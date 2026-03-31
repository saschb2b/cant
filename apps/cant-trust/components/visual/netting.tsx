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
  node: string;
  arrow: string;
  green: string;
  red: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    node: isDark ? "#60a5fa" : "#2563eb",
    arrow: isDark ? "#f87171" : "#dc2626",
    green: isDark ? "#4ade80" : "#16a34a",
    red: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  Gross settlement (every transfer individually)                     */
/* ------------------------------------------------------------------ */

export function NettingGross() {
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

    // Three banks forming a triangle with bilateral payments
    const banks = [
      { x: W / 2, y: 55, label: "Bank A" },
      { x: 70, y: 180, label: "Bank B" },
      { x: W - 70, y: 180, label: "Bank C" },
    ];
    // All 6 individual transfers
    const transfers = [
      { from: 0, to: 1, amount: 80 },
      { from: 1, to: 0, amount: 50 },
      { from: 1, to: 2, amount: 70 },
      { from: 2, to: 1, amount: 40 },
      { from: 0, to: 2, amount: 60 },
      { from: 2, to: 0, amount: 30 },
    ];
    const totalGross = transfers.reduce((s, t) => s + t.amount, 0);

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
      ctx.fillText("Gross settlement", W / 2, 18);

      // Draw banks
      for (const bank of banks) {
        ctx.beginPath();
        ctx.arc(bank.x, bank.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = c.node;
        ctx.fill();
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(bank.label, bank.x, bank.y + 28);
      }

      // Animate transfers one at a time
      const transferTime = CYCLE / transfers.length;
      const currentIdx = Math.min(
        Math.floor(t / transferTime),
        transfers.length - 1,
      );
      const frac = (t / transferTime) % 1;

      for (let i = 0; i <= currentIdx; i++) {
        const tr = transfers[i]!;
        const from = banks[tr.from]!;
        const to = banks[tr.to]!;

        const progress = i < currentIdx ? 1 : frac;
        const px = from.x + (to.x - from.x) * progress;
        const py = from.y + (to.y - from.y) * progress;

        // Arrow line
        ctx.strokeStyle = c.arrow;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Moving dot
        if (i === currentIdx) {
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = c.arrow;
          ctx.fill();
        }

        // Amount label
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        ctx.font = "8px monospace";
        ctx.fillStyle = c.red;
        ctx.textAlign = "center";
        ctx.fillText(`$${tr.amount}`, mx + (i % 2 === 0 ? -12 : 12), my - 4);
      }

      // Total
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.red;
      ctx.textAlign = "center";
      ctx.fillText(`Total moved: $${totalGross}`, W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="6 individual transfers" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Bilateral netting (net amounts only)                               */
/* ------------------------------------------------------------------ */

export function NettingBilateral() {
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

    const banks = [
      { x: W / 2, y: 55, label: "Bank A" },
      { x: 70, y: 180, label: "Bank B" },
      { x: W - 70, y: 180, label: "Bank C" },
    ];

    // Net amounts after bilateral netting: A->B: 80-50=30, B->C: 70-40=30, A->C: 60-30=30
    const netTransfers = [
      { from: 0, to: 1, amount: 30 },
      { from: 1, to: 2, amount: 30 },
      { from: 0, to: 2, amount: 30 },
    ];
    const totalNet = netTransfers.reduce((s, t) => s + t.amount, 0);

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
      ctx.fillText("Bilateral netting", W / 2, 18);

      // Draw banks
      for (const bank of banks) {
        ctx.beginPath();
        ctx.arc(bank.x, bank.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = c.node;
        ctx.fill();
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(bank.label, bank.x, bank.y + 28);
      }

      const transferTime = CYCLE / netTransfers.length;
      const currentIdx = Math.min(
        Math.floor(t / transferTime),
        netTransfers.length - 1,
      );
      const frac = (t / transferTime) % 1;

      for (let i = 0; i <= currentIdx; i++) {
        const tr = netTransfers[i]!;
        const from = banks[tr.from]!;
        const to = banks[tr.to]!;

        const progress = i < currentIdx ? 1 : frac;
        const px = from.x + (to.x - from.x) * progress;
        const py = from.y + (to.y - from.y) * progress;

        ctx.strokeStyle = c.green;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (i === currentIdx) {
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = c.green;
          ctx.fill();
        }

        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        ctx.font = "8px monospace";
        ctx.fillStyle = c.green;
        ctx.textAlign = "center";
        ctx.fillText(`$${tr.amount}`, mx + (i % 2 === 0 ? -12 : 12), my - 4);
      }

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.green;
      ctx.textAlign = "center";
      ctx.fillText(`Total moved: $${totalNet} (70% less)`, W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="3 netted transfers" canvasRef={canvasRef} />;
}
