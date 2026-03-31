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
  sliceA: string;
  sliceB: string;
  sliceC: string;
  growth: string;
  accent: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    sliceA: isDark ? "#f87171" : "#dc2626",
    sliceB: isDark ? "#60a5fa" : "#2563eb",
    sliceC: isDark ? "#4ade80" : "#16a34a",
    growth: isDark ? "#22c55e" : "#16a34a",
    accent: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Zero Sum                                                           */
/* ------------------------------------------------------------------ */

export function WealthZeroSum() {
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
      ctx.fillText("Fixed total model", W / 2, 14);

      const cx = W / 2;
      const cy = 115;
      const r = 60;

      // Animated slices that redistribute
      const shift = Math.sin(elapsed * 0.8) * 0.3;
      const slices = [
        { size: 0.33 + shift, color: c.sliceA, label: "A" },
        { size: 0.33 - shift * 0.5, color: c.sliceB, label: "B" },
        { size: 0.34 - shift * 0.5, color: c.sliceC, label: "C" },
      ];

      let startAngle = -Math.PI / 2;
      for (const slice of slices) {
        const endAngle = startAngle + slice.size * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = slice.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.bg;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        const midAngle = (startAngle + endAngle) / 2;
        const lx = cx + Math.cos(midAngle) * (r * 0.6);
        const ly = cy + Math.sin(midAngle) * (r * 0.6);
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(slice.label, lx, ly + 4);

        startAngle = endAngle;
      }

      // Total counter
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Total: 100", cx, cy + r + 28);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Total stays constant", cx, cy + r + 42);
      ctx.fillText("Slices redistribute", cx, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Fixed total model" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Wealth Creation                                                    */
/* ------------------------------------------------------------------ */

export function WealthCreation() {
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
      ctx.fillText("Growing total model", W / 2, 14);

      const cx = W / 2;
      const cy = 110;

      // Growing pie (loops every 20 seconds)
      const cycleElapsed = elapsed % 20;
      const growthFactor = 1 + Math.min(cycleElapsed * 0.08, 1.2);
      const r = 35 * growthFactor;

      const slices = [
        { size: 0.33, color: c.sliceA, label: "A" },
        { size: 0.33, color: c.sliceB, label: "B" },
        { size: 0.34, color: c.sliceC, label: "C" },
      ];

      let startAngle = -Math.PI / 2;
      for (const slice of slices) {
        const endAngle = startAngle + slice.size * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, Math.min(r, 75), startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = slice.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.bg;
        ctx.lineWidth = 2;
        ctx.stroke();

        const midAngle = (startAngle + endAngle) / 2;
        const lx = cx + Math.cos(midAngle) * (Math.min(r, 75) * 0.6);
        const ly = cy + Math.sin(midAngle) * (Math.min(r, 75) * 0.6);
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(slice.label, lx, ly + 4);

        startAngle = endAngle;
      }

      // Production icons: seed -> plant -> food
      const prodY = 30;
      const prodX = 40;
      const prodPhase = (elapsed * 0.6) % 3;

      // Seed
      ctx.font = "10px monospace";
      ctx.fillStyle = prodPhase >= 0 ? c.accent : c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("seed", prodX, prodY);

      // Arrow
      if (prodPhase >= 1) {
        ctx.strokeStyle = c.growth;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(prodX + 18, prodY - 4);
        ctx.lineTo(prodX + 38, prodY - 4);
        ctx.stroke();
      }

      // Plant
      if (prodPhase >= 1) {
        ctx.fillStyle = c.growth;
        ctx.fillText("plant", prodX + 55, prodY);
      }

      // Arrow
      if (prodPhase >= 2) {
        ctx.strokeStyle = c.growth;
        ctx.beginPath();
        ctx.moveTo(prodX + 75, prodY - 4);
        ctx.lineTo(prodX + 95, prodY - 4);
        ctx.stroke();
      }

      // Food
      if (prodPhase >= 2) {
        ctx.fillStyle = c.growth;
        ctx.fillText("food!", prodX + 115, prodY);
      }

      // Total counter growing
      const total = Math.floor(100 * growthFactor);
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText(`Total: ${total}`, cx, cy + Math.min(r, 75) + 24);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Total increases", cx, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Growing total model" canvasRef={canvasRef} />;
}
