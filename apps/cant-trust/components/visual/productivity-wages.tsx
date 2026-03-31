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
  productivity: string;
  wages: string;
  marker: string;
  gap: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    productivity: isDark ? "#60a5fa" : "#3b82f6",
    wages: isDark ? "#4ade80" : "#16a34a",
    marker: isDark ? "#fbbf24" : "#d97706",
    gap: isDark ? "rgba(248,113,113,0.2)" : "rgba(220,38,38,0.15)",
  };
}

/* ------------------------------------------------------------------ */
/*  Linked: both lines move together                                   */
/* ------------------------------------------------------------------ */

export function ProductivityWagesLinked() {
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
      ctx.fillText("Pre-1971: linked growth", W / 2, 18);

      // Chart area
      const chartL = 40;
      const chartR = W - 20;
      const chartT = 35;
      const chartB = H - 40;
      const chartW = chartR - chartL;
      const chartH = chartB - chartT;

      // Axes
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartL, chartT);
      ctx.lineTo(chartL, chartB);
      ctx.lineTo(chartR, chartB);
      ctx.stroke();

      // Y-axis label
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.save();
      ctx.translate(12, chartT + chartH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Growth Index", 0, 0);
      ctx.restore();

      // X-axis labels
      ctx.textAlign = "center";
      ctx.fillText("1948", chartL, chartB + 14);
      ctx.fillText("1971", chartR, chartB + 14);

      // Animated progress
      const progress = Math.min(1, elapsed / 3);
      const points = 50;
      const drawCount = Math.floor(points * progress);

      // Draw both lines climbing together
      ctx.lineWidth = 2;

      // Productivity line
      ctx.strokeStyle = c.productivity;
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        const x = chartL + t * chartW;
        const y = chartB - t * chartH * 0.8;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wages line (tracks closely)
      ctx.strokeStyle = c.wages;
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        const x = chartL + t * chartW;
        const y = chartB - t * chartH * 0.75;
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

        ctx.fillStyle = c.productivity;
        ctx.fillRect(chartL + 10, chartT + 5, 12, 3);
        ctx.fillText("Productivity", chartL + 26, chartT + 10);

        ctx.fillStyle = c.wages;
        ctx.fillRect(chartL + 10, chartT + 18, 12, 3);
        ctx.fillText("Wages", chartL + 26, chartT + 23);

        ctx.globalAlpha = 1;
      }

      // Bottom note
      if (elapsed > 2.5) {
        const a = Math.min(1, (elapsed - 2.5) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.wages;
        ctx.fillText("Workers share in productivity gains", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Linked growth" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Diverged: wages flatten after 1971 marker                          */
/* ------------------------------------------------------------------ */

export function ProductivityWagesDiverged() {
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
      ctx.fillText("Post-1971: diverging paths", W / 2, 18);

      const chartL = 40;
      const chartR = W - 20;
      const chartT = 35;
      const chartB = H - 40;
      const chartW = chartR - chartL;
      const chartH = chartB - chartT;

      // Axes
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartL, chartT);
      ctx.lineTo(chartL, chartB);
      ctx.lineTo(chartR, chartB);
      ctx.stroke();

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("1948", chartL, chartB + 14);
      ctx.fillText("1971", chartL + chartW * 0.4, chartB + 14);
      ctx.fillText("2024", chartR, chartB + 14);

      // 1971 marker line
      const markerX = chartL + chartW * 0.4;
      ctx.strokeStyle = c.marker;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(markerX, chartT);
      ctx.lineTo(markerX, chartB);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.marker;
      ctx.fillText("1971", markerX, chartT - 4);

      const progress = Math.min(1, elapsed / 4);
      const points = 60;
      const drawCount = Math.floor(points * progress);
      const splitPoint = Math.floor(points * 0.4);

      // Gap fill
      if (drawCount > splitPoint) {
        ctx.fillStyle = c.gap;
        ctx.beginPath();
        for (let i = splitPoint; i <= drawCount; i++) {
          const t = i / points;
          const x = chartL + t * chartW;
          const yProd = chartB - (0.3 + (t - 0.4) * 1.2) * chartH;
          if (i === splitPoint) ctx.moveTo(x, yProd);
          else ctx.lineTo(x, yProd);
        }
        for (let i = drawCount; i >= splitPoint; i--) {
          const t = i / points;
          const x = chartL + t * chartW;
          const yWage = chartB - (0.3 + (t - 0.4) * 0.15) * chartH;
          ctx.lineTo(x, yWage);
        }
        ctx.fill();
      }

      // Productivity line (keeps climbing)
      ctx.strokeStyle = c.productivity;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        const x = chartL + t * chartW;
        let y: number;
        if (t <= 0.4) {
          y = chartB - t * 0.75 * chartH;
        } else {
          y = chartB - (0.3 + (t - 0.4) * 1.2) * chartH;
        }
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wages line (flattens after 1971)
      ctx.strokeStyle = c.wages;
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        const x = chartL + t * chartW;
        let y: number;
        if (t <= 0.4) {
          y = chartB - t * 0.7 * chartH;
        } else {
          y = chartB - (0.3 + (t - 0.4) * 0.15) * chartH;
        }
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
        ctx.fillStyle = c.productivity;
        ctx.fillRect(chartL + 10, chartT + 5, 12, 3);
        ctx.fillText("Productivity", chartL + 26, chartT + 10);
        ctx.fillStyle = c.wages;
        ctx.fillRect(chartL + 10, chartT + 18, 12, 3);
        ctx.fillText("Wages", chartL + 26, chartT + 23);
        ctx.globalAlpha = 1;
      }

      if (elapsed > 3) {
        const a = Math.min(1, (elapsed - 3) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.marker;
        ctx.fillText("Growing gap after gold standard ended", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Diverging growth" canvasRef={canvasRef} />;
}
