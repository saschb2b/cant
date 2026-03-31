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
  box: string;
  boxStroke: string;
  cash: string;
  iou: string;
  accent: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    box: isDark ? "#334155" : "#e2e8f0",
    boxStroke: isDark ? "#64748b" : "#94a3b8",
    cash: isDark ? "#4ade80" : "#16a34a",
    iou: isDark ? "#f87171" : "#dc2626",
    accent: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Deposit as Property                                                */
/* ------------------------------------------------------------------ */

export function DepositAsProperty() {
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

      // "YOU" label
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("YOU", 80, 40);

      // Person icon
      ctx.beginPath();
      ctx.arc(80, 55, 10, 0, Math.PI * 2);
      ctx.fillStyle = c.accent;
      ctx.fill();
      ctx.fillRect(74, 67, 12, 18);

      // Arrow pointing to vault
      ctx.strokeStyle = c.cash;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 90);
      ctx.lineTo(80, 115);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(75, 110);
      ctx.lineTo(80, 117);
      ctx.lineTo(85, 110);
      ctx.fillStyle = c.cash;
      ctx.fill();

      // Safe deposit box
      const bx = 40;
      const by = 120;
      const bw = 80;
      const bh = 70;
      ctx.fillStyle = c.box;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = c.boxStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("SAFE DEPOSIT", bx + bw / 2, by + 15);

      // Cash inside (pulsing)
      const pulse = 0.8 + 0.2 * Math.sin(elapsed * 2);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = c.cash;
      ctx.font = "bold 16px monospace";
      ctx.fillText("$$$", bx + bw / 2, by + 45);
      ctx.globalAlpha = 1;

      // "Your money" label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.cash;
      ctx.fillText("Your property", bx + bw / 2, by + bh + 16);

      // Ownership arrow
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText("You own it", 140, 150);
      ctx.fillText("Bank stores it", 140, 165);
      ctx.fillText("Withdraw anytime", 140, 180);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Deposit as property", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Deposit as property" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Deposit as IOU                                                     */
/* ------------------------------------------------------------------ */

export function DepositAsIOU() {
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

      // "YOU" label
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("YOU", 80, 40);

      // Person icon
      ctx.beginPath();
      ctx.arc(80, 55, 10, 0, Math.PI * 2);
      ctx.fillStyle = c.accent;
      ctx.fill();
      ctx.fillRect(74, 67, 12, 18);

      // Cash goes to bank (animated)
      const cycle = elapsed % 4;
      const cashProgress = Math.min(1, cycle / 1.5);

      // Cash moving right
      const cashX = 80 + cashProgress * 120;
      if (cashProgress < 1) {
        ctx.fillStyle = c.cash;
        ctx.font = "bold 12px monospace";
        ctx.globalAlpha = 1 - cashProgress;
        ctx.fillText("$$$", cashX, 78);
        ctx.globalAlpha = 1;
      }

      // IOU comes back (after cash arrives)
      if (cycle > 1.5) {
        const iouProgress = Math.min(1, (cycle - 1.5) / 1.0);
        const iouX = 200 - iouProgress * 120;
        ctx.fillStyle = c.iou;
        ctx.font = "bold 10px monospace";
        ctx.globalAlpha = iouProgress;
        ctx.fillText("IOU", iouX, 95);
        ctx.globalAlpha = 1;
      }

      // Bank box
      const bx = 180;
      const by = 110;
      const bw = 100;
      const bh = 80;
      ctx.fillStyle = c.box;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = c.boxStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("BANK", bx + bw / 2, by + 16);

      // Cash inside bank (bank uses it)
      ctx.fillStyle = c.cash;
      ctx.font = "12px monospace";
      ctx.fillText("$$$ (theirs)", bx + bw / 2, by + 40);

      // "Bank's money" label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.iou;
      ctx.fillText("Bank's asset now", bx + bw / 2, by + bh + 16);

      // IOU slip for you
      if (cycle > 2.5) {
        ctx.fillStyle = c.iou;
        ctx.strokeStyle = c.iou;
        ctx.lineWidth = 1;
        const slipX = 20;
        const slipY = 120;
        ctx.strokeRect(slipX, slipY, 80, 50);
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("IOU SLIP", slipX + 40, slipY + 16);
        ctx.fillStyle = c.dimText;
        ctx.fillText("Promise to pay", slipX + 40, slipY + 30);
        ctx.fillText("(unsecured)", slipX + 40, slipY + 42);
      }

      // Title
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Deposit as IOU", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Deposit as IOU" canvasRef={canvasRef} />;
}
