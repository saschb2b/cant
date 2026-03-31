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
  reveal: string;
  hidden: string;
  bad: string;
  good: string;
  cave: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    reveal: isDark ? "#f87171" : "#dc2626",
    hidden: isDark ? "#4ade80" : "#16a34a",
    bad: isDark ? "#f87171" : "#dc2626",
    good: isDark ? "#4ade80" : "#16a34a",
    cave: isDark ? "#555" : "#bbb",
  };
}

/* ------------------------------------------------------------------ */
/*  Reveal everything to prove                                         */
/* ------------------------------------------------------------------ */

export function ZkpRevealAll() {
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
    const CYCLE = 5;

    const fields = [
      { label: "Name", value: "Alice Smith" },
      { label: "Age", value: "28" },
      { label: "SSN", value: "123-45-6789" },
      { label: "Address", value: "123 Main St" },
      { label: "Income", value: "$85,000" },
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
      ctx.fillText("Prove age: reveal everything", W / 2, 18);

      const revealedCount = Math.min(Math.floor(t / 0.6) + 1, fields.length);

      for (let i = 0; i < revealedCount; i++) {
        const f = fields[i]!;
        const y = 45 + i * 28;

        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = c.dim;
        ctx.fillText(f.label + ":", 40, y);
        ctx.fillStyle = c.reveal;
        ctx.fillText(f.value, 130, y);

        // Eye icon
        ctx.font = "8px monospace";
        ctx.fillStyle = c.bad;
        ctx.textAlign = "right";
        ctx.fillText("exposed", W - 40, y);
      }

      if (t > 3) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.bad;
        ctx.textAlign = "center";
        ctx.fillText("All private data exposed", W / 2, H - 40);
        ctx.fillText("Just to prove you are over 18", W / 2, H - 25);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Full disclosure to prove one fact"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Zero-knowledge proof (prove without revealing)                     */
/* ------------------------------------------------------------------ */

export function ZkpZeroKnowledge() {
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
    const CYCLE = 6;

    const fields = [
      { label: "Name", hidden: true },
      { label: "Age >= 18", hidden: false, value: "TRUE" },
      { label: "SSN", hidden: true },
      { label: "Address", hidden: true },
      { label: "Income", hidden: true },
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
      ctx.fillText("Prove age: zero-knowledge", W / 2, 18);

      const visibleCount = Math.min(Math.floor(t / 0.6) + 1, fields.length);

      for (let i = 0; i < visibleCount; i++) {
        const f = fields[i]!;
        const y = 45 + i * 28;

        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = c.dim;
        ctx.fillText(f.label + ":", 40, y);

        if (f.hidden) {
          // Redacted
          ctx.fillStyle = isDark ? "#333" : "#ddd";
          ctx.fillRect(130, y - 10, 80, 14);
          ctx.font = "8px monospace";
          ctx.fillStyle = c.good;
          ctx.textAlign = "right";
          ctx.fillText("hidden", W - 40, y);
        } else {
          ctx.fillStyle = c.good;
          ctx.font = "bold 9px monospace";
          ctx.fillText(f.value!, 130, y);
          ctx.font = "8px monospace";
          ctx.textAlign = "right";
          ctx.fillText("proven", W - 40, y);
        }
      }

      if (t > 3.5) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.good;
        ctx.textAlign = "center";
        ctx.fillText("Proof verified mathematically", W / 2, H - 40);
        ctx.fillText("Zero private data revealed", W / 2, H - 25);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Prove a fact, reveal nothing else"
      canvasRef={canvasRef}
    />
  );
}
