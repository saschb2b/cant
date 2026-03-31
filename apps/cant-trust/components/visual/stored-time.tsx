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
  number: string;
  bar: string;
  barBg: string;
  danger: string;
  accent: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    number: isDark ? "#60a5fa" : "#2563eb",
    bar: isDark ? "#fbbf24" : "#d97706",
    barBg: isDark ? "#334155" : "#e2e8f0",
    danger: isDark ? "#f87171" : "#dc2626",
    accent: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Money Just Numbers                                                  */
/* ------------------------------------------------------------------ */

export function MoneyJustNumbers() {
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

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Money as numbers", W / 2, 14);

      // Box for balance display
      const bx = W / 2 - 80;
      const by = 50;
      const bw = 160;
      const bh = 80;
      ctx.fillStyle = c.barBg;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, bw, bh);

      // Fluctuating balance
      const noise =
        Math.sin(elapsed * 2.3) * 1200 +
        Math.sin(elapsed * 5.1) * 800 +
        Math.cos(elapsed * 1.7) * 500;
      const balance = Math.floor(10000 + noise);

      ctx.font = "10px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Balance:", W / 2, by + 25);

      ctx.font = "bold 22px monospace";
      ctx.fillStyle = c.number;
      ctx.fillText(`$${balance.toLocaleString()}`, W / 2, by + 55);

      // Random digits floating
      ctx.font = "12px monospace";
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < 15; i++) {
        const dx = 30 + ((i * 47 + Math.floor(elapsed * 30)) % (W - 60));
        const dy = 150 + ((i * 31 + Math.floor(elapsed * 20)) % 60);
        const digit = Math.floor((elapsed * (i + 1) * 3) % 10);
        ctx.fillStyle = c.number;
        ctx.fillText(digit.toString(), dx, dy);
      }
      ctx.globalAlpha = 1;

      // Bottom labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Digital balance", W / 2, H - 22);
      ctx.fillText("Account ledger", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Money as numbers" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Money Stored Energy                                                 */
/* ------------------------------------------------------------------ */

export function MoneyStoredEnergy() {
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

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Money as stored time", W / 2, 14);

      // Clock icon (simple circle with hands)
      const clockX = 70;
      const clockY = 65;
      const clockR = 20;
      ctx.beginPath();
      ctx.arc(clockX, clockY, clockR, 0, Math.PI * 2);
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Hour hand
      const hourAngle = ((elapsed * 0.5) % (Math.PI * 2)) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(
        clockX + Math.cos(hourAngle) * 12,
        clockY + Math.sin(hourAngle) * 12,
      );
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Minute hand
      const minAngle = ((elapsed * 3) % (Math.PI * 2)) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(
        clockX + Math.cos(minAngle) * 16,
        clockY + Math.sin(minAngle) * 16,
      );
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Arrow from clock to battery bar
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(clockX + clockR + 5, clockY);
      ctx.lineTo(clockX + clockR + 30, clockY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(clockX + clockR + 25, clockY - 4);
      ctx.lineTo(clockX + clockR + 30, clockY);
      ctx.lineTo(clockX + clockR + 25, clockY + 4);
      ctx.fillStyle = c.accent;
      ctx.fill();

      // Battery bar (savings)
      const barX = 130;
      const barY = 45;
      const barW = 150;
      const barH = 40;
      ctx.fillStyle = c.barBg;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, barY, barW, barH);

      // Battery tip
      ctx.fillStyle = c.accent;
      ctx.fillRect(barX + barW, barY + 12, 6, 16);

      // Filling phase then debasement phase
      const totalCycle = 12;
      const cycleT = elapsed % totalCycle;
      const fillPhase = Math.min(cycleT / 6, 1); // First 6 seconds: fill
      const debasePhase = cycleT > 7 ? Math.min((cycleT - 7) / 4, 1) : 0; // After 7s: debase

      const totalBlocks = 10;
      const filledBlocks = Math.floor(fillPhase * totalBlocks);
      const remainingBlocks = Math.floor(
        filledBlocks * (1 - debasePhase * 0.4),
      );

      // Draw blocks
      const blockW = (barW - 12) / totalBlocks;
      for (let i = 0; i < filledBlocks; i++) {
        const isEroded = i >= remainingBlocks && debasePhase > 0;
        ctx.fillStyle = isEroded ? c.danger : c.bar;
        ctx.globalAlpha = isEroded ? 0.2 + Math.sin(elapsed * 4) * 0.15 : 0.8;
        ctx.fillRect(barX + 4 + i * blockW, barY + 4, blockW - 2, barH - 8);
        ctx.globalAlpha = 1;
      }

      // Hours counter
      const hours = Math.floor(filledBlocks * 4);
      const lostHours = Math.floor((filledBlocks - remainingBlocks) * 4);
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText(`${hours} life hours saved`, W / 2, barY + barH + 22);

      if (debasePhase > 0) {
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.danger;
        ctx.fillText(
          `${lostHours} hours debased away`,
          W / 2,
          barY + barH + 38,
        );

        ctx.font = "9px monospace";
        ctx.fillText("Purchasing power changes over time", W / 2, H - 10);
      } else {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.accent;
        ctx.fillText("Work converts to savings", W / 2, H - 10);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Money as stored time" canvasRef={canvasRef} />
  );
}
