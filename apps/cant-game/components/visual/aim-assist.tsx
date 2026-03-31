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
const TARGET_RADIUS = 10;
const CROSSHAIR_SIZE = 12;
const MAGNETISM_RADIUS = 45;
const HIT_RADIUS = 13;

/** Seconds between auto-fired shots. */
const SHOT_INTERVAL = 1.4;
/** How long the hit/miss flash shows. */
const FLASH_DURATION = 0.35;

/* ------------------------------------------------------------------ */
/*  Deterministic seeded random                                        */
/* ------------------------------------------------------------------ */

function makeRng(seed: number) {
  let s = seed;
  return function rand() {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Target: slow smooth path the crosshair must track                  */
/* ------------------------------------------------------------------ */

function targetPos(t: number): { x: number; y: number } {
  return {
    x: CANVAS_W / 2 + Math.sin(t * 0.7) * 80 + Math.sin(t * 1.3) * 30,
    y: CANVAS_H / 2 + Math.cos(t * 0.5) * 50 + Math.cos(t * 1.1) * 20,
  };
}

/* ------------------------------------------------------------------ */
/*  Trail point                                                        */
/* ------------------------------------------------------------------ */

interface TrailPoint {
  x: number;
  y: number;
}

/* ------------------------------------------------------------------ */
/*  Shot result for visual feedback                                    */
/* ------------------------------------------------------------------ */

interface ShotResult {
  x: number;
  y: number;
  hit: boolean;
  timer: number;
}

/* ------------------------------------------------------------------ */
/*  Simulation state                                                   */
/* ------------------------------------------------------------------ */

interface SimState {
  crossX: number;
  crossY: number;
  time: number;
  shotTimer: number;
  hits: number;
  total: number;
  trail: TrailPoint[];
  shots: ShotResult[];
}

function createSimState(): SimState {
  const start = targetPos(0);
  return {
    crossX: start.x + 30,
    crossY: start.y - 20,
    time: 0,
    shotTimer: 0,
    hits: 0,
    total: 0,
    trail: [],
    shots: [],
  };
}

function stepSim(
  state: SimState,
  dt: number,
  assist: boolean,
  rand: () => number,
): void {
  state.time += dt;
  state.shotTimer += dt;

  const tgt = targetPos(state.time);
  const dx = tgt.x - state.crossX;
  const dy = tgt.y - state.crossY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Crosshair follows target with spring-like tracking + noise
  // This simulates a human player using an analog stick to track
  const springK = 8;
  const damping = 0.92;

  // Noise: simulates imprecise analog stick input
  const t = state.time;
  const noiseScale = 2.5;
  const nx =
    Math.sin(t * 5.7) * noiseScale +
    Math.sin(t * 9.3 + 1.5) * noiseScale * 0.6 +
    (rand() - 0.5) * noiseScale * 0.8;
  const ny =
    Math.cos(t * 4.9) * noiseScale +
    Math.cos(t * 8.1 + 2.3) * noiseScale * 0.6 +
    (rand() - 0.5) * noiseScale * 0.8;

  let moveX = dx * springK * dt + nx;
  let moveY = dy * springK * dt + ny;

  // Aim assist: when inside magnetism radius, dampen noise and add pull
  if (assist && dist < MAGNETISM_RADIUS && dist > 0.1) {
    const closeness = 1.0 - dist / MAGNETISM_RADIUS;
    // Noise reduced quadratically
    const noiseDamp = (dist / MAGNETISM_RADIUS) * (dist / MAGNETISM_RADIUS);
    // Extra pull toward target
    const extraPull = closeness * 15;
    moveX = dx * (springK + extraPull) * dt + nx * noiseDamp;
    moveY = dy * (springK + extraPull) * dt + ny * noiseDamp;
  }

  state.crossX += moveX;
  state.crossY += moveY;

  // Light damping on overshoot (simulates stick returning to center)
  const overX = state.crossX - tgt.x;
  const overY = state.crossY - tgt.y;
  state.crossX = tgt.x + overX * damping;
  state.crossY = tgt.y + overY * damping;

  // Clamp
  state.crossX = Math.max(4, Math.min(CANVAS_W - 4, state.crossX));
  state.crossY = Math.max(4, Math.min(CANVAS_H - 4, state.crossY));

  // Trail
  state.trail.push({ x: state.crossX, y: state.crossY });
  if (state.trail.length > 60) state.trail.shift();

  // Age shot results
  for (const shot of state.shots) {
    shot.timer -= dt;
  }
  state.shots = state.shots.filter((s) => s.timer > 0);

  // Auto-fire shot at interval
  if (state.shotTimer >= SHOT_INTERVAL) {
    state.shotTimer = 0;
    state.total += 1;
    const hitDx = state.crossX - tgt.x;
    const hitDy = state.crossY - tgt.y;
    const hitDist = Math.sqrt(hitDx * hitDx + hitDy * hitDy);
    const hit = hitDist < HIT_RADIUS;
    if (hit) state.hits += 1;
    state.shots.push({
      x: state.crossX,
      y: state.crossY,
      hit,
      timer: FLASH_DURATION,
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Drawing                                                            */
/* ------------------------------------------------------------------ */

interface DrawColors {
  crosshair: string;
  target: string;
  hit: string;
  miss: string;
  magnetism: string;
  trail: string;
  bg: string;
  text: string;
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  state: SimState,
  colors: DrawColors,
  showMagnetism: boolean,
): void {
  const tgt = targetPos(state.time);

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Magnetism radius (assist version)
  if (showMagnetism) {
    ctx.beginPath();
    ctx.arc(tgt.x, tgt.y, MAGNETISM_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = colors.magnetism;
    ctx.fill();
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = colors.hit;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // Target (bullseye)
  ctx.beginPath();
  ctx.arc(tgt.x, tgt.y, TARGET_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = colors.target;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(tgt.x, tgt.y, TARGET_RADIUS * 0.5, 0, Math.PI * 2);
  ctx.strokeStyle = colors.bg;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(tgt.x, tgt.y, 2, 0, Math.PI * 2);
  ctx.fillStyle = colors.bg;
  ctx.fill();

  // Trail
  for (let i = 0; i < state.trail.length; i++) {
    const pt = state.trail[i];
    if (!pt) continue;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = colors.trail;
    ctx.globalAlpha = ((i + 1) / state.trail.length) * 0.4;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Shot results (expanding rings)
  for (const shot of state.shots) {
    const progress = 1 - shot.timer / FLASH_DURATION;
    const radius = 8 + progress * 12;
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = shot.hit ? colors.hit : colors.miss;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 1 - progress;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Hit checkmark or miss X
    if (progress < 0.6) {
      ctx.globalAlpha = 1 - progress / 0.6;
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = shot.hit ? colors.hit : colors.miss;
      ctx.fillText(shot.hit ? "\u2713" : "\u2717", shot.x, shot.y - 16);
      ctx.globalAlpha = 1;
    }
  }

  // Crosshair
  const cx = state.crossX;
  const cy = state.crossY;
  // Color crosshair green when on target
  const onTarget =
    Math.sqrt((cx - tgt.x) * (cx - tgt.x) + (cy - tgt.y) * (cy - tgt.y)) <
    HIT_RADIUS;
  const chColor = onTarget ? colors.hit : colors.crosshair;

  ctx.strokeStyle = chColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - CROSSHAIR_SIZE, cy);
  ctx.lineTo(cx - 4, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 4, cy);
  ctx.lineTo(cx + CROSSHAIR_SIZE, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - CROSSHAIR_SIZE);
  ctx.lineTo(cx, cy - 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy + 4);
  ctx.lineTo(cx, cy + CROSSHAIR_SIZE);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = chColor;
  ctx.fill();

  // Score
  if (state.total > 0) {
    ctx.font = "bold 11px monospace";
    ctx.fillStyle = colors.text;
    ctx.textAlign = "right";
    ctx.fillText(
      String(state.hits) + "/" + String(state.total) + " hits",
      CANVAS_W - 8,
      CANVAS_H - 10,
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

function useAimSim(assist: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDarkMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxResult = canvas.getContext("2d");
    if (!ctxResult) return;
    const ctx: CanvasRenderingContext2D = ctxResult;

    const colors: DrawColors = {
      crosshair: isDark ? "#F87171" : "#DC2626",
      target: isDark ? "#F59E0B" : "#D97706",
      hit: isDark ? "#22C55E" : "#15803D",
      miss: isDark ? "#EF4444" : "#DC2626",
      magnetism: isDark ? "rgba(34,197,94,0.08)" : "rgba(21,128,61,0.06)",
      trail: isDark ? "#F87171" : "#DC2626",
      bg: isDark ? "#1a1a1a" : "#fafafa",
      text: isDark ? "#F5F1F1" : "#111827",
    };

    const rand = makeRng(99);
    const state = createSimState();
    let raf = 0;
    let lastTs = 0;

    function tick(ts: number) {
      const dt = lastTs === 0 ? 1 / 60 : Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      stepSim(state, dt, assist, rand);
      drawScene(ctx, state, colors, assist);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDark, assist]);

  return canvasRef;
}

/* ------------------------------------------------------------------ */
/*  Exported components                                                */
/* ------------------------------------------------------------------ */

export function AimRaw() {
  const canvasRef = useAimSim(false);

  return <CanvasSimulation label="Raw analog input" canvasRef={canvasRef} />;
}

export function AimAssist() {
  const canvasRef = useAimSim(true);

  return (
    <CanvasSimulation
      label="Aim assist with magnetism radius"
      canvasRef={canvasRef}
    />
  );
}
