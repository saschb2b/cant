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
  whale: string;
  small: string;
  drep: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    whale: isDark ? "#f87171" : "#dc2626",
    small: isDark ? "#60a5fa" : "#2563eb",
    drep: isDark ? "#4ade80" : "#16a34a",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Simple Majority                                                    */
/* ------------------------------------------------------------------ */

export function SimpleMajority() {
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
      ctx.fillText("1 token = 1 vote", W / 2, 14);

      // Whale
      ctx.fillStyle = c.whale;
      ctx.beginPath();
      ctx.arc(80, 60, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "7px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("Whale", 80, 57);
      ctx.fillText("1M tokens", 80, 67);

      // Small holders
      for (let i = 0; i < 5; i++) {
        const x = 170 + (i % 3) * 40;
        const y = 45 + Math.floor(i / 3) * 35;
        ctx.fillStyle = c.small;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "6px monospace";
        ctx.fillStyle = c.bg;
        ctx.textAlign = "center";
        ctx.fillText(`${50 + i * 20}`, x, y + 3);
      }

      // Vote power comparison
      const barY = 105;
      const maxBarW = 240;

      // Whale bar
      ctx.fillStyle = c.whale;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(40, barY, maxBarW * 0.99, 20);
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.whale;
      ctx.textAlign = "left";
      ctx.fillText("Whale: 99.98%", 45, barY + 14);

      // Small holders bar (tiny)
      ctx.fillStyle = c.small;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(40, barY + 26, maxBarW * 0.002 + 1, 20);
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.small;
      ctx.textAlign = "left";
      ctx.fillText("Others: 0.02%", 45, barY + 40);

      // Sybil attack warning
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.whale;
      ctx.textAlign = "center";
      ctx.fillText("Whale decides every proposal", W / 2, 175);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Small holders have no voice", W / 2, 195);
      ctx.fillText("Whale can also split into many wallets", W / 2, 211);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("Oligarchy, not democracy", W / 2, 231);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="1 token = 1 vote" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Stake Weighted Voting                                              */
/* ------------------------------------------------------------------ */

export function StakeWeightedVoting() {
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
      ctx.fillText("Delegated voting (DReps)", W / 2, 14);

      // Small holders delegating to DRep
      const holders = [
        { x: 40, y: 50 },
        { x: 40, y: 80 },
        { x: 40, y: 110 },
        { x: 40, y: 140 },
      ];

      for (const h of holders) {
        ctx.fillStyle = c.small;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 7, 0, Math.PI * 2);
        ctx.fill();

        // Delegation arrow
        ctx.strokeStyle = c.small;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(h.x + 8, h.y);
        ctx.lineTo(100, 95);
        ctx.stroke();
      }

      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("5000+", 40, 165);
      ctx.fillText("holders", 40, 175);

      // DRep (aggregator)
      ctx.fillStyle = c.drep;
      ctx.beginPath();
      ctx.arc(115, 95, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "7px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("DRep", 115, 93);
      ctx.fillText("X", 115, 102);

      // Whale
      ctx.fillStyle = c.whale;
      ctx.beginPath();
      ctx.arc(240, 55, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "7px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("Whale", 240, 53);
      ctx.fillText("1M", 240, 62);

      // Combined delegation bar vs whale
      const barY = 130;
      const combinedPct = 0.6;
      const whalePct = 0.4;

      // Animated growing
      const growth = Math.min(1, elapsed * 0.3);

      ctx.fillStyle = c.drep;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(40, barY, 200 * combinedPct * growth, 16);
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.drep;
      ctx.textAlign = "left";
      ctx.fillText(`DRep X: ${Math.floor(combinedPct * 100)}%`, 42, barY + 12);

      ctx.fillStyle = c.whale;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(40, barY + 22, 200 * whalePct * growth, 16);
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.whale;
      ctx.textAlign = "left";
      ctx.fillText(`Whale: ${Math.floor(whalePct * 100)}%`, 42, barY + 34);

      // Labels
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.drep;
      ctx.textAlign = "center";
      ctx.fillText("Delegation pools influence", W / 2, 190);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Delegation is revocable anytime", W / 2, 208);
      ctx.fillText("Liquid democracy: delegate or vote", W / 2, 224);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Delegated voting (DReps)" canvasRef={canvasRef} />
  );
}
