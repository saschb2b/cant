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
  lever: string;
  leverKnob: string;
  borrow: string;
  asset: string;
  bar: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    lever: isDark ? "#64748b" : "#94a3b8",
    leverKnob: isDark ? "#f87171" : "#dc2626",
    borrow: isDark ? "#4ade80" : "#16a34a",
    asset: isDark ? "#fbbf24" : "#d97706",
    bar: isDark ? "#334155" : "#e2e8f0",
  };
}

/* ------------------------------------------------------------------ */
/*  Low Interest Rate                                                  */
/* ------------------------------------------------------------------ */

export function LowInterestRate() {
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

      // Rate lever (low position)
      const leverX = 40;
      const leverTop = 40;
      const leverH = 120;
      ctx.fillStyle = c.bar;
      ctx.fillRect(leverX - 3, leverTop, 6, leverH);

      // Knob at bottom (low rate)
      const knobY = leverTop + leverH - 15;
      ctx.beginPath();
      ctx.arc(leverX, knobY, 8, 0, Math.PI * 2);
      ctx.fillStyle = c.leverKnob;
      ctx.fill();

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Rate", leverX, leverTop - 5);
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.leverKnob;
      ctx.fillText("0.5%", leverX, knobY + 25);

      // Many borrowing arrows
      const arrowCount = 6;
      for (let i = 0; i < arrowCount; i++) {
        const ay = 50 + i * 20;
        const startX = 80;
        const speed = 0.8 + (i % 3) * 0.3;
        const progress = ((elapsed * speed + i * 0.4) % 2) / 2;
        const endX = startX + progress * 140;

        ctx.strokeStyle = c.borrow;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, ay);
        ctx.lineTo(endX, ay);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(endX - 4, ay - 3);
        ctx.lineTo(endX, ay);
        ctx.lineTo(endX - 4, ay + 3);
        ctx.fillStyle = c.borrow;
        ctx.fill();
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.borrow;
      ctx.textAlign = "left";
      ctx.fillText("Lots of borrowing", 80, 185);

      // Asset prices rising
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.asset;
      ctx.textAlign = "center";
      const rise = Math.sin(elapsed * 0.5) * 5;
      ctx.fillText("Asset prices", 200, 195 + rise);
      ctx.font = "bold 16px monospace";
      ctx.fillText("\u2191 \u2191 \u2191", 200, 215 + rise);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Low interest rate environment", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Low interest rate environment"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  High Interest Rate                                                 */
/* ------------------------------------------------------------------ */

export function HighInterestRate() {
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

      // Rate lever (high position)
      const leverX = 40;
      const leverTop = 40;
      const leverH = 120;
      ctx.fillStyle = c.bar;
      ctx.fillRect(leverX - 3, leverTop, 6, leverH);

      // Knob at top (high rate)
      const knobY = leverTop + 15;
      ctx.beginPath();
      ctx.arc(leverX, knobY, 8, 0, Math.PI * 2);
      ctx.fillStyle = c.leverKnob;
      ctx.fill();

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Rate", leverX, leverTop - 5);
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.leverKnob;
      ctx.fillText("5.5%", leverX, knobY + 25);

      // Few borrowing arrows (slow)
      const arrowCount = 2;
      for (let i = 0; i < arrowCount; i++) {
        const ay = 70 + i * 40;
        const startX = 80;
        const progress = ((elapsed * 0.3 + i * 0.5) % 3) / 3;
        const endX = startX + progress * 100;

        ctx.strokeStyle = c.borrow;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, ay);
        ctx.lineTo(endX, ay);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText("Little borrowing", 80, 185);

      // Asset prices stable/falling
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.asset;
      ctx.textAlign = "center";
      ctx.fillText("Asset prices", 200, 195);
      ctx.font = "bold 16px monospace";
      ctx.fillText("\u2193 \u2192 \u2193", 200, 215);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("High interest rate environment", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="High interest rate environment"
      canvasRef={canvasRef}
    />
  );
}
