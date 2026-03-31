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
  money: string;
  first: string;
  last: string;
  arrow: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    money: isDark ? "#fbbf24" : "#d97706",
    first: isDark ? "#4ade80" : "#16a34a",
    last: isDark ? "#f87171" : "#dc2626",
    arrow: isDark ? "#93c5fd" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  First Receivers                                                    */
/* ------------------------------------------------------------------ */

export function FirstReceivers() {
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

    interface MoneyDrop {
      x: number;
      y: number;
      targetY: number;
      alpha: number;
    }

    const drops: MoneyDrop[] = [];
    let spawnTimer = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      spawnTimer += dt;

      if (spawnTimer > 0.8 && drops.length < 12) {
        drops.push({
          x: 140 + Math.random() * 40,
          y: 55,
          targetY: 75 + Math.random() * 15,
          alpha: 1,
        });
        spawnTimer = 0;
      }

      for (const d of drops) {
        d.y += (d.targetY - d.y) * 2 * dt;
      }

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
      ctx.fillText("First receivers", W / 2, 14);

      // Central bank / printer at top
      ctx.fillStyle = c.money;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(120, 30, 80, 25);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.money;
      ctx.lineWidth = 1;
      ctx.strokeRect(120, 30, 80, 25);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.money;
      ctx.fillText("Central Bank", W / 2, 46);

      // Money drops flowing to banks
      for (const d of drops) {
        ctx.font = "10px monospace";
        ctx.fillStyle = c.money;
        ctx.globalAlpha = d.alpha;
        ctx.fillText("$", d.x, d.y);
        ctx.globalAlpha = 1;
      }

      // Layer 1: Banks
      const bankY = 85;
      ctx.fillStyle = c.first;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(70, bankY, 180, 25);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.first;
      ctx.strokeRect(70, bankY, 180, 25);
      ctx.font = "9px monospace";
      ctx.fillStyle = c.first;
      ctx.textAlign = "center";
      ctx.fillText("Banks (buy at OLD prices)", W / 2, bankY + 16);

      // Layer 2: Corporations
      const corpY = 125;
      ctx.fillStyle = c.first;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(50, corpY, 220, 25);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.first;
      ctx.strokeRect(50, corpY, 220, 25);
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Corporations / wealthy borrowers", W / 2, corpY + 16);

      // Arrow down
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2, corpY + 28);
      ctx.lineTo(W / 2, corpY + 42);
      ctx.stroke();

      // Asset prices
      ctx.font = "9px monospace";
      ctx.fillStyle = c.first;
      ctx.fillText("Stocks +15%  Real estate +12%", W / 2, corpY + 55);

      // Bottom label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.first;
      ctx.textAlign = "center";
      ctx.fillText("Wealth increases BEFORE", W / 2, H - 22);
      ctx.fillText("prices rise for everyone", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="First receivers" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Last Receivers                                                     */
/* ------------------------------------------------------------------ */

export function LastReceivers() {
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
      ctx.fillText("Last receivers", W / 2, 14);

      // Worker at bottom
      const workerY = 60;
      ctx.beginPath();
      ctx.arc(W / 2, workerY, 18, 0, Math.PI * 2);
      ctx.fillStyle = c.last;
      ctx.globalAlpha = 0.2;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.last;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Worker", W / 2, workerY + 4);

      // Wage bar (stays same)
      const wageY = 95;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText("Wages:", 30, wageY + 12);
      ctx.fillStyle = c.arrow;
      ctx.fillRect(90, wageY, 100, 16);
      ctx.font = "9px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("unchanged", 140, wageY + 12);

      // Price bars (growing)
      const priceY = 125;
      const growth = 1 + Math.min(elapsed * 0.05, 0.6);
      const items = [
        { label: "Groceries", w: 80 * growth },
        { label: "Rent", w: 90 * growth },
        { label: "Gas", w: 70 * growth },
      ];

      ctx.textAlign = "left";
      for (let i = 0; i < items.length; i++) {
        const item = items[i]!;
        const iy = priceY + i * 22;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText(item.label + ":", 30, iy + 12);
        ctx.fillStyle = c.last;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(90, iy, item.w, 16);
        ctx.globalAlpha = 1;

        // Up arrow
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.last;
        ctx.textAlign = "left";
        ctx.fillText(
          `+${Math.floor((growth - 1) * 100)}%`,
          92 + item.w,
          iy + 12,
        );
      }

      // Bottom
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.last;
      ctx.textAlign = "center";
      ctx.fillText("Prices already rose", W / 2, H - 22);
      ctx.fillText("Same income buys less", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Last receivers" canvasRef={canvasRef} />;
}
