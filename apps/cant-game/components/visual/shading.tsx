"use client";

import { useRef, useEffect } from "react";
import {
  CanvasSimulation,
  useIsDarkMode,
} from "@cant/shared/components/canvas-simulation";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CANVAS_W = 320;
const CANVAS_H = 240;
const SPHERE_RADIUS = 80;
const CX = CANVAS_W / 2;
const CY = CANVAS_H / 2;

/** Number of latitude/longitude segments for the sphere mesh. */
const SEGMENTS = 10;

/* ------------------------------------------------------------------ */
/*  3D math helpers                                                    */
/* ------------------------------------------------------------------ */

type Vec3 = [number, number, number];

function normalize(v: Vec3): Vec3 {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  if (len === 0) return [0, 0, 0];
  return [v[0] / len, v[1] / len, v[2] / len];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

/* ------------------------------------------------------------------ */
/*  Sphere mesh generation                                             */
/* ------------------------------------------------------------------ */

interface Vertex {
  pos: Vec3;
  normal: Vec3;
}

interface Triangle {
  v0: Vertex;
  v1: Vertex;
  v2: Vertex;
}

function buildSphereMesh(): Triangle[] {
  const verts: Vertex[][] = [];

  for (let lat = 0; lat <= SEGMENTS; lat++) {
    const theta = (lat / SEGMENTS) * Math.PI;
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const row: Vertex[] = [];
    for (let lon = 0; lon <= SEGMENTS; lon++) {
      const phi = (lon / SEGMENTS) * 2 * Math.PI;
      const x = sinT * Math.cos(phi);
      const y = cosT;
      const z = sinT * Math.sin(phi);
      const normal: Vec3 = [x, y, z];
      const pos: Vec3 = [
        x * SPHERE_RADIUS,
        y * SPHERE_RADIUS,
        z * SPHERE_RADIUS,
      ];
      row.push({ pos, normal });
    }
    verts.push(row);
  }

  const tris: Triangle[] = [];
  for (let lat = 0; lat < SEGMENTS; lat++) {
    for (let lon = 0; lon < SEGMENTS; lon++) {
      const row0 = verts[lat];
      const row1 = verts[lat + 1];
      if (!row0 || !row1) continue;
      const tl = row0[lon];
      const tr = row0[lon + 1];
      const bl = row1[lon];
      const br = row1[lon + 1];
      if (!tl || !tr || !bl || !br) continue;
      tris.push({ v0: tl, v1: bl, v2: tr });
      tris.push({ v0: tr, v1: bl, v2: br });
    }
  }
  return tris;
}

/* ------------------------------------------------------------------ */
/*  Projection and rasterization                                       */
/* ------------------------------------------------------------------ */

function project(p: Vec3): [number, number] {
  // Simple orthographic projection (ignore z for x/y, use z for depth)
  return [CX + p[0], CY - p[1]];
}

/** Compute barycentric coordinates. Returns null if degenerate. */
function barycentric(
  px: number,
  py: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): [number, number, number] | null {
  const denom = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2);
  if (Math.abs(denom) < 0.001) return null;
  const u = ((y1 - y2) * (px - x2) + (x2 - x1) * (py - y2)) / denom;
  const v = ((y2 - y0) * (px - x2) + (x0 - x2) * (py - y2)) / denom;
  const w = 1 - u - v;
  return [u, v, w];
}

function computeDiffuse(normal: Vec3, worldPos: Vec3, lightPos: Vec3): number {
  const lightDir = normalize(sub(lightPos, worldPos));
  return Math.max(dot(normal, lightDir), 0);
}

interface ShadingColors {
  ambient: Vec3;
  diffuse: Vec3;
  bg: string;
  text: string;
}

/* ------------------------------------------------------------------ */
/*  Gouraud (per-vertex) shading renderer                              */
/* ------------------------------------------------------------------ */

function drawGouraud(
  ctx: CanvasRenderingContext2D,
  mesh: Triangle[],
  lightPos: Vec3,
  colors: ShadingColors,
) {
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const imgData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
  const pixels = imgData.data;
  const depthBuf = new Float32Array(CANVAS_W * CANVAS_H).fill(-Infinity);

  for (const tri of mesh) {
    // Compute lighting at each vertex
    const d0 = computeDiffuse(tri.v0.normal, tri.v0.pos, lightPos);
    const d1 = computeDiffuse(tri.v1.normal, tri.v1.pos, lightPos);
    const d2 = computeDiffuse(tri.v2.normal, tri.v2.pos, lightPos);

    const [sx0, sy0] = project(tri.v0.pos);
    const [sx1, sy1] = project(tri.v1.pos);
    const [sx2, sy2] = project(tri.v2.pos);

    // Back-face cull (screen-space winding)
    const cross = (sx1 - sx0) * (sy2 - sy0) - (sy1 - sy0) * (sx2 - sx0);
    if (cross < 0) continue;

    // Bounding box
    const minX = Math.max(0, Math.floor(Math.min(sx0, sx1, sx2)));
    const maxX = Math.min(CANVAS_W - 1, Math.ceil(Math.max(sx0, sx1, sx2)));
    const minY = Math.max(0, Math.floor(Math.min(sy0, sy1, sy2)));
    const maxY = Math.min(CANVAS_H - 1, Math.ceil(Math.max(sy0, sy1, sy2)));

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const bary = barycentric(px, py, sx0, sy0, sx1, sy1, sx2, sy2);
        if (!bary) continue;
        const [u, v, w] = bary;
        if (u < 0 || v < 0 || w < 0) continue;

        // Depth test
        const z = u * tri.v0.pos[2] + v * tri.v1.pos[2] + w * tri.v2.pos[2];
        const idx = py * CANVAS_W + px;
        if (z < (depthBuf[idx] ?? -Infinity)) continue;
        depthBuf[idx] = z;

        // Interpolate diffuse from vertex values (Gouraud)
        const diff = u * d0 + v * d1 + w * d2;
        const r = colors.ambient[0] + colors.diffuse[0] * diff;
        const g = colors.ambient[1] + colors.diffuse[1] * diff;
        const b = colors.ambient[2] + colors.diffuse[2] * diff;

        const pi = idx * 4;
        pixels[pi] = Math.min(255, Math.round(r * 255));
        pixels[pi + 1] = Math.min(255, Math.round(g * 255));
        pixels[pi + 2] = Math.min(255, Math.round(b * 255));
        pixels[pi + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  ctx.font = "bold 10px monospace";
  ctx.fillStyle = colors.text;
  ctx.textAlign = "center";
  ctx.fillText(
    "Per-vertex: lighting interpolated across face",
    CANVAS_W / 2,
    CANVAS_H - 8,
  );
}

/* ------------------------------------------------------------------ */
/*  Phong (per-fragment) shading renderer                              */
/* ------------------------------------------------------------------ */

function drawPhong(
  ctx: CanvasRenderingContext2D,
  mesh: Triangle[],
  lightPos: Vec3,
  colors: ShadingColors,
) {
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const imgData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
  const pixels = imgData.data;
  const depthBuf = new Float32Array(CANVAS_W * CANVAS_H).fill(-Infinity);

  for (const tri of mesh) {
    const [sx0, sy0] = project(tri.v0.pos);
    const [sx1, sy1] = project(tri.v1.pos);
    const [sx2, sy2] = project(tri.v2.pos);

    const cross = (sx1 - sx0) * (sy2 - sy0) - (sy1 - sy0) * (sx2 - sx0);
    if (cross < 0) continue;

    const minX = Math.max(0, Math.floor(Math.min(sx0, sx1, sx2)));
    const maxX = Math.min(CANVAS_W - 1, Math.ceil(Math.max(sx0, sx1, sx2)));
    const minY = Math.max(0, Math.floor(Math.min(sy0, sy1, sy2)));
    const maxY = Math.min(CANVAS_H - 1, Math.ceil(Math.max(sy0, sy1, sy2)));

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const bary = barycentric(px, py, sx0, sy0, sx1, sy1, sx2, sy2);
        if (!bary) continue;
        const [u, v, w] = bary;
        if (u < 0 || v < 0 || w < 0) continue;

        const z = u * tri.v0.pos[2] + v * tri.v1.pos[2] + w * tri.v2.pos[2];
        const idx = py * CANVAS_W + px;
        if (z < (depthBuf[idx] ?? -Infinity)) continue;
        depthBuf[idx] = z;

        // Interpolate normal and position per-fragment (Phong)
        const normal = normalize(
          lerp3(
            lerp3(tri.v0.normal, tri.v1.normal, v / Math.max(u + v, 0.001)),
            tri.v2.normal,
            w,
          ),
        );
        const worldPos: Vec3 = [
          u * tri.v0.pos[0] + v * tri.v1.pos[0] + w * tri.v2.pos[0],
          u * tri.v0.pos[1] + v * tri.v1.pos[1] + w * tri.v2.pos[1],
          u * tri.v0.pos[2] + v * tri.v1.pos[2] + w * tri.v2.pos[2],
        ];
        const diff = computeDiffuse(normal, worldPos, lightPos);

        const r = colors.ambient[0] + colors.diffuse[0] * diff;
        const g = colors.ambient[1] + colors.diffuse[1] * diff;
        const b = colors.ambient[2] + colors.diffuse[2] * diff;

        const pi = idx * 4;
        pixels[pi] = Math.min(255, Math.round(r * 255));
        pixels[pi + 1] = Math.min(255, Math.round(g * 255));
        pixels[pi + 2] = Math.min(255, Math.round(b * 255));
        pixels[pi + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  ctx.font = "bold 10px monospace";
  ctx.fillStyle = colors.text;
  ctx.textAlign = "center";
  ctx.fillText(
    "Per-fragment: lighting computed per pixel",
    CANVAS_W / 2,
    CANVAS_H - 8,
  );
}

/* ------------------------------------------------------------------ */
/*  Exported components                                                */
/* ------------------------------------------------------------------ */

export function ShadingGouraud() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxResult = canvas.getContext("2d");
    if (!ctxResult) return;
    const ctx: CanvasRenderingContext2D = ctxResult;

    const mesh = buildSphereMesh();
    let raf = 0;
    let startTime = 0;

    const colors: ShadingColors = {
      ambient: isDark ? [0.08, 0.03, 0.03] : [0.12, 0.08, 0.08],
      diffuse: isDark ? [0.95, 0.35, 0.35] : [0.85, 0.15, 0.15],
      bg: isDark ? "#1a1a1a" : "#fafafa",
      text: isDark ? "#F5F1F1" : "#111827",
    };

    function tick(time: number) {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;

      // Orbit the light around the sphere
      const angle = elapsed * 0.8;
      const lightPos: Vec3 = [Math.cos(angle) * 200, 80, Math.sin(angle) * 200];

      drawGouraud(ctx, mesh, lightPos, colors);
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  return (
    <CanvasSimulation
      label="Gouraud shading (per-vertex)"
      canvasRef={canvasRef}
    />
  );
}

export function ShadingPhong() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxResult = canvas.getContext("2d");
    if (!ctxResult) return;
    const ctx: CanvasRenderingContext2D = ctxResult;

    const mesh = buildSphereMesh();
    let raf = 0;
    let startTime = 0;

    const colors: ShadingColors = {
      ambient: isDark ? [0.08, 0.03, 0.03] : [0.12, 0.08, 0.08],
      diffuse: isDark ? [0.95, 0.35, 0.35] : [0.85, 0.15, 0.15],
      bg: isDark ? "#1a1a1a" : "#fafafa",
      text: isDark ? "#F5F1F1" : "#111827",
    };

    function tick(time: number) {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;

      const angle = elapsed * 0.8;
      const lightPos: Vec3 = [Math.cos(angle) * 200, 80, Math.sin(angle) * 200];

      drawPhong(ctx, mesh, lightPos, colors);
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  return (
    <CanvasSimulation
      label="Phong shading (per-fragment)"
      canvasRef={canvasRef}
    />
  );
}
