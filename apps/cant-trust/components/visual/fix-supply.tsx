// @ts-nocheck
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
  accent: string;
  infinite: string;
  fixed: string;
  line: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    infinite: isDark ? "#f87171" : "#dc2626",
    fixed: isDark ? "#4ade80" : "#16a34a",
    line: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Infinite Supply                                                    */
/* ------------------------------------------------------------------ */

export function InfiniteSupply() {
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
      ctx.fillText("Infinite supply", W / 2, 14);

      // Money printer
      const printerX = 40;
      const printerY = 40;
      ctx.fillStyle = c.infinite;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(printerX, printerY, 80, 50);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.infinite;
      ctx.lineWidth = 2;
      ctx.strokeRect(printerX, printerY, 80, 50);
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.infinite;
      ctx.textAlign = "center";
      ctx.fillText("PRINTER", printerX + 40, printerY + 20);

      // Animated printing
      const printPhase = (elapsed * 2) % 1;
      ctx.fillStyle = c.accent;
      ctx.fillRect(printerX + 80, printerY + 20 - printPhase * 5, 20, 10);

      // Supply counter climbing
      const supply = Math.floor(15 + elapsed * 2);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.infinite;
      ctx.textAlign = "center";
      ctx.fillText(`$${supply}T`, W / 2 + 50, 65);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("and counting...", W / 2 + 50, 80);

      // Line chart going up with no limit
      const chartX = 40;
      const chartY = 100;
      const chartW = 240;
      const chartH = 100;

      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartX, chartY);
      ctx.lineTo(chartX, chartY + chartH);
      ctx.lineTo(chartX + chartW, chartY + chartH);
      ctx.stroke();

      // Exponential curve
      ctx.strokeStyle = c.infinite;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const progress = Math.min(1, elapsed * 0.1);
        const xFrac = (i / steps) * progress;
        const px = chartX + xFrac * chartW;
        const yFrac = Math.pow(xFrac * 2, 1.5) * 0.3;
        const py = chartY + chartH - yFrac * chartH;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, Math.max(chartY, py));
      }
      ctx.stroke();

      // No limit line (arrow going up)
      ctx.strokeStyle = c.infinite;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(chartX + chartW * 0.8, chartY + chartH * 0.3);
      ctx.lineTo(chartX + chartW * 0.9, chartY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.infinite;
      ctx.textAlign = "right";
      ctx.fillText("No limit", chartX + chartW, chartY + 10);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Supply climbs endlessly", W / 2, 220);
      ctx.fillText("Each dollar buys less over time", W / 2, 234);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Infinite supply" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Fixed Supply                                                       */
/* ------------------------------------------------------------------ */

export function FixedSupply() {
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
      ctx.fillText("Fixed supply", W / 2, 14);

      // Chart
      const chartX = 40;
      const chartY = 30;
      const chartW = 240;
      const chartH = 130;

      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartX, chartY);
      ctx.lineTo(chartX, chartY + chartH);
      ctx.lineTo(chartX + chartW, chartY + chartH);
      ctx.stroke();

      // 21M ceiling line
      ctx.strokeStyle = c.fixed;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(chartX, chartY + 10);
      ctx.lineTo(chartX + chartW, chartY + 10);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.fixed;
      ctx.textAlign = "right";
      ctx.fillText("21,000,000", chartX + chartW, chartY + 7);

      // Asymptotic curve approaching 21M
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const steps = 80;
      for (let i = 0; i <= steps; i++) {
        const progress = Math.min(1, elapsed * 0.15);
        const xFrac = (i / steps) * progress;
        const px = chartX + xFrac * chartW;
        // Logarithmic curve approaching ceiling
        const yFrac = 1 - Math.exp(-xFrac * 3);
        const py = chartY + 10 + (chartH - 10) * (1 - yFrac);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Halving markers
      const halvings = [0.25, 0.5, 0.7, 0.85];
      for (let i = 0; i < halvings.length; i++) {
        const hx = chartX + halvings[i] * chartW;
        if (hx > chartX + chartW * Math.min(1, elapsed * 0.15)) continue;

        ctx.strokeStyle = c.dimText;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(hx, chartY + chartH - 5);
        ctx.lineTo(hx, chartY + chartH + 5);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = "6px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(`H${i + 1}`, hx, chartY + chartH + 14);
      }

      // Counter
      const btcMined = Math.min(21, 19 + elapsed * 0.01);
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText(`${btcMined.toFixed(2)}M / 21M BTC`, W / 2, 185);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Halving reduces emission every 4 years", W / 2, 205);
      ctx.fillText("Approaching cap asymptotically", W / 2, 221);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.fixed;
      ctx.fillText("Hard ceiling, nobody can print more", W / 2, 237);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Fixed supply" canvasRef={canvasRef} />;
}
