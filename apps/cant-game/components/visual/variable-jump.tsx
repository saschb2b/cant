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

const GROUND_Y = 190;
const CHAR_SIZE = 14;
const RUN_SPEED = 55;
const GRAVITY = 700;

/** The three hold durations the simulation cycles through (seconds). */
const HOLD_DURATIONS = [0.08, 0.22, 0.42];
const HOLD_LABELS = ["tap", "med", "long"];

/** Jump velocity per hold level for the variable version. */
const JUMP_VY_BY_LEVEL = [-120, -210, -320];

/** Fixed jump always uses this velocity. */
const FIXED_JUMP_VY = -220;

/** Max hold bar width in pixels. */
const HOLD_BAR_W = 50;
const HOLD_BAR_H = 6;
const HOLD_BAR_X = 10;
const HOLD_BAR_Y = 10;

const MAX_TRAIL = 120;

/** Pause between cycles on the same jump index. */
const CYCLE_PAUSE = 0.6;

/* ------------------------------------------------------------------ */
/*  Simulation state                                                   */
/* ------------------------------------------------------------------ */

interface TrailDot {
  x: number;
  y: number;
}

interface SimState {
  x: number;
  y: number;
  vy: number;
  onGround: boolean;
  /** Current index into HOLD_DURATIONS cycle. */
  holdIndex: number;
  /** Accumulated hold time for current jump. */
  holdTimer: number;
  /** Whether the hold phase is active. */
  holding: boolean;
  /** Whether a jump is in progress (airborne from a jump). */
  jumping: boolean;
  /** Whether the character has committed to a jump (left the ground). */
  launched: boolean;
  /** Pause timer before next cycle step. */
  pauseTimer: number;
  /** Trail of arc dots. */
  trail: TrailDot[];
  /** Time accumulator for spawning trail dots. */
  trailTimer: number;
  /** The hold fraction at the moment of launch (0-1). */
  launchFraction: number;
}

function createState(): SimState {
  return {
    x: -CHAR_SIZE,
    y: GROUND_Y - CHAR_SIZE,
    vy: 0,
    onGround: true,
    holdIndex: 0,
    holdTimer: 0,
    holding: false,
    jumping: false,
    launched: false,
    pauseTimer: 0.5,
    trail: [],
    trailTimer: 0,
    launchFraction: 0,
  };
}

/* ------------------------------------------------------------------ */
/*  Simulation step                                                    */
/* ------------------------------------------------------------------ */

/** X position where a jump is triggered. */
const JUMP_TRIGGER_X = 90;

function stepSim(state: SimState, dt: number, variable: boolean): void {
  // Pause between jumps
  if (state.pauseTimer > 0) {
    state.pauseTimer -= dt;
    if (state.pauseTimer <= 0) {
      state.holding = false;
      state.jumping = false;
      state.launched = false;
      state.holdTimer = 0;
      state.launchFraction = 0;
    }
    // Still run the character
    state.x += RUN_SPEED * dt;
    if (state.x > CANVAS_W + CHAR_SIZE) {
      state.x = -CHAR_SIZE;
    }
    return;
  }

  // Movement
  state.x += RUN_SPEED * dt;
  if (state.x > CANVAS_W + CHAR_SIZE) {
    state.x = -CHAR_SIZE;
    // Clear trail on wrap
    state.trail = [];
  }

  const targetHold =
    HOLD_DURATIONS[state.holdIndex] ?? HOLD_DURATIONS[0] ?? 0.08;

  // Trigger hold phase when reaching the jump spot
  if (
    !state.holding &&
    !state.jumping &&
    state.onGround &&
    state.x >= JUMP_TRIGGER_X
  ) {
    state.holding = true;
    state.holdTimer = 0;
  }

  // Hold phase: accumulate hold time
  if (state.holding && !state.launched) {
    state.holdTimer += dt;
    if (state.holdTimer >= targetHold) {
      // Release: launch the jump
      state.holdTimer = targetHold;
      state.holding = false;
      state.launched = true;
      state.jumping = true;
      const maxDuration = HOLD_DURATIONS[HOLD_DURATIONS.length - 1] ?? 0.42;
      state.launchFraction = targetHold / maxDuration;

      if (variable) {
        state.vy = JUMP_VY_BY_LEVEL[state.holdIndex] ?? FIXED_JUMP_VY;
      } else {
        state.vy = FIXED_JUMP_VY;
      }
      state.onGround = false;
    }
  }

  // Gravity when airborne
  if (!state.onGround) {
    state.vy += GRAVITY * dt;
    state.y += state.vy * dt;

    // Trail dots
    state.trailTimer += dt;
    if (state.trailTimer > 0.02) {
      state.trailTimer = 0;
      state.trail.push({
        x: state.x + CHAR_SIZE / 2,
        y: state.y + CHAR_SIZE / 2,
      });
      if (state.trail.length > MAX_TRAIL) {
        state.trail.shift();
      }
    }

    // Land
    if (state.vy > 0 && state.y + CHAR_SIZE >= GROUND_Y) {
      state.y = GROUND_Y - CHAR_SIZE;
      state.vy = 0;
      state.onGround = true;
      state.jumping = false;
      state.launched = false;
      state.holding = false;

      // Advance to next hold duration
      state.holdIndex = (state.holdIndex + 1) % HOLD_DURATIONS.length;
      state.pauseTimer = CYCLE_PAUSE;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Drawing                                                            */
/* ------------------------------------------------------------------ */

interface DrawColors {
  character: string;
  ground: string;
  trail: string;
  holdBar: string;
  bg: string;
  text: string;
  arcGuide: string;
}

/** Draw a parabolic arc guide from a starting point with given velocity. */
function drawArcGuide(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  vy: number,
  color: string,
  alpha: number,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();

  let px = startX;
  let py = startY;
  let vel = vy;
  const simDt = 0.016;
  ctx.moveTo(px, py);

  for (let i = 0; i < 80; i++) {
    vel += GRAVITY * simDt;
    px += RUN_SPEED * simDt;
    py += vel * simDt;
    if (py > GROUND_Y) {
      ctx.lineTo(px, GROUND_Y);
      break;
    }
    ctx.lineTo(px, py);
  }

  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  state: SimState,
  colors: DrawColors,
  variable: boolean,
): void {
  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Ground line
  ctx.fillStyle = colors.ground;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, 3);

  // Ground texture dots
  ctx.globalAlpha = 0.15;
  for (let gx = 10; gx < CANVAS_W; gx += 20) {
    ctx.fillRect(gx, GROUND_Y + 6, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Trail dots
  ctx.fillStyle = colors.trail;
  for (let i = 0; i < state.trail.length; i++) {
    const dot = state.trail[i];
    if (!dot) continue;
    const age = 1 - i / state.trail.length;
    ctx.globalAlpha = age * 0.8;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Arc guides
  if (variable) {
    // Faint min and max arc guidelines from the jump trigger point
    const guideStartY = GROUND_Y - CHAR_SIZE / 2;
    const guideStartX = JUMP_TRIGGER_X + CHAR_SIZE / 2;
    const minVy = JUMP_VY_BY_LEVEL[0] ?? -120;
    const maxVy = JUMP_VY_BY_LEVEL[JUMP_VY_BY_LEVEL.length - 1] ?? -320;
    drawArcGuide(ctx, guideStartX, guideStartY, minVy, colors.arcGuide, 0.15);
    drawArcGuide(ctx, guideStartX, guideStartY, maxVy, colors.arcGuide, 0.15);
  } else {
    // Fixed: show the single arc trajectory
    const guideStartY = GROUND_Y - CHAR_SIZE / 2;
    const guideStartX = JUMP_TRIGGER_X + CHAR_SIZE / 2;
    drawArcGuide(
      ctx,
      guideStartX,
      guideStartY,
      FIXED_JUMP_VY,
      colors.arcGuide,
      0.25,
    );
  }

  // Character (square with eyes)
  ctx.fillStyle = colors.character;
  ctx.fillRect(state.x, state.y, CHAR_SIZE, CHAR_SIZE);

  // Eyes
  ctx.fillStyle = colors.bg;
  const eyeY = state.y + 4;
  ctx.fillRect(state.x + 7, eyeY, 2, 2);
  ctx.fillRect(state.x + 11, eyeY, 2, 2);

  // Hold bar background
  ctx.fillStyle = colors.ground;
  ctx.globalAlpha = 0.3;
  ctx.fillRect(HOLD_BAR_X, HOLD_BAR_Y, HOLD_BAR_W, HOLD_BAR_H);
  ctx.globalAlpha = 1;

  // Hold bar outline
  ctx.strokeStyle = colors.ground;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.strokeRect(HOLD_BAR_X, HOLD_BAR_Y, HOLD_BAR_W, HOLD_BAR_H);
  ctx.globalAlpha = 1;

  // Hold bar fill
  const maxHold = HOLD_DURATIONS[HOLD_DURATIONS.length - 1] ?? 0.42;
  let fillFraction = 0;
  if (state.holding) {
    fillFraction = state.holdTimer / maxHold;
  } else if (state.launched || state.jumping) {
    fillFraction = state.launchFraction;
  }
  if (fillFraction > 0) {
    ctx.fillStyle = colors.holdBar;
    const barFillW = Math.min(fillFraction, 1) * HOLD_BAR_W;
    ctx.fillRect(HOLD_BAR_X, HOLD_BAR_Y, barFillW, HOLD_BAR_H);
  }

  // Hold bar label
  ctx.font = "9px monospace";
  ctx.fillStyle = colors.text;
  ctx.globalAlpha = 0.7;
  ctx.textAlign = "left";
  ctx.fillText("HOLD", HOLD_BAR_X, HOLD_BAR_Y + HOLD_BAR_H + 12);
  ctx.globalAlpha = 1;

  // Current input label (tap/med/long)
  const activeIndex = state.holdIndex;
  const label = HOLD_LABELS[activeIndex] ?? "tap";
  ctx.font = "bold 10px monospace";
  ctx.fillStyle = colors.holdBar;
  ctx.globalAlpha = 0.8;
  ctx.textAlign = "left";
  ctx.fillText(label, HOLD_BAR_X + HOLD_BAR_W + 6, HOLD_BAR_Y + HOLD_BAR_H);
  ctx.globalAlpha = 1;

  // Cycle indicator dots
  for (let i = 0; i < HOLD_DURATIONS.length; i++) {
    const dotX = HOLD_BAR_X + 2 + i * 10;
    const dotY = HOLD_BAR_Y + HOLD_BAR_H + 22;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
    if (i === activeIndex) {
      ctx.fillStyle = colors.holdBar;
      ctx.fill();
    } else {
      ctx.strokeStyle = colors.ground;
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Animation hook                                                     */
/* ------------------------------------------------------------------ */

function useVariableJumpSim(variable: boolean, colors: DrawColors) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(createState());
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  useEffect(() => {
    // Reset state when mode changes
    stateRef.current = createState();
    lastTimeRef.current = 0;

    function tick(time: number) {
      const dt = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 0.05)
        : 0.016;
      lastTimeRef.current = time;

      stepSim(stateRef.current, dt, variable);

      const canvas = canvasRef.current;
      const maybeCtx = canvas ? canvas.getContext("2d") : null;
      if (maybeCtx) {
        const ctx: CanvasRenderingContext2D = maybeCtx;
        drawScene(ctx, stateRef.current, colorsRef.current, variable);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [variable]);

  return canvasRef;
}

/* ------------------------------------------------------------------ */
/*  Exported components                                                */
/* ------------------------------------------------------------------ */

export function JumpFixed() {
  const isDark = useIsDarkMode();

  const colors: DrawColors = {
    character: isDark ? "#F87171" : "#DC2626",
    ground: isDark ? "#B8A8A8" : "#4B5563",
    trail: isDark ? "rgba(248,113,113,0.3)" : "rgba(220,38,38,0.2)",
    holdBar: isDark ? "#F59E0B" : "#D97706",
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#E5E5E5" : "#1a1a1a",
    arcGuide: isDark ? "#B8A8A8" : "#4B5563",
  };

  const canvasRef = useVariableJumpSim(false, colors);

  return (
    <CanvasSimulation
      label={"Fixed height: hold duration ignored"}
      canvasRef={canvasRef}
    />
  );
}

export function JumpVariable() {
  const isDark = useIsDarkMode();

  const colors: DrawColors = {
    character: isDark ? "#F87171" : "#DC2626",
    ground: isDark ? "#B8A8A8" : "#4B5563",
    trail: isDark ? "rgba(248,113,113,0.3)" : "rgba(220,38,38,0.2)",
    holdBar: isDark ? "#F59E0B" : "#D97706",
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#E5E5E5" : "#1a1a1a",
    arcGuide: isDark ? "#B8A8A8" : "#4B5563",
  };

  const canvasRef = useVariableJumpSim(true, colors);

  return (
    <CanvasSimulation
      label={"Variable height: hold duration controls arc"}
      canvasRef={canvasRef}
    />
  );
}
