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
  subsidy: string;
  fee: string;
  danger: string;
  success: string;
  bar: string;
  barStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    subsidy: isDark ? "#f7931a" : "#c28a1a",
    fee: isDark ? "#93c5fd" : "#3b82f6",
    danger: isDark ? "#f87171" : "#dc2626",
    success: isDark ? "#4ade80" : "#16a34a",
    bar: isDark ? "#334155" : "#e2e8f0",
    barStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Subsidy Only Mining                                                */
/* ------------------------------------------------------------------ */

export function SubsidyOnlyMining() {
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
      ctx.fillText("Subsidy only", W / 2, 16);

      // Halving periods shown as bars
      const numBars = 8;
      const barW = 28;
      const gap = 6;
      const totalW = numBars * barW + (numBars - 1) * gap;
      const startX = (W - totalW) / 2;
      const baseY = 170;
      const maxH = 120;

      const progress = (elapsed % 10) / 10;
      const revealedBars = Math.floor(progress * numBars) + 1;

      for (let i = 0; i < Math.min(revealedBars, numBars); i++) {
        const x = startX + i * (barW + gap);
        const reward = 50 / Math.pow(2, i);
        const barH = (reward / 50) * maxH;

        ctx.fillStyle = c.subsidy;
        ctx.globalAlpha = barH < 5 ? 0.3 : 0.6;
        ctx.fillRect(x, baseY - barH, barW, barH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.subsidy;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, baseY - Math.max(barH, 1), barW, Math.max(barH, 1));

        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        if (reward >= 1) {
          ctx.fillText(`${reward}`, x + barW / 2, baseY - barH - 4);
        } else {
          ctx.fillText("~0", x + barW / 2, baseY - 6);
        }
      }

      // Labels
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Halvings over time", W / 2, baseY + 14);

      // Warning at bottom
      if (revealedBars >= 6) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.danger;
        ctx.fillText("Reward approaches zero", W / 2, baseY + 34);
        ctx.font = "9px monospace";
        ctx.fillText("Who secures the network?", W / 2, H - 10);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Subsidy only" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Subsidy + Fees Mining                                              */
/* ------------------------------------------------------------------ */

export function SubsidyPlusFees() {
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
      ctx.fillText("Subsidy + fees", W / 2, 16);

      const numBars = 8;
      const barW = 28;
      const gap = 6;
      const totalW = numBars * barW + (numBars - 1) * gap;
      const startX = (W - totalW) / 2;
      const baseY = 170;
      const maxH = 120;

      const progress = (elapsed % 10) / 10;
      const revealedBars = Math.floor(progress * numBars) + 1;

      for (let i = 0; i < Math.min(revealedBars, numBars); i++) {
        const x = startX + i * (barW + gap);
        const subsidy = 50 / Math.pow(2, i);
        const subsidyH = (subsidy / 50) * maxH;

        // Fee grows as subsidy shrinks
        const feeRatio = Math.min(1, i / (numBars - 1));
        const feeH = feeRatio * maxH * 0.6;

        // Subsidy bar
        ctx.fillStyle = c.subsidy;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(x, baseY - subsidyH - feeH, barW, subsidyH);
        ctx.globalAlpha = 1;

        // Fee bar stacked on top
        ctx.fillStyle = c.fee;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(x, baseY - feeH, barW, feeH);
        ctx.globalAlpha = 1;

        // Combined outline
        const totalH = subsidyH + feeH;
        ctx.strokeStyle = c.barStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, baseY - totalH, barW, totalH);
      }

      // Legend
      ctx.font = "8px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = c.subsidy;
      ctx.fillRect(startX, baseY + 8, 10, 8);
      ctx.fillStyle = c.text;
      ctx.fillText("Subsidy", startX + 14, baseY + 16);

      ctx.fillStyle = c.fee;
      ctx.fillRect(startX + 80, baseY + 8, 10, 8);
      ctx.fillStyle = c.text;
      ctx.fillText("Fees", startX + 94, baseY + 16);

      // Status
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("Total reward stays sustainable", W / 2, baseY + 36);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.success;
      ctx.fillText("Security budget maintained", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Subsidy plus fees" canvasRef={canvasRef} />;
}
