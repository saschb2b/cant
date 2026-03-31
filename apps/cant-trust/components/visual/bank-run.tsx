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
  vault: string;
  vaultStroke: string;
  person: string;
  cash: string;
  panic: string;
  closed: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    vault: isDark ? "#334155" : "#e2e8f0",
    vaultStroke: isDark ? "#64748b" : "#94a3b8",
    person: isDark ? "#93c5fd" : "#3b82f6",
    cash: isDark ? "#4ade80" : "#16a34a",
    panic: isDark ? "#f87171" : "#dc2626",
    closed: isDark ? "#ef4444" : "#b91c1c",
  };
}

/* ------------------------------------------------------------------ */
/*  Stable Bank                                                        */
/* ------------------------------------------------------------------ */

export function StableBank() {
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

      // Vault
      const vx = 120;
      const vy = 50;
      const vw = 80;
      const vh = 100;
      ctx.fillStyle = c.vault;
      ctx.fillRect(vx, vy, vw, vh);
      ctx.strokeStyle = c.vaultStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(vx, vy, vw, vh);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("BANK", vx + vw / 2, vy + 15);

      // Full vault bars
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = c.cash;
        ctx.fillRect(vx + 8, vy + 22 + i * 12, vw - 16, 8);
      }

      // Few customers, calm
      const customerCount = 3;
      for (let i = 0; i < customerCount; i++) {
        const cx = 40 + i * 30;
        const cy = 180 + Math.sin(elapsed * 1.5 + i) * 5;
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = c.person;
        ctx.fill();
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Normal withdrawals", W / 2, 210);
      ctx.fillText("Vault stays full", W / 2, 225);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Stable bank operations", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Stable bank operations" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Bank Run Simulation                                                */
/* ------------------------------------------------------------------ */

export function BankRunSimulation() {
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

      const cycle = elapsed % 10;

      // Vault
      const vx = 120;
      const vy = 50;
      const vw = 80;
      const vh = 100;
      ctx.fillStyle = c.vault;
      ctx.fillRect(vx, vy, vw, vh);
      ctx.strokeStyle = c.vaultStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(vx, vy, vw, vh);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("BANK", vx + vw / 2, vy + 15);

      // Vault bars depleting over time
      const maxBars = 6;
      const barsLeft = Math.max(0, maxBars - Math.floor(cycle * 0.8));
      for (let i = 0; i < barsLeft; i++) {
        ctx.fillStyle = c.cash;
        ctx.fillRect(vx + 8, vy + vh - 12 - i * 12, vw - 16, 8);
      }

      // Growing crowd
      const crowdSize = Math.min(12, 2 + Math.floor(cycle * 1.2));
      for (let i = 0; i < crowdSize; i++) {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const cx = 30 + col * 22;
        const cy = 170 + row * 25;
        const shake = cycle > 3 ? Math.sin(elapsed * 10 + i) * 2 : 0;
        ctx.beginPath();
        ctx.arc(cx + shake, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = cycle > 3 ? c.panic : c.person;
        ctx.fill();
      }

      // Panic text
      if (cycle > 3) {
        const alpha = Math.min(1, (cycle - 3) / 1);
        ctx.globalAlpha = alpha;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.panic;
        ctx.textAlign = "center";
        ctx.fillText("PANIC SPREADING", W / 2, 165);
        ctx.globalAlpha = 1;
      }

      // CLOSED sign
      if (barsLeft === 0) {
        ctx.fillStyle = c.closed;
        ctx.fillRect(vx - 5, vy + vh / 2 - 12, vw + 10, 24);
        ctx.font = "bold 14px monospace";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText("CLOSED", vx + vw / 2, vy + vh / 2 + 5);
      }

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Bank run dynamics", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Bank run dynamics" canvasRef={canvasRef} />;
}
