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
  cpi: string;
  housing: string;
  health: string;
  education: string;
  food: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    cpi: isDark ? "#60a5fa" : "#3b82f6",
    housing: isDark ? "#f87171" : "#dc2626",
    health: isDark ? "#fb923c" : "#ea580c",
    education: isDark ? "#a78bfa" : "#7c3aed",
    food: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Official CPI rate: single moderate bar                             */
/* ------------------------------------------------------------------ */

export function CPIOfficialRate() {
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
      ctx.fillText("Official CPI measurement", W / 2, 18);

      const barMaxH = 120;
      const barW = 80;
      const barX = W / 2 - barW / 2;
      const barY = H - 60;

      const progress = Math.min(1, elapsed / 1.5);
      const cpiRate = 3;
      const barH = (cpiRate / 10) * barMaxH * progress;

      ctx.fillStyle = c.cpi;
      ctx.fillRect(barX, barY - barH, barW, barH);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY - barH, barW, barH);

      ctx.font = "bold 16px monospace";
      ctx.fillStyle = c.cpi;
      ctx.textAlign = "center";
      ctx.fillText("3%", W / 2, barY - barH - 10);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("CPI", W / 2, barY + 14);

      // "Everything is fine" message
      if (elapsed > 1.5) {
        const a = Math.min(1, (elapsed - 1.5) / 0.5);
        ctx.globalAlpha = a;

        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "center";
        ctx.fillText("Weighted average of a", W / 2, barY + 34);
        ctx.fillText("government-selected basket", W / 2, barY + 46);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Official CPI" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Real costs: multiple taller bars                                   */
/* ------------------------------------------------------------------ */

export function RealCostRate() {
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

    const items = [
      { label: "Housing", rate: 8, colorKey: "housing" as const },
      { label: "Health", rate: 6, colorKey: "health" as const },
      { label: "Educ", rate: 7, colorKey: "education" as const },
      { label: "Food", rate: 5, colorKey: "food" as const },
    ];

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
      ctx.fillText("Actual cost increases", W / 2, 18);

      const barMaxH = 120;
      const barW = 50;
      const gap = 15;
      const totalW = items.length * barW + (items.length - 1) * gap;
      const startX = (W - totalW) / 2;
      const barY = H - 60;

      // CPI reference line
      const cpiH = (3 / 10) * barMaxH;
      ctx.strokeStyle = c.cpi;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(startX - 10, barY - cpiH);
      ctx.lineTo(startX + totalW + 10, barY - cpiH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "7px monospace";
      ctx.fillStyle = c.cpi;
      ctx.textAlign = "left";
      ctx.fillText("CPI 3%", startX + totalW + 12, barY - cpiH + 3);

      for (let i = 0; i < items.length; i++) {
        const item = items[i]!;
        const progress = Math.min(1, (elapsed - i * 0.3) / 1.2);
        if (progress <= 0) continue;

        const barH = (item.rate / 10) * barMaxH * progress;
        const bx = startX + i * (barW + gap);

        ctx.fillStyle = c[item.colorKey];
        ctx.fillRect(bx, barY - barH, barW, barH);
        ctx.strokeStyle = c.text;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, barY - barH, barW, barH);

        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c[item.colorKey];
        ctx.textAlign = "center";
        ctx.fillText("+" + item.rate + "%", bx + barW / 2, barY - barH - 6);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.fillText(item.label, bx + barW / 2, barY + 12);
      }

      if (elapsed > 2.5) {
        const a = Math.min(1, (elapsed - 2.5) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.housing;
        ctx.textAlign = "center";
        ctx.fillText("All exceed official CPI rate", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Real cost rates" canvasRef={canvasRef} />;
}
