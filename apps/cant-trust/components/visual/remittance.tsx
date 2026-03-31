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
  good: string;
  bad: string;
  bar: string;
  barBad: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    good: isDark ? "#4ade80" : "#16a34a",
    bad: isDark ? "#f87171" : "#dc2626",
    bar: isDark ? "#4ade80" : "#16a34a",
    barBad: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  High cost, slow corridor                                           */
/* ------------------------------------------------------------------ */

export function RemittanceExpensive() {
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
      ctx.fillText("Traditional remittance", W / 2, 18);

      // Send amount
      const sendAmt = 200;
      const feePercent = 9;
      const fee = sendAmt * (feePercent / 100);
      const received = sendAmt - fee;

      // Animated bar showing money eaten by fees
      const progress = Math.min(t / 2, 1);
      const barX = 40;
      const barW = W - 80;
      const barY = 70;
      const barH = 30;

      // Full bar (sent)
      ctx.fillStyle = c.barBad;
      ctx.fillRect(barX, barY, barW * progress, barH);

      // Fee chunk
      const feeW = barW * (feePercent / 100);
      if (progress > 0.5) {
        ctx.fillStyle = isDark ? "#991b1b" : "#fca5a5";
        ctx.fillRect(barX + barW - feeW, barY, feeW, barH);
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText("FEE", barX + barW - feeW / 2, barY + barH / 2 + 3);
      }

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText(`Sent: $${sendAmt}`, barX, barY - 8);
      ctx.textAlign = "right";
      ctx.fillText(`Received: $${received.toFixed(0)}`, barX + barW, barY - 8);

      // Stats
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.bad;
      ctx.fillText(`${feePercent}% fees`, W / 2, barY + barH + 25);

      // Time
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dim;
      const days = Math.min(Math.floor((t / CYCLE) * 5), 5);
      ctx.fillText(
        `Delivery: ${days < 5 ? "processing..." : "3-5 days"}`,
        W / 2,
        barY + barH + 42,
      );

      // Family impact
      if (t > 3) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.bad;
        ctx.textAlign = "center";
        ctx.fillText(
          `$${fee.toFixed(0)} lost to intermediaries`,
          W / 2,
          H - 40,
        );
        ctx.fillText("On $200/month, that is $216/year lost", W / 2, H - 25);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="High-cost corridor" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Low cost, fast corridor                                            */
/* ------------------------------------------------------------------ */

export function RemittanceCheap() {
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
      ctx.fillText("Crypto remittance", W / 2, 18);

      const sendAmt = 200;
      const feePercent = 0.5;
      const fee = sendAmt * (feePercent / 100);
      const received = sendAmt - fee;

      const progress = Math.min(t / 1, 1);
      const barX = 40;
      const barW = W - 80;
      const barY = 70;
      const barH = 30;

      // Full bar (nearly all green)
      ctx.fillStyle = c.bar;
      ctx.fillRect(barX, barY, barW * progress, barH);

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText(`Sent: $${sendAmt}`, barX, barY - 8);
      ctx.textAlign = "right";
      ctx.fillText(`Received: $${received.toFixed(0)}`, barX + barW, barY - 8);

      // Stats
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.good;
      ctx.fillText(`${feePercent}% fees`, W / 2, barY + barH + 25);

      // Time
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dim;
      ctx.fillText(
        t > 1 ? "Delivery: minutes" : "Sending...",
        W / 2,
        barY + barH + 42,
      );

      // Savings
      if (t > 1.5) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.good;
        ctx.textAlign = "center";
        ctx.fillText(`Only $${fee.toFixed(0)} in fees`, W / 2, H - 40);
        ctx.fillText("$204 saved per year vs traditional", W / 2, H - 25);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Low-cost crypto corridor" canvasRef={canvasRef} />
  );
}
