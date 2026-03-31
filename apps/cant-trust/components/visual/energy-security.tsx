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
  block: string;
  blockStroke: string;
  danger: string;
  energy: string;
  success: string;
  accent: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
    danger: isDark ? "#f87171" : "#dc2626",
    energy: isDark ? "#fbbf24" : "#d97706",
    success: isDark ? "#4ade80" : "#16a34a",
    accent: isDark ? "#f7931a" : "#c28a1a",
  };
}

/* ------------------------------------------------------------------ */
/*  Free Block Production                                              */
/* ------------------------------------------------------------------ */

export function FreeBlockProduction() {
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
    let blockCount = 0;
    let spawnTimer = 0;

    interface SpamBlock {
      x: number;
      y: number;
      fake: boolean;
      alpha: number;
    }

    const blocks: SpamBlock[] = [];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      spawnTimer += dt;

      if (spawnTimer > 0.4 && blocks.length < 20) {
        blockCount++;
        blocks.push({
          x: 20 + Math.random() * 280,
          y: 40 + Math.random() * 160,
          fake: Math.random() > 0.3,
          alpha: 1,
        });
        spawnTimer = 0;
      }

      if (blocks.length >= 20) {
        blocks.length = 0;
        blockCount = 0;
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
      ctx.fillStyle = c.dimText;
      ctx.fillText("Free block production", W / 2, 16);

      for (const b of blocks) {
        const bw = 30;
        const bh = 20;
        ctx.fillStyle = b.fake ? c.danger : c.block;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(b.x - bw / 2, b.y - bh / 2, bw, bh);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = b.fake ? c.danger : c.blockStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x - bw / 2, b.y - bh / 2, bw, bh);
        ctx.font = "6px monospace";
        ctx.fillStyle = b.fake ? c.danger : c.text;
        ctx.textAlign = "center";
        ctx.fillText(b.fake ? "FAKE" : "ok", b.x, b.y + 3);
      }

      // Cost indicator
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("Cost to produce: $0", W / 2, H - 26);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText("No barrier to spam or attack", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Free block production" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Energy-Backed Blocks                                               */
/* ------------------------------------------------------------------ */

export function EnergyBackedBlocks() {
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
    let blockTimer = 0;
    let blocksDone = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      blockTimer += dt;

      if (blockTimer > 2.5) {
        blockTimer = 0;
        blocksDone++;
        if (blocksDone > 5) blocksDone = 0;
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
      ctx.fillStyle = c.dimText;
      ctx.fillText("Energy-backed blocks", W / 2, 16);

      // Chain of blocks
      const blockW = 40;
      const blockH = 30;
      const chainY = 55;
      const shown = Math.min(blocksDone, 5);

      for (let i = 0; i < shown; i++) {
        const x = 30 + i * (blockW + 12);
        ctx.fillStyle = c.success;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x, chainY, blockW, blockH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.success;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, chainY, blockW, blockH);
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(`#${i + 1}`, x + blockW / 2, chainY + blockH / 2 + 3);

        if (i > 0) {
          ctx.strokeStyle = c.blockStroke;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x - 12, chainY + blockH / 2);
          ctx.lineTo(x, chainY + blockH / 2);
          ctx.stroke();
        }
      }

      // Energy cost per block (lightning bolt)
      if (shown > 0) {
        const lastX = 30 + (shown - 1) * (blockW + 12) + blockW / 2;

        // Lightning bolt
        const boltPulse = (Math.sin(elapsed * 6) + 1) / 2;
        ctx.fillStyle = c.energy;
        ctx.globalAlpha = 0.5 + boltPulse * 0.5;
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.fillText("\u26A1", lastX, chainY + blockH + 20);
        ctx.globalAlpha = 1;
      }

      // Attack cost bar
      const costBarX = 40;
      const costBarY = 120;
      const costBarW = 240;
      const costBarH = 20;

      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("Attack cost:", costBarX, costBarY - 6);

      ctx.fillStyle = c.danger;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(costBarX, costBarY, costBarW, costBarH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.danger;
      ctx.lineWidth = 1;
      ctx.strokeRect(costBarX, costBarY, costBarW, costBarH);

      // Fill representing cost
      const costFill = Math.min(1, (shown / 5) * 0.8 + 0.2);
      ctx.fillStyle = c.danger;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(costBarX, costBarY, costBarW * costFill, costBarH);
      ctx.globalAlpha = 1;

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText(
        "Billions in hardware + electricity",
        costBarX + costBarW / 2,
        costBarY + 14,
      );

      // Network energy
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText(
        "Must outspend entire network to attack",
        W / 2,
        costBarY + 40,
      );

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.energy;
      ctx.fillText("Energy = security", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Energy-backed blocks" canvasRef={canvasRef} />
  );
}
