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
  chainA: string;
  chainB: string;
  unified: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    chainA: isDark ? "#f87171" : "#dc2626",
    chainB: isDark ? "#60a5fa" : "#2563eb",
    unified: isDark ? "#4ade80" : "#16a34a",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Hard Fork                                                          */
/* ------------------------------------------------------------------ */

export function HardFork() {
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
      ctx.fillText("Hard fork: chain splits", W / 2, 14);

      // Common chain before fork
      const forkX = 120;
      const chainY = 80;

      // Pre-fork blocks
      for (let i = 0; i < 3; i++) {
        const x = 20 + i * 38;
        ctx.fillStyle = c.block;
        ctx.fillRect(x, chainY, 30, 22);
        ctx.strokeStyle = c.blockStroke;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, chainY, 30, 22);

        if (i > 0) {
          ctx.strokeStyle = c.blockStroke;
          ctx.beginPath();
          ctx.moveTo(x - 8, chainY + 11);
          ctx.lineTo(x, chainY + 11);
          ctx.stroke();
        }
      }

      // Fork point
      ctx.fillStyle = c.accent;
      ctx.beginPath();
      ctx.arc(forkX, chainY + 11, 5, 0, Math.PI * 2);
      ctx.fill();

      // Chain A (upper fork) - animated growing
      const growA = Math.min(1, (elapsed - 1) * 0.4);
      if (growA > 0) {
        for (let i = 0; i < 3; i++) {
          const progress = Math.min(1, growA * 3 - i);
          if (progress <= 0) break;
          const x = forkX + 20 + i * 38;
          const y = chainY - 35;
          ctx.fillStyle = c.chainA;
          ctx.globalAlpha = progress * 0.3;
          ctx.fillRect(x, y, 30, 22);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = c.chainA;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, 30, 22);

          if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(forkX, chainY + 11);
            ctx.lineTo(x, y + 11);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(x - 8, y + 11);
            ctx.lineTo(x, y + 11);
            ctx.stroke();
          }
        }
        ctx.font = "8px monospace";
        ctx.fillStyle = c.chainA;
        ctx.textAlign = "left";
        ctx.fillText("Chain A (v2.0)", forkX + 20, chainY - 42);
      }

      // Chain B (lower fork) - animated growing
      const growB = Math.min(1, (elapsed - 1.5) * 0.4);
      if (growB > 0) {
        for (let i = 0; i < 3; i++) {
          const progress = Math.min(1, growB * 3 - i);
          if (progress <= 0) break;
          const x = forkX + 20 + i * 38;
          const y = chainY + 35;
          ctx.fillStyle = c.chainB;
          ctx.globalAlpha = progress * 0.3;
          ctx.fillRect(x, y, 30, 22);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = c.chainB;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, 30, 22);

          if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(forkX, chainY + 11);
            ctx.lineTo(x, y + 11);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(x - 8, y + 11);
            ctx.lineTo(x, y + 11);
            ctx.stroke();
          }
        }
        ctx.font = "8px monospace";
        ctx.fillStyle = c.chainB;
        ctx.textAlign = "left";
        ctx.fillText("Chain B (v1.0)", forkX + 20, chainY + 65);
      }

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Two separate chains persist", W / 2, 165);
      ctx.fillText("Community divided, tokens split", W / 2, 181);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("Bitcoin vs Bitcoin Cash (2017)", W / 2, 205);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Everyone must agree or chain splits", W / 2, 225);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Hard fork: chain splits" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Soft Fork (Hard Fork Combinator)                                   */
/* ------------------------------------------------------------------ */

export function SoftFork() {
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
      ctx.fillText("Hard fork combinator", W / 2, 14);

      // Single chain, continuous
      const chainY = 60;
      const blockCount = 8;
      const upgradeBlock = 4;

      for (let i = 0; i < blockCount; i++) {
        const x = 15 + i * 37;
        const isNew = i >= upgradeBlock;
        const progress = Math.min(1, (elapsed - i * 0.3) * 2);
        if (progress <= 0) continue;

        ctx.fillStyle = isNew ? c.unified : c.block;
        ctx.globalAlpha = isNew ? 0.3 : 1;
        ctx.fillRect(x, chainY, 30, 22);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isNew ? c.unified : c.blockStroke;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, chainY, 30, 22);

        ctx.font = "7px monospace";
        ctx.fillStyle = isNew ? c.unified : c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(isNew ? "v2" : "v1", x + 15, chainY + 14);

        if (i > 0) {
          ctx.strokeStyle = c.blockStroke;
          ctx.beginPath();
          ctx.moveTo(x - 7, chainY + 11);
          ctx.lineTo(x, chainY + 11);
          ctx.stroke();
        }
      }

      // Upgrade boundary marker
      const boundaryX = 15 + upgradeBlock * 37 - 4;
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(boundaryX, chainY - 10);
      ctx.lineTo(boundaryX, chainY + 35);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "7px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("upgrade", boundaryX, chainY + 45);

      // SPO readiness signals
      const signalY = 110;
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("SPO readiness signals:", W / 2, signalY);

      const spoCount = 5;
      const readyCount = Math.min(spoCount, Math.floor(elapsed * 0.7));
      for (let i = 0; i < spoCount; i++) {
        const x = 60 + i * 45;
        const ready = i < readyCount;
        ctx.fillStyle = ready ? c.unified : c.block;
        ctx.beginPath();
        ctx.arc(x, signalY + 18, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "7px monospace";
        ctx.fillStyle = ready ? c.bg : c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(ready ? "OK" : "...", x, signalY + 21);
      }

      // Labels
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.unified;
      ctx.textAlign = "center";
      ctx.fillText("One chain continues forward", W / 2, 160);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("No split, nodes auto-upgrade", W / 2, 180);
      ctx.fillText("Protocol manages the transition", W / 2, 196);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.unified;
      ctx.fillText("Smooth upgrade, community intact", W / 2, 220);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Hard fork combinator" canvasRef={canvasRef} />
  );
}
