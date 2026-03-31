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
  left: string;
  right: string;
  money: string;
  gap: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    left: isDark ? "#60a5fa" : "#2563eb",
    right: isDark ? "#f87171" : "#dc2626",
    money: isDark ? "#fbbf24" : "#d97706",
    gap: isDark ? "#a855f7" : "#7c3aed",
  };
}

/* ------------------------------------------------------------------ */
/*  Political Debate                                                   */
/* ------------------------------------------------------------------ */

export function PoliticalDebate() {
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
      ctx.fillText("Political solutions", W / 2, 14);

      // Left group
      ctx.fillStyle = c.left;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(15, 30, 120, 55);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.left;
      ctx.lineWidth = 1;
      ctx.strokeRect(15, 30, 120, 55);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.left;
      ctx.textAlign = "center";
      ctx.fillText("Left", 75, 45);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Tax the rich", 75, 58);
      ctx.fillText("Redistribute", 75, 70);

      // Right group
      ctx.fillStyle = c.right;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(185, 30, 120, 55);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.right;
      ctx.strokeRect(185, 30, 120, 55);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.right;
      ctx.textAlign = "center";
      ctx.fillText("Right", 245, 45);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Cut taxes", 245, 58);
      ctx.fillText("Grow economy", 245, 70);

      // Arrows going back and forth
      const arrowPhase = Math.sin(elapsed * 2);
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1.5;
      const arrowY = 55;
      ctx.beginPath();
      ctx.moveTo(140, arrowY);
      ctx.lineTo(140 + arrowPhase * 15, arrowY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(180, arrowY);
      ctx.lineTo(180 + arrowPhase * -15, arrowY);
      ctx.stroke();

      // Wealth gap bar that oscillates but stays wide
      const gapY = 100;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Wealth gap:", W / 2, gapY - 3);

      const gapW = 200 + Math.sin(elapsed * 0.5) * 10;
      ctx.fillStyle = c.gap;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(W / 2 - gapW / 2, gapY + 5, gapW, 20);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.gap;
      ctx.strokeRect(W / 2 - gapW / 2, gapY + 5, gapW, 20);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.gap;
      ctx.fillText("WIDE (always)", W / 2, gapY + 19);

      // Cycle repeats
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Debate cycles endlessly", W / 2, 150);
      ctx.fillText("Gap keeps growing despite", W / 2, 166);
      ctx.fillText("decades of both approaches", W / 2, 180);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.gap;
      ctx.fillText("Neither side questions the money", W / 2, 200);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Treating symptoms, ignoring cause", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Political solutions" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Monetary Root Cause                                                */
/* ------------------------------------------------------------------ */

export function MonetaryRootCause() {
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
      ctx.fillText("Monetary root cause", W / 2, 14);

      // Money printer in center, highlighted
      const printerX = W / 2;
      const printerY = 60;
      const pulse = 0.6 + Math.sin(elapsed * 2) * 0.3;

      ctx.fillStyle = c.money;
      ctx.globalAlpha = pulse * 0.3;
      ctx.fillRect(printerX - 50, printerY - 15, 100, 30);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.money;
      ctx.lineWidth = 2;
      ctx.strokeRect(printerX - 50, printerY - 15, 100, 30);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.money;
      ctx.fillText("MONEY PRINTER", printerX, printerY + 4);
      ctx.font = "bold 8px monospace";
      ctx.fillText("ROOT CAUSE", printerX, printerY + 25);

      // Arrow down to wealth gap
      ctx.strokeStyle = c.money;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(printerX, printerY + 18);
      ctx.lineTo(printerX, 100);
      ctx.stroke();
      ctx.fillStyle = c.money;
      ctx.beginPath();
      ctx.moveTo(printerX - 5, 95);
      ctx.lineTo(printerX, 100);
      ctx.lineTo(printerX + 5, 95);
      ctx.fill();

      // Wealth gap bar
      const gapY = 105;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Wealth gap:", W / 2, gapY - 3);

      const gapW = 200;
      ctx.fillStyle = c.gap;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(W / 2 - gapW / 2, gapY + 5, gapW, 20);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.gap;
      ctx.strokeRect(W / 2 - gapW / 2, gapY + 5, gapW, 20);

      // Cantillon arrows
      ctx.font = "8px monospace";
      ctx.fillStyle = c.money;
      ctx.textAlign = "left";
      ctx.fillText("New $ -> Wall St first", 30, 155);
      ctx.fillText("-> Asset prices inflate", 30, 168);
      ctx.fillText("-> Asset owners get richer", 30, 181);
      ctx.fillText("-> Wage earners fall behind", 30, 194);

      // Fix the money
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.money;
      ctx.textAlign = "center";
      ctx.fillText("Fix the money, fix the gap", W / 2, 215);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.money;
      ctx.fillText("The money is the root issue", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Monetary root cause" canvasRef={canvasRef} />;
}
