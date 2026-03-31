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
  bad: string;
  good: string;
  block: string;
  energy: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    bad: isDark ? "#f87171" : "#dc2626",
    good: isDark ? "#4ade80" : "#16a34a",
    block: isDark ? "#60a5fa" : "#2563eb",
    energy: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  No cost to propose (spam)                                          */
/* ------------------------------------------------------------------ */

export function PowNoCost() {
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

    interface SpamBlock {
      x: number;
      y: number;
      vy: number;
    }

    const blocks: SpamBlock[] = [];
    let spawnTimer = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      spawnTimer += dt;

      if (spawnTimer > 0.15 && blocks.length < 30) {
        blocks.push({
          x: 30 + Math.random() * (W - 60),
          y: 30,
          vy: 40 + Math.random() * 60,
        });
        spawnTimer = 0;
      }

      for (const b of blocks) {
        b.y += b.vy * dt;
      }
      for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i]!.y > H + 20) blocks.splice(i, 1);
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
      ctx.textAlign = "center";
      ctx.fillStyle = c.dim;
      ctx.fillText("Free block proposals", W / 2, 18);

      // Draw spam blocks
      for (const b of blocks) {
        ctx.fillStyle = c.bad;
        ctx.fillRect(b.x - 10, b.y - 8, 20, 16);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText("blk", b.x, b.y + 3);
      }

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.bad;
      ctx.textAlign = "center";
      ctx.fillText("Anyone can flood the network", W / 2, H - 30);
      ctx.fillText("No cost = unlimited spam", W / 2, H - 15);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="No cost to propose blocks" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Proof of Work (energy-costly mining)                               */
/* ------------------------------------------------------------------ */

export function PowEnergyCost() {
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
      ctx.fillText("Proof of Work mining", W / 2, 18);

      // Mining animation
      const miningProgress = Math.min(t / 3, 1);
      const nonceCount = Math.floor(miningProgress * 1000000);

      // Energy meter
      const meterX = 40;
      const meterW = W - 80;
      const meterY = 50;
      const meterH = 20;

      ctx.strokeStyle = c.dim;
      ctx.lineWidth = 1;
      ctx.strokeRect(meterX, meterY, meterW, meterH);
      ctx.fillStyle = c.energy;
      ctx.fillRect(meterX, meterY, meterW * miningProgress, meterH);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Energy consumed", W / 2, meterY - 5);

      // Nonce counter
      ctx.font = "10px monospace";
      ctx.fillStyle = c.energy;
      ctx.fillText(
        `Nonce: ${nonceCount.toLocaleString()}`,
        W / 2,
        meterY + meterH + 20,
      );

      // Hash attempts
      if (t > 1) {
        ctx.font = "8px monospace";
        ctx.fillStyle = c.dim;
        ctx.textAlign = "left";
        const hashes = [
          "0x7f3a... (invalid)",
          "0x8b2c... (invalid)",
          "0x00004a1... (VALID!)",
        ];
        const visibleHashes = Math.min(
          Math.floor((t - 1) / 0.6),
          hashes.length,
        );
        for (let i = 0; i < visibleHashes; i++) {
          ctx.fillStyle = i === 2 ? c.good : c.dim;
          ctx.fillText(hashes[i]!, 50, 120 + i * 18);
        }
      }

      // Block found
      if (miningProgress >= 1) {
        ctx.fillStyle = c.block;
        ctx.fillRect(W / 2 - 30, 175, 60, 30);
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText("BLOCK", W / 2, 194);

        ctx.font = "9px monospace";
        ctx.fillStyle = c.good;
        ctx.fillText("Real energy spent = real cost to cheat", W / 2, H - 10);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Energy-costly block production"
      canvasRef={canvasRef}
    />
  );
}
