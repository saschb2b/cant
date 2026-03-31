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
  bar: string;
  barStroke: string;
  money: string;
  bond: string;
  inflate: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    bar: isDark ? "#334155" : "#e2e8f0",
    barStroke: isDark ? "#64748b" : "#94a3b8",
    money: isDark ? "#4ade80" : "#16a34a",
    bond: isDark ? "#93c5fd" : "#3b82f6",
    inflate: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  Normal Money Supply                                                */
/* ------------------------------------------------------------------ */

export function NormalMoneySupply() {
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

      // Balance sheet
      const sheetX = 60;
      const sheetY = 50;
      const sheetW = 200;
      const sheetH = 120;
      ctx.fillStyle = c.bar;
      ctx.fillRect(sheetX, sheetY, sheetW, sheetH);
      ctx.strokeStyle = c.barStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(sheetX, sheetY, sheetW, sheetH);

      // Center divider
      ctx.beginPath();
      ctx.moveTo(sheetX + sheetW / 2, sheetY);
      ctx.lineTo(sheetX + sheetW / 2, sheetY + sheetH);
      ctx.strokeStyle = c.barStroke;
      ctx.stroke();

      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Assets", sheetX + sheetW / 4, sheetY + 15);
      ctx.fillText("Liabilities", sheetX + (3 * sheetW) / 4, sheetY + 15);

      // Stable bars
      const barH = 60;
      const pulse = 0.9 + 0.1 * Math.sin(elapsed * 1.5);

      ctx.globalAlpha = pulse;
      ctx.fillStyle = c.bond;
      ctx.fillRect(sheetX + 15, sheetY + 30, 70, barH);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Bonds", sheetX + 50, sheetY + 55);

      ctx.fillStyle = c.money;
      ctx.fillRect(sheetX + sheetW / 2 + 15, sheetY + 30, 70, barH);
      ctx.fillStyle = c.text;
      ctx.fillText("Currency", sheetX + sheetW / 2 + 50, sheetY + 55);
      ctx.globalAlpha = 1;

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.money;
      ctx.textAlign = "center";
      ctx.fillText("Stable money supply", W / 2, sheetY + sheetH + 25);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Central bank balance sheet", W / 2, sheetY + sheetH + 42);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Normal monetary policy", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Normal monetary policy" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  QE Expansion                                                       */
/* ------------------------------------------------------------------ */

export function QEExpansion() {
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

      const cycle = elapsed % 8;
      const expansion = Math.min(1, cycle / 5);

      // Balance sheet (growing)
      const sheetX = 60 - expansion * 30;
      const sheetY = 50 - expansion * 15;
      const sheetW = 200 + expansion * 60;
      const sheetH = 120 + expansion * 30;
      ctx.fillStyle = c.bar;
      ctx.fillRect(sheetX, sheetY, sheetW, sheetH);
      ctx.strokeStyle = c.inflate;
      ctx.lineWidth = 2;
      ctx.strokeRect(sheetX, sheetY, sheetW, sheetH);

      // Center divider
      ctx.beginPath();
      ctx.moveTo(sheetX + sheetW / 2, sheetY);
      ctx.lineTo(sheetX + sheetW / 2, sheetY + sheetH);
      ctx.strokeStyle = c.barStroke;
      ctx.stroke();

      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Assets", sheetX + sheetW / 4, sheetY + 15);
      ctx.fillText("Liabilities", sheetX + (3 * sheetW) / 4, sheetY + 15);

      // Growing bars
      const barH = 60 + expansion * 40;
      ctx.fillStyle = c.bond;
      ctx.fillRect(sheetX + 10, sheetY + 25, sheetW / 2 - 20, barH);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Bonds", sheetX + sheetW / 4, sheetY + 45);
      ctx.fillText("(buying)", sheetX + sheetW / 4, sheetY + 58);

      ctx.fillStyle = c.money;
      ctx.fillRect(
        sheetX + sheetW / 2 + 10,
        sheetY + 25,
        sheetW / 2 - 20,
        barH,
      );
      ctx.fillStyle = c.text;
      ctx.fillText("New $$$", sheetX + (3 * sheetW) / 4, sheetY + 45);
      ctx.fillText("(created)", sheetX + (3 * sheetW) / 4, sheetY + 58);

      // Inflation warning
      if (expansion > 0.5) {
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.inflate;
        ctx.textAlign = "center";
        const bottomY = sheetY + sheetH + 18;
        ctx.fillText("Balance sheet expanding", W / 2, bottomY);
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText("New money chases same goods", W / 2, bottomY + 16);
      }

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Quantitative easing", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Quantitative easing" canvasRef={canvasRef} />;
}
