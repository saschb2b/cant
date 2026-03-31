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
  bid: string;
  ask: string;
  curve: string;
  dot: string;
  gap: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    bid: isDark ? "#4ade80" : "#16a34a",
    ask: isDark ? "#f87171" : "#dc2626",
    curve: isDark ? "#60a5fa" : "#2563eb",
    dot: isDark ? "#fbbf24" : "#d97706",
    gap: isDark ? "#444" : "#ccc",
  };
}

/* ------------------------------------------------------------------ */
/*  Order Book Trading                                                 */
/* ------------------------------------------------------------------ */

export function OrderBookTrading() {
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

    const bids = [99.5, 99.0, 98.5, 97.0, 96.0];
    const asks = [100.5, 101.0, 101.5, 103.0, 104.5];
    const bidSizes = [10, 25, 40, 15, 5];
    const askSizes = [5, 15, 20, 8, 3];

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
      ctx.fillText("Order book exchange", W / 2, 14);

      // Column headers
      const leftX = 40;
      const rightX = 200;
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.bid;
      ctx.textAlign = "center";
      ctx.fillText("BID", leftX + 50, 32);
      ctx.fillStyle = c.ask;
      ctx.fillText("ASK", rightX + 50, 32);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Price  Qty", leftX + 50, 44);
      ctx.fillText("Price  Qty", rightX + 50, 44);

      // Bids
      const blinkIdx = Math.floor(elapsed * 2) % bids.length;
      for (let i = 0; i < bids.length; i++) {
        const y = 56 + i * 16;
        const isGap = i === 3;
        ctx.fillStyle = isGap ? c.gap : c.bid;
        ctx.globalAlpha =
          i === blinkIdx ? 0.5 + 0.5 * Math.sin(elapsed * 6) : 1;
        ctx.textAlign = "right";
        ctx.fillText(`$${bids[i].toFixed(1)}`, leftX + 55, y);
        ctx.textAlign = "left";
        ctx.fillText(`${bidSizes[i]}`, leftX + 62, y);
        if (isGap) {
          ctx.fillStyle = c.gap;
          ctx.textAlign = "center";
          ctx.fillText("gap", leftX + 50, y + 12);
        }
        ctx.globalAlpha = 1;
      }

      // Asks
      for (let i = 0; i < asks.length; i++) {
        const y = 56 + i * 16;
        const isGap = i === 3;
        ctx.fillStyle = isGap ? c.gap : c.ask;
        ctx.textAlign = "right";
        ctx.fillText(`$${asks[i].toFixed(1)}`, rightX + 55, y);
        ctx.textAlign = "left";
        ctx.fillText(`${askSizes[i]}`, rightX + 62, y);
        if (isGap) {
          ctx.fillStyle = c.gap;
          ctx.textAlign = "center";
          ctx.fillText("gap", rightX + 50, y + 12);
        }
      }

      // Spread indicator
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("Spread: $1.00", W / 2, 160);

      // Bottom label
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Requires active market makers", W / 2, 185);
      ctx.fillText("Gaps where no orders exist", W / 2, 200);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Order book exchange" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  AMM Curve                                                          */
/* ------------------------------------------------------------------ */

export function AmmCurve() {
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
      ctx.fillText("Automated Market Maker", W / 2, 14);

      // Draw axes
      const ox = 60;
      const oy = 190;
      const axW = 210;
      const axH = 150;

      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox, oy - axH);
      ctx.lineTo(ox, oy);
      ctx.lineTo(ox + axW, oy);
      ctx.stroke();

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Token A", ox + axW / 2, oy + 14);
      ctx.save();
      ctx.translate(ox - 12, oy - axH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Token B", 0, 0);
      ctx.restore();

      // Draw x*y=k curve
      const k = 10000;
      ctx.strokeStyle = c.curve;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let first = true;
      for (let px = 15; px <= 200; px++) {
        const xVal = (px / 200) * 200;
        const yVal = k / (xVal + 50);
        const sx = ox + px;
        const sy = oy - (yVal / 200) * axH;
        if (sy < oy - axH) continue;
        if (first) {
          ctx.moveTo(sx, sy);
          first = false;
        } else {
          ctx.lineTo(sx, sy);
        }
      }
      ctx.stroke();

      // Animated dot sliding along curve
      const t = (Math.sin(elapsed * 0.8) + 1) / 2;
      const dotXVal = 30 + t * 150;
      const dotYVal = k / (dotXVal + 50);
      const dotSx = ox + (dotXVal / 200) * 200;
      const dotSy = oy - (dotYVal / 200) * axH;

      ctx.fillStyle = c.dot;
      ctx.beginPath();
      ctx.arc(dotSx, dotSy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Price label near dot
      const price = (dotYVal / dotXVal).toFixed(2);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.dot;
      ctx.textAlign = "left";
      ctx.fillText(`Price: ${price}`, dotSx + 10, dotSy - 5);

      // Formula
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("x * y = k", W / 2, 215);

      // Bottom labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Always liquid, algorithmically priced", W / 2, 232);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Automated Market Maker" canvasRef={canvasRef} />
  );
}
