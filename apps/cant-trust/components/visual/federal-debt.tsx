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
  debt: string;
  marker: string;
  axis: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    debt: isDark ? "#f87171" : "#dc2626",
    marker: isDark ? "#fbbf24" : "#d97706",
    axis: isDark ? "#555" : "#ccc",
  };
}

/* ------------------------------------------------------------------ */
/*  Constrained debt: slow, manageable growth                          */
/* ------------------------------------------------------------------ */

export function DebtConstrained() {
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
      ctx.fillText("Debt-to-GDP: constrained era", W / 2, 18);

      const chartL = 45;
      const chartR = W - 20;
      const chartT = 35;
      const chartB = H - 35;
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

      // Y labels
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "right";
      ctx.fillText("120%", chartL - 4, chartT + 10);
      ctx.fillText("60%", chartL - 4, chartT + chartH / 2);
      ctx.fillText("0%", chartL - 4, chartB);

      ctx.textAlign = "center";
      ctx.fillText("1945", chartL, chartB + 12);
      ctx.fillText("1971", chartR, chartB + 12);

      // Animated debt line: rises moderately then falls
      const progress = Math.min(1, elapsed / 3.5);
      const points = 50;
      const drawCount = Math.floor(points * progress);

      ctx.strokeStyle = c.debt;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        // Starts high (WWII), drops, then stays low
        const debtRatio = 0.9 * Math.exp(-t * 3) + 0.25;
        const x = chartL + t * chartW;
        const y = chartB - debtRatio * chartH * 0.7;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // GDP ratio label
      if (elapsed > 2.5) {
        const a = Math.min(1, (elapsed - 2.5) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText("Debt-to-GDP fell from 120% to 35%", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Constrained debt" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Exponential debt: hockey stick after 1971                          */
/* ------------------------------------------------------------------ */

export function DebtExponential() {
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
      ctx.fillText("Debt-to-GDP: unconstrained era", W / 2, 18);

      const chartL = 45;
      const chartR = W - 20;
      const chartT = 35;
      const chartB = H - 35;
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
      ctx.textAlign = "right";
      ctx.fillText("130%", chartL - 4, chartT + 10);
      ctx.fillText("65%", chartL - 4, chartT + chartH / 2);
      ctx.fillText("0%", chartL - 4, chartB);

      ctx.textAlign = "center";
      ctx.fillText("1971", chartL, chartB + 12);
      ctx.fillText("2024", chartR, chartB + 12);

      // Animated exponential debt line
      const progress = Math.min(1, elapsed / 4);
      const points = 60;
      const drawCount = Math.floor(points * progress);

      ctx.strokeStyle = c.debt;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= drawCount; i++) {
        const t = i / points;
        // Exponential growth: 35% to 130%
        const debtRatio = 0.25 + 0.75 * Math.pow(t, 2.2);
        const x = chartL + t * chartW;
        const y = chartB - debtRatio * chartH * 0.75;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Counter
      if (elapsed > 1) {
        const pct = Math.min(130, 35 + (elapsed / 4) * 95);
        ctx.font = "bold 14px monospace";
        ctx.fillStyle = c.debt;
        ctx.textAlign = "right";
        ctx.fillText(Math.round(pct) + "%", chartR - 5, chartT + 20);
      }

      if (elapsed > 3) {
        const a = Math.min(1, (elapsed - 3) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.debt;
        ctx.textAlign = "center";
        ctx.fillText("Debt-to-GDP surged from 35% to 130%", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Exponential debt" canvasRef={canvasRef} />;
}
