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
  m0: string;
  m1: string;
  m2: string;
  m3: string;
  simple: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    m0: isDark ? "#fbbf24" : "#d97706",
    m1: isDark ? "#4ade80" : "#16a34a",
    m2: isDark ? "#93c5fd" : "#3b82f6",
    m3: isDark ? "#c084fc" : "#7c3aed",
    simple: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Simple Money (just cash)                                           */
/* ------------------------------------------------------------------ */

export function SimpleMoney() {
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

      // Single circle
      const cx = W / 2;
      const cy = 110;
      const r = 50 + 3 * Math.sin(elapsed * 2);

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = c.simple;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.simple;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Cash", cx, cy - 5);

      ctx.font = "10px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("= Money", cx, cy + 15);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText('"Money is just physical cash"', W / 2, 195);
      ctx.fillText("Ignores most of the money supply", W / 2, 210);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Simple definition of money", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Simple definition of money"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Money Layers (M0, M1, M2, M3)                                     */
/* ------------------------------------------------------------------ */

export function MoneyLayers() {
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

    const layers = [
      { label: "M3 (institutional)", r: 90, colorKey: "m3" as const },
      { label: "M2 (+ savings)", r: 68, colorKey: "m2" as const },
      { label: "M1 (+ checking)", r: 46, colorKey: "m1" as const },
      { label: "M0 (physical cash)", r: 24, colorKey: "m0" as const },
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

      const cx = W / 2;
      const cy = 115;
      const cycle = elapsed % 6;

      // Draw layers from outside in
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i]!;
        const appearTime = i * 1.2;
        if (cycle < appearTime) continue;

        const progress = Math.min(1, (cycle - appearTime) / 0.8);
        const r = layer.r * progress;
        const pulse = 1 + 0.02 * Math.sin(elapsed * 2 + i);

        ctx.beginPath();
        ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = c[layer.colorKey];
        ctx.globalAlpha = 0.25;
        ctx.fill();
        ctx.globalAlpha = progress;
        ctx.strokeStyle = c[layer.colorKey];
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Labels on the right side
      for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i]!;
        const appearTime = i * 1.2 + 0.5;
        if (cycle < appearTime) continue;

        const alpha = Math.min(1, (cycle - appearTime) / 0.5);
        ctx.globalAlpha = alpha;
        const labelY = 40 + (layers.length - 1 - i) * 16;
        ctx.font = "8px monospace";
        ctx.textAlign = "right";
        ctx.fillStyle = c[layer.colorKey];
        ctx.fillText(layer.label, W - 10, labelY);
        ctx.globalAlpha = 1;
      }

      // Bottom note
      if (cycle > 4) {
        const alpha = Math.min(1, (cycle - 4) / 0.5);
        ctx.globalAlpha = alpha;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "center";
        ctx.fillText("Cash is only ~10% of total money", W / 2, 220);
        ctx.globalAlpha = 1;
      }

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Money supply layers", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Money supply layers" canvasRef={canvasRef} />;
}
