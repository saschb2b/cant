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
const BALL_RADIUS = 8;
const GRAVITY = 600;
const TRAIL_LENGTH = 60;
const WALL_INSET = 10;

/** How often a lag spike occurs (in seconds). */
const SPIKE_INTERVAL = 3.0;
/** Simulated frame time during a spike (one bad frame). */
const SPIKE_DT = 0.2;
/** How long the "LAG" label stays visible after a spike (seconds). */
const LAG_LABEL_DURATION = 0.6;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface TrailPoint {
  x: number;
  y: number;
}

interface Colors {
  ball: string;
  trail: string;
  wall: string;
  lag: string;
  text: string;
  bg: string;
}

function createBall(): Ball {
  return { x: 60, y: 60, vx: 120, vy: 0 };
}

/* ------------------------------------------------------------------ */
/*  Physics step (shared by both approaches)                           */
/* ------------------------------------------------------------------ */

function physicsTick(ball: Ball, dt: number) {
  ball.vy += GRAVITY * dt;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  if (ball.x - BALL_RADIUS < WALL_INSET) {
    ball.x = WALL_INSET + BALL_RADIUS;
    ball.vx = Math.abs(ball.vx);
  }
  if (ball.x + BALL_RADIUS > CANVAS_W - WALL_INSET) {
    ball.x = CANVAS_W - WALL_INSET - BALL_RADIUS;
    ball.vx = -Math.abs(ball.vx);
  }
  if (ball.y - BALL_RADIUS < WALL_INSET) {
    ball.y = WALL_INSET + BALL_RADIUS;
    ball.vy = Math.abs(ball.vy);
  }
  if (ball.y + BALL_RADIUS > CANVAS_H - WALL_INSET) {
    ball.y = CANVAS_H - WALL_INSET - BALL_RADIUS;
    ball.vy = -Math.abs(ball.vy) * 0.85;
    if (Math.abs(ball.vy) < 30) {
      ball.vy = -250;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Drawing helpers                                                    */
/* ------------------------------------------------------------------ */

function drawScene(
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  trail: TrailPoint[],
  colors: Colors,
  fps: number,
  showLag: boolean,
) {
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.strokeStyle = colors.wall;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    WALL_INSET,
    WALL_INSET,
    CANVAS_W - 2 * WALL_INSET,
    CANVAS_H - 2 * WALL_INSET,
  );

  for (let i = 0; i < trail.length; i++) {
    const pt = trail[i];
    if (!pt) continue;
    const alpha = (i + 1) / trail.length;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, BALL_RADIUS * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = colors.trail;
    ctx.globalAlpha = alpha * 0.7;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = colors.ball;
  ctx.fill();

  ctx.font = "bold 11px monospace";
  ctx.textAlign = "right";
  ctx.fillStyle = colors.text;
  ctx.fillText("FPS: " + String(Math.round(fps)), CANVAS_W - 16, 26);

  if (showLag) {
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = colors.lag;
    ctx.fillText("LAG", CANVAS_W / 2, 30);
  }
}

/* ------------------------------------------------------------------ */
/*  Variable timestep component                                        */
/* ------------------------------------------------------------------ */

export function TimestepVariable() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors: Colors = {
    ball: isDark ? "#F87171" : "#DC2626",
    trail: isDark ? "rgba(248,113,113,0.3)" : "rgba(220,38,38,0.2)",
    wall: isDark ? "#B8A8A8" : "#4B5563",
    lag: isDark ? "#F59E0B" : "#D97706",
    text: isDark ? "#F5F1F1" : "#111827",
    bg: isDark ? "#1a1a1a" : "#fafafa",
  };

  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  });

  useEffect(() => {
    const ball = createBall();
    const trail: TrailPoint[] = [];
    let lastTime = 0;
    let elapsed = 0;
    let nextSpike = SPIKE_INTERVAL;
    let spikeConsumed = false;
    let lagLabelTimer = 0;
    let displayFps = 60;
    let rafId = 0;

    function tick(time: number) {
      const rawDt = lastTime ? (time - lastTime) / 1000 : 1 / 60;
      lastTime = time;
      elapsed += rawDt;

      let dt = Math.min(rawDt, 0.05);

      // Inject a single bad frame at each spike interval
      if (elapsed >= nextSpike && !spikeConsumed) {
        dt = SPIKE_DT;
        spikeConsumed = true;
        lagLabelTimer = LAG_LABEL_DURATION;
        displayFps = 5;
      }
      if (spikeConsumed && elapsed >= nextSpike + 0.1) {
        nextSpike += SPIKE_INTERVAL;
        spikeConsumed = false;
      }

      lagLabelTimer = Math.max(0, lagLabelTimer - rawDt);
      if (lagLabelTimer <= 0) {
        displayFps = displayFps * 0.9 + (1 / Math.max(rawDt, 0.001)) * 0.1;
      }

      // Variable timestep: pass the (possibly huge) dt directly
      physicsTick(ball, dt);

      trail.push({ x: ball.x, y: ball.y });
      if (trail.length > TRAIL_LENGTH) trail.shift();

      const canvas = canvasRef.current;
      const ctx = canvas ? canvas.getContext("2d") : null;
      if (ctx) {
        drawScene(
          ctx,
          ball,
          trail,
          colorsRef.current,
          displayFps,
          lagLabelTimer > 0,
        );
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Variable delta time" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Fixed timestep component                                           */
/* ------------------------------------------------------------------ */

const FIXED_DT = 1 / 60;

export function TimestepFixed() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors: Colors = {
    ball: isDark ? "#F87171" : "#DC2626",
    trail: isDark ? "rgba(248,113,113,0.3)" : "rgba(220,38,38,0.2)",
    wall: isDark ? "#B8A8A8" : "#4B5563",
    lag: isDark ? "#F59E0B" : "#D97706",
    text: isDark ? "#F5F1F1" : "#111827",
    bg: isDark ? "#1a1a1a" : "#fafafa",
  };

  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  });

  useEffect(() => {
    const ball = createBall();
    const trail: TrailPoint[] = [];
    let lastTime = 0;
    let elapsed = 0;
    let accumulator = 0;
    let nextSpike = SPIKE_INTERVAL;
    let spikeConsumed = false;
    let lagLabelTimer = 0;
    let displayFps = 60;
    let rafId = 0;

    function tick(time: number) {
      const rawDt = lastTime ? (time - lastTime) / 1000 : 1 / 60;
      lastTime = time;
      elapsed += rawDt;

      let frameDt = Math.min(rawDt, 0.05);

      // Inject the same single bad frame
      if (elapsed >= nextSpike && !spikeConsumed) {
        frameDt = SPIKE_DT;
        spikeConsumed = true;
        lagLabelTimer = LAG_LABEL_DURATION;
        displayFps = 5;
      }
      if (spikeConsumed && elapsed >= nextSpike + 0.1) {
        nextSpike += SPIKE_INTERVAL;
        spikeConsumed = false;
      }

      lagLabelTimer = Math.max(0, lagLabelTimer - rawDt);
      if (lagLabelTimer <= 0) {
        displayFps = displayFps * 0.9 + (1 / Math.max(rawDt, 0.001)) * 0.1;
      }

      // Fixed timestep with accumulator
      accumulator += frameDt;
      if (accumulator > 0.25) accumulator = 0.25;
      while (accumulator >= FIXED_DT) {
        physicsTick(ball, FIXED_DT);
        accumulator -= FIXED_DT;
      }

      trail.push({ x: ball.x, y: ball.y });
      if (trail.length > TRAIL_LENGTH) trail.shift();

      const canvas = canvasRef.current;
      const ctx = canvas ? canvas.getContext("2d") : null;
      if (ctx) {
        drawScene(
          ctx,
          ball,
          trail,
          colorsRef.current,
          displayFps,
          lagLabelTimer > 0,
        );
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Fixed timestep with accumulator"
      canvasRef={canvasRef}
    />
  );
}
