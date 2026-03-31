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
  top: string;
  bottom: string;
  m2: string;
  axis: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    top: isDark ? "#f87171" : "#dc2626",
    bottom: isDark ? "#60a5fa" : "#3b82f6",
    m2: isDark ? "#4ade80" : "#16a34a",
    axis: isDark ? "#555" : "#ccc",
  };
}

/* ------------------------------------------------------------------ */
/*  Without printing: all groups grow somewhat together                 */
/* ------------------------------------------------------------------ */

export function WealthWithoutPrinting() {
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

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Wealth share: stable money", W / 2, 18);

      const chartL = 40;
      const chartR = W - 20;
      const chartT = 35;
      const chartB = H - 40;
      const chartW = chartR - chartL;
      const chartH = chartB - chartT;

      // Axes
      ctx.strokeStyle = c.axis;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartL, chartT);
      ctx.lineTo(chartL, chartB);
      ctx.lineTo(chartR, chartB);
      ctx.stroke();

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("1950", chartL, chartB + 12);
      ctx.fillText("1971", chartR, chartB + 12);

      const progress = Math.min(1, elapsed / 3);
      const points = 50;
      const drawCount = Math.floor(points * progress);

      // Top 0.1% line
      ctx.strokeStyle = c.top;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        const x = chartL + t * chartW;
        const y = chartB - (0.3 + t * 0.5) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Bottom 90% line (tracks fairly closely)
      ctx.strokeStyle = c.bottom;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        const x = chartL + t * chartW;
        const y = chartB - (0.2 + t * 0.45) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Legend
      if (elapsed > 1) {
        const a = Math.min(1, (elapsed - 1) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = c.top;
        ctx.fillRect(chartL + 10, chartT + 5, 12, 3);
        ctx.fillText("Top 0.1%", chartL + 26, chartT + 10);
        ctx.fillStyle = c.bottom;
        ctx.fillRect(chartL + 10, chartT + 18, 12, 3);
        ctx.fillText("Bottom 90%", chartL + 26, chartT + 23);
        ctx.globalAlpha = 1;
      }

      if (elapsed > 2.5) {
        const a = Math.min(1, (elapsed - 2.5) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText("All groups rising together", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Shared prosperity" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  With printing: M2 and top 0.1% track, bottom 90% flat             */
/* ------------------------------------------------------------------ */

export function WealthWithPrinting() {
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

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Wealth share: money printing era", W / 2, 18);

      const chartL = 40;
      const chartR = W - 20;
      const chartT = 35;
      const chartB = H - 40;
      const chartW = chartR - chartL;
      const chartH = chartB - chartT;

      ctx.strokeStyle = c.axis;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartL, chartT);
      ctx.lineTo(chartL, chartB);
      ctx.lineTo(chartR, chartB);
      ctx.stroke();

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("1971", chartL, chartB + 12);
      ctx.fillText("2024", chartR, chartB + 12);

      const progress = Math.min(1, elapsed / 4);
      const points = 60;
      const drawCount = Math.floor(points * progress);

      // M2 money supply line (shoots up)
      ctx.strokeStyle = c.m2;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        const x = chartL + t * chartW;
        const y = chartB - (0.1 + Math.pow(t, 1.8) * 0.8) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Top 0.1% (tracks M2 closely)
      ctx.strokeStyle = c.top;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        const x = chartL + t * chartW;
        const y = chartB - (0.12 + Math.pow(t, 1.7) * 0.75) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Bottom 90% (flat)
      ctx.strokeStyle = c.bottom;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        const x = chartL + t * chartW;
        const y = chartB - (0.15 + t * 0.08) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Legend
      if (elapsed > 1) {
        const a = Math.min(1, (elapsed - 1) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = c.m2;
        ctx.fillRect(chartL + 10, chartT + 5, 12, 3);
        ctx.fillText("M2 Supply", chartL + 26, chartT + 10);
        ctx.fillStyle = c.top;
        ctx.fillRect(chartL + 10, chartT + 18, 12, 3);
        ctx.fillText("Top 0.1%", chartL + 26, chartT + 23);
        ctx.fillStyle = c.bottom;
        ctx.fillRect(chartL + 10, chartT + 31, 12, 3);
        ctx.fillText("Bottom 90%", chartL + 26, chartT + 36);
        ctx.globalAlpha = 1;
      }

      if (elapsed > 3) {
        const a = Math.min(1, (elapsed - 3) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.top;
        ctx.textAlign = "center";
        ctx.fillText("M2 and top 0.1% wealth correlate", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Diverging wealth" canvasRef={canvasRef} />;
}
