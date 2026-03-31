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
  green: string;
  red: string;
  line: string;
  risk: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    green: isDark ? "#4ade80" : "#16a34a",
    red: isDark ? "#f87171" : "#dc2626",
    line: isDark ? "#555" : "#aaa",
    risk: isDark ? "rgba(248,113,113,0.15)" : "rgba(220,38,38,0.1)",
  };
}

/* ------------------------------------------------------------------ */
/*  T+2 settlement (slow, with counterparty risk window)               */
/* ------------------------------------------------------------------ */

export function SettlementT2() {
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

      // Title
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dim;
      ctx.fillText("T+2 settlement", W / 2, 18);

      // Timeline
      const lineY = 120;
      const x0 = 40;
      const x2 = W - 40;
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, lineY);
      ctx.lineTo(x2, lineY);
      ctx.stroke();

      // Day markers
      const days = ["Day 0", "Day 1", "Day 2"];
      for (let i = 0; i < 3; i++) {
        const dx = x0 + (i / 2) * (x2 - x0);
        ctx.beginPath();
        ctx.moveTo(dx, lineY - 6);
        ctx.lineTo(dx, lineY + 6);
        ctx.stroke();
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(days[i]!, dx, lineY + 20);
      }

      // Risk window
      const riskStart = x0;
      const riskEnd = x2;
      ctx.fillStyle = c.risk;
      ctx.fillRect(riskStart, lineY - 40, riskEnd - riskStart, 35);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.red;
      ctx.textAlign = "center";
      ctx.fillText("Counterparty risk window", W / 2, lineY - 28);

      // Animated progress dot
      const progress = Math.min(t / (CYCLE * 0.8), 1);
      const dotX = x0 + progress * (x2 - x0);
      ctx.beginPath();
      ctx.arc(dotX, lineY, 6, 0, Math.PI * 2);
      ctx.fillStyle = progress < 1 ? c.red : c.green;
      ctx.fill();

      // Status
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      if (progress < 1) {
        ctx.fillStyle = c.red;
        ctx.fillText("PENDING...", W / 2, lineY + 50);
      } else {
        ctx.fillStyle = c.green;
        ctx.fillText("SETTLED", W / 2, lineY + 50);
      }

      // Buyer/Seller
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dim;
      ctx.textAlign = "left";
      ctx.fillText("Buyer", x0, H - 20);
      ctx.textAlign = "right";
      ctx.fillText("Seller", x2, H - 20);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="T+2 delayed settlement" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  T+0 settlement (instant, no risk window)                           */
/* ------------------------------------------------------------------ */

export function SettlementT0() {
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
    const CYCLE = 3;

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

      // Title
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dim;
      ctx.fillText("T+0 settlement", W / 2, 18);

      // Timeline
      const lineY = 120;
      const x0 = 40;
      const x2 = W - 40;
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, lineY);
      ctx.lineTo(x2, lineY);
      ctx.stroke();

      // Single marker
      ctx.beginPath();
      ctx.moveTo(x0, lineY - 6);
      ctx.lineTo(x0, lineY + 6);
      ctx.stroke();
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Now", x0, lineY + 20);

      // Instant flash
      const settled = t > 0.5;
      if (settled) {
        // Green zone
        ctx.fillStyle = isDark
          ? "rgba(74,222,128,0.1)"
          : "rgba(22,163,74,0.08)";
        ctx.fillRect(x0, lineY - 40, x2 - x0, 35);
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.green;
        ctx.textAlign = "center";
        ctx.fillText("No counterparty risk", W / 2, lineY - 28);
      }

      // Dot at start, instantly moves to end
      const dotX = settled ? x0 + 20 : x0;
      ctx.beginPath();
      ctx.arc(dotX, lineY, 6, 0, Math.PI * 2);
      ctx.fillStyle = c.green;
      ctx.fill();

      // Checkmark
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      if (settled) {
        ctx.fillStyle = c.green;
        ctx.fillText("SETTLED INSTANTLY", W / 2, lineY + 50);

        // Flash ring
        const flash = Math.max(0, 1 - (t - 0.5) / 1);
        if (flash > 0) {
          ctx.globalAlpha = flash * 0.6;
          ctx.beginPath();
          ctx.arc(x0 + 20, lineY, 15, 0, Math.PI * 2);
          ctx.strokeStyle = c.green;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Buyer/Seller
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dim;
      ctx.textAlign = "left";
      ctx.fillText("Buyer", x0, H - 20);
      ctx.textAlign = "right";
      ctx.fillText("Seller", x2, H - 20);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="T+0 instant settlement" canvasRef={canvasRef} />
  );
}
