// @ts-nocheck
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
  accent: string;
  free: string;
  locked: string;
  block: string;
  blockStroke: string;
  score: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    free: isDark ? "#4ade80" : "#16a34a",
    locked: isDark ? "#f87171" : "#dc2626",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
    score: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Unrestricted Access                                                */
/* ------------------------------------------------------------------ */

export function UnrestrictedAccess() {
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
      ctx.fillText("Unrestricted access", W / 2, 14);

      // Person
      ctx.fillStyle = c.free;
      ctx.beginPath();
      ctx.arc(W / 2, 45, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("You", W / 2, 48);

      // Score: N/A
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Score: N/A", W / 2, 75);

      // All categories available
      const categories = [
        "Travel",
        "Food",
        "Luxury",
        "Education",
        "Savings",
        "Housing",
      ];

      const cols = 3;
      for (let i = 0; i < categories.length; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 45 + col * 90;
        const y = 90 + row * 50;

        ctx.fillStyle = c.free;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(x, y, 80, 35);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.free;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, 80, 35);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.free;
        ctx.textAlign = "center";
        ctx.fillText(categories[i], x + 40, y + 15);
        ctx.fillText("[OK]", x + 40, y + 28);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Full spending ability, all categories", W / 2, 210);
      ctx.fillText("No behavior-based restrictions", W / 2, 226);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Unrestricted access" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Score Based Access                                                 */
/* ------------------------------------------------------------------ */

export function ScoreBasedAccess() {
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
      ctx.fillText("Score-based access", W / 2, 14);

      // Person
      ctx.fillStyle = c.locked;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(W / 2, 45, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("You", W / 2, 48);

      // Animated score decreasing
      const cycle = elapsed % 10;
      const score = Math.max(200, Math.floor(800 - cycle * 60));
      const scoreColor =
        score > 600 ? c.free : score > 400 ? c.score : c.locked;

      ctx.font = "bold 12px monospace";
      ctx.fillStyle = scoreColor;
      ctx.fillText(`Score: ${score}`, W / 2, 75);

      // Categories - lock based on score
      const categories = [
        { name: "Food", threshold: 0 },
        { name: "Housing", threshold: 200 },
        { name: "Education", threshold: 400 },
        { name: "Savings", threshold: 500 },
        { name: "Travel", threshold: 600 },
        { name: "Luxury", threshold: 700 },
      ];

      const cols = 3;
      for (let i = 0; i < categories.length; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 45 + col * 90;
        const y = 90 + row * 50;
        const accessible = score >= categories[i].threshold;

        if (accessible) {
          ctx.fillStyle = c.free;
          ctx.globalAlpha = 0.15;
          ctx.fillRect(x, y, 80, 35);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = c.free;
        } else {
          ctx.fillStyle = c.locked;
          ctx.globalAlpha = 0.1;
          ctx.fillRect(x, y, 80, 35);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = c.locked;
        }
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, 80, 35);

        ctx.font = "8px monospace";
        ctx.fillStyle = accessible ? c.free : c.locked;
        ctx.textAlign = "center";
        ctx.fillText(categories[i].name, x + 40, y + 15);
        ctx.fillText(accessible ? "[OK]" : "[LOCKED]", x + 40, y + 28);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Score drops, access shrinks", W / 2, 210);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.locked;
      ctx.fillText("Money as reward and punishment", W / 2, 228);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Score-based access" canvasRef={canvasRef} />;
}
