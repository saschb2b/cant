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
  bank: string;
  bankStroke: string;
  deposit: string;
  loan: string;
  counter: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    bank: isDark ? "#334155" : "#e2e8f0",
    bankStroke: isDark ? "#64748b" : "#94a3b8",
    deposit: isDark ? "#4ade80" : "#16a34a",
    loan: isDark ? "#f87171" : "#dc2626",
    counter: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Single Deposit (no multiplication)                                 */
/* ------------------------------------------------------------------ */

export function SingleDeposit() {
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

      // Single bank
      const bx = 110;
      const by = 70;
      const bw = 100;
      const bh = 80;
      ctx.fillStyle = c.bank;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = c.bankStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("BANK", bx + bw / 2, by + 16);

      // $1000 inside (pulsing)
      const pulse = 0.7 + 0.3 * Math.sin(elapsed * 2);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = c.deposit;
      ctx.font = "bold 18px monospace";
      ctx.fillText("$1,000", bx + bw / 2, by + 50);
      ctx.globalAlpha = 1;

      // Total money counter
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.counter;
      ctx.fillText("Total money: $1,000", W / 2, by + bh + 40);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Deposit sits in vault", W / 2, by + bh + 58);
      ctx.fillText("No new money created", W / 2, by + bh + 72);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Single deposit", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Single deposit" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Money Multiplier (chain of lending)                                */
/* ------------------------------------------------------------------ */

export function MoneyMultiplier() {
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

    const chain = [
      { amount: 1000, lent: 900 },
      { amount: 900, lent: 810 },
      { amount: 810, lent: 729 },
      { amount: 729, lent: 656 },
    ];

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

      const cycle = elapsed % 10;
      const bankW = 60;
      const bankH = 40;
      const startX = 15;
      const bankY = 80;
      let totalMoney = 0;

      for (let i = 0; i < chain.length; i++) {
        const step = chain[i]!;
        const appearTime = i * 2;
        if (cycle < appearTime) break;

        const x = startX + i * 75;
        const progress = Math.min(1, (cycle - appearTime) / 1.0);

        // Bank box
        ctx.globalAlpha = progress;
        ctx.fillStyle = c.bank;
        ctx.fillRect(x, bankY, bankW, bankH);
        ctx.strokeStyle = c.bankStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, bankY, bankW, bankH);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(`Bank ${i + 1}`, x + bankW / 2, bankY + 12);

        // Amount deposited
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.deposit;
        ctx.fillText(`$${step.amount}`, x + bankW / 2, bankY + 28);

        totalMoney += step.amount;

        // Arrow to next bank
        if (i < chain.length - 1 && cycle > appearTime + 1) {
          const arrowProgress = Math.min(1, (cycle - appearTime - 1) / 0.8);
          const ax = x + bankW;
          const aEndX = ax + (75 - bankW) * arrowProgress;
          ctx.strokeStyle = c.loan;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ax, bankY + bankH / 2);
          ctx.lineTo(aEndX, bankY + bankH / 2);
          ctx.stroke();

          // Lent amount label
          ctx.font = "7px monospace";
          ctx.fillStyle = c.loan;
          ctx.fillText(
            `$${step.lent}`,
            (ax + aEndX) / 2,
            bankY + bankH / 2 - 6,
          );
        }

        ctx.globalAlpha = 1;
      }

      // "..." at the end
      if (cycle > 8) {
        ctx.font = "bold 14px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "left";
        ctx.fillText("...", startX + chain.length * 75, bankY + 25);
      }

      // Total money counter (animated)
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.counter;
      ctx.textAlign = "center";
      ctx.fillText(`Total money: $${totalMoney.toLocaleString()}`, W / 2, 170);

      // Explanation
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Each loan creates a new deposit", W / 2, 190);
      ctx.fillText("$1,000 becomes ~$10,000 (10x multiplier)", W / 2, 204);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Money multiplier effect", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Money multiplier effect" canvasRef={canvasRef} />
  );
}
