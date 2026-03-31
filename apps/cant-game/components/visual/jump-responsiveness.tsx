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

const GROUND_Y = 170;
const PLAT_HEIGHT = 16;
const CHAR_SIZE = 16;
const GRAVITY = 600;
const RUN_SPEED = 70;
const JUMP_VY = -260;

const PLAT1_LEFT = 20;
const PLAT1_RIGHT = 150;
const GAP_WIDTH = 60;
const PLAT2_LEFT = PLAT1_RIGHT + GAP_WIDTH;
const PLAT2_RIGHT = 300;

/** How many pixels past the edge the character presses jump. */
const JUMP_DELAY_PX = 10;

/** Coyote time grace period in seconds. */
const COYOTE_WINDOW = 0.12;

/** How many pixels the coyote grace zone extends past the edge. */
const COYOTE_VISUAL_PX = COYOTE_WINDOW * RUN_SPEED;

const RESET_PAUSE = 0.8;

/* ------------------------------------------------------------------ */
/*  Simulation state                                                   */
/* ------------------------------------------------------------------ */

interface SimState {
  x: number;
  y: number;
  vy: number;
  onGround: boolean;
  /** Time since the character left the ground (for coyote time). */
  airTime: number;
  jumped: boolean;
  jumpFlash: number;
  /** Whether the jump attempt succeeded. */
  jumpSucceeded: boolean;
  /** Whether the character landed on the second platform. */
  landed: boolean;
  /** Pause timer before reset. */
  resetTimer: number;
  /** Falling into the pit. */
  falling: boolean;
  /** Success glow timer. */
  successGlow: number;
  /** Fail flash timer. */
  failFlash: number;
}

function createState(): SimState {
  return {
    x: PLAT1_LEFT + 10,
    y: GROUND_Y - CHAR_SIZE,
    vy: 0,
    onGround: true,
    airTime: 0,
    jumped: false,
    jumpFlash: 0,
    jumpSucceeded: false,
    landed: false,
    resetTimer: 0,
    falling: false,
    successGlow: 0,
    failFlash: 0,
  };
}

function isOnPlatform(x: number, y: number): boolean {
  const cx = x + CHAR_SIZE / 2;
  const bottom = y + CHAR_SIZE;
  const onPlat1 =
    cx >= PLAT1_LEFT &&
    cx <= PLAT1_RIGHT &&
    bottom >= GROUND_Y &&
    bottom <= GROUND_Y + 4;
  const onPlat2 =
    cx >= PLAT2_LEFT &&
    cx <= PLAT2_RIGHT &&
    bottom >= GROUND_Y &&
    bottom <= GROUND_Y + 4;
  return onPlat1 || onPlat2;
}

function stepSim(state: SimState, dt: number, useCoyoteTime: boolean): void {
  // Pausing after landing or falling
  if (state.resetTimer > 0) {
    state.resetTimer -= dt;
    if (state.resetTimer <= 0) {
      const fresh = createState();
      state.x = fresh.x;
      state.y = fresh.y;
      state.vy = fresh.vy;
      state.onGround = fresh.onGround;
      state.airTime = fresh.airTime;
      state.jumped = fresh.jumped;
      state.jumpFlash = fresh.jumpFlash;
      state.jumpSucceeded = fresh.jumpSucceeded;
      state.landed = fresh.landed;
      state.falling = fresh.falling;
      state.successGlow = fresh.successGlow;
      state.failFlash = fresh.failFlash;
    }
    return;
  }

  // Timers
  if (state.jumpFlash > 0) state.jumpFlash -= dt;
  if (state.successGlow > 0) state.successGlow -= dt;
  if (state.failFlash > 0) state.failFlash -= dt;

  // Already landed on second platform, coast to a stop
  if (state.landed) {
    state.x += RUN_SPEED * 0.5 * dt;
    if (state.x > PLAT2_LEFT + 40) {
      state.resetTimer = RESET_PAUSE;
    }
    return;
  }

  // Falling off screen
  if (state.falling) {
    state.vy += GRAVITY * dt;
    state.y += state.vy * dt;
    if (state.y > CANVAS_H + 20) {
      state.resetTimer = RESET_PAUSE;
    }
    return;
  }

  // Movement
  state.x += RUN_SPEED * dt;

  // Check ground
  const wasOnGround = state.onGround;
  if (state.vy >= 0) {
    state.onGround = isOnPlatform(state.x, state.y);
  } else {
    state.onGround = false;
  }

  if (state.onGround) {
    state.y = GROUND_Y - CHAR_SIZE;
    state.vy = 0;
    state.airTime = 0;
  } else {
    state.airTime += dt;
  }

  // Detect leaving first platform
  const cx = state.x + CHAR_SIZE / 2;
  const jumpTriggerX = PLAT1_RIGHT + JUMP_DELAY_PX;

  // Attempt jump when crossing the trigger point
  if (
    !state.jumped &&
    cx >= jumpTriggerX &&
    cx < jumpTriggerX + RUN_SPEED * dt + 2
  ) {
    state.jumped = true;
    state.jumpFlash = 0.5;

    const canJump = useCoyoteTime
      ? state.onGround || state.airTime < COYOTE_WINDOW
      : state.onGround;

    if (canJump) {
      state.vy = JUMP_VY;
      state.onGround = false;
      state.jumpSucceeded = true;
      state.successGlow = 0.4;
    } else {
      state.jumpSucceeded = false;
      state.failFlash = 0.5;
    }
  }

  // Apply gravity when airborne
  if (!state.onGround) {
    state.vy += GRAVITY * dt;
    state.y += state.vy * dt;

    // Check landing on second platform
    if (state.vy > 0 && state.jumpSucceeded) {
      const bottom = state.y + CHAR_SIZE;
      if (
        cx >= PLAT2_LEFT &&
        cx <= PLAT2_RIGHT &&
        bottom >= GROUND_Y &&
        bottom <= GROUND_Y + state.vy * dt + 4
      ) {
        state.y = GROUND_Y - CHAR_SIZE;
        state.vy = 0;
        state.onGround = true;
        state.landed = true;
        state.successGlow = 0.6;
      }
    }
  }

  // Detect lost in the gap (no jump or failed jump)
  if (
    !state.onGround &&
    !state.jumpSucceeded &&
    cx > PLAT1_RIGHT + 5 &&
    !wasOnGround
  ) {
    const bottom = state.y + CHAR_SIZE;
    if (bottom > GROUND_Y + PLAT_HEIGHT) {
      state.falling = true;
    }
  }

  // Detect falling past platforms even with jump
  if (state.y > GROUND_Y + PLAT_HEIGHT + 10 && !state.landed) {
    state.falling = true;
  }
}

/* ------------------------------------------------------------------ */
/*  Drawing                                                            */
/* ------------------------------------------------------------------ */

interface DrawColors {
  character: string;
  platform: string;
  success: string;
  bg: string;
  text: string;
  pit: string;
  coyoteZone: string;
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  state: SimState,
  colors: DrawColors,
  showCoyoteZone: boolean,
) {
  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Pit (darker area between platforms)
  ctx.fillStyle = colors.pit;
  ctx.fillRect(PLAT1_RIGHT, GROUND_Y, GAP_WIDTH, CANVAS_H - GROUND_Y);

  // Platforms
  ctx.fillStyle = colors.platform;
  ctx.fillRect(PLAT1_LEFT, GROUND_Y, PLAT1_RIGHT - PLAT1_LEFT, PLAT_HEIGHT);
  ctx.fillRect(PLAT2_LEFT, GROUND_Y, PLAT2_RIGHT - PLAT2_LEFT, PLAT_HEIGHT);

  // Platform surface highlight
  ctx.fillStyle = showCoyoteZone ? colors.success : colors.text;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(PLAT1_LEFT, GROUND_Y, PLAT1_RIGHT - PLAT1_LEFT, 2);
  ctx.fillRect(PLAT2_LEFT, GROUND_Y, PLAT2_RIGHT - PLAT2_LEFT, 2);
  ctx.globalAlpha = 1;

  // Coyote time zone indicator (dotted extension from platform edge)
  if (showCoyoteZone) {
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = colors.success;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(PLAT1_RIGHT, GROUND_Y);
    ctx.lineTo(PLAT1_RIGHT + COYOTE_VISUAL_PX, GROUND_Y);
    ctx.stroke();

    // Subtle filled zone
    ctx.fillStyle = colors.success;
    ctx.globalAlpha = 0.08;
    ctx.fillRect(PLAT1_RIGHT, GROUND_Y - 30, COYOTE_VISUAL_PX, 30);
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.restore();

    // Label
    ctx.font = "9px monospace";
    ctx.fillStyle = colors.success;
    ctx.globalAlpha = 0.6;
    ctx.textAlign = "center";
    ctx.fillText("grace", PLAT1_RIGHT + COYOTE_VISUAL_PX / 2, GROUND_Y - 4);
    ctx.globalAlpha = 1;
  }

  // Character
  let charColor = colors.character;
  if (state.successGlow > 0) {
    charColor = colors.success;
  } else if (
    state.failFlash > 0 &&
    Math.floor(state.failFlash * 12) % 2 === 0
  ) {
    charColor = colors.text;
  }
  ctx.fillStyle = charColor;
  ctx.fillRect(state.x, state.y, CHAR_SIZE, CHAR_SIZE);

  // Eyes on character
  ctx.fillStyle = colors.bg;
  const eyeY = state.y + 5;
  ctx.fillRect(state.x + 9, eyeY, 3, 3);
  ctx.fillRect(state.x + 13, eyeY, 3, 3);

  // Jump flash indicator
  if (state.jumpFlash > 0) {
    const flashAlpha = Math.min(state.jumpFlash / 0.3, 1);
    ctx.globalAlpha = flashAlpha;
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    if (state.jumpSucceeded) {
      ctx.fillStyle = colors.success;
      ctx.fillText("JUMP", state.x + CHAR_SIZE / 2, state.y - 10);
    } else {
      ctx.fillStyle = colors.character;
      ctx.fillText("JUMP", state.x + CHAR_SIZE / 2, state.y - 10);
      // X mark for failed jump
      ctx.strokeStyle = colors.character;
      ctx.lineWidth = 2;
      const markX = state.x + CHAR_SIZE / 2 + 28;
      const markY = state.y - 17;
      ctx.beginPath();
      ctx.moveTo(markX - 5, markY - 5);
      ctx.lineTo(markX + 5, markY + 5);
      ctx.moveTo(markX + 5, markY - 5);
      ctx.lineTo(markX - 5, markY + 5);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // Success particles when landing on second platform
  if (state.landed && state.successGlow > 0) {
    const particleAlpha = Math.min(state.successGlow / 0.3, 1);
    ctx.globalAlpha = particleAlpha;
    ctx.fillStyle = colors.success;
    const spread = (0.6 - state.successGlow) * 80;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const px = state.x + CHAR_SIZE / 2 + Math.cos(angle) * spread;
      const py = state.y + CHAR_SIZE / 2 + Math.sin(angle) * spread;
      ctx.fillRect(px - 2, py - 2, 4, 4);
    }
    ctx.globalAlpha = 1;
  }

  // Fail indicator when falling into pit
  if (state.falling && state.failFlash > 0) {
    const failAlpha = Math.min(state.failFlash / 0.3, 1);
    ctx.globalAlpha = failAlpha;
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = colors.character;
    ctx.textAlign = "center";
    ctx.fillText("MISS", PLAT1_RIGHT + GAP_WIDTH / 2, GROUND_Y - 20);
    ctx.globalAlpha = 1;
  }
}

/* ------------------------------------------------------------------ */
/*  Shared animation hook                                              */
/* ------------------------------------------------------------------ */

function useJumpSim(useCoyoteTime: boolean, colors: DrawColors) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(createState());
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);

  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  useEffect(() => {
    function tick(time: number) {
      const dt = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 0.05)
        : 0.016;
      lastTimeRef.current = time;

      stepSim(stateRef.current, dt, useCoyoteTime);

      const canvas = canvasRef.current;
      const ctx = canvas ? canvas.getContext("2d") : null;
      if (ctx) {
        drawScene(ctx, stateRef.current, colorsRef.current, useCoyoteTime);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [useCoyoteTime]);

  return canvasRef;
}

/* ------------------------------------------------------------------ */
/*  Exported components                                                */
/* ------------------------------------------------------------------ */

export function JumpStrict() {
  const isDark = useIsDarkMode();

  const colors: DrawColors = {
    character: isDark ? "#F87171" : "#DC2626",
    platform: isDark ? "#B8A8A8" : "#4B5563",
    success: isDark ? "#22C55E" : "#15803D",
    bg: isDark ? "#1a1a1a" : "#f8f8f8",
    text: isDark ? "#F5F1F1" : "#111827",
    pit: isDark ? "#0d0d0d" : "#e5e5e5",
    coyoteZone: isDark ? "#22C55E" : "#15803D",
  };

  const canvasRef = useJumpSim(false, colors);

  return (
    <CanvasSimulation label="Jump only while grounded" canvasRef={canvasRef} />
  );
}

export function JumpCoyoteTime() {
  const isDark = useIsDarkMode();

  const colors: DrawColors = {
    character: isDark ? "#F87171" : "#DC2626",
    platform: isDark ? "#B8A8A8" : "#4B5563",
    success: isDark ? "#22C55E" : "#15803D",
    bg: isDark ? "#1a1a1a" : "#f8f8f8",
    text: isDark ? "#F5F1F1" : "#111827",
    pit: isDark ? "#0d0d0d" : "#e5e5e5",
    coyoteZone: isDark ? "#22C55E" : "#15803D",
  };

  const canvasRef = useJumpSim(true, colors);

  return (
    <CanvasSimulation
      label={"Coyote time: " + String(COYOTE_WINDOW * 1000) + "ms grace window"}
      canvasRef={canvasRef}
    />
  );
}
