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
  bar: string;
  barStroke: string;
  flow: string;
  accent: string;
  danger: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    bar: isDark ? "#334155" : "#e2e8f0",
    barStroke: isDark ? "#64748b" : "#94a3b8",
    flow: isDark ? "#f87171" : "#dc2626",
    accent: isDark ? "#f7931a" : "#c28a1a",
    danger: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  Low Stock-to-Flow (Fiat)                                           */
/* ------------------------------------------------------------------ */

export function LowStockToFlow() {
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
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Low stock-to-flow (Fiat)", W / 2, 16);

      // Stock bar (existing supply)
      const barX = 60;
      const barBaseY = 190;
      const barW = 80;
      const stockH = 80;
      ctx.fillStyle = c.bar;
      ctx.fillRect(barX, barBaseY - stockH, barW, stockH);
      ctx.strokeStyle = c.barStroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barBaseY - stockH, barW, stockH);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Stock", barX + barW / 2, barBaseY - stockH - 6);

      // Flow bar (new supply, very large relative)
      const flowBarX = 180;
      const flowPulse = 50 + Math.sin(elapsed * 2) * 15;
      ctx.fillStyle = c.flow;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(flowBarX, barBaseY - flowPulse, barW, flowPulse);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.flow;
      ctx.strokeRect(flowBarX, barBaseY - flowPulse, barW, flowPulse);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.flow;
      ctx.textAlign = "center";
      ctx.fillText("New supply", flowBarX + barW / 2, barBaseY - flowPulse - 6);

      // Printer icon (animated)
      const printerAlpha = (Math.sin(elapsed * 4) + 1) / 2;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.flow;
      ctx.globalAlpha = 0.5 + printerAlpha * 0.5;
      ctx.fillText(
        "PRINTING...",
        flowBarX + barW / 2,
        barBaseY - flowPulse - 20,
      );
      ctx.globalAlpha = 1;

      // Ratio display
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("S2F ratio: ~5", W / 2, barBaseY + 20);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText("Easy to dilute", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Low stock-to-flow" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  High Stock-to-Flow (Bitcoin)                                       */
/* ------------------------------------------------------------------ */

export function HighStockToFlow() {
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
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("High stock-to-flow (Bitcoin)", W / 2, 16);

      // Stock bar (very tall)
      const barX = 60;
      const barBaseY = 190;
      const barW = 80;
      const stockH = 140;
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(barX, barBaseY - stockH, barW, stockH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barBaseY - stockH, barW, stockH);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("19.5M BTC", barX + barW / 2, barBaseY - stockH / 2 + 4);
      ctx.fillText("Stock", barX + barW / 2, barBaseY - stockH - 6);

      // Flow bar (tiny)
      const flowBarX = 180;
      const flowH = 8;
      ctx.fillStyle = c.flow;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(flowBarX, barBaseY - flowH, barW, flowH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.flow;
      ctx.strokeRect(flowBarX, barBaseY - flowH, barW, flowH);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.flow;
      ctx.textAlign = "center";
      ctx.fillText("Flow", flowBarX + barW / 2, barBaseY - flowH - 22);
      ctx.font = "8px monospace";
      ctx.fillText("164k BTC/yr", flowBarX + barW / 2, barBaseY - flowH - 10);

      // Comparison to Gold
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";

      // Draw mini gold bar for reference
      const goldX = flowBarX;
      const goldH = 22;
      ctx.strokeStyle = c.dimText;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(goldX, barBaseY - goldH - 30, barW, goldH);
      ctx.setLineDash([]);
      ctx.fillStyle = c.dimText;
      ctx.fillText("Gold S2F:~62", goldX + barW / 2, barBaseY - goldH - 34);

      // Ratio display
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("S2F ratio: ~119", W / 2, barBaseY + 20);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("Hard to dilute", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="High stock-to-flow" canvasRef={canvasRef} />;
}
