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
  provider: string;
  pool: string;
  poolStroke: string;
  warning: string;
  fee: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    provider: isDark ? "#60a5fa" : "#2563eb",
    pool: isDark ? "#334155" : "#e2e8f0",
    poolStroke: isDark ? "#64748b" : "#94a3b8",
    warning: isDark ? "#f87171" : "#dc2626",
    fee: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Single-Sided Liquidity                                             */
/* ------------------------------------------------------------------ */

export function SingleSidedLiquidity() {
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
      ctx.fillText("Single provider", W / 2, 14);

      // Single person icon
      const px = W / 2;
      const py = 50;
      ctx.fillStyle = c.provider;
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("LP", px, py + 4);

      // Arrow down to pool
      ctx.strokeStyle = c.provider;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, py + 14);
      ctx.lineTo(px, 90);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px - 4, 86);
      ctx.lineTo(px, 92);
      ctx.lineTo(px + 4, 86);
      ctx.fillStyle = c.provider;
      ctx.fill();

      // Pool (thin)
      const poolY = 95;
      const poolW = 80;
      const poolH = 60;
      ctx.fillStyle = c.pool;
      ctx.fillRect(px - poolW / 2, poolY, poolW, poolH);
      ctx.strokeStyle = c.poolStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(px - poolW / 2, poolY, poolW, poolH);

      // Thin liquidity bar
      const liqH = 15 + 5 * Math.sin(elapsed * 2);
      ctx.fillStyle = c.provider;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(
        px - poolW / 2 + 8,
        poolY + poolH - liqH - 5,
        poolW - 16,
        liqH,
      );
      ctx.globalAlpha = 1;

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("POOL", px, poolY + 14);
      ctx.fillStyle = c.warning;
      ctx.fillText("Thin", px, poolY + poolH - 2);

      // Risk concentrated label
      ctx.font = "9px monospace";
      ctx.fillStyle = c.warning;
      ctx.textAlign = "center";
      ctx.fillText("All risk on one provider", W / 2, 180);
      ctx.fillText("Thin liquidity, high slippage", W / 2, 196);

      // 100% risk indicator
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.warning;
      ctx.fillText("Risk: 100%", W / 2, 220);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Single provider" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Pooled Liquidity                                                   */
/* ------------------------------------------------------------------ */

export function PooledLiquidity() {
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
      ctx.fillText("Pooled liquidity", W / 2, 14);

      // Multiple provider icons
      const providers = [80, 140, 200, 240];
      for (let i = 0; i < providers.length; i++) {
        const x = providers[i];
        ctx.fillStyle = c.provider;
        ctx.beginPath();
        ctx.arc(x, 40, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText("LP", x, 43);

        // Arrow to pool
        ctx.strokeStyle = c.provider;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 50);
        ctx.lineTo(W / 2, 78);
        ctx.stroke();
      }

      // Pool (wide, deep)
      const poolX = 70;
      const poolY = 80;
      const poolW = 180;
      const poolH = 65;
      ctx.fillStyle = c.pool;
      ctx.fillRect(poolX, poolY, poolW, poolH);
      ctx.strokeStyle = c.poolStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(poolX, poolY, poolW, poolH);

      // Deep liquidity
      const liqH = 40 + 5 * Math.sin(elapsed * 1.5);
      ctx.fillStyle = c.provider;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(poolX + 8, poolY + poolH - liqH - 5, poolW - 16, liqH);
      ctx.globalAlpha = 1;

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("SHARED POOL", W / 2, poolY + 14);

      // Fees distributed
      ctx.fillStyle = c.fee;
      const feeY = poolY + poolH + 8;
      ctx.font = "9px monospace";
      ctx.fillText("Fees distributed proportionally", W / 2, feeY);

      // Impermanent loss indicator (animated price shift)
      const priceShift = Math.sin(elapsed * 0.6) * 20;
      const ilBarY = feeY + 18;
      ctx.fillStyle = c.dimText;
      ctx.font = "8px monospace";
      ctx.fillText("Price shift", W / 2, ilBarY);

      // IL bar
      const barX = 100;
      const barW = 120;
      ctx.fillStyle = c.pool;
      ctx.fillRect(barX, ilBarY + 4, barW, 10);
      ctx.strokeStyle = c.poolStroke;
      ctx.strokeRect(barX, ilBarY + 4, barW, 10);

      // Price indicator
      ctx.fillStyle = c.accent;
      ctx.fillRect(barX + barW / 2 + priceShift - 2, ilBarY + 4, 4, 10);

      // IL label
      const ilPct = Math.abs((priceShift / 20) * 5.7).toFixed(1);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.warning;
      ctx.fillText(`IL: ~${ilPct}%`, W / 2, ilBarY + 28);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Fees must exceed impermanent loss", W / 2, 232);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Pooled liquidity" canvasRef={canvasRef} />;
}
