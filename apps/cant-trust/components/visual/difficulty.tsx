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
  target: string;
  danger: string;
  success: string;
  accent: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    bar: isDark ? "#334155" : "#e2e8f0",
    barStroke: isDark ? "#64748b" : "#94a3b8",
    target: isDark ? "#4ade80" : "#16a34a",
    danger: isDark ? "#f87171" : "#dc2626",
    success: isDark ? "#4ade80" : "#16a34a",
    accent: isDark ? "#f7931a" : "#c28a1a",
  };
}

/* ------------------------------------------------------------------ */
/*  Fixed Difficulty                                                   */
/* ------------------------------------------------------------------ */

export function FixedDifficulty() {
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
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Fixed difficulty", W / 2, 16);

      // Target line (10 min)
      const chartX = 40;
      const chartY = 40;
      const chartW = 250;
      const chartH = 130;

      ctx.strokeStyle = c.target;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const targetY = chartY + chartH / 2;
      ctx.moveTo(chartX, targetY);
      ctx.lineTo(chartX + chartW, targetY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.target;
      ctx.textAlign = "right";
      ctx.fillText("10 min target", chartX + chartW, targetY - 6);

      // Oscillating block time bars
      const numBars = 12;
      const barW = (chartW - 20) / numBars - 2;
      for (let i = 0; i < numBars; i++) {
        const x = chartX + 10 + i * (barW + 2);
        // Wild oscillation: hashrate changes cause block time to swing
        const phase = elapsed * 0.5 + i * 0.7;
        const swing = Math.sin(phase) * 0.8;
        const blockTime = 10 + swing * 15; // 2-25 min range
        const barH = (blockTime / 25) * chartH;
        const barY = chartY + chartH - barH;

        const isOff = Math.abs(blockTime - 10) > 3;
        ctx.fillStyle = isOff ? c.danger : c.bar;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(x, barY, barW, barH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isOff ? c.danger : c.barStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, barY, barW, barH);

        ctx.font = "6px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(`${blockTime.toFixed(0)}m`, x + barW / 2, barY - 4);
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Block time", chartX + chartW / 2, chartY + chartH + 14);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText("Block times swing wildly", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Fixed difficulty" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Adaptive Difficulty                                                */
/* ------------------------------------------------------------------ */

export function AdaptiveDifficulty() {
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
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Adaptive difficulty", W / 2, 16);

      const chartX = 40;
      const chartY = 40;
      const chartW = 250;
      const chartH = 130;

      // Target line
      ctx.strokeStyle = c.target;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      const targetY = chartY + chartH / 2;
      ctx.beginPath();
      ctx.moveTo(chartX, targetY);
      ctx.lineTo(chartX + chartW, targetY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.target;
      ctx.textAlign = "right";
      ctx.fillText("10 min target", chartX + chartW, targetY - 6);

      // Block times converging to 10 min
      const numBars = 12;
      const barW = (chartW - 20) / numBars - 2;
      for (let i = 0; i < numBars; i++) {
        const x = chartX + 10 + i * (barW + 2);
        // Start off, then converge to 10
        const deviation =
          Math.sin(elapsed * 0.3 + i * 0.5) * Math.max(0, 8 - i * 0.8);
        const blockTime = 10 + deviation;
        const barH = (blockTime / 25) * chartH;
        const barY = chartY + chartH - barH;

        const isClose = Math.abs(blockTime - 10) < 2;
        ctx.fillStyle = isClose ? c.success : c.bar;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(x, barY, barW, barH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isClose ? c.success : c.barStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, barY, barW, barH);

        ctx.font = "6px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(`${blockTime.toFixed(0)}m`, x + barW / 2, barY - 4);

        // Adjustment marker
        if (i === 5) {
          ctx.font = "7px monospace";
          ctx.fillStyle = c.accent;
          ctx.fillText("adj", x + barW / 2, chartY + chartH + 10);
        }
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Block time", chartX + chartW / 2, chartY + chartH + 14);

      // Feedback loop label
      ctx.font = "9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("Self-correcting feedback loop", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Adaptive difficulty" canvasRef={canvasRef} />;
}
