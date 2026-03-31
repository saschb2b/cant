"use client";

import { useRef, useEffect } from "react";
import {
  CanvasSimulation,
  useIsDarkMode,
} from "@cant/shared/components/canvas-simulation";

/* ------------------------------------------------------------------ */
/*  Shared constants and types                                         */
/* ------------------------------------------------------------------ */

const CANVAS_W = 320;
const CANVAS_H = 240;
const NETWORK_INTERVAL = 200; // ms between server updates
const ENTITY_RADIUS = 8;
const PATH_SPEED = 0.0004; // how fast the entity traverses the figure-8

interface Snapshot {
  x: number;
  y: number;
  t: number; // timestamp when this snapshot was received
}

/** Compute figure-8 position for a given parameter t (0..1 wraps). */
function figure8(t: number): { x: number; y: number } {
  const cx = CANVAS_W / 2;
  const cy = CANVAS_H / 2;
  const rx = CANVAS_W * 0.32;
  const ry = CANVAS_H * 0.32;
  const angle = t * Math.PI * 2;
  return {
    x: cx + rx * Math.sin(angle),
    y: cy + ry * Math.sin(angle * 2),
  };
}

/** Draw the faint figure-8 ground truth path. */
function drawPath(ctx: CanvasRenderingContext2D, pathColor: string) {
  ctx.beginPath();
  ctx.setLineDash([3, 5]);
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const p = figure8(i / steps);
    if (i === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

/** Draw small dots at each network update position. */
function drawUpdateDots(
  ctx: CanvasRenderingContext2D,
  snapshots: Snapshot[],
  dotColor: string,
) {
  ctx.fillStyle = dotColor;
  ctx.globalAlpha = 0.7;
  for (const snap of snapshots) {
    ctx.beginPath();
    ctx.arc(snap.x, snap.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Draw a filled circle for the entity. */
function drawEntity(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  alpha: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fill();
  ctx.globalAlpha = 1;
}

/* ------------------------------------------------------------------ */
/*  NetcodeSnapping: entity teleports between network snapshots        */
/* ------------------------------------------------------------------ */

export function NetcodeSnapping() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const entityColor = isDark ? "#F87171" : "#DC2626";
  const pathColor = isDark ? "#B8A8A8" : "#4B5563";
  const dotColor = isDark ? "#F59E0B" : "#D97706";
  const textColor = isDark ? "#F5F1F1" : "#111827";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxResult = canvas.getContext("2d");
    if (!ctxResult) return;
    const ctx: CanvasRenderingContext2D = ctxResult;

    let rafId = 0;
    let startTime = 0;
    let lastNetworkTick = 0;
    const snapshots: Snapshot[] = [];
    let currentPos = figure8(0);
    const MAX_DOTS = 30;

    function tick(time: number) {
      if (startTime === 0) {
        startTime = time;
      }
      const elapsed = time - startTime;
      const pathT = (elapsed * PATH_SPEED) % 1;

      // Generate a new network snapshot every NETWORK_INTERVAL ms
      if (elapsed - lastNetworkTick >= NETWORK_INTERVAL) {
        lastNetworkTick = elapsed;
        const serverPos = figure8(pathT);
        snapshots.push({ x: serverPos.x, y: serverPos.y, t: elapsed });
        // Snap to the latest position
        currentPos = { x: serverPos.x, y: serverPos.y };
        // Keep only recent dots
        while (snapshots.length > MAX_DOTS) {
          snapshots.shift();
        }
      }

      // Draw
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawPath(ctx, pathColor);
      drawUpdateDots(ctx, snapshots, dotColor);
      drawEntity(
        ctx,
        currentPos.x,
        currentPos.y,
        entityColor,
        1,
        ENTITY_RADIUS,
      );

      // Label
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = textColor;
      ctx.textAlign = "right";
      ctx.fillText("snapping", CANVAS_W - 8, 16);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [entityColor, pathColor, dotColor, textColor]);

  return (
    <CanvasSimulation
      label="Teleport to each server update"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  NetcodeInterpolation: entity smoothly glides between snapshots     */
/* ------------------------------------------------------------------ */

export function NetcodeInterpolation() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const entityColor = isDark ? "#F87171" : "#DC2626";
  const ghostColor = isDark ? "#B8A8A8" : "#4B5563";
  const pathColor = isDark ? "#B8A8A8" : "#4B5563";
  const dotColor = isDark ? "#F59E0B" : "#D97706";
  const textColor = isDark ? "#F5F1F1" : "#111827";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxResult = canvas.getContext("2d");
    if (!ctxResult) return;
    const ctx: CanvasRenderingContext2D = ctxResult;

    let rafId = 0;
    let startTime = 0;
    let lastNetworkTick = 0;
    const snapshots: Snapshot[] = [];
    const MAX_DOTS = 30;
    // Interpolation renders one interval behind, between the two most recent snapshots
    const INTERP_DELAY = NETWORK_INTERVAL;

    function tick(time: number) {
      if (startTime === 0) {
        startTime = time;
      }
      const elapsed = time - startTime;
      const pathT = (elapsed * PATH_SPEED) % 1;

      // Generate a new network snapshot every NETWORK_INTERVAL ms
      if (elapsed - lastNetworkTick >= NETWORK_INTERVAL) {
        lastNetworkTick = elapsed;
        const serverPos = figure8(pathT);
        snapshots.push({ x: serverPos.x, y: serverPos.y, t: elapsed });
        while (snapshots.length > MAX_DOTS) {
          snapshots.shift();
        }
      }

      // Find two snapshots to interpolate between (render time is one interval behind)
      const renderTime = elapsed - INTERP_DELAY;
      let interpX = CANVAS_W / 2;
      let interpY = CANVAS_H / 2;

      if (snapshots.length >= 2) {
        // Find the pair of snapshots that bracket renderTime
        let from = snapshots[0];
        let to = snapshots[1];
        if (from && to) {
          for (let i = 1; i < snapshots.length; i++) {
            const s = snapshots[i];
            const prev = snapshots[i - 1];
            if (s && prev && s.t >= renderTime) {
              from = prev;
              to = s;
              break;
            }
            if (s) {
              from = snapshots[i - 1] ?? from;
              to = s;
            }
          }
          const duration = to.t - from.t;
          const alpha =
            duration > 0
              ? Math.max(0, Math.min(1, (renderTime - from.t) / duration))
              : 1;
          interpX = from.x + (to.x - from.x) * alpha;
          interpY = from.y + (to.y - from.y) * alpha;
        }
      } else if (snapshots.length === 1) {
        const s = snapshots[0];
        if (s) {
          interpX = s.x;
          interpY = s.y;
        }
      }

      // Real-time "ghost" position (where the entity actually is on the server)
      const realPos = figure8(pathT);

      // Draw
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawPath(ctx, pathColor);
      drawUpdateDots(ctx, snapshots, dotColor);

      // Ghost (real position, faint)
      drawEntity(
        ctx,
        realPos.x,
        realPos.y,
        ghostColor,
        0.25,
        ENTITY_RADIUS + 2,
      );

      // Interpolated entity
      drawEntity(ctx, interpX, interpY, entityColor, 1, ENTITY_RADIUS);

      // Thin line connecting ghost to interpolated to show delay
      ctx.beginPath();
      ctx.moveTo(interpX, interpY);
      ctx.lineTo(realPos.x, realPos.y);
      ctx.strokeStyle = ghostColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Label
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = textColor;
      ctx.textAlign = "right";
      ctx.fillText("interpolated", CANVAS_W - 8, 16);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [entityColor, ghostColor, pathColor, dotColor, textColor]);

  return (
    <CanvasSimulation
      label="Smooth lerp between updates (slight delay)"
      canvasRef={canvasRef}
    />
  );
}
