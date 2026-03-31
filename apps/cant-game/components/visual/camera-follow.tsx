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

const WORLD_W = 640;
const WORLD_H = 480;

const CHAR_SIZE = 14;

/** Character path: figure-8, moderate speed. */
const PATH_CX = WORLD_W / 2;
const PATH_CY = WORLD_H / 2;
const PATH_RX = 200;
const PATH_RY = 120;
const PATH_SPEED = 0.6;

/** Number of landmark dots scattered across the world. */
const LANDMARK_COUNT = 40;

/** Lerp factor for smooth camera (per-frame blend). */
const SMOOTH_FACTOR = 0.05;

/* ------------------------------------------------------------------ */
/*  Deterministic random (mulberry32)                                  */
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
/*  Generate landmarks once                                            */
/* ------------------------------------------------------------------ */

interface Landmark {
  x: number;
  y: number;
  size: number;
}

function generateLandmarks(): Landmark[] {
  const rng = mulberry32(77);
  const marks: Landmark[] = [];
  for (let i = 0; i < LANDMARK_COUNT; i++) {
    marks.push({
      x: rng() * WORLD_W,
      y: rng() * WORLD_H,
      size: 2 + rng() * 4,
    });
  }
  return marks;
}

const LANDMARKS = generateLandmarks();

/* ------------------------------------------------------------------ */
/*  Character path (figure-8 using Lissajous)                          */
/* ------------------------------------------------------------------ */

function charPosition(t: number): { x: number; y: number } {
  // Lissajous figure-8: x = sin(t), y = sin(2t)
  const x = PATH_CX + Math.sin(t) * PATH_RX;
  const y = PATH_CY + Math.sin(2 * t) * PATH_RY;
  return { x, y };
}

/* ------------------------------------------------------------------ */
/*  Drawing                                                            */
/* ------------------------------------------------------------------ */

interface DrawColors {
  character: string;
  landmark: string;
  bg: string;
  grid: string;
}

function drawWorld(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  charX: number,
  charY: number,
  colors: DrawColors,
) {
  // Clear with background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Camera offset: translate world so camera position is at viewport center
  const offsetX = -cameraX + CANVAS_W / 2;
  const offsetY = -cameraY + CANVAS_H / 2;

  ctx.save();
  ctx.translate(offsetX, offsetY);

  // Draw grid lines
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.25;
  const gridSize = 48;
  for (let gx = 0; gx <= WORLD_W; gx += gridSize) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, WORLD_H);
    ctx.stroke();
  }
  for (let gy = 0; gy <= WORLD_H; gy += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(WORLD_W, gy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // World border
  ctx.strokeStyle = colors.landmark;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.3;
  ctx.strokeRect(0, 0, WORLD_W, WORLD_H);
  ctx.globalAlpha = 1;

  // Landmarks (stars/dots)
  ctx.fillStyle = colors.landmark;
  for (const lm of LANDMARKS) {
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(lm.x, lm.y, lm.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Draw the figure-8 path as a faint trail
  ctx.strokeStyle = colors.landmark;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  const trailSteps = 200;
  for (let i = 0; i <= trailSteps; i++) {
    const angle = (i / trailSteps) * Math.PI * 2;
    const pt = charPosition(angle);
    if (i === 0) {
      ctx.moveTo(pt.x, pt.y);
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Character (square with eyes)
  ctx.fillStyle = colors.character;
  ctx.fillRect(
    charX - CHAR_SIZE / 2,
    charY - CHAR_SIZE / 2,
    CHAR_SIZE,
    CHAR_SIZE,
  );

  // Eyes
  ctx.fillStyle = colors.bg;
  const eyeY = charY - CHAR_SIZE / 2 + 4;
  const eyeLeftX = charX - CHAR_SIZE / 2 + 3;
  const eyeRightX = charX - CHAR_SIZE / 2 + 9;
  ctx.fillRect(eyeLeftX, eyeY, 2, 2);
  ctx.fillRect(eyeRightX, eyeY, 2, 2);

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  Shared animation hook                                              */
/* ------------------------------------------------------------------ */

function useCameraFollow(smooth: boolean, colors: DrawColors) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const cameraRef = useRef({ x: PATH_CX, y: PATH_CY });
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);

  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  useEffect(() => {
    // Reset camera to center of path on mount
    cameraRef.current = { x: PATH_CX, y: PATH_CY };
    timeRef.current = 0;
    lastFrameRef.current = 0;

    function tick(frameTime: number) {
      const dt = lastFrameRef.current
        ? Math.min((frameTime - lastFrameRef.current) / 1000, 0.05)
        : 0.016;
      lastFrameRef.current = frameTime;

      timeRef.current += dt * PATH_SPEED;

      const charPos = charPosition(timeRef.current);

      // Update camera
      if (smooth) {
        cameraRef.current.x +=
          (charPos.x - cameraRef.current.x) * SMOOTH_FACTOR;
        cameraRef.current.y +=
          (charPos.y - cameraRef.current.y) * SMOOTH_FACTOR;
      } else {
        cameraRef.current.x = charPos.x;
        cameraRef.current.y = charPos.y;
      }

      const canvas = canvasRef.current;
      const tempCtx = canvas ? canvas.getContext("2d") : null;
      if (tempCtx) {
        const ctx: CanvasRenderingContext2D = tempCtx;
        drawWorld(
          ctx,
          cameraRef.current.x,
          cameraRef.current.y,
          charPos.x,
          charPos.y,
          colorsRef.current,
        );
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [smooth]);

  return canvasRef;
}

/* ------------------------------------------------------------------ */
/*  Exported components                                                */
/* ------------------------------------------------------------------ */

export function CameraSnap() {
  const isDark = useIsDarkMode();

  const colors: DrawColors = {
    character: isDark ? "#F87171" : "#DC2626",
    landmark: isDark ? "#B8A8A8" : "#4B5563",
    bg: isDark ? "#1a1a1a" : "#fafafa",
    grid: isDark ? "#B8A8A8" : "#4B5563",
  };

  const canvasRef = useCameraFollow(false, colors);

  return (
    <CanvasSimulation
      label="Camera snaps to character each frame"
      canvasRef={canvasRef}
    />
  );
}

export function CameraSmooth() {
  const isDark = useIsDarkMode();

  const colors: DrawColors = {
    character: isDark ? "#F87171" : "#DC2626",
    landmark: isDark ? "#B8A8A8" : "#4B5563",
    bg: isDark ? "#1a1a1a" : "#fafafa",
    grid: isDark ? "#B8A8A8" : "#4B5563",
  };

  const canvasRef = useCameraFollow(true, colors);

  return (
    <CanvasSimulation
      label={"Smooth follow: lerp factor " + String(SMOOTH_FACTOR)}
      canvasRef={canvasRef}
    />
  );
}
