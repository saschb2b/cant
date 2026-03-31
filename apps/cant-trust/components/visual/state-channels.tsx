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
  onchain: string;
  offchain: string;
  block: string;
  blockStroke: string;
  expensive: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    onchain: isDark ? "#f87171" : "#dc2626",
    offchain: isDark ? "#4ade80" : "#16a34a",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
    expensive: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Every Tx On Chain                                                  */
/* ------------------------------------------------------------------ */

export function EveryTxOnChain() {
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
      ctx.fillText("Every tx on-chain", W / 2, 14);

      // Blockchain blocks
      const blockCount = Math.min(8, Math.floor(elapsed * 1.5) + 1);
      const blockW = 30;
      const blockH = 25;
      const startX = 20;
      const chainY = 50;

      for (let i = 0; i < blockCount; i++) {
        const x = startX + i * (blockW + 6);
        ctx.fillStyle = c.block;
        ctx.fillRect(x, chainY, blockW, blockH);
        ctx.strokeStyle = c.onchain;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, chainY, blockW, blockH);

        ctx.font = "7px monospace";
        ctx.fillStyle = c.onchain;
        ctx.textAlign = "center";
        ctx.fillText(`tx${i + 1}`, x + blockW / 2, chainY + 15);

        // Chain link
        if (i > 0) {
          ctx.strokeStyle = c.blockStroke;
          ctx.beginPath();
          ctx.moveTo(x - 6, chainY + blockH / 2);
          ctx.lineTo(x, chainY + blockH / 2);
          ctx.stroke();
        }
      }

      // Counter
      const txCount = Math.min(100, Math.floor(elapsed * 8));
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.onchain;
      ctx.textAlign = "center";
      ctx.fillText(`${txCount}/100 on-chain writes`, W / 2, 105);

      // Cost
      const cost = txCount * 0.5;
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.expensive;
      ctx.fillText(`Total fees: $${cost.toFixed(0)}`, W / 2, 125);

      // Each tx arrow pointing to chain
      const arrowCount = Math.min(6, Math.floor(elapsed));
      for (let i = 0; i < arrowCount; i++) {
        const x = 40 + i * 45;
        ctx.strokeStyle = c.onchain;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 140);
        ctx.lineTo(x, chainY + blockH + 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 3, chainY + blockH + 10);
        ctx.lineTo(x, chainY + blockH + 5);
        ctx.lineTo(x + 3, chainY + blockH + 10);
        ctx.fillStyle = c.onchain;
        ctx.fill();
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("100 transactions = 100 on-chain writes", W / 2, 165);
      ctx.fillText("Each write costs gas/fees", W / 2, 181);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.expensive;
      ctx.fillText("Expensive and slow", W / 2, 205);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Every tx on-chain" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Channel Open Close                                                 */
/* ------------------------------------------------------------------ */

export function ChannelOpenClose() {
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
      ctx.fillText("State channel", W / 2, 14);

      // Open channel (on-chain tx 1)
      const openX = 30;
      const openY = 35;
      ctx.fillStyle = c.block;
      ctx.fillRect(openX, openY, 70, 30);
      ctx.strokeStyle = c.onchain;
      ctx.lineWidth = 2;
      ctx.strokeRect(openX, openY, 70, 30);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.onchain;
      ctx.textAlign = "center";
      ctx.fillText("Open", openX + 35, openY + 13);
      ctx.fillText("(on-chain)", openX + 35, openY + 24);

      // Off-chain transactions (animated arrows)
      const channelY = 90;
      const channelH = 70;

      ctx.fillStyle = c.offchain;
      ctx.globalAlpha = 0.08;
      ctx.fillRect(30, channelY, 260, channelH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.offchain;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(30, channelY, 260, channelH);
      ctx.setLineDash([]);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.offchain;
      ctx.textAlign = "center";
      ctx.fillText("OFF-CHAIN CHANNEL", W / 2, channelY + 14);

      // Animated off-chain txs
      const offchainCount = Math.min(100, Math.floor(elapsed * 12));
      const arrowCount = 6;
      for (let i = 0; i < arrowCount; i++) {
        const phase = (elapsed * 2 + i * 0.5) % 3;
        const ax = 50 + (phase / 3) * 220;
        const ay = channelY + 25 + (i % 3) * 16;
        ctx.fillStyle = c.offchain;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax + 8, ay + 3);
        ctx.lineTo(ax, ay + 6);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.offchain;
      ctx.fillText(
        `${offchainCount} txs (free, instant)`,
        W / 2,
        channelY + channelH - 8,
      );

      // Close channel (on-chain tx 2)
      const closeX = 220;
      const closeY = 35;
      ctx.fillStyle = c.block;
      ctx.fillRect(closeX, closeY, 70, 30);
      ctx.strokeStyle = c.onchain;
      ctx.lineWidth = 2;
      ctx.strokeRect(closeX, closeY, 70, 30);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.onchain;
      ctx.textAlign = "center";
      ctx.fillText("Close", closeX + 35, closeY + 13);
      ctx.fillText("(on-chain)", closeX + 35, closeY + 24);

      // Arrow from open to channel
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(openX + 35, openY + 30);
      ctx.lineTo(openX + 35, channelY);
      ctx.stroke();

      // Arrow from channel to close
      ctx.beginPath();
      ctx.moveTo(closeX + 35, channelY);
      ctx.lineTo(closeX + 35, closeY + 30);
      ctx.stroke();

      // Summary
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("2 on-chain writes for 100 trades", W / 2, 185);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Open channel + close channel only", W / 2, 203);
      ctx.fillText("Hydra (Cardano), Lightning (Bitcoin)", W / 2, 219);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="State channel" canvasRef={canvasRef} />;
}
