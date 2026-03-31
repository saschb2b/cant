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
  dim: string;
  input: string;
  output: string;
  bad: string;
  good: string;
  box: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    input: isDark ? "#60a5fa" : "#2563eb",
    output: isDark ? "#f87171" : "#dc2626",
    bad: isDark ? "#f87171" : "#dc2626",
    good: isDark ? "#4ade80" : "#16a34a",
    box: isDark ? "#333" : "#e5e5e5",
  };
}

/* ------------------------------------------------------------------ */
/*  Weak hash (similar inputs produce similar outputs)                 */
/* ------------------------------------------------------------------ */

export function HashWeak() {
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
    const CYCLE = 4;

    const pairs = [
      { input: "hello", output: "48656C" },
      { input: "hellp", output: "48656D" },
      { input: "hellq", output: "48656E" },
    ];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      const t = elapsed % CYCLE;

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
      ctx.fillStyle = c.dim;
      ctx.fillText("Weak hash function", W / 2, 18);

      // Hash box
      ctx.fillStyle = c.box;
      ctx.fillRect(W / 2 - 30, 85, 60, 30);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("HASH", W / 2, 104);

      const visibleCount = Math.min(Math.floor(t / 1) + 1, pairs.length);

      for (let i = 0; i < visibleCount; i++) {
        const pair = pairs[i]!;
        const y = 55 + i * 28;

        // Input
        ctx.font = "10px monospace";
        ctx.textAlign = "right";
        ctx.fillStyle = c.input;
        ctx.fillText(`"${pair.input}"`, W / 2 - 40, y);

        // Arrow
        ctx.strokeStyle = c.dim;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 35, y - 3);
        ctx.lineTo(W / 2 - 28, y - 3);
        ctx.stroke();

        // Output
        ctx.textAlign = "left";
        ctx.fillStyle = c.output;
        ctx.fillText(pair.output, W / 2 + 40, y);
      }

      // Highlight similarity
      if (visibleCount >= 2) {
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.bad;
        ctx.fillText("Outputs differ by 1 character", W / 2, 165);
        ctx.fillText("Pattern is predictable", W / 2, 180);
      }

      // Warning
      if (t > 2.5) {
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.bad;
        ctx.fillText("Can guess input from output", W / 2, H - 20);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Similar inputs, similar outputs"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Strong hash (avalanche effect)                                     */
/* ------------------------------------------------------------------ */

export function HashStrong() {
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
    const CYCLE = 4;

    const pairs = [
      { input: "hello", output: "2CF24D" },
      { input: "hellp", output: "E91F7B" },
      { input: "hellq", output: "5B4A03" },
    ];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      const t = elapsed % CYCLE;

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
      ctx.fillStyle = c.dim;
      ctx.fillText("Strong hash (SHA-256)", W / 2, 18);

      // Hash box
      ctx.fillStyle = c.box;
      ctx.fillRect(W / 2 - 30, 85, 60, 30);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("SHA", W / 2, 104);

      const visibleCount = Math.min(Math.floor(t / 1) + 1, pairs.length);

      for (let i = 0; i < visibleCount; i++) {
        const pair = pairs[i]!;
        const y = 55 + i * 28;

        ctx.font = "10px monospace";
        ctx.textAlign = "right";
        ctx.fillStyle = c.input;
        ctx.fillText(`"${pair.input}"`, W / 2 - 40, y);

        ctx.strokeStyle = c.dim;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 35, y - 3);
        ctx.lineTo(W / 2 - 28, y - 3);
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.fillStyle = c.good;
        ctx.fillText(pair.output, W / 2 + 40, y);
      }

      if (visibleCount >= 2) {
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.good;
        ctx.fillText("Outputs completely different", W / 2, 165);
        ctx.fillText("Avalanche effect", W / 2, 180);
      }

      if (t > 2.5) {
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.good;
        ctx.fillText("Cannot reverse the hash", W / 2, H - 20);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Similar inputs, wildly different outputs"
      canvasRef={canvasRef}
    />
  );
}
