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
  vault: string;
  vaultStroke: string;
  shield: string;
  shieldFull: string;
  gap: string;
  label: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    vault: isDark ? "#334155" : "#e2e8f0",
    vaultStroke: isDark ? "#64748b" : "#94a3b8",
    shield: isDark ? "#4ade80" : "#16a34a",
    shieldFull: isDark ? "#22c55e" : "#16a34a",
    gap: isDark ? "#f87171" : "#dc2626",
    label: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Full Insurance (perception)                                        */
/* ------------------------------------------------------------------ */

export function FullInsurance() {
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

      // Large vault
      const vx = 80;
      const vy = 50;
      const vw = 160;
      const vh = 100;
      ctx.fillStyle = c.vault;
      ctx.fillRect(vx, vy, vw, vh);
      ctx.strokeStyle = c.vaultStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(vx, vy, vw, vh);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Total Deposits: $10T", vx + vw / 2, vy + 20);

      // Full shield overlay (pulsing)
      const pulse = 0.6 + 0.2 * Math.sin(elapsed * 2);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = c.shieldFull;
      ctx.fillRect(vx + 10, vy + 30, vw - 20, vh - 40);
      ctx.globalAlpha = 1;

      // Shield icon
      ctx.font = "bold 28px monospace";
      ctx.fillStyle = c.shield;
      ctx.fillText("\u2714", vx + vw / 2, vy + 75);

      // Label
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.shield;
      ctx.fillText('"Fully insured"', W / 2, vy + vh + 25);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Public perception", W / 2, vy + vh + 42);
      ctx.fillText('"Your deposits are safe"', W / 2, vy + vh + 56);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Deposit insurance perception", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Deposit insurance perception"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Partial Insurance (reality)                                        */
/* ------------------------------------------------------------------ */

export function PartialInsurance() {
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

      // Deposits bar (tall)
      const barX = 60;
      const barY = 40;
      const barW = 80;
      const barH = 150;
      ctx.fillStyle = c.vault;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = c.vaultStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, barY, barW, barH);

      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Deposits", barX + barW / 2, barY + 15);
      ctx.font = "bold 10px monospace";
      ctx.fillText("$10T", barX + barW / 2, barY + 30);

      // FDIC fund bar (tiny)
      const fundH = barH * 0.013; // 1.3% ratio
      const minFundH = 6;
      const actualFundH = Math.max(minFundH, fundH);
      const fundY = barY + barH - actualFundH;

      // Pulsing shield (tiny)
      const pulse = 0.7 + 0.3 * Math.sin(elapsed * 3);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = c.shield;
      ctx.fillRect(barX + 5, fundY, barW - 10, actualFundH);
      ctx.globalAlpha = 1;

      // Gap visualization
      ctx.fillStyle = c.gap;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(barX + 5, barY + 35, barW - 10, fundY - barY - 35);
      ctx.globalAlpha = 1;

      // FDIC fund label with arrow
      const labelX = 200;
      ctx.strokeStyle = c.shield;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(barX + barW, fundY + actualFundH / 2);
      ctx.lineTo(labelX, fundY + actualFundH / 2);
      ctx.stroke();

      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = c.shield;
      ctx.fillText("FDIC Fund", labelX + 5, fundY - 2);
      ctx.font = "bold 10px monospace";
      ctx.fillText("$128B", labelX + 5, fundY + 12);
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("(1.3%)", labelX + 5, fundY + 25);

      // Gap label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.gap;
      ctx.textAlign = "left";
      ctx.fillText("Uninsured", labelX + 5, barY + 80);
      ctx.fillText("98.7%", labelX + 5, barY + 95);

      // Bottom label
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Actual coverage ratio", W / 2, barY + barH + 20);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Deposit insurance reality", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Deposit insurance reality" canvasRef={canvasRef} />
  );
}
