"use client";

import { useRef, useEffect } from "react";
import {
  CanvasSimulation,
  useIsDarkMode,
} from "@cant/shared/components/canvas-simulation";

/* ------------------------------------------------------------------ */
/*  Constants and helpers                                              */
/* ------------------------------------------------------------------ */

const CANVAS_W = 320;
const CANVAS_H = 240;
const OBJECT_COUNT = 60;
const OBJECT_SIZE = 6;

/** Viewport is ~40% of canvas dimensions. */
const VP_W = 128;
const VP_H = 96;

interface WorldObject {
  x: number;
  y: number;
  kind: "square" | "circle";
}

/** Mulberry32 PRNG seeded at 99. */
function createObjects(): WorldObject[] {
  const objects: WorldObject[] = [];
  let seed = 99;
  function rand() {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  for (let i = 0; i < OBJECT_COUNT; i++) {
    objects.push({
      x: OBJECT_SIZE + rand() * (CANVAS_W - 2 * OBJECT_SIZE),
      y: OBJECT_SIZE + rand() * (CANVAS_H - 2 * OBJECT_SIZE),
      kind: rand() > 0.5 ? "circle" : "square",
    });
  }
  return objects;
}

/** Returns the camera viewport center position on a figure-8 path. */
function cameraPosition(time: number): { cx: number; cy: number } {
  const t = time * 0.0004;
  const cx = CANVAS_W / 2 + Math.sin(t) * (CANVAS_W / 2 - VP_W / 2 - 8);
  const cy = CANVAS_H / 2 + Math.sin(t * 2) * (CANVAS_H / 2 - VP_H / 2 - 8);
  return { cx, cy };
}

function isInsideViewport(
  obj: WorldObject,
  vpLeft: number,
  vpTop: number,
): boolean {
  return (
    obj.x + OBJECT_SIZE >= vpLeft &&
    obj.x - OBJECT_SIZE <= vpLeft + VP_W &&
    obj.y + OBJECT_SIZE >= vpTop &&
    obj.y - OBJECT_SIZE <= vpTop + VP_H
  );
}

function drawObject(
  ctx: CanvasRenderingContext2D,
  obj: WorldObject,
  color: string,
  alpha: number,
) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  if (obj.kind === "circle") {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, OBJECT_SIZE, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(
      obj.x - OBJECT_SIZE,
      obj.y - OBJECT_SIZE,
      OBJECT_SIZE * 2,
      OBJECT_SIZE * 2,
    );
  }
  ctx.globalAlpha = 1;
}

function drawViewport(
  ctx: CanvasRenderingContext2D,
  vpLeft: number,
  vpTop: number,
  borderColor: string,
) {
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(vpLeft, vpTop, VP_W, VP_H);
  ctx.setLineDash([]);
}

/* ------------------------------------------------------------------ */
/*  Draw functions                                                     */
/* ------------------------------------------------------------------ */

function drawRenderAll(
  ctx: CanvasRenderingContext2D,
  objects: WorldObject[],
  time: number,
  colors: { entity: string; viewport: string; text: string },
) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const { cx, cy } = cameraPosition(time);
  const vpLeft = cx - VP_W / 2;
  const vpTop = cy - VP_H / 2;

  // Draw all objects at full color
  for (const obj of objects) {
    drawObject(ctx, obj, colors.entity, 1);
  }

  drawViewport(ctx, vpLeft, vpTop, colors.viewport);

  // Counter: always renders everything
  ctx.font = "bold 11px monospace";
  ctx.fillStyle = colors.text;
  ctx.textAlign = "right";
  ctx.fillText(
    "Rendered: " + String(OBJECT_COUNT) + "/" + String(OBJECT_COUNT),
    CANVAS_W - 8,
    16,
  );
}

function drawRenderCulled(
  ctx: CanvasRenderingContext2D,
  objects: WorldObject[],
  time: number,
  colors: { entity: string; viewport: string; text: string },
) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const { cx, cy } = cameraPosition(time);
  const vpLeft = cx - VP_W / 2;
  const vpTop = cy - VP_H / 2;

  let visibleCount = 0;

  for (const obj of objects) {
    const inside = isInsideViewport(obj, vpLeft, vpTop);
    if (inside) {
      visibleCount++;
      drawObject(ctx, obj, colors.entity, 1);
    } else {
      drawObject(ctx, obj, colors.entity, 0.15);
    }
  }

  drawViewport(ctx, vpLeft, vpTop, colors.viewport);

  ctx.font = "bold 11px monospace";
  ctx.fillStyle = colors.text;
  ctx.textAlign = "right";
  ctx.fillText(
    "Rendered: " + String(visibleCount) + "/" + String(OBJECT_COUNT),
    CANVAS_W - 8,
    16,
  );
}

/* ------------------------------------------------------------------ */
/*  Canvas hook                                                        */
/* ------------------------------------------------------------------ */

function useFrustumCanvas(
  drawFn: (
    ctx: CanvasRenderingContext2D,
    objects: WorldObject[],
    time: number,
  ) => void,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectsRef = useRef(createObjects());
  const rafRef = useRef(0);

  const drawFnRef = useRef(drawFn);

  useEffect(() => {
    drawFnRef.current = drawFn;
  }, [drawFn]);

  useEffect(() => {
    function tick(time: number) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        drawFnRef.current(ctx, objectsRef.current, time);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return canvasRef;
}

/* ------------------------------------------------------------------ */
/*  Exported components                                                */
/* ------------------------------------------------------------------ */

export function RenderAll() {
  const isDark = useIsDarkMode();

  const colors = {
    entity: isDark ? "#F87171" : "#DC2626",
    viewport: isDark ? "#22C55E" : "#15803D",
    text: isDark ? "#F5F1F1" : "#111827",
  };

  const canvasRef = useFrustumCanvas((ctx, objects, time) => {
    drawRenderAll(ctx, objects, time, colors);
  });

  return (
    <CanvasSimulation
      label="No culling: every object rendered"
      canvasRef={canvasRef}
    />
  );
}

export function RenderCulled() {
  const isDark = useIsDarkMode();

  const colors = {
    entity: isDark ? "#F87171" : "#DC2626",
    viewport: isDark ? "#22C55E" : "#15803D",
    text: isDark ? "#F5F1F1" : "#111827",
  };

  const canvasRef = useFrustumCanvas((ctx, objects, time) => {
    drawRenderCulled(ctx, objects, time, colors);
  });

  return (
    <CanvasSimulation
      label="Frustum culling: skip off-screen objects"
      canvasRef={canvasRef}
    />
  );
}
