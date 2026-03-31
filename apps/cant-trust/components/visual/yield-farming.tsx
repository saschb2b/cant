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
  safe: string;
  danger: string;
  yield: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    safe: isDark ? "#4ade80" : "#16a34a",
    danger: isDark ? "#f87171" : "#dc2626",
    yield: isDark ? "#fbbf24" : "#d97706",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Simple Staking                                                     */
/* ------------------------------------------------------------------ */

export function SimpleStaking() {
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
      ctx.fillText("Simple staking", W / 2, 14);

      // Single protocol box
      const bx = 80;
      const by = 40;
      const bw = 160;
      const bh = 70;
      ctx.fillStyle = c.block;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = c.blockStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Protocol A", bx + bw / 2, by + 20);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Audited, established", bx + bw / 2, by + 35);
      ctx.fillText("Single risk layer", bx + bw / 2, by + 48);

      // Yield bar growing steadily
      const yieldBarY = 130;
      const maxBarW = 200;
      const progress = (elapsed % 10) / 10;
      const barW = progress * maxBarW;

      ctx.fillStyle = c.block;
      ctx.fillRect(60, yieldBarY, maxBarW, 20);
      ctx.strokeStyle = c.blockStroke;
      ctx.strokeRect(60, yieldBarY, maxBarW, 20);

      ctx.fillStyle = c.safe;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(60, yieldBarY, barW, 20);
      ctx.globalAlpha = 1;

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("Yield", 62, yieldBarY + 14);

      // APY
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.safe;
      ctx.textAlign = "center";
      ctx.fillText("5-8% APY", W / 2, yieldBarY + 50);

      // Risk assessment
      ctx.font = "9px monospace";
      ctx.fillStyle = c.safe;
      ctx.fillText("One risk layer: contract risk", W / 2, 195);

      ctx.fillStyle = c.dimText;
      ctx.fillText("Steady, predictable returns", W / 2, 215);
      ctx.fillText("Lower yield, lower risk", W / 2, 230);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Simple staking" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Yield Farm Stack                                                   */
/* ------------------------------------------------------------------ */

export function YieldFarmStack() {
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

    const risks = [
      "Smart contract risk",
      "Oracle risk",
      "Impermanent loss",
      "Token emission dilution",
      "Rug pull potential",
    ];

    let toppleStart = -1;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      // Trigger topple every 8 seconds
      const cycle = elapsed % 12;
      if (cycle > 6 && toppleStart < 0) {
        toppleStart = elapsed;
      }
      if (cycle < 1) {
        toppleStart = -1;
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
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Yield farm stack", W / 2, 14);

      // Stack of risk blocks (dominoes)
      const blockW = 180;
      const blockH = 26;
      const startY = 30;

      for (let i = 0; i < risks.length; i++) {
        const y = startY + i * (blockH + 4);
        let tilt = 0;

        if (toppleStart > 0) {
          const toppleElapsed = elapsed - toppleStart;
          const delay = (risks.length - 1 - i) * 0.3;
          if (toppleElapsed > delay) {
            tilt = Math.min(15, (toppleElapsed - delay) * 20);
          }
        }

        ctx.save();
        const cx = W / 2;
        const cy = y + blockH / 2;
        ctx.translate(cx, cy);
        ctx.rotate((tilt * Math.PI) / 180);

        // Block color gets more red toward top
        const danger = i / (risks.length - 1);
        ctx.fillStyle = i < 2 ? c.yield : c.danger;
        ctx.globalAlpha = 0.3 + danger * 0.4;
        ctx.fillRect(-blockW / 2, -blockH / 2, blockW, blockH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.blockStroke;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-blockW / 2, -blockH / 2, blockW, blockH);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(risks[i], 0, 4);

        ctx.restore();
      }

      // APY label
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("5,000% APY", W / 2, 186);

      // Warning
      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText("Tower of compounding risk", W / 2, 206);
      ctx.fillStyle = c.dimText;
      ctx.fillText("Higher yield, each layer can fail", W / 2, 222);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Yield farm stack" canvasRef={canvasRef} />;
}
