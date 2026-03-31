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
  income: string;
  expense: string;
  savings: string;
  red: string;
  green: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    income: isDark ? "#4ade80" : "#16a34a",
    expense: isDark ? "#f87171" : "#dc2626",
    savings: isDark ? "#60a5fa" : "#3b82f6",
    red: isDark ? "#f87171" : "#dc2626",
    green: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  1950s: single income sufficient                                    */
/* ------------------------------------------------------------------ */

export function SingleIncomeSufficient() {
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

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("1950s household", W / 2, 18);

      // Income stream (one arrow)
      const incomeY = 45;
      ctx.fillStyle = c.income;
      ctx.fillRect(40, incomeY, 100, 16);
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("1 Income", 90, incomeY + 12);

      // Arrow to budget
      ctx.strokeStyle = c.income;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(140, incomeY + 8);
      ctx.lineTo(170, incomeY + 8);
      ctx.stroke();
      ctx.fillStyle = c.income;
      ctx.beginPath();
      ctx.moveTo(170, incomeY + 8);
      ctx.lineTo(165, incomeY + 3);
      ctx.lineTo(165, incomeY + 13);
      ctx.fill();

      // Budget breakdown bar
      const barX = 175;
      const barY = 38;
      const barW = 120;
      const barH = 30;
      const progress = Math.min(1, elapsed / 2);

      // Expenses portion (60%)
      ctx.fillStyle = c.expense;
      ctx.fillRect(barX, barY, barW * 0.6 * progress, barH);
      // Savings portion (40%)
      ctx.fillStyle = c.savings;
      ctx.fillRect(
        barX + barW * 0.6 * progress,
        barY,
        barW * 0.4 * progress,
        barH,
      );

      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barW, barH);

      if (progress > 0.5) {
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText("60%", barX + barW * 0.3, barY + barH + 10);
        ctx.fillText("40%", barX + barW * 0.8, barY + barH + 10);
        ctx.fillText("Expenses", barX + barW * 0.3, barY + barH + 20);
        ctx.fillText("Savings", barX + barW * 0.8, barY + barH + 20);
      }

      // Savings meter
      const meterX = W / 2 - 40;
      const meterY = 115;
      const meterW = 80;
      const meterH = 60;
      const savingsLevel = Math.min(1, (elapsed % 6) / 4);

      ctx.strokeStyle = c.savings;
      ctx.lineWidth = 2;
      ctx.strokeRect(meterX, meterY, meterW, meterH);

      ctx.fillStyle = c.savings;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(
        meterX,
        meterY + meterH * (1 - savingsLevel),
        meterW,
        meterH * savingsLevel,
      );
      ctx.globalAlpha = 1;

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.savings;
      ctx.textAlign = "center";
      ctx.fillText("SAVINGS", W / 2, meterY + meterH / 2 + 4);

      ctx.font = "bold 12px monospace";
      ctx.fillText(
        Math.round(savingsLevel * 100) + "%",
        W / 2,
        meterY + meterH / 2 + 18,
      );

      if (elapsed > 2.5) {
        const a = Math.min(1, (elapsed - 2.5) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.green;
        ctx.textAlign = "center";
        ctx.fillText("One earner supports entire household", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Single income era" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Today: dual income barely covers expenses                          */
/* ------------------------------------------------------------------ */

export function DualIncomeRequired() {
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

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("2024 household", W / 2, 18);

      // Two income streams
      const incomeY1 = 35;
      const incomeY2 = 55;
      ctx.fillStyle = c.income;
      ctx.fillRect(20, incomeY1, 70, 14);
      ctx.fillRect(20, incomeY2, 70, 14);
      ctx.font = "bold 7px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Income 1", 55, incomeY1 + 10);
      ctx.fillText("Income 2", 55, incomeY2 + 10);

      // Arrows merging
      ctx.strokeStyle = c.income;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(90, incomeY1 + 7);
      ctx.lineTo(120, 50);
      ctx.moveTo(90, incomeY2 + 7);
      ctx.lineTo(120, 50);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(120, 50);
      ctx.lineTo(150, 50);
      ctx.stroke();

      // Budget breakdown bar
      const barX = 155;
      const barY = 38;
      const barW = 140;
      const barH = 28;
      const progress = Math.min(1, elapsed / 2);

      // Expenses take almost everything (92%)
      ctx.fillStyle = c.expense;
      ctx.fillRect(barX, barY, barW * 0.92 * progress, barH);
      // Tiny savings (8%)
      ctx.fillStyle = c.savings;
      ctx.fillRect(
        barX + barW * 0.92 * progress,
        barY,
        barW * 0.08 * progress,
        barH,
      );

      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barW, barH);

      if (progress > 0.5) {
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText("92%", barX + barW * 0.46, barY + barH + 10);
        ctx.fillText("8%", barX + barW * 0.96, barY + barH + 10);
        ctx.fillText("Expenses", barX + barW * 0.46, barY + barH + 20);
        ctx.fillText("Sav", barX + barW * 0.96, barY + barH + 20);
      }

      // Savings meter (nearly empty)
      const meterX = W / 2 - 40;
      const meterY = 115;
      const meterW = 80;
      const meterH = 60;
      const savingsLevel = Math.min(0.08, (elapsed % 8) / 80);

      ctx.strokeStyle = c.red;
      ctx.lineWidth = 2;
      ctx.strokeRect(meterX, meterY, meterW, meterH);

      ctx.fillStyle = c.red;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(
        meterX,
        meterY + meterH * (1 - savingsLevel),
        meterW,
        meterH * savingsLevel,
      );
      ctx.globalAlpha = 1;

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.red;
      ctx.textAlign = "center";
      ctx.fillText("SAVINGS", W / 2, meterY + meterH / 2 + 4);

      ctx.font = "bold 12px monospace";
      ctx.fillText(
        Math.round(savingsLevel * 100) + "%",
        W / 2,
        meterY + meterH / 2 + 18,
      );

      // Blinking warning
      if (elapsed > 2 && Math.floor(elapsed * 2) % 2 === 0) {
        ctx.font = "bold 8px monospace";
        ctx.fillStyle = c.red;
        ctx.fillText("LOW", W / 2, meterY - 5);
      }

      if (elapsed > 2.5) {
        const a = Math.min(1, (elapsed - 2.5) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.red;
        ctx.textAlign = "center";
        ctx.fillText("Two earners, barely breaking even", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Dual income era" canvasRef={canvasRef} />;
}
