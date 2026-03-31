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
  product: string;
  price: string;
  green: string;
  red: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    product: isDark ? "#60a5fa" : "#3b82f6",
    price: isDark ? "#fbbf24" : "#d97706",
    green: isDark ? "#4ade80" : "#16a34a",
    red: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  Honest pricing: price goes up when costs rise                      */
/* ------------------------------------------------------------------ */

export function HonestPricing() {
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
      ctx.fillText("Honest pricing", W / 2, 18);

      // Product box (stays same size)
      const prodW = 80;
      const prodH = 80;
      const prodX = W / 2 - prodW / 2;
      const prodY = 40;

      ctx.fillStyle = c.product;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(prodX, prodY, prodW, prodH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.product;
      ctx.lineWidth = 2;
      ctx.strokeRect(prodX, prodY, prodW, prodH);

      // Weight label (constant)
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("500g", W / 2, prodY + prodH / 2 + 4);

      // Price changes over time
      const cycle = Math.floor((elapsed % 9) / 3);
      const prices = ["$3.00", "$3.50", "$4.00"];
      const years = ["2020", "2022", "2024"];

      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.price;
      ctx.fillText(prices[cycle]!, W / 2, prodY - 8);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText(years[cycle]!, W / 2, prodY + prodH + 16);

      // Arrow showing price increase
      if (cycle > 0) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.green;
        ctx.fillText("Price reflects cost", W / 2, 165);
      }

      // Timeline
      const tlY = 185;
      for (let i = 0; i < 3; i++) {
        const x = 70 + i * 90;
        const isActive = i === cycle;

        ctx.fillStyle = isActive ? c.price : c.dimText;
        ctx.beginPath();
        ctx.arc(x, tlY, isActive ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "7px monospace";
        ctx.fillStyle = isActive ? c.text : c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(years[i]!, x, tlY + 16);
        ctx.fillText(prices[i]!, x, tlY + 26);
      }

      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(70, tlY);
      ctx.lineTo(250, tlY);
      ctx.stroke();

      if (elapsed > 2) {
        const a = Math.min(1, (elapsed - 2) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.green;
        ctx.textAlign = "center";
        ctx.fillText("Same product, transparent pricing", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Transparent pricing" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Shrinkflation: same price, shrinking product                       */
/* ------------------------------------------------------------------ */

export function ShrinkflationPricing() {
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
      ctx.fillText("Shrinkflation", W / 2, 18);

      // Product shrinks over time
      const cycle = Math.floor((elapsed % 9) / 3);
      const weights = [500, 425, 350];
      const weightLabels = ["500g", "425g", "350g"];
      const sizes = [1.0, 0.85, 0.7];

      const baseW = 80;
      const baseH = 80;
      const scale = sizes[cycle]!;
      const prodW = baseW * scale;
      const prodH = baseH * scale;
      const prodX = W / 2 - prodW / 2;
      const prodY = 40 + (baseH - prodH);

      ctx.fillStyle = c.product;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(prodX, prodY, prodW, prodH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.product;
      ctx.lineWidth = 2;
      ctx.strokeRect(prodX, prodY, prodW, prodH);

      // Weight label (shrinking)
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = cycle > 0 ? c.red : c.text;
      ctx.textAlign = "center";
      ctx.fillText(weightLabels[cycle]!, W / 2, prodY + prodH / 2 + 4);

      // Price stays the same!
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.price;
      ctx.fillText("$3.00", W / 2, 35);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      const years = ["2020", "2022", "2024"];
      ctx.fillText(years[cycle]!, W / 2, 40 + baseH + 16);

      // Timeline
      const tlY = 185;
      for (let i = 0; i < 3; i++) {
        const x = 70 + i * 90;
        const isActive = i === cycle;

        ctx.fillStyle = isActive ? c.red : c.dimText;
        ctx.beginPath();
        ctx.arc(x, tlY, isActive ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "7px monospace";
        ctx.fillStyle = isActive ? c.text : c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(years[i]!, x, tlY + 16);
        ctx.fillText(weightLabels[i]!, x, tlY + 26);
      }

      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(70, tlY);
      ctx.lineTo(250, tlY);
      ctx.stroke();

      // Per-unit cost
      if (cycle > 0) {
        const perUnit = (3.0 / weights[cycle]!) * 1000;
        ctx.font = "bold 8px monospace";
        ctx.fillStyle = c.red;
        ctx.textAlign = "center";
        ctx.fillText("Per kg: $" + perUnit.toFixed(2), W / 2, 160);
      }

      if (elapsed > 2) {
        const a = Math.min(1, (elapsed - 2) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.red;
        ctx.textAlign = "center";
        ctx.fillText("Same price, less product", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Hidden price increase" canvasRef={canvasRef} />
  );
}
