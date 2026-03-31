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
const BALL_RADIUS = 8;
const BALL_SPEED = 800;
const WALL_X = CANVAS_W / 2;
const WALL_HALF_W = 2;
const WALL_TOP = 40;
const WALL_BOTTOM = CANVAS_H - 40;
const FLASH_DURATION = 0.25;

/* ------------------------------------------------------------------ */
/*  Shared paper style                                                 */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Colors helper                                                      */
/* ------------------------------------------------------------------ */

interface SimColors {
  entity: string;
  wall: string;
  hit: string;
  text: string;
  bg: string;
  trail: string;
}

/* ------------------------------------------------------------------ */
/*  Discrete collision (tunneling)                                     */
/* ------------------------------------------------------------------ */

function drawDiscrete(
  ctx: CanvasRenderingContext2D,
  ballX: number,
  ballY: number,
  prevX: number,
  flashTimer: number,
  tunnelX: number,
  colors: SimColors,
) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Wall
  ctx.fillStyle = colors.wall;
  ctx.fillRect(
    WALL_X - WALL_HALF_W,
    WALL_TOP,
    WALL_HALF_W * 2,
    WALL_BOTTOM - WALL_TOP,
  );

  // Tunnel flash: red trail through wall when tunneling occurs
  if (flashTimer > 0) {
    const alpha = Math.min(flashTimer / FLASH_DURATION, 1) * 0.7;
    ctx.save();
    ctx.globalAlpha = alpha;

    // Red glow on wall where tunnel happened
    ctx.fillStyle = colors.entity;
    ctx.fillRect(WALL_X - 12, tunnelX - 20, 24, 40);

    // Dashed trail showing the skip
    ctx.strokeStyle = colors.entity;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(prevX, ballY);
    ctx.lineTo(ballX, ballY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  // Ghost positions showing discrete steps
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = colors.entity;
  const stepSize = BALL_SPEED / 60;
  const dir = ballX > prevX ? 1 : -1;
  let gx = prevX;
  for (let i = 0; i < 3; i++) {
    gx += dir * stepSize * 0.3;
    if (gx > BALL_RADIUS && gx < CANVAS_W - BALL_RADIUS) {
      ctx.beginPath();
      ctx.arc(gx, ballY, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = colors.entity;
  ctx.fill();

  // Ball highlight
  ctx.beginPath();
  ctx.arc(ballX - 2, ballY - 2, BALL_RADIUS * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();

  // Label
  ctx.font = "bold 10px monospace";
  ctx.fillStyle = colors.text;
  ctx.textAlign = "center";
  ctx.fillText(
    "Discrete: position = pos + vel * dt",
    CANVAS_W / 2,
    CANVAS_H - 8,
  );
}

/* ------------------------------------------------------------------ */
/*  Continuous collision (correct)                                     */
/* ------------------------------------------------------------------ */

function drawContinuous(
  ctx: CanvasRenderingContext2D,
  ballX: number,
  ballY: number,
  flashTimer: number,
  contactX: number,
  colors: SimColors,
) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Wall
  ctx.fillStyle = colors.wall;
  ctx.fillRect(
    WALL_X - WALL_HALF_W,
    WALL_TOP,
    WALL_HALF_W * 2,
    WALL_BOTTOM - WALL_TOP,
  );

  // Contact flash: green glow at bounce point
  if (flashTimer > 0) {
    const alpha = Math.min(flashTimer / FLASH_DURATION, 1) * 0.8;
    ctx.save();
    ctx.globalAlpha = alpha;

    // Green contact burst
    ctx.fillStyle = colors.hit;
    ctx.beginPath();
    ctx.arc(contactX, ballY, BALL_RADIUS + 10 * alpha, 0, Math.PI * 2);
    ctx.fill();

    // Sweep line showing path checked
    ctx.strokeStyle = colors.hit;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(ballX, ballY);
    ctx.lineTo(contactX, ballY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = colors.entity;
  ctx.fill();

  // Ball highlight
  ctx.beginPath();
  ctx.arc(ballX - 2, ballY - 2, BALL_RADIUS * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();

  // Label
  ctx.font = "bold 10px monospace";
  ctx.fillStyle = colors.text;
  ctx.textAlign = "center";
  ctx.fillText("Continuous: sweep test along path", CANVAS_W / 2, CANVAS_H - 8);
}

/* ------------------------------------------------------------------ */
/*  Exported component: Discrete (tunneling)                           */
/* ------------------------------------------------------------------ */

export function CollisionDiscrete() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxOrNull = canvas.getContext("2d");
    if (!ctxOrNull) return;
    const ctx: CanvasRenderingContext2D = ctxOrNull;

    const colors: SimColors = {
      entity: isDark ? "#F87171" : "#DC2626",
      wall: isDark ? "#B8A8A8" : "#4B5563",
      hit: isDark ? "#22C55E" : "#15803D",
      text: isDark ? "#F5F1F1" : "#111827",
      bg: isDark ? "#1E1E1E" : "#FAFAFA",
      trail: isDark ? "#F87171" : "#DC2626",
    };

    let ballX = 60;
    const ballY = CANVAS_H / 2;
    let vx = BALL_SPEED;
    let prevX = ballX;
    let flashTimer = 0;
    let tunnelY = ballY;
    let savedPrevX = ballX;
    let lastTime = 0;
    let raf = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
      lastTime = time;

      prevX = ballX;

      // Discrete step: just add velocity, no wall check between frames
      ballX += vx * dt;

      // Check if we tunneled through the wall (crossed it without stopping)
      const wallLeft = WALL_X - WALL_HALF_W - BALL_RADIUS;
      const wallRight = WALL_X + WALL_HALF_W + BALL_RADIUS;
      const crossedRight = prevX < wallLeft && ballX > wallRight;
      const crossedLeft = prevX > wallRight && ballX < wallLeft;

      if (crossedRight || crossedLeft) {
        // Tunneled through. Flash red to show the problem.
        flashTimer = FLASH_DURATION;
        tunnelY = ballY;
        savedPrevX = prevX;
      }

      // Bounce off canvas edges
      if (ballX - BALL_RADIUS < 0) {
        ballX = BALL_RADIUS;
        vx = Math.abs(vx);
      }
      if (ballX + BALL_RADIUS > CANVAS_W) {
        ballX = CANVAS_W - BALL_RADIUS;
        vx = -Math.abs(vx);
      }

      flashTimer = Math.max(0, flashTimer - dt);

      drawDiscrete(ctx, ballX, ballY, savedPrevX, flashTimer, tunnelY, colors);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  return (
    <CanvasSimulation
      label="Bullet tunnels through wall"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Exported component: Continuous (correct bounce)                    */
/* ------------------------------------------------------------------ */

export function CollisionContinuous() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxOrNull2 = canvas.getContext("2d");
    if (!ctxOrNull2) return;
    const ctx: CanvasRenderingContext2D = ctxOrNull2;

    const colors: SimColors = {
      entity: isDark ? "#F87171" : "#DC2626",
      wall: isDark ? "#B8A8A8" : "#4B5563",
      hit: isDark ? "#22C55E" : "#15803D",
      text: isDark ? "#F5F1F1" : "#111827",
      bg: isDark ? "#1E1E1E" : "#FAFAFA",
      trail: isDark ? "#22C55E" : "#15803D",
    };

    let ballX = 60;
    const ballY = CANVAS_H / 2;
    let vx = BALL_SPEED;
    let flashTimer = 0;
    let contactPt = WALL_X;
    let lastTime = 0;
    let raf = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
      lastTime = time;

      // Continuous collision: sweep the ball along its path
      let remaining = vx * dt;
      let steps = 0;
      const maxSteps = 4;

      while (Math.abs(remaining) > 0.01 && steps < maxSteps) {
        steps++;
        const newX = ballX + remaining;

        // Determine wall edges considering ball radius
        const wallLeft = WALL_X - WALL_HALF_W - BALL_RADIUS;
        const wallRight = WALL_X + WALL_HALF_W + BALL_RADIUS;

        if (remaining > 0 && ballX < wallLeft && newX >= wallLeft) {
          // Moving right, would hit left side of wall
          const tHit = (wallLeft - ballX) / remaining;
          ballX = wallLeft;
          remaining = -(1 - tHit) * Math.abs(remaining);
          vx = -Math.abs(vx);
          flashTimer = FLASH_DURATION;
          contactPt = WALL_X - WALL_HALF_W;
        } else if (remaining < 0 && ballX > wallRight && newX <= wallRight) {
          // Moving left, would hit right side of wall
          const tHit = (wallRight - ballX) / remaining;
          ballX = wallRight;
          remaining = (1 - tHit) * Math.abs(remaining);
          vx = Math.abs(vx);
          flashTimer = FLASH_DURATION;
          contactPt = WALL_X + WALL_HALF_W;
        } else {
          ballX = newX;
          remaining = 0;
        }
      }

      // Bounce off canvas edges
      if (ballX - BALL_RADIUS < 0) {
        ballX = BALL_RADIUS;
        vx = Math.abs(vx);
      }
      if (ballX + BALL_RADIUS > CANVAS_W) {
        ballX = CANVAS_W - BALL_RADIUS;
        vx = -Math.abs(vx);
      }

      flashTimer = Math.max(0, flashTimer - dt);

      drawContinuous(ctx, ballX, ballY, flashTimer, contactPt, colors);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  return (
    <CanvasSimulation
      label="Bullet stops at contact point"
      canvasRef={canvasRef}
    />
  );
}
