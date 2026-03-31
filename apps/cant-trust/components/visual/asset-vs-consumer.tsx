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
  consumer: string;
  asset: string;
  barBg: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    consumer: isDark ? "#60a5fa" : "#2563eb",
    asset: isDark ? "#f87171" : "#dc2626",
    barBg: isDark ? "#334155" : "#e2e8f0",
  };
}

/* ------------------------------------------------------------------ */
/*  Consumer Prices (CPI)                                              */
/* ------------------------------------------------------------------ */

export function ConsumerPrices() {
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
      ctx.fillText("Consumer prices (CPI)", W / 2, 14);

      const items = [
        { label: "Groceries", pct: 3 },
        { label: "Gas", pct: 5 },
        { label: "Clothing", pct: 1 },
        { label: "Electronics", pct: -2 },
      ];

      const barX = 100;
      const startY = 40;
      const maxW = 150;
      const growth = Math.min(elapsed * 0.3, 1);

      for (let i = 0; i < items.length; i++) {
        const item = items[i]!;
        const iy = startY + i * 35;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "right";
        ctx.fillText(item.label, barX - 8, iy + 14);

        // Bar background
        ctx.fillStyle = c.barBg;
        ctx.fillRect(barX, iy, maxW, 20);

        // Bar
        const w = (item.pct / 10) * maxW * growth;
        ctx.fillStyle = item.pct >= 0 ? c.consumer : c.dimText;
        ctx.globalAlpha = 0.6;
        if (w >= 0) {
          ctx.fillRect(barX, iy, w, 20);
        } else {
          ctx.fillRect(barX + w, iy, -w, 20);
        }
        ctx.globalAlpha = 1;

        // Percentage
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "left";
        ctx.fillText(
          `${item.pct >= 0 ? "+" : ""}${item.pct}%`,
          barX + maxW + 8,
          iy + 14,
        );
      }

      // CPI result
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.consumer;
      ctx.textAlign = "center";
      ctx.fillText("CPI: ~2-3%", W / 2, 200);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText('"Inflation is under control"', W / 2, 218);

      ctx.fillStyle = c.consumer;
      ctx.fillText("What central banks measure", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Consumer prices (CPI)" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Asset Prices                                                       */
/* ------------------------------------------------------------------ */

export function AssetPrices() {
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
      ctx.fillText("Asset prices", W / 2, 14);

      const items = [
        { label: "Stocks", pct: 15 },
        { label: "Real estate", pct: 12 },
        { label: "Fine art", pct: 18 },
      ];

      const barX = 100;
      const startY = 40;
      const maxW = 150;
      const growth = Math.min(elapsed * 0.3, 1);

      for (let i = 0; i < items.length; i++) {
        const item = items[i]!;
        const iy = startY + i * 40;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "right";
        ctx.fillText(item.label, barX - 8, iy + 14);

        ctx.fillStyle = c.barBg;
        ctx.fillRect(barX, iy, maxW, 22);

        const w = (item.pct / 20) * maxW * growth;
        ctx.fillStyle = c.asset;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(barX, iy, w, 22);
        ctx.globalAlpha = 1;

        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.asset;
        ctx.textAlign = "left";
        ctx.fillText(`+${item.pct}%`, barX + maxW + 8, iy + 16);
      }

      // NOT in CPI
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.asset;
      ctx.textAlign = "center";
      ctx.fillText("NOT in CPI", W / 2, 185);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Where new money actually goes", W / 2, 203);

      ctx.fillStyle = c.asset;
      ctx.fillText("Not considered inflation", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Asset prices" canvasRef={canvasRef} />;
}
