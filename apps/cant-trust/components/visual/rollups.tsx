"use client";

import { useRef, useEffect } from "react";
import {
  CanvasSimulation,
  useIsDarkMode,
} from "@cant/shared/components/canvas-simulation";

const W = 320;
const H = 240;

interface Colors {
  bg: string;
  text: string;
  dimText: string;
  accent: string;
  batch: string;
  batchStroke: string;
  warning: string;
  success: string;
  delay: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    batch: isDark ? "#334155" : "#e2e8f0",
    batchStroke: isDark ? "#64748b" : "#94a3b8",
    warning: isDark ? "#fbbf24" : "#d97706",
    success: isDark ? "#4ade80" : "#16a34a",
    delay: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  Optimistic Rollup                                                  */
/* ------------------------------------------------------------------ */

export function OptimisticRollup() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(getColors(isDark));

  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    let rafId = 0;
    let lastTime = 0;
    let elapsed = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const c = colorsRef.current;
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);

      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Optimistic rollup", W / 2, 14);

      // Batch box
      const bx = 60;
      const by = 30;
      const bw = 200;
      const bh = 50;
      ctx.fillStyle = c.batch;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = c.batchStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      // Small tx squares inside batch
      for (let i = 0; i < 12; i++) {
        const tx = bx + 10 + (i % 6) * 30;
        const ty = by + 10 + Math.floor(i / 6) * 18;
        ctx.fillStyle = c.accent;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(tx, ty, 20, 12);
        ctx.globalAlpha = 1;
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Batch of transactions", bx + bw / 2, by + bh + 12);

      // "Assumed valid" label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.warning;
      ctx.fillText("ASSUMED VALID", W / 2, 110);

      // 7-day countdown
      const cycle = elapsed % 14;
      const day = Math.min(7, Math.floor(cycle));
      const challengeActive = cycle > 3 && cycle < 5;

      // Progress bar for challenge period
      const barX = 50;
      const barY = 120;
      const barW = 220;
      const barH = 16;
      ctx.fillStyle = c.batch;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = c.batchStroke;
      ctx.strokeRect(barX, barY, barW, barH);

      const progress = Math.min(1, day / 7);
      ctx.fillStyle = c.delay;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(barX, barY, barW * progress, barH);
      ctx.globalAlpha = 1;

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText(`Day ${day}/7 challenge period`, W / 2, barY + 12);

      // Challenge flash
      if (challengeActive) {
        const blink = Math.sin(elapsed * 8) > 0;
        if (blink) {
          ctx.font = "bold 9px monospace";
          ctx.fillStyle = c.delay;
          ctx.fillText("CHALLENGED!", W / 2, barY + 32);
        }
      }

      // Withdrawal delay
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.delay;
      ctx.textAlign = "center";
      ctx.fillText("Withdrawal: ~7 day delay", W / 2, 170);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Must wait for challenge period to end", W / 2, 190);
      ctx.fillText("Needs at least 1 honest verifier", W / 2, 206);
      ctx.fillText("Finality delayed, not instant", W / 2, 222);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Optimistic rollup" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  ZK Rollup                                                          */
/* ------------------------------------------------------------------ */

export function ZkRollup() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(getColors(isDark));

  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    let rafId = 0;
    let lastTime = 0;
    let elapsed = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const c = colorsRef.current;
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);

      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("ZK rollup", W / 2, 14);

      // Batch box
      const bx = 40;
      const by = 30;
      const bw = 140;
      const bh = 50;
      ctx.fillStyle = c.batch;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = c.batchStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      for (let i = 0; i < 8; i++) {
        const tx = bx + 10 + (i % 4) * 32;
        const ty = by + 10 + Math.floor(i / 4) * 18;
        ctx.fillStyle = c.accent;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(tx, ty, 22, 12);
        ctx.globalAlpha = 1;
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Batch", bx + bw / 2, by + bh + 12);

      // Plus sign
      ctx.font = "bold 16px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("+", bx + bw + 15, by + bh / 2 + 5);

      // ZK proof box
      const px = 215;
      const py = 30;
      const pw = 80;
      const ph = 50;
      ctx.fillStyle = c.success;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(px, py, pw, ph);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.success;
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, pw, ph);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("ZK Proof", px + pw / 2, py + 22);

      // Animated verification checkmark
      const verified = elapsed % 4 > 1;
      if (verified) {
        ctx.font = "bold 12px monospace";
        ctx.fillText("Valid", px + pw / 2, py + 42);
      } else {
        const dots = ".".repeat((Math.floor(elapsed * 4) % 3) + 1);
        ctx.font = "9px monospace";
        ctx.fillText(`proving${dots}`, px + pw / 2, py + 42);
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Validity proof", px + pw / 2, py + ph + 12);

      // "PROVEN VALID" label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.success;
      ctx.fillText("PROVEN VALID", W / 2, 115);

      // Instant verification
      ctx.fillStyle = c.success;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(50, 122, 220, 18);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.success;
      ctx.strokeRect(50, 122, 220, 18);
      ctx.font = "9px monospace";
      ctx.fillStyle = c.success;
      ctx.fillText("Instantly verifiable, no waiting", W / 2, 134);

      // Benefits
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("Withdrawal: minutes", W / 2, 165);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("No challenge period needed", W / 2, 185);
      ctx.fillText("Mathematical proof of correctness", W / 2, 201);
      ctx.fillText("Strongest security guarantee", W / 2, 217);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="ZK rollup" canvasRef={canvasRef} />;
}
