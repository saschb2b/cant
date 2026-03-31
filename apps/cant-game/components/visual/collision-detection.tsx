"use client";

import { useRef, useEffect } from "react";
import {
  CanvasSimulation,
  useIsDarkMode,
} from "@cant/shared/components/canvas-simulation";

/* ------------------------------------------------------------------ */
/*  Shared simulation types and helpers                                */
/* ------------------------------------------------------------------ */

interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const ENTITY_COUNT = 40;
const CANVAS_W = 320;
const CANVAS_H = 240;
const ENTITY_RADIUS = 6;
const CELL_SIZE = 48;

/** Seed a deterministic set of entities so both panels start identically. */
function createEntities(): Entity[] {
  const entities: Entity[] = [];
  let seed = 42;
  function rand() {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  for (let i = 0; i < ENTITY_COUNT; i++) {
    entities.push({
      x: ENTITY_RADIUS + rand() * (CANVAS_W - 2 * ENTITY_RADIUS),
      y: ENTITY_RADIUS + rand() * (CANVAS_H - 2 * ENTITY_RADIUS),
      vx: (rand() - 0.5) * 60,
      vy: (rand() - 0.5) * 60,
      r: ENTITY_RADIUS,
    });
  }
  return entities;
}

function stepEntities(entities: Entity[], dt: number) {
  for (const e of entities) {
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    if (e.x - e.r < 0) {
      e.x = e.r;
      e.vx = Math.abs(e.vx);
    }
    if (e.x + e.r > CANVAS_W) {
      e.x = CANVAS_W - e.r;
      e.vx = -Math.abs(e.vx);
    }
    if (e.y - e.r < 0) {
      e.y = e.r;
      e.vy = Math.abs(e.vy);
    }
    if (e.y + e.r > CANVAS_H) {
      e.y = CANVAS_H - e.r;
      e.vy = -Math.abs(e.vy);
    }
  }
}

function intersects(a: Entity, b: Entity): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = a.r + b.r;
  return dx * dx + dy * dy < dist * dist;
}

function cellKey(cx: number, cy: number): string {
  return String(cx) + "," + String(cy);
}

/* ------------------------------------------------------------------ */
/*  Brute Force renderer                                               */
/* ------------------------------------------------------------------ */

function drawBruteForce(
  ctx: CanvasRenderingContext2D,
  entities: Entity[],
  colors: { entity: string; check: string; hit: string; text: string },
) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  let checks = 0;
  for (let i = 0; i < entities.length; i++) {
    const a = entities[i];
    if (!a) continue;
    for (let j = i + 1; j < entities.length; j++) {
      const b = entities[j];
      if (!b) continue;
      checks++;
      const hit = intersects(a, b);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = hit ? colors.hit : colors.check;
      ctx.lineWidth = hit ? 1.5 : 0.3;
      ctx.globalAlpha = hit ? 0.9 : 0.15;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  for (const e of entities) {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fillStyle = colors.entity;
    ctx.fill();
  }

  ctx.font = "bold 11px monospace";
  ctx.fillStyle = colors.text;
  ctx.textAlign = "right";
  ctx.fillText(String(checks) + " checks", CANVAS_W - 8, 16);
}

/* ------------------------------------------------------------------ */
/*  Spatial Hash renderer                                              */
/* ------------------------------------------------------------------ */

function drawSpatialHash(
  ctx: CanvasRenderingContext2D,
  entities: Entity[],
  colors: {
    entity: string;
    check: string;
    hit: string;
    grid: string;
    text: string;
  },
) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Draw grid
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.3;
  for (let x = 0; x <= CANVAS_W; x += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_H);
    ctx.stroke();
  }
  for (let y = 0; y <= CANVAS_H; y += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_W, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Build spatial hash
  const cells = new Map<string, Entity[]>();
  for (const e of entities) {
    const cx = Math.floor(e.x / CELL_SIZE);
    const cy = Math.floor(e.y / CELL_SIZE);
    const key = cellKey(cx, cy);
    const cell = cells.get(key) ?? [];
    cell.push(e);
    cells.set(key, cell);
  }

  // Check only nearby pairs (use index-based pair dedup)
  let checks = 0;
  const checked = new Set<string>();
  for (let idx = 0; idx < entities.length; idx++) {
    const e = entities[idx];
    if (!e) continue;
    const cx = Math.floor(e.x / CELL_SIZE);
    const cy = Math.floor(e.y / CELL_SIZE);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = cellKey(cx + dx, cy + dy);
        const cell = cells.get(key);
        if (!cell) continue;
        for (const other of cell) {
          if (other === e) continue;
          // Use object identity via indexOf for stable dedup
          const oi = entities.indexOf(other);
          const lo = Math.min(idx, oi);
          const hi = Math.max(idx, oi);
          const pairId = String(lo) + "-" + String(hi);
          if (checked.has(pairId)) continue;
          checked.add(pairId);
          checks++;
          const hit = intersects(e, other);
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = hit ? colors.hit : colors.check;
          ctx.lineWidth = hit ? 1.5 : 0.5;
          ctx.globalAlpha = hit ? 0.9 : 0.35;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  for (const e of entities) {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fillStyle = colors.entity;
    ctx.fill();
  }

  ctx.font = "bold 11px monospace";
  ctx.fillStyle = colors.text;
  ctx.textAlign = "right";
  ctx.fillText(String(checks) + " checks", CANVAS_W - 8, 16);
}

/* ------------------------------------------------------------------ */
/*  Canvas hook                                                        */
/* ------------------------------------------------------------------ */

function useSimulation(
  drawFn: (ctx: CanvasRenderingContext2D, entities: Entity[]) => void,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const entitiesRef = useRef(createEntities());
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);

  const drawFnRef = useRef(drawFn);

  useEffect(() => {
    drawFnRef.current = drawFn;
  }, [drawFn]);

  useEffect(() => {
    function tick(time: number) {
      const dt = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 0.05)
        : 0.016;
      lastTimeRef.current = time;

      stepEntities(entitiesRef.current, dt);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        drawFnRef.current(ctx, entitiesRef.current);
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

export function CollisionBruteForce() {
  const isDark = useIsDarkMode();

  const colors = {
    entity: isDark ? "#F87171" : "#DC2626",
    check: isDark ? "#B8A8A8" : "#4B5563",
    hit: isDark ? "#22C55E" : "#15803D",
    text: isDark ? "#F5F1F1" : "#111827",
  };

  const canvasRef = useSimulation((ctx, entities) => {
    drawBruteForce(ctx, entities, colors);
  });

  return (
    <CanvasSimulation
      label={"O(n\u00B2) pairwise checks"}
      canvasRef={canvasRef}
    />
  );
}

export function CollisionSpatialHash() {
  const isDark = useIsDarkMode();

  const colors = {
    entity: isDark ? "#F87171" : "#DC2626",
    check: isDark ? "#B8A8A8" : "#4B5563",
    hit: isDark ? "#22C55E" : "#15803D",
    grid: isDark ? "#F87171" : "#DC2626",
    text: isDark ? "#F5F1F1" : "#111827",
  };

  const canvasRef = useSimulation((ctx, entities) => {
    drawSpatialHash(ctx, entities, colors);
  });

  return (
    <CanvasSimulation
      label="Spatial hash: nearby checks only"
      canvasRef={canvasRef}
    />
  );
}
