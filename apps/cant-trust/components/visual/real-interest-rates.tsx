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
  positive: string;
  negative: string;
  bar: string;
  barBg: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    positive: isDark ? "#4ade80" : "#16a34a",
    negative: isDark ? "#f87171" : "#dc2626",
    bar: isDark ? "#fbbf24" : "#d97706",
    barBg: isDark ? "#334155" : "#e2e8f0",
  };
}

/* ------------------------------------------------------------------ */
/*  Positive Real Rate                                                 */
/* ------------------------------------------------------------------ */

export function PositiveRealRate() {
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
      ctx.fillText("Positive real interest rate", W / 2, 14);

      // Rate calculation
      const calcY = 35;
      ctx.font = "10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Savings rate: 5%", W / 2, calcY);
      ctx.fillText("Inflation: 2%", W / 2, calcY + 16);
      ctx.strokeStyle = c.dimText;
      ctx.beginPath();
      ctx.moveTo(100, calcY + 22);
      ctx.lineTo(220, calcY + 22);
      ctx.stroke();
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.positive;
      ctx.fillText("Real return: +3%", W / 2, calcY + 38);

      // Savings bar growing
      const barX = 40;
      const barY = 100;
      const barW = 180;
      const barH = 30;
      const year = Math.floor(elapsed * 0.8) % 6;
      const growth = Math.pow(1.03, year);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText(`Year ${year}:`, barX, barY - 5);

      ctx.fillStyle = c.barBg;
      ctx.fillRect(barX, barY, barW + 40, barH);

      ctx.fillStyle = c.positive;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(barX, barY, barW * growth, barH);
      ctx.globalAlpha = 1;

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText(
        `$${(10000 * growth).toFixed(0)} purchasing power`,
        W / 2,
        barY + 20,
      );

      // Benefits
      const benY = 155;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.positive;
      ctx.textAlign = "center";
      ctx.fillText("Saving is rewarded", W / 2, benY);
      ctx.fillText("Capital accumulates", W / 2, benY + 16);
      ctx.fillText("Retirement planning works", W / 2, benY + 32);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.positive;
      ctx.fillText("Savings grow in real terms", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Positive real interest rate"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Negative Real Rate                                                 */
/* ------------------------------------------------------------------ */

export function NegativeRealRate() {
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
      ctx.fillText("Negative real interest rate", W / 2, 14);

      // Rate calculation
      const calcY = 35;
      ctx.font = "10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Savings rate: 1%", W / 2, calcY);
      ctx.fillText("Inflation: 6%", W / 2, calcY + 16);
      ctx.strokeStyle = c.dimText;
      ctx.beginPath();
      ctx.moveTo(100, calcY + 22);
      ctx.lineTo(220, calcY + 22);
      ctx.stroke();
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.negative;
      ctx.fillText("Real return: -5%", W / 2, calcY + 38);

      // Savings bar shrinking
      const barX = 40;
      const barY = 100;
      const barW = 180;
      const barH = 30;
      const year = Math.floor(elapsed * 0.8) % 6;
      const shrink = Math.pow(0.95, year);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText(`Year ${year}:`, barX, barY - 5);

      ctx.fillStyle = c.barBg;
      ctx.fillRect(barX, barY, barW + 40, barH);

      ctx.fillStyle = c.negative;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(barX, barY, barW * shrink, barH);
      ctx.globalAlpha = 1;

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText(
        `$${(10000 * shrink).toFixed(0)} purchasing power`,
        W / 2,
        barY + 20,
      );

      // Problems
      const probY = 155;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.negative;
      ctx.textAlign = "center";
      ctx.fillText("Saving is penalized", W / 2, probY);
      ctx.fillText("You lose wealth by being prudent", W / 2, probY + 16);
      ctx.fillText("The norm since 2008", W / 2, probY + 32);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.negative;
      ctx.fillText("Savings shrink every year", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Negative real interest rate"
      canvasRef={canvasRef}
    />
  );
}
