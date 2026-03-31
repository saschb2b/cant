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

const ARENA_SIZE = 160;
const ARENA_X = (CANVAS_W - ARENA_SIZE) / 2;
const ARENA_Y = 30;

const CHAR_SIZE = 16;
const MOVE_SPEED = 1.8;

const STICK_VIS_RADIUS = 22;
const STICK_VIS_X = CANVAS_W - 34;
const STICK_VIS_Y = CANVAS_H - 34;

const DEADZONE_RADIUS = 0.2;

const IDLE_FRAMES = 120; // ~2s at 60fps
const MOVE_FRAMES = 120; // ~2s at 60fps
const PHASE_TOTAL = IDLE_FRAMES + MOVE_FRAMES;

const NOISE_AMPLITUDE = 0.08;

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
/*  Color palette                                                      */
/* ------------------------------------------------------------------ */

interface Colors {
  character: string;
  arenaBorder: string;
  deadzoneIndicator: string;
  bg: string;
  text: string;
}

/* ------------------------------------------------------------------ */
/*  Drawing helpers                                                    */
/* ------------------------------------------------------------------ */

function drawBackground(ctx: CanvasRenderingContext2D, bg: string) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function drawArena(ctx: CanvasRenderingContext2D, borderColor: string) {
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(ARENA_X, ARENA_Y, ARENA_SIZE, ARENA_SIZE);
}

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
) {
  const half = CHAR_SIZE / 2;

  // Body
  ctx.fillStyle = color;
  ctx.fillRect(x - half, y - half, CHAR_SIZE, CHAR_SIZE);

  // Eyes
  ctx.fillStyle = "#FFFFFF";
  const eyeY = y - half + 5;
  const leftEyeX = x - 3;
  const rightEyeX = x + 3;
  ctx.fillRect(leftEyeX - 2, eyeY - 2, 4, 4);
  ctx.fillRect(rightEyeX - 2, eyeY - 2, 4, 4);

  // Pupils
  ctx.fillStyle = "#000000";
  ctx.fillRect(leftEyeX - 1, eyeY - 1, 2, 2);
  ctx.fillRect(rightEyeX - 1, eyeY - 1, 2, 2);
}

function drawStickVisualization(
  ctx: CanvasRenderingContext2D,
  stickX: number,
  stickY: number,
  borderColor: string,
  textColor: string,
  showDeadzone: boolean,
  deadzoneColor: string,
) {
  // Outer ring
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(STICK_VIS_X, STICK_VIS_Y, STICK_VIS_RADIUS, 0, Math.PI * 2);
  ctx.stroke();

  // Deadzone circle
  if (showDeadzone) {
    ctx.fillStyle = deadzoneColor;
    ctx.beginPath();
    ctx.arc(
      STICK_VIS_X,
      STICK_VIS_Y,
      STICK_VIS_RADIUS * DEADZONE_RADIUS,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.strokeStyle = deadzoneColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(
      STICK_VIS_X,
      STICK_VIS_Y,
      STICK_VIS_RADIUS * DEADZONE_RADIUS,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }

  // Crosshairs
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(STICK_VIS_X - STICK_VIS_RADIUS, STICK_VIS_Y);
  ctx.lineTo(STICK_VIS_X + STICK_VIS_RADIUS, STICK_VIS_Y);
  ctx.moveTo(STICK_VIS_X, STICK_VIS_Y - STICK_VIS_RADIUS);
  ctx.lineTo(STICK_VIS_X, STICK_VIS_Y + STICK_VIS_RADIUS);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Stick dot
  const dotX = STICK_VIS_X + stickX * STICK_VIS_RADIUS;
  const dotY = STICK_VIS_Y + stickY * STICK_VIS_RADIUS;
  ctx.fillStyle = textColor;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  isIdle: boolean,
  textColor: string,
) {
  ctx.font = "bold 10px monospace";
  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(isIdle ? "Phase: Idle" : "Phase: Moving", 6, 4);
}

/* ------------------------------------------------------------------ */
/*  Simulation helpers                                                 */
/* ------------------------------------------------------------------ */

function clampToArena(x: number, y: number): { x: number; y: number } {
  const halfChar = CHAR_SIZE / 2;
  const minX = ARENA_X + halfChar;
  const maxX = ARENA_X + ARENA_SIZE - halfChar;
  const minY = ARENA_Y + halfChar;
  const maxY = ARENA_Y + ARENA_SIZE - halfChar;
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

function generateMoveDirection(
  rng: () => number,
  phaseIndex: number,
): { x: number; y: number } {
  // Generate a consistent direction for each move phase
  // Use the rng seeded per-phase for determinism
  const directions = [
    { x: 0.7, y: 0.7 },
    { x: -0.8, y: 0.3 },
    { x: 0.3, y: -0.9 },
    { x: -0.5, y: -0.6 },
    { x: 0.9, y: -0.2 },
    { x: -0.4, y: 0.8 },
    { x: 0.6, y: 0.5 },
    { x: -0.7, y: -0.4 },
  ];
  const dir = directions[phaseIndex % directions.length];
  if (!dir) return { x: rng() - 0.5, y: rng() - 0.5 };
  return dir;
}

/* ------------------------------------------------------------------ */
/*  Simulation hook                                                    */
/* ------------------------------------------------------------------ */

function useDeadzoneAnimation(applyDeadzone: boolean, colors: Colors) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const rng = mulberry32(applyDeadzone ? 42 : 42);

    const centerX = ARENA_X + ARENA_SIZE / 2;
    const centerY = ARENA_Y + ARENA_SIZE / 2;
    let charX = centerX;
    let charY = centerY;
    let frame = 0;
    let phaseCount = 0;

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

      const phaseFrame = frame % PHASE_TOTAL;
      const isIdle = phaseFrame < IDLE_FRAMES;

      // When transitioning to a new phase cycle, increment phase count
      if (phaseFrame === 0 && frame > 0) {
        phaseCount++;
      }

      // Generate raw stick input
      let rawX = 0;
      let rawY = 0;

      if (isIdle) {
        // Idle: stick near center with noise (simulating drift)
        rawX = (rng() - 0.5) * NOISE_AMPLITUDE * 2;
        rawY = (rng() - 0.5) * NOISE_AMPLITUDE * 2;
        // Occasionally larger spikes to make drift more visible
        if (rng() < 0.1) {
          rawX += (rng() - 0.5) * NOISE_AMPLITUDE * 4;
          rawY += (rng() - 0.5) * NOISE_AMPLITUDE * 4;
        }
      } else {
        // Moving: push stick in a direction plus noise
        const dir = generateMoveDirection(rng, phaseCount);
        rawX = dir.x + (rng() - 0.5) * NOISE_AMPLITUDE;
        rawY = dir.y + (rng() - 0.5) * NOISE_AMPLITUDE;
      }

      // Clamp raw input to unit circle (but the raw version uses square clamping)
      let processedX = rawX;
      let processedY = rawY;

      if (applyDeadzone) {
        // Circular deadzone with radial remapping
        const mag = Math.sqrt(rawX * rawX + rawY * rawY);
        if (mag < DEADZONE_RADIUS) {
          processedX = 0;
          processedY = 0;
        } else {
          // Remap so the range [DEADZONE_RADIUS, 1] maps to [0, 1]
          const remapped = Math.min(
            (mag - DEADZONE_RADIUS) / (1 - DEADZONE_RADIUS),
            1,
          );
          processedX = (rawX / mag) * remapped;
          processedY = (rawY / mag) * remapped;
        }
      } else {
        // No deadzone: raw values pass through (square clamping per axis)
        processedX = Math.max(-1, Math.min(1, rawX));
        processedY = Math.max(-1, Math.min(1, rawY));
      }

      // Move character
      charX += processedX * MOVE_SPEED;
      charY += processedY * MOVE_SPEED;

      // Keep in arena
      const clamped = clampToArena(charX, charY);
      charX = clamped.x;
      charY = clamped.y;

      // When entering idle, drift back toward center slowly for the deadzone version
      if (isIdle && applyDeadzone && processedX === 0 && processedY === 0) {
        // Character stays perfectly still with deadzone
      }

      // Draw everything
      drawBackground(ctx, colors.bg);
      drawArena(ctx, colors.arenaBorder);
      drawCharacter(ctx, charX, charY, colors.character);
      drawStickVisualization(
        ctx,
        Math.max(-1, Math.min(1, rawX)),
        Math.max(-1, Math.min(1, rawY)),
        colors.arenaBorder,
        colors.text,
        applyDeadzone,
        colors.deadzoneIndicator,
      );
      drawPhaseLabel(ctx, isIdle, colors.text);

      // Status text
      ctx.font = "9px monospace";
      ctx.fillStyle = colors.text;
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      const inputMag = Math.sqrt(
        processedX * processedX + processedY * processedY,
      );
      ctx.fillText("Input: " + inputMag.toFixed(3), 6, CANVAS_H - 4);

      frame++;
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyDeadzone, colors]);

  return canvasRef;
}

/* ------------------------------------------------------------------ */
/*  Exported components                                                */
/* ------------------------------------------------------------------ */

export function DeadzoneRaw() {
  const isDark = useIsDarkMode();

  const colors: Colors = {
    character: isDark ? "#F87171" : "#DC2626",
    arenaBorder: isDark ? "#B8A8A8" : "#4B5563",
    deadzoneIndicator: isDark
      ? "rgba(248,113,113,0.2)"
      : "rgba(220,38,38,0.15)",
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#F5F1F1" : "#111827",
  };

  const canvasRef = useDeadzoneAnimation(false, colors);

  return (
    <CanvasSimulation label="No deadzone (raw input)" canvasRef={canvasRef} />
  );
}

export function DeadzoneCircular() {
  const isDark = useIsDarkMode();

  const colors: Colors = {
    character: isDark ? "#F87171" : "#DC2626",
    arenaBorder: isDark ? "#B8A8A8" : "#4B5563",
    deadzoneIndicator: isDark
      ? "rgba(248,113,113,0.2)"
      : "rgba(220,38,38,0.15)",
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#F5F1F1" : "#111827",
  };

  const canvasRef = useDeadzoneAnimation(true, colors);

  return (
    <CanvasSimulation
      label="Circular deadzone (radius 0.2)"
      canvasRef={canvasRef}
    />
  );
}
