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
  good: string;
  bad: string;
  accent: string;
  barBg: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    good: isDark ? "#4ade80" : "#16a34a",
    bad: isDark ? "#f87171" : "#dc2626",
    accent: isDark ? "#fbbf24" : "#d97706",
    barBg: isDark ? "#334155" : "#e2e8f0",
  };
}

/* ------------------------------------------------------------------ */
/*  Productivity Deflation                                             */
/* ------------------------------------------------------------------ */

export function ProductivityDeflation() {
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
      ctx.fillText("Productivity-driven deflation", W / 2, 14);

      // Price bars shrinking over time (good thing)
      const items = [
        { label: "TV (1980)", price: "$1,000", newPrice: "$300" },
        { label: "Phone call", price: "$2/min", newPrice: "$0/min" },
        { label: "Computer", price: "$5,000", newPrice: "$500" },
      ];

      const barX = 90;
      const barW = 180;

      for (let i = 0; i < items.length; i++) {
        const iy = 35 + i * 50;
        const shrinkProgress = Math.min(elapsed * 0.15, 1);
        const oldW = barW;
        const newW = barW * (0.3 + (1 - shrinkProgress) * 0.7);

        const item = items[i]!;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "right";
        ctx.fillText(item.label, barX - 5, iy + 12);

        // Old price (faded)
        ctx.fillStyle = c.barBg;
        ctx.fillRect(barX, iy, oldW, 18);

        // New price (smaller bar)
        ctx.fillStyle = c.good;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(barX, iy, newW, 18);
        ctx.globalAlpha = 1;

        // Price labels
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "left";
        ctx.fillText(item.newPrice, barX + 3, iy + 13);

        ctx.fillStyle = c.dimText;
        ctx.globalAlpha = 0.5;
        ctx.textAlign = "right";
        ctx.fillText(item.price, barX + oldW - 3, iy + 13);
        ctx.globalAlpha = 1;

        // Down arrow
        ctx.fillStyle = c.good;
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("falling", barX + oldW / 2, iy + 32);
      }

      // Summary
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.good;
      ctx.textAlign = "center";
      ctx.fillText("Falling prices = rising", W / 2, 200);
      ctx.fillText("standard of living", W / 2, 214);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.good;
      ctx.fillText("Natural economic progress", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Productivity-driven deflation"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Central Bank View of Deflation                                     */
/* ------------------------------------------------------------------ */

export function CentralBankDeflationView() {
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
      ctx.fillText("Central bank view", W / 2, 14);

      // Warning sign
      ctx.font = "bold 20px monospace";
      ctx.fillStyle = c.bad;
      ctx.fillText("DANGER!", W / 2, 45);

      // Claims
      const claims = [
        '"Deflation is dangerous"',
        '"People will stop buying"',
        '"Economy needs 2% inflation"',
      ];

      for (let i = 0; i < claims.length; i++) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.bad;
        ctx.textAlign = "center";
        ctx.fillText(claims[i]!, W / 2, 65 + i * 16);
      }

      // Counter-argument box
      const boxY = 115;
      ctx.fillStyle = c.good;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(25, boxY, W - 50, 60);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.good;
      ctx.lineWidth = 1;
      ctx.strokeRect(25, boxY, W - 50, 60);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.good;
      ctx.fillText("But...", W / 2, boxY + 14);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Do you delay buying a phone", W / 2, boxY + 30);
      ctx.fillText("because next year is cheaper?", W / 2, boxY + 43);
      ctx.fillText("Tech sector: decades of deflation", W / 2, boxY + 56);

      // Real reason
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Real fear: deflation increases", W / 2, 195);
      ctx.fillText("the real value of government debt", W / 2, 208);

      ctx.fillStyle = c.bad;
      ctx.fillText("Inflation preferred to reduce debt burden", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Central bank view" canvasRef={canvasRef} />;
}
