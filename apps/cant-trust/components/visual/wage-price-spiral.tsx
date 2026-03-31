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
  wages: string;
  prices: string;
  money: string;
  arrow: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    wages: isDark ? "#60a5fa" : "#2563eb",
    prices: isDark ? "#f87171" : "#dc2626",
    money: isDark ? "#fbbf24" : "#d97706",
    arrow: isDark ? "#93c5fd" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  Wages Cause Inflation                                              */
/* ------------------------------------------------------------------ */

export function WagesCauseInflation() {
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
      ctx.fillText("Wages cause inflation", W / 2, 14);

      // Circular spiral: wages -> prices -> wages -> prices
      const cx = W / 2;
      const cy = 115;
      const r = 55;

      // Rotating arrow cycle
      const angle = elapsed * 0.8;

      // Circle path
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Four nodes on circle
      const nodes = [
        {
          label: "Workers demand\nhigher wages",
          angle: -Math.PI / 2,
          color: c.wages,
        },
        { label: "Companies\nraise prices", angle: 0, color: c.prices },
        {
          label: "Workers see\nhigher prices",
          angle: Math.PI / 2,
          color: c.prices,
        },
        {
          label: "Workers demand\nmore raises",
          angle: Math.PI,
          color: c.wages,
        },
      ];

      for (const node of nodes) {
        const nx = cx + Math.cos(node.angle) * r;
        const ny = cy + Math.sin(node.angle) * r;

        ctx.beginPath();
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        const lines = node.label.split("\n");
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        for (let j = 0; j < lines.length; j++) {
          const offX = node.angle === 0 ? 50 : node.angle === Math.PI ? -50 : 0;
          const offY =
            node.angle === -Math.PI / 2
              ? -18
              : node.angle === Math.PI / 2
                ? 18
                : 0;
          ctx.fillText(lines[j] ?? "", nx + offX, ny + offY + j * 10 - 2);
        }
      }

      // Animated arrow around circle
      const ax = cx + Math.cos(angle) * r;
      const ay = cy + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(ax, ay, 4, 0, Math.PI * 2);
      ctx.fillStyle = c.prices;
      ctx.fill();

      // Blame label
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.prices;
      ctx.textAlign = "center";
      ctx.fillText("Blame: workers", cx, cy);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText('"Suppress wage growth"', W / 2, H - 8);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Wages cause inflation" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Money Supply Causes Inflation                                      */
/* ------------------------------------------------------------------ */

export function MoneySupplyCausesInflation() {
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
      ctx.fillText("Money supply causes inflation", W / 2, 14);

      // Linear chain: printer -> prices rise -> wages follow
      const chainY = 65;

      // Money printer
      ctx.fillStyle = c.money;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(20, chainY - 15, 70, 30);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.money;
      ctx.lineWidth = 1;
      ctx.strokeRect(20, chainY - 15, 70, 30);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.money;
      ctx.textAlign = "center";
      ctx.fillText("Money supply", 55, chainY - 2);
      ctx.fillText("expands", 55, chainY + 8);

      // Arrow 1
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(95, chainY);
      ctx.lineTo(120, chainY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(115, chainY - 4);
      ctx.lineTo(120, chainY);
      ctx.lineTo(115, chainY + 4);
      ctx.fillStyle = c.arrow;
      ctx.fill();

      // Prices rise
      ctx.fillStyle = c.prices;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(125, chainY - 15, 70, 30);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.prices;
      ctx.strokeRect(125, chainY - 15, 70, 30);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.prices;
      ctx.fillText("Prices rise", 160, chainY + 4);

      // Arrow 2
      ctx.strokeStyle = c.arrow;
      ctx.beginPath();
      ctx.moveTo(200, chainY);
      ctx.lineTo(225, chainY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(220, chainY - 4);
      ctx.lineTo(225, chainY);
      ctx.lineTo(220, chainY + 4);
      ctx.fillStyle = c.arrow;
      ctx.fill();

      // Wages follow
      ctx.fillStyle = c.wages;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(230, chainY - 15, 70, 30);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.wages;
      ctx.strokeRect(230, chainY - 15, 70, 30);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.wages;
      ctx.fillText("Wages try", 265, chainY - 2);
      ctx.fillText("to catch up", 265, chainY + 8);

      // Root cause label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.money;
      ctx.textAlign = "center";
      ctx.fillText("ROOT CAUSE", 55, chainY + 30);

      // Thermometer analogy
      const thermY = 120;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Wages FOLLOW inflation,", W / 2, thermY);
      ctx.fillText("they don't CAUSE it", W / 2, thermY + 14);

      // Thermometer visual
      const tx = W / 2;
      const ty = thermY + 40;
      ctx.beginPath();
      ctx.arc(tx, ty + 20, 10, 0, Math.PI * 2);
      ctx.fillStyle = c.prices;
      ctx.globalAlpha = 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillRect(tx - 4, ty - 10, 8, 30);
      ctx.strokeStyle = c.prices;
      ctx.lineWidth = 1;
      ctx.strokeRect(tx - 5, ty - 12, 10, 34);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Blaming wages = blaming", W / 2, ty + 42);
      ctx.fillText("the thermometer for the fever", W / 2, ty + 54);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Money supply causes inflation"
      canvasRef={canvasRef}
    />
  );
}
