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
  dollar: string;
  green: string;
  red: string;
  cart: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    dollar: isDark ? "#4ade80" : "#16a34a",
    green: isDark ? "#4ade80" : "#16a34a",
    red: isDark ? "#f87171" : "#dc2626",
    cart: isDark ? "#60a5fa" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  Stable purchasing power: $100 buys the same over time              */
/* ------------------------------------------------------------------ */

export function StablePurchasingPower() {
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
      ctx.fillText("Stable purchasing power", W / 2, 18);

      // Dollar bill
      ctx.fillStyle = c.dollar;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(W / 2 - 40, 30, 80, 35);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.dollar;
      ctx.lineWidth = 2;
      ctx.strokeRect(W / 2 - 40, 30, 80, 35);
      ctx.font = "bold 16px monospace";
      ctx.fillStyle = c.dollar;
      ctx.fillText("$100", W / 2, 54);

      // Cart items (consistent count)
      const items = 8;
      const cartY = 85;
      const itemW = 25;
      const itemH = 18;
      const progress = Math.min(1, elapsed / 1.5);
      const cols = 4;

      for (let i = 0; i < items; i++) {
        const showProgress = Math.min(1, (elapsed - i * 0.1) / 0.5);
        if (showProgress <= 0) continue;

        const col = i % cols;
        const row = Math.floor(i / cols);
        const ix = 60 + col * (itemW + 12);
        const iy = cartY + row * (itemH + 8);

        ctx.fillStyle = c.cart;
        ctx.globalAlpha = showProgress * 0.6;
        ctx.fillRect(ix, iy, itemW, itemH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.cart;
        ctx.lineWidth = 1;
        ctx.strokeRect(ix, iy, itemW, itemH);
      }

      // Stable over time label
      const years = ["1971", "2000", "2024"];
      const yBase = 155;
      for (let i = 0; i < years.length; i++) {
        const a = Math.min(1, (elapsed - 1 - i * 0.8) / 0.5);
        if (a <= 0) continue;

        ctx.globalAlpha = a;
        const x = 60 + i * 80;
        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(years[i]!, x, yBase);
        ctx.fillText(items + " items", x, yBase + 12);

        // Checkmark
        ctx.strokeStyle = c.green;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 6, yBase + 22);
        ctx.lineTo(x - 2, yBase + 26);
        ctx.lineTo(x + 6, yBase + 18);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (elapsed > 3) {
        const a = Math.min(1, (elapsed - 3) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.green;
        ctx.textAlign = "center";
        ctx.fillText("$100 always buys the same amount", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Preserved value" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Eroded purchasing power: same $100 buys less over time             */
/* ------------------------------------------------------------------ */

export function ErodedPurchasingPower() {
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
      ctx.fillText("Eroded purchasing power", W / 2, 18);

      // Dollar bill
      ctx.fillStyle = c.dollar;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(W / 2 - 40, 30, 80, 35);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.dollar;
      ctx.lineWidth = 2;
      ctx.strokeRect(W / 2 - 40, 30, 80, 35);
      ctx.font = "bold 16px monospace";
      ctx.fillStyle = c.dollar;
      ctx.fillText("$100", W / 2, 54);

      // Three time periods with shrinking carts
      const periods = [
        { year: "1971", items: 8, power: "$100" },
        { year: "2000", items: 4, power: "$48" },
        { year: "2024", items: 2, power: "$17" },
      ];

      const sectionW = 85;
      const startX = 25;
      const cartY = 85;

      for (let p = 0; p < periods.length; p++) {
        const period = periods[p]!;
        const sectionStart = startX + p * sectionW;
        const centerX = sectionStart + sectionW / 2;
        const showAt = 1 + p * 1.2;
        const a = Math.min(1, (elapsed - showAt) / 0.6);
        if (a <= 0) continue;

        ctx.globalAlpha = a;

        // Year label
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(period.year, centerX, cartY);

        // Draw items
        const itemW = 14;
        const itemH = 12;
        const cols = Math.min(period.items, 4);
        for (let i = 0; i < period.items; i++) {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const ix = centerX - (cols * (itemW + 4)) / 2 + col * (itemW + 4);
          const iy = cartY + 8 + row * (itemH + 4);

          ctx.fillStyle = c.cart;
          ctx.globalAlpha = a * 0.6;
          ctx.fillRect(ix, iy, itemW, itemH);
          ctx.globalAlpha = a;
          ctx.strokeStyle = c.cart;
          ctx.lineWidth = 1;
          ctx.strokeRect(ix, iy, itemW, itemH);
        }

        // Buying power label
        ctx.font = "8px monospace";
        ctx.fillStyle = c.red;
        ctx.fillText("Worth " + period.power, centerX, cartY + 55);
        ctx.globalAlpha = 1;
      }

      // Declining counter
      if (elapsed > 2) {
        const a = Math.min(1, (elapsed - 2) / 0.5);
        ctx.globalAlpha = a;
        const pctLeft = Math.max(17, 100 - (elapsed - 2) * 20);
        ctx.font = "bold 14px monospace";
        ctx.fillStyle = c.red;
        ctx.textAlign = "center";
        ctx.fillText("Buying power: " + Math.round(pctLeft) + "%", W / 2, 175);
        ctx.globalAlpha = 1;
      }

      if (elapsed > 4) {
        const a = Math.min(1, (elapsed - 4) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.red;
        ctx.textAlign = "center";
        ctx.fillText("Dollar lost 83% of purchasing power", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Declining value" canvasRef={canvasRef} />;
}
