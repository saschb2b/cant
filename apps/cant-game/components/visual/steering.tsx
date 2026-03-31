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
const TRAIL_LENGTH = 80;
const AGENT_SIZE = 10;
const MAX_SPEED = 2.5;
const MAX_FORCE = 0.12;
const SLOWING_RADIUS = 60;
const TARGET_MOVE_INTERVAL = 240; // ~4 seconds at 60fps
const PADDING = 30;

/* ------------------------------------------------------------------ */
/*  Seeded random (mulberry32)                                         */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Vector helpers                                                     */
/* ------------------------------------------------------------------ */

interface Vec2 {
  x: number;
  y: number;
}

function vecAdd(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

function vecSub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

function vecScale(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s };
}

function vecMag(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function vecNormalize(v: Vec2): Vec2 {
  const m = vecMag(v);
  if (m === 0) return { x: 0, y: 0 };
  return { x: v.x / m, y: v.y / m };
}

function vecLimit(v: Vec2, max: number): Vec2 {
  const m = vecMag(v);
  if (m <= max) return v;
  return vecScale(vecNormalize(v), max);
}

/* ------------------------------------------------------------------ */
/*  Steering behaviors                                                 */
/* ------------------------------------------------------------------ */

function steerSeek(pos: Vec2, vel: Vec2, target: Vec2): Vec2 {
  const desired = vecScale(vecNormalize(vecSub(target, pos)), MAX_SPEED);
  const steer = vecSub(desired, vel);
  return vecLimit(steer, MAX_FORCE);
}

function steerArrive(pos: Vec2, vel: Vec2, target: Vec2): Vec2 {
  const toTarget = vecSub(target, pos);
  const dist = vecMag(toTarget);
  if (dist < 0.5) {
    return vecScale(vel, -1); // brake to stop
  }
  let desiredSpeed = MAX_SPEED;
  if (dist < SLOWING_RADIUS) {
    desiredSpeed = MAX_SPEED * (dist / SLOWING_RADIUS);
  }
  const desired = vecScale(vecNormalize(toTarget), desiredSpeed);
  const steer = vecSub(desired, vel);
  return vecLimit(steer, MAX_FORCE);
}

/* ------------------------------------------------------------------ */
/*  Rendering helpers                                                  */
/* ------------------------------------------------------------------ */

interface Colors {
  agent: string;
  target: string;
  trail: string;
  slowingRadius: string;
  bg: string;
  text: string;
}

function drawBackground(ctx: CanvasRenderingContext2D, bg: string) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function drawTrail(
  ctx: CanvasRenderingContext2D,
  trail: Vec2[],
  color: string,
) {
  for (let i = 0; i < trail.length; i++) {
    const point = trail[i];
    if (!point) continue;
    const alpha = (i + 1) / trail.length;
    ctx.globalAlpha = alpha * 0.7;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawAgent(
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  vel: Vec2,
  color: string,
) {
  const angle = Math.atan2(vel.y, vel.x);
  const half = AGENT_SIZE / 2;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(angle);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(half, 0);
  ctx.lineTo(-half, -half * 0.7);
  ctx.lineTo(-half * 0.5, 0);
  ctx.lineTo(-half, half * 0.7);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawTarget(ctx: CanvasRenderingContext2D, pos: Vec2, color: string) {
  const s = 5;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Diamond shape
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y - s);
  ctx.lineTo(pos.x + s, pos.y);
  ctx.lineTo(pos.x, pos.y + s);
  ctx.lineTo(pos.x - s, pos.y);
  ctx.closePath();
  ctx.stroke();

  // Center dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawSlowingRadius(
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  color: string,
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, SLOWING_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

/* ------------------------------------------------------------------ */
/*  Simulation hook                                                    */
/* ------------------------------------------------------------------ */

type SteerFn = (pos: Vec2, vel: Vec2, target: Vec2) => Vec2;

function useSteeringAnimation(
  steerFn: SteerFn,
  colors: Colors,
  showSlowingRadius: boolean,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const rng = mulberry32(55);

    function randomTarget(): Vec2 {
      return {
        x: PADDING + rng() * (CANVAS_W - PADDING * 2),
        y: PADDING + rng() * (CANVAS_H - PADDING * 2),
      };
    }

    let agentPos: Vec2 = { x: CANVAS_W / 2, y: CANVAS_H / 2 };
    let agentVel: Vec2 = { x: 0.5, y: 0.3 };
    let target: Vec2 = randomTarget();
    let nextTarget: Vec2 = randomTarget();
    let targetTimer = 0;
    let targetLerpT = 1;
    const trail: Vec2[] = [];

    function tick() {
      const canvas = canvasRef.current;
      if (!canvas) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const tempCtx = canvas.getContext("2d");
      if (!tempCtx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const ctx: CanvasRenderingContext2D = tempCtx;

      // Move target to new position every interval
      targetTimer++;
      if (targetTimer >= TARGET_MOVE_INTERVAL) {
        targetTimer = 0;
        target = nextTarget;
        nextTarget = randomTarget();
        targetLerpT = 0;
      }

      // Smoothly lerp target to its destination
      if (targetLerpT < 1) {
        targetLerpT = Math.min(targetLerpT + 0.02, 1);
      }

      // Apply steering
      const force = steerFn(agentPos, agentVel, target);
      agentVel = vecLimit(vecAdd(agentVel, force), MAX_SPEED);
      agentPos = vecAdd(agentPos, agentVel);

      // Wrap around edges
      if (agentPos.x < 0) agentPos.x += CANVAS_W;
      if (agentPos.x > CANVAS_W) agentPos.x -= CANVAS_W;
      if (agentPos.y < 0) agentPos.y += CANVAS_H;
      if (agentPos.y > CANVAS_H) agentPos.y -= CANVAS_H;

      // Update trail
      trail.push({ x: agentPos.x, y: agentPos.y });
      if (trail.length > TRAIL_LENGTH) {
        trail.shift();
      }

      // Draw
      drawBackground(ctx, colors.bg);
      drawTrail(ctx, trail, colors.trail);

      if (showSlowingRadius) {
        drawSlowingRadius(ctx, target, colors.slowingRadius);
      }

      drawTarget(ctx, target, colors.target);
      drawAgent(ctx, agentPos, agentVel, colors.agent);

      // Label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = colors.text;
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      const speed = vecMag(agentVel);
      ctx.fillText("Speed: " + speed.toFixed(2), CANVAS_W - 6, 4);

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [steerFn, colors, showSlowingRadius]);

  return canvasRef;
}

/* ------------------------------------------------------------------ */
/*  Exported components                                                */
/* ------------------------------------------------------------------ */

export function SteerSeek() {
  const isDark = useIsDarkMode();

  const colors: Colors = {
    agent: isDark ? "#F87171" : "#DC2626",
    target: isDark ? "#22C55E" : "#15803D",
    trail: isDark ? "rgba(248,113,113,0.3)" : "rgba(220,38,38,0.2)",
    slowingRadius: isDark ? "rgba(34,197,94,0.15)" : "rgba(21,128,61,0.1)",
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#F5F1F1" : "#111827",
  };

  const canvasRef = useSteeringAnimation(steerSeek, colors, false);

  return (
    <CanvasSimulation
      label="Seek behavior (no deceleration)"
      canvasRef={canvasRef}
    />
  );
}

export function SteerArrive() {
  const isDark = useIsDarkMode();

  const colors: Colors = {
    agent: isDark ? "#F87171" : "#DC2626",
    target: isDark ? "#22C55E" : "#15803D",
    trail: isDark ? "rgba(248,113,113,0.3)" : "rgba(220,38,38,0.2)",
    slowingRadius: isDark ? "rgba(34,197,94,0.15)" : "rgba(21,128,61,0.1)",
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#F5F1F1" : "#111827",
  };

  const canvasRef = useSteeringAnimation(steerArrive, colors, true);

  return (
    <CanvasSimulation
      label="Arrive behavior (slowing radius)"
      canvasRef={canvasRef}
    />
  );
}
