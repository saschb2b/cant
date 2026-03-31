"use client";

import { useRef, useEffect } from "react";
import {
  CanvasSimulation,
  useIsDarkMode,
} from "@cant/shared/components/canvas-simulation";

/* ------------------------------------------------------------------ */
/*  Shared constants                                                   */
/* ------------------------------------------------------------------ */

const CANVAS_W = 320;
const CANVAS_H = 240;
const NUM_POINTS = 15;
const SEGMENT_LENGTH = 14;
const GRAVITY_Y = 980;
const INITIAL_PUSH_X = 120;

/** Anchor position at top-center of the canvas. */
const ANCHOR_X = CANVAS_W / 2;
const ANCHOR_Y = 20;

interface Point {
  x: number;
  y: number;
}

interface EulerPoint extends Point {
  vx: number;
  vy: number;
}

interface VerletPoint extends Point {
  oldX: number;
  oldY: number;
}

interface RopeColors {
  rope: string;
  anchor: string;
  bg: string;
}

/* ------------------------------------------------------------------ */
/*  Drawing helpers                                                    */
/* ------------------------------------------------------------------ */

function drawRope(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  colors: RopeColors,
) {
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Draw segments as lines
  ctx.strokeStyle = colors.rope;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    if (!pt) continue;
    if (i === 0) {
      ctx.moveTo(pt.x, pt.y);
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  }
  ctx.stroke();

  // Draw joints
  for (let i = 1; i < points.length; i++) {
    const pt = points[i];
    if (!pt) continue;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = colors.rope;
    ctx.fill();
  }

  // Draw anchor point
  const anchor = points[0];
  if (anchor) {
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = colors.anchor;
    ctx.fill();
    ctx.strokeStyle = colors.anchor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

/* ------------------------------------------------------------------ */
/*  Euler integration helpers                                          */
/* ------------------------------------------------------------------ */

function createEulerPoints(): EulerPoint[] {
  const pts: EulerPoint[] = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    pts.push({
      x: ANCHOR_X,
      y: ANCHOR_Y + i * SEGMENT_LENGTH,
      vx: i === 0 ? 0 : INITIAL_PUSH_X,
      vy: 0,
    });
  }
  return pts;
}

function eulerStep(points: EulerPoint[], dt: number) {
  // Apply gravity and integrate with naive Euler (no damping)
  for (let i = 1; i < points.length; i++) {
    const pt = points[i];
    if (!pt) continue;
    pt.vy += GRAVITY_Y * dt;
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
  }

  // Enforce distance constraints (single pass, order-dependent)
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.001) continue;
    const diff = (dist - SEGMENT_LENGTH) / dist;
    const offsetX = dx * diff * 0.5;
    const offsetY = dy * diff * 0.5;

    if (i === 0) {
      // Anchor is fixed, push everything onto b
      b.x -= offsetX * 2;
      b.y -= offsetY * 2;
      // Euler: also adjust velocity to reflect the position correction
      // (This naive approach is the source of energy gain)
      b.vx -= (offsetX * 2) / dt;
      b.vy -= (offsetY * 2) / dt;
    } else {
      a.x += offsetX;
      a.y += offsetY;
      a.vx += offsetX / dt;
      a.vy += offsetY / dt;
      b.x -= offsetX;
      b.y -= offsetY;
      b.vx -= offsetX / dt;
      b.vy -= offsetY / dt;
    }
  }

  // Pin anchor
  const anchor = points[0];
  if (anchor) {
    anchor.x = ANCHOR_X;
    anchor.y = ANCHOR_Y;
    anchor.vx = 0;
    anchor.vy = 0;
  }
}

/* ------------------------------------------------------------------ */
/*  Verlet integration helpers                                         */
/* ------------------------------------------------------------------ */

function createVerletPoints(): VerletPoint[] {
  const pts: VerletPoint[] = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    const x = ANCHOR_X;
    const y = ANCHOR_Y + i * SEGMENT_LENGTH;
    // Give initial push via oldX offset (Verlet encodes velocity as pos - oldPos)
    const pushOffset = i === 0 ? 0 : (INITIAL_PUSH_X / 60) * (i / NUM_POINTS);
    pts.push({
      x: x,
      y: y,
      oldX: x - pushOffset,
      oldY: y,
    });
  }
  return pts;
}

function verletStep(points: VerletPoint[], dt: number, time: number) {
  const dtSq = dt * dt;

  // Verlet integration
  for (let i = 1; i < points.length; i++) {
    const pt = points[i];
    if (!pt) continue;
    const tempX = pt.x;
    const tempY = pt.y;
    const velX = (pt.x - pt.oldX) * 0.99; // slight damping
    const velY = (pt.y - pt.oldY) * 0.99;

    // Gentle periodic wind force on all points
    const wind = Math.sin(time * 1.5) * 40;

    pt.x = pt.x + velX + wind * dtSq;
    pt.y = pt.y + velY + GRAVITY_Y * dtSq;
    pt.oldX = tempX;
    pt.oldY = tempY;
  }

  // Constraint relaxation (multiple iterations for stability)
  const iterations = 5;
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.001) continue;
      const diff = (dist - SEGMENT_LENGTH) / dist;
      const offsetX = dx * diff * 0.5;
      const offsetY = dy * diff * 0.5;

      if (i === 0) {
        b.x -= offsetX * 2;
        b.y -= offsetY * 2;
      } else {
        a.x += offsetX;
        a.y += offsetY;
        b.x -= offsetX;
        b.y -= offsetY;
      }
    }

    // Pin anchor every iteration
    const anchor = points[0];
    if (anchor) {
      anchor.x = ANCHOR_X;
      anchor.y = ANCHOR_Y;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Euler rope component                                               */
/* ------------------------------------------------------------------ */

export function RopeEuler() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors: RopeColors = {
    rope: isDark ? "#F87171" : "#DC2626",
    anchor: isDark ? "#B8A8A8" : "#4B5563",
    bg: isDark ? "#1a1a1a" : "#fafafa",
  };

  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  });

  useEffect(() => {
    const points = createEulerPoints();
    let lastTime = 0;
    let rafId = 0;

    function tick(time: number) {
      const rawDt = lastTime ? (time - lastTime) / 1000 : 1 / 60;
      lastTime = time;
      const dt = Math.min(rawDt, 0.05);

      eulerStep(points, dt);

      const canvas = canvasRef.current;
      const tempCtx = canvas ? canvas.getContext("2d") : null;
      if (tempCtx) {
        const ctx: CanvasRenderingContext2D = tempCtx;
        drawRope(ctx, points, colorsRef.current);

        // Label
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = isDark ? "#F5F1F1" : "#111827";
        ctx.fillText("Euler integration", CANVAS_W / 2, CANVAS_H - 8);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CanvasSimulation label="Euler integration (naive)" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Verlet rope component                                              */
/* ------------------------------------------------------------------ */

export function RopeVerlet() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors: RopeColors = {
    rope: isDark ? "#F87171" : "#DC2626",
    anchor: isDark ? "#B8A8A8" : "#4B5563",
    bg: isDark ? "#1a1a1a" : "#fafafa",
  };

  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  });

  useEffect(() => {
    const points = createVerletPoints();
    let lastTime = 0;
    let elapsed = 0;
    let rafId = 0;

    function tick(time: number) {
      const rawDt = lastTime ? (time - lastTime) / 1000 : 1 / 60;
      lastTime = time;
      elapsed += rawDt;
      const dt = Math.min(rawDt, 0.05);

      verletStep(points, dt, elapsed);

      const canvas = canvasRef.current;
      const tempCtx = canvas ? canvas.getContext("2d") : null;
      if (tempCtx) {
        const ctx: CanvasRenderingContext2D = tempCtx;
        drawRope(ctx, points, colorsRef.current);

        // Label
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = isDark ? "#F5F1F1" : "#111827";
        ctx.fillText("Verlet integration", CANVAS_W / 2, CANVAS_H - 8);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CanvasSimulation
      label="Verlet integration (stable)"
      canvasRef={canvasRef}
    />
  );
}
