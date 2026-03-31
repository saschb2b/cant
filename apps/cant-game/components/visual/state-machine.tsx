"use client";

import { useRef, useEffect } from "react";
import {
  CanvasSimulation,
  useIsDarkMode,
} from "@cant/shared/components/canvas-simulation";

/* ------------------------------------------------------------------ */
/*  Shared constants                                                    */
/* ------------------------------------------------------------------ */

const CANVAS_W = 320;
const CANVAS_H = 240;

/** Interval between state-change attempts (ms). */
const TICK_INTERVAL = 900;

interface Colors {
  character: string;
  activeState: string;
  conflict: string;
  inactive: string;
  bg: string;
  text: string;
  flagOn: string;
  flagOff: string;
  diagram: string;
  rejected: string;
}

/* ------------------------------------------------------------------ */
/*  Deterministic PRNG (mulberry32)                                     */
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
/*  Character drawing                                                   */
/* ------------------------------------------------------------------ */

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  color: string,
  pose: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";

  // Head
  ctx.beginPath();
  ctx.arc(cx, cy - 28, 8, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(cx, cy - 20);
  ctx.lineTo(cx, cy);
  ctx.stroke();

  if (pose === "dead") {
    // X eyes
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - 31);
    ctx.lineTo(cx - 1, cy - 27);
    ctx.moveTo(cx - 1, cy - 31);
    ctx.lineTo(cx - 4, cy - 27);
    ctx.moveTo(cx + 1, cy - 31);
    ctx.lineTo(cx + 4, cy - 27);
    ctx.moveTo(cx + 4, cy - 31);
    ctx.lineTo(cx + 1, cy - 27);
    ctx.stroke();
    ctx.lineWidth = 2.5;
    // Collapsed legs
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 14, cy + 6);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 14, cy + 6);
    ctx.stroke();
    // Collapsed arms
    ctx.beginPath();
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx - 12, cy);
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx + 12, cy);
    ctx.stroke();
  } else if (pose === "jumping") {
    // Arms up
    ctx.beginPath();
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx - 14, cy - 26);
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx + 14, cy - 26);
    ctx.stroke();
    // Legs tucked
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 10, cy + 8);
    ctx.lineTo(cx - 6, cy + 16);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 10, cy + 8);
    ctx.lineTo(cx + 6, cy + 16);
    ctx.stroke();
  } else if (pose === "running") {
    // Arms swinging
    ctx.beginPath();
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx - 16, cy - 6);
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx + 12, cy - 20);
    ctx.stroke();
    // Legs stride
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 14, cy + 18);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 14, cy + 14);
    ctx.stroke();
  } else if (pose === "attacking") {
    // Sword arm extended
    ctx.beginPath();
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx + 20, cy - 18);
    ctx.lineTo(cx + 32, cy - 22);
    ctx.stroke();
    // Shield arm
    ctx.beginPath();
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx - 10, cy - 6);
    ctx.stroke();
    // Stance legs
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 10, cy + 18);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 10, cy + 18);
    ctx.stroke();
  } else {
    // Idle
    ctx.beginPath();
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx - 12, cy - 4);
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx + 12, cy - 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 8, cy + 18);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 8, cy + 18);
    ctx.stroke();
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  Boolean flags version                                               */
/* ------------------------------------------------------------------ */

interface BoolFlags {
  isRunning: boolean;
  isJumping: boolean;
  isDead: boolean;
  isAttacking: boolean;
}

const FLAG_NAMES: (keyof BoolFlags)[] = [
  "isRunning",
  "isJumping",
  "isDead",
  "isAttacking",
];

function hasConflict(flags: BoolFlags): boolean {
  if (flags.isDead && (flags.isRunning || flags.isJumping || flags.isAttacking))
    return true;
  if (flags.isJumping && flags.isAttacking) return true;
  return false;
}

function dominantPose(flags: BoolFlags): string {
  if (flags.isDead) return "dead";
  if (flags.isAttacking) return "attacking";
  if (flags.isJumping) return "jumping";
  if (flags.isRunning) return "running";
  return "idle";
}

function drawFlagBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  active: boolean,
  onColor: string,
  offColor: string,
  textColor: string,
) {
  const w = 72;
  const h = 18;
  const r = 9;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fillStyle = active ? onColor : offColor;
  ctx.fill();

  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = active ? "#FFFFFF" : textColor;
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
}

export function StateBooleanFlags() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors: Colors = {
    character: isDark ? "#F87171" : "#DC2626",
    activeState: isDark ? "#22C55E" : "#15803D",
    conflict: isDark ? "#EF4444" : "#DC2626",
    inactive: isDark ? "#B8A8A8" : "#4B5563",
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#F5F1F1" : "#111827",
    flagOn: isDark ? "#22C55E" : "#15803D",
    flagOff: isDark ? "#3a3a3a" : "#D1D5DB",
    diagram: isDark ? "#B8A8A8" : "#4B5563",
    rejected: isDark ? "#EF4444" : "#DC2626",
  };

  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  });

  useEffect(() => {
    const rand = mulberry32(33);
    const flags: BoolFlags = {
      isRunning: false,
      isJumping: false,
      isDead: false,
      isAttacking: false,
    };
    let conflictFlash = 0;
    let tickCount = 0;

    const intervalId = setInterval(() => {
      tickCount++;
      const c = colorsRef.current;

      // Every 12 ticks, reset all flags to start a new cycle
      if (tickCount % 12 === 0) {
        flags.isRunning = false;
        flags.isJumping = false;
        flags.isDead = false;
        flags.isAttacking = false;
      }

      // Randomly toggle a flag (no validation)
      const flagIdx = Math.floor(rand() * 4);
      const key = FLAG_NAMES[flagIdx];
      if (key) {
        flags[key] = !flags[key];
      }

      if (hasConflict(flags)) {
        conflictFlash = 3;
      } else if (conflictFlash > 0) {
        conflictFlash--;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const tempCtx = canvas.getContext("2d");
      if (!tempCtx) return;
      const ctx: CanvasRenderingContext2D = tempCtx;

      // Clear
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Draw character
      const charColor = hasConflict(flags) ? c.conflict : c.character;
      drawCharacter(ctx, CANVAS_W / 2, 80, charColor, dominantPose(flags));

      // Conflict flash
      if (hasConflict(flags) && conflictFlash > 0) {
        ctx.save();
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.conflict;
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(tickCount * 2);
        ctx.fillText("CONFLICT", CANVAS_W / 2, 30);
        ctx.restore();

        // Show which flags conflict
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.conflict;
        const active = FLAG_NAMES.filter((f) => flags[f]);
        ctx.fillText(active.join(" + "), CANVAS_W / 2, 44);
      }

      // Draw flag badges in 2x2 grid
      const badgeStartX = (CANVAS_W - 156) / 2;
      const badgeStartY = 140;

      for (let i = 0; i < FLAG_NAMES.length; i++) {
        const name = FLAG_NAMES[i];
        if (!name) continue;
        const col = i % 2;
        const row = Math.floor(i / 2);
        const bx = badgeStartX + col * 82;
        const by = badgeStartY + row * 26;
        const isActive = flags[name];
        const isConflicting = hasConflict(flags) && isActive;
        const onColor = isConflicting ? c.conflict : c.flagOn;
        drawFlagBadge(ctx, bx, by, name, isActive, onColor, c.flagOff, c.text);
      }

      // Status text at bottom
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.inactive;
      ctx.fillText(
        "Tick " + String(tickCount) + " - Flags toggled independently",
        CANVAS_W / 2,
        CANVAS_H - 12,
      );
    }, TICK_INTERVAL);

    // Draw initial frame
    {
      const c = colorsRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const tempCtx = canvas.getContext("2d");
        if (tempCtx) {
          const ctx: CanvasRenderingContext2D = tempCtx;
          ctx.fillStyle = c.bg;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          drawCharacter(ctx, CANVAS_W / 2, 80, c.character, "idle");

          const badgeStartX = (CANVAS_W - 156) / 2;
          const badgeStartY = 140;
          for (let i = 0; i < FLAG_NAMES.length; i++) {
            const name = FLAG_NAMES[i];
            if (!name) continue;
            const col = i % 2;
            const row = Math.floor(i / 2);
            drawFlagBadge(
              ctx,
              badgeStartX + col * 82,
              badgeStartY + row * 26,
              name,
              false,
              c.flagOn,
              c.flagOff,
              c.text,
            );
          }

          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = c.inactive;
          ctx.fillText(
            "Tick 0 - Flags toggled independently",
            CANVAS_W / 2,
            CANVAS_H - 12,
          );
        }
      }
    }

    return () => clearInterval(intervalId);
  }, []);

  return (
    <CanvasSimulation
      label="Boolean flags (no validation)"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Finite State Machine version                                        */
/* ------------------------------------------------------------------ */

type FSMState = "Idle" | "Run" | "Jump" | "Attack" | "Dead";

const FSM_TRANSITIONS: Record<FSMState, FSMState[]> = {
  Idle: ["Run", "Attack", "Dead"],
  Run: ["Idle", "Jump", "Attack", "Dead"],
  Jump: ["Idle", "Dead"],
  Attack: ["Idle", "Dead"],
  Dead: [],
};

const FSM_STATES: FSMState[] = ["Idle", "Run", "Jump", "Attack", "Dead"];

/** Positions for the state diagram circles (relative to diagram area). */
const DIAGRAM_POSITIONS: Record<FSMState, { x: number; y: number }> = {
  Idle: { x: 50, y: 25 },
  Run: { x: 130, y: 10 },
  Jump: { x: 210, y: 25 },
  Attack: { x: 130, y: 55 },
  Dead: { x: 270, y: 40 },
};

const DIAGRAM_RADIUS = 16;

function drawStateDiagram(
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
  current: FSMState,
  colors: Colors,
  rejectedText: string | null,
) {
  ctx.save();
  ctx.translate(offsetX, offsetY);

  // Draw edges (simplified, just key transitions)
  const edges: [FSMState, FSMState][] = [
    ["Idle", "Run"],
    ["Run", "Jump"],
    ["Jump", "Idle"],
    ["Idle", "Attack"],
    ["Run", "Attack"],
    ["Attack", "Idle"],
  ];

  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  for (const [from, to] of edges) {
    const fp = DIAGRAM_POSITIONS[from];
    const tp = DIAGRAM_POSITIONS[to];
    ctx.strokeStyle = colors.diagram;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(fp.x, fp.y);
    ctx.lineTo(tp.x, tp.y);
    ctx.stroke();
  }

  // Draw "any -> Dead" dashed
  ctx.strokeStyle = colors.rejected;
  ctx.globalAlpha = 0.25;
  for (const st of FSM_STATES) {
    if (st === "Dead") continue;
    const fp = DIAGRAM_POSITIONS[st];
    const tp = DIAGRAM_POSITIONS.Dead;
    ctx.beginPath();
    ctx.moveTo(fp.x, fp.y);
    ctx.lineTo(tp.x, tp.y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // Draw nodes
  for (const st of FSM_STATES) {
    const pos = DIAGRAM_POSITIONS[st];
    const isActive = st === current;

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, DIAGRAM_RADIUS, 0, Math.PI * 2);

    if (isActive) {
      ctx.fillStyle = colors.activeState;
      ctx.globalAlpha = 0.25;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors.activeState;
      ctx.lineWidth = 2.5;
    } else {
      ctx.strokeStyle = colors.diagram;
      ctx.lineWidth = 1.5;
    }
    ctx.stroke();

    ctx.font = isActive ? "bold 9px monospace" : "9px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = isActive ? colors.activeState : colors.text;
    ctx.fillText(st, pos.x, pos.y);
  }

  // Rejected transition text
  if (rejectedText) {
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = colors.rejected;
    ctx.fillText(rejectedText, 160, 78);
  }

  ctx.restore();
}

function fsmPoseForState(state: FSMState): string {
  switch (state) {
    case "Idle":
      return "idle";
    case "Run":
      return "running";
    case "Jump":
      return "jumping";
    case "Attack":
      return "attacking";
    case "Dead":
      return "dead";
  }
}

export function StateFiniteMachine() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors: Colors = {
    character: isDark ? "#F87171" : "#DC2626",
    activeState: isDark ? "#22C55E" : "#15803D",
    conflict: isDark ? "#EF4444" : "#DC2626",
    inactive: isDark ? "#B8A8A8" : "#4B5563",
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#F5F1F1" : "#111827",
    flagOn: isDark ? "#22C55E" : "#15803D",
    flagOff: isDark ? "#3a3a3a" : "#D1D5DB",
    diagram: isDark ? "#B8A8A8" : "#4B5563",
    rejected: isDark ? "#EF4444" : "#DC2626",
  };

  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  });

  useEffect(() => {
    const rand = mulberry32(33);
    let currentState: FSMState = "Idle";
    let rejectedMsg: string | null = null;
    let rejectedTimer = 0;
    let tickCount = 0;

    function drawFrame(c: Colors) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const tempCtx = canvas.getContext("2d");
      if (!tempCtx) return;
      const ctx: CanvasRenderingContext2D = tempCtx;

      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Draw character
      drawCharacter(
        ctx,
        CANVAS_W / 2,
        60,
        c.character,
        fsmPoseForState(currentState),
      );

      // Current state label
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.activeState;
      ctx.fillText("State: " + currentState, CANVAS_W / 2, 110);

      // State diagram in bottom portion
      const displayReject = rejectedTimer > 0 ? rejectedMsg : null;
      drawStateDiagram(ctx, 10, 125, currentState, c, displayReject);

      // Status text
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.inactive;
      ctx.fillText(
        "Tick " + String(tickCount) + " - Transitions validated by FSM",
        CANVAS_W / 2,
        CANVAS_H - 8,
      );
    }

    const intervalId = setInterval(() => {
      tickCount++;
      const c = colorsRef.current;

      if (rejectedTimer > 0) {
        rejectedTimer--;
      }

      // If dead, reset after a few ticks
      if (currentState === "Dead") {
        if (tickCount % 6 === 0) {
          currentState = "Idle";
        }
        drawFrame(c);
        return;
      }

      // Pick a random target state (same PRNG sequence as boolean version)
      const targetIdx = Math.floor(rand() * FSM_STATES.length);
      const target = FSM_STATES[targetIdx];
      if (!target || target === currentState) {
        drawFrame(c);
        return;
      }

      // Check if transition is valid
      const allowed = FSM_TRANSITIONS[currentState];
      if (allowed.includes(target)) {
        currentState = target;
      } else {
        rejectedMsg = currentState + " -> " + target + " rejected";
        rejectedTimer = 2;
      }

      drawFrame(c);
    }, TICK_INTERVAL);

    // Initial frame
    drawFrame(colorsRef.current);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <CanvasSimulation
      label="Finite state machine (validated transitions)"
      canvasRef={canvasRef}
    />
  );
}
