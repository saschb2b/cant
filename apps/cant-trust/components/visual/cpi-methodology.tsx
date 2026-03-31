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
  honest: string;
  adjusted: string;
  bar: string;
  barBg: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    honest: isDark ? "#4ade80" : "#16a34a",
    adjusted: isDark ? "#f87171" : "#dc2626",
    bar: isDark ? "#fbbf24" : "#d97706",
    barBg: isDark ? "#334155" : "#e2e8f0",
  };
}

/* ------------------------------------------------------------------ */
/*  1980 CPI Method                                                    */
/* ------------------------------------------------------------------ */

export function CPI1980Method() {
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
      ctx.fillText("1980 CPI methodology", W / 2, 14);

      // Fixed basket
      const basketItems = [
        { icon: "Steak", price: "$8 -> $12" },
        { icon: "House", price: "actual price" },
        { icon: "Tuition", price: "actual cost" },
      ];

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Fixed basket (no substitution)", W / 2, 35);

      for (let i = 0; i < basketItems.length; i++) {
        const ix = 40 + i * 95;
        const iy = 50;

        ctx.fillStyle = c.honest;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(ix, iy, 80, 35);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.honest;
        ctx.lineWidth = 1;
        ctx.strokeRect(ix, iy, 80, 35);

        const bi = basketItems[i]!;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(bi.icon, ix + 40, iy + 14);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText(bi.price, ix + 40, iy + 28);
      }

      // Result bar
      const barX = 40;
      const barY = 105;
      const barW = 240;
      const growth = Math.min(elapsed * 0.3, 1);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText("Measured inflation:", barX, barY - 5);

      ctx.fillStyle = c.barBg;
      ctx.fillRect(barX, barY, barW, 25);

      // 7-10% bar
      const pct = 0.85;
      ctx.fillStyle = c.honest;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(barX, barY, barW * pct * growth, 25);
      ctx.globalAlpha = 1;

      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("7-10%", W / 2, barY + 18);

      // Properties
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("No substitution adjustments", W / 2, 155);
      ctx.fillText("No hedonic quality adjustments", W / 2, 170);
      ctx.fillText("Housing: actual home prices", W / 2, 185);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.honest;
      ctx.fillText("Measures actual cost of living", W / 2, 210);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.honest;
      ctx.fillText("Higher but more honest reading", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="1980 CPI methodology" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Modern CPI Method                                                  */
/* ------------------------------------------------------------------ */

export function CPIModernMethod() {
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
      ctx.fillText("Modern CPI methodology", W / 2, 14);

      // Swappable basket
      const swapPhase = (elapsed * 0.4) % 2;
      const showSwap = swapPhase > 1;

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Adjustable basket (substitution)", W / 2, 35);

      const items = showSwap
        ? [
            { icon: "Chicken", note: "swapped in" },
            { icon: "Rent", note: "imputed" },
            { icon: "Laptop", note: "hedonic adj." },
          ]
        : [
            { icon: "Steak", note: "too expensive" },
            { icon: "House", note: "not tracked" },
            { icon: "Tuition", note: "excluded" },
          ];

      for (let i = 0; i < items.length; i++) {
        const ix = 40 + i * 95;
        const iy = 50;

        ctx.fillStyle = showSwap ? c.adjusted : c.dimText;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(ix, iy, 80, 35);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = showSwap ? c.adjusted : c.dimText;
        ctx.lineWidth = 1;
        ctx.strokeRect(ix, iy, 80, 35);

        const itm = items[i]!;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(itm.icon, ix + 40, iy + 14);
        ctx.font = "7px monospace";
        ctx.fillStyle = showSwap ? c.adjusted : c.dimText;
        ctx.fillText(itm.note, ix + 40, iy + 28);
      }

      // Result bar
      const barX = 40;
      const barY = 105;
      const barW = 240;
      const growth = Math.min(elapsed * 0.3, 1);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText("Reported inflation:", barX, barY - 5);

      ctx.fillStyle = c.barBg;
      ctx.fillRect(barX, barY, barW, 25);

      // ~3% bar (much smaller)
      const pct = 0.3;
      ctx.fillStyle = c.adjusted;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(barX, barY, barW * pct * growth, 25);
      ctx.globalAlpha = 1;

      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("~3%", barX + barW * pct * 0.5, barY + 18);

      // Adjustments
      ctx.font = "9px monospace";
      ctx.fillStyle = c.adjusted;
      ctx.textAlign = "center";
      ctx.fillText("Steak too expensive? Use chicken", W / 2, 155);
      ctx.fillText("Faster laptop = price DROP", W / 2, 170);
      ctx.fillText("Housing: imputed rent, not price", W / 2, 185);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.adjusted;
      ctx.fillText("Systematically lower readings", W / 2, 210);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.adjusted;
      ctx.fillText("Lower CPI = lower govt obligations", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Modern CPI methodology" canvasRef={canvasRef} />
  );
}
