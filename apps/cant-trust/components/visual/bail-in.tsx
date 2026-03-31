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
  external: string;
  deposit: string;
  danger: string;
  warning: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    bank: isDark ? "#334155" : "#e2e8f0",
    bankStroke: isDark ? "#64748b" : "#94a3b8",
    external: isDark ? "#4ade80" : "#16a34a",
    deposit: isDark ? "#93c5fd" : "#3b82f6",
    danger: isDark ? "#f87171" : "#dc2626",
    warning: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  External Bailout                                                   */
/* ------------------------------------------------------------------ */

export function ExternalBailout() {
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

      const cycle = elapsed % 6;

      // Bank (troubled)
      const bx = 120;
      const by = 80;
      const bw = 80;
      const bh = 60;
      ctx.fillStyle = c.bank;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = cycle < 2 ? c.danger : c.bankStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("BANK", bx + bw / 2, by + 20);

      if (cycle < 2) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.danger;
        ctx.fillText("INSOLVENT", bx + bw / 2, by + 38);
      }

      // Taxpayer money flows in (after trouble shown)
      if (cycle > 2) {
        const progress = Math.min(1, (cycle - 2) / 1.5);
        const srcX = bx + bw / 2;
        const srcY = 30;
        const curY = srcY + progress * (by - srcY - 5);

        ctx.strokeStyle = c.external;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        ctx.lineTo(srcX, curY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(srcX, curY, 5, 0, Math.PI * 2);
        ctx.fillStyle = c.external;
        ctx.fill();

        ctx.font = "9px monospace";
        ctx.fillStyle = c.external;
        ctx.fillText("Taxpayer money", srcX, srcY - 5);
      }

      // Depositors untouched
      const depY = by + bh + 30;
      for (let i = 0; i < 4; i++) {
        const dx = 80 + i * 45;
        ctx.beginPath();
        ctx.arc(dx, depY, 8, 0, Math.PI * 2);
        ctx.fillStyle = c.deposit;
        ctx.fill();
      }
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Depositors untouched", W / 2, depY + 22);

      if (cycle > 4) {
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.external;
        ctx.fillText("Bank rescued with public funds", W / 2, H - 10);
      }

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("External bailout", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="External bailout" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Deposit Bail-In                                                    */
/* ------------------------------------------------------------------ */

export function DepositBailIn() {
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

      const cycle = elapsed % 8;

      // Bank
      const bx = 120;
      const by = 30;
      const bw = 80;
      const bh = 50;
      ctx.fillStyle = c.bank;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = c.danger;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("BANK", bx + bw / 2, by + 20);
      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText("INSOLVENT", bx + bw / 2, by + 38);

      // Depositor accounts
      const accounts = [
        { label: "Alice", initial: 100000, x: 40 },
        { label: "Bob", initial: 250000, x: 120 },
        { label: "Carol", initial: 50000, x: 200 },
        { label: "Dave", initial: 180000, x: 280 },
      ];

      const haircut = cycle > 3 ? Math.min(0.475, (cycle - 3) * 0.15) : 0;

      for (const acct of accounts) {
        const ay = 110;
        const currentBalance = Math.round(acct.initial * (1 - haircut));

        // Account box
        ctx.fillStyle = c.bank;
        ctx.fillRect(acct.x - 25, ay, 50, 45);
        ctx.strokeStyle = haircut > 0 ? c.danger : c.bankStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(acct.x - 25, ay, 50, 45);

        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.dimText;
        ctx.fillText(acct.label, acct.x, ay + 12);

        // Balance (shrinking)
        ctx.font = "bold 8px monospace";
        ctx.fillStyle = haircut > 0 ? c.danger : c.deposit;
        const displayK = Math.round(currentBalance / 1000);
        ctx.fillText(`$${displayK}K`, acct.x, ay + 28);

        // Arrow up to bank (money taken)
        if (haircut > 0) {
          ctx.strokeStyle = c.danger;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.moveTo(acct.x, ay);
          ctx.lineTo(bx + bw / 2, by + bh);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Haircut percentage
      if (haircut > 0) {
        ctx.font = "bold 14px monospace";
        ctx.fillStyle = c.danger;
        ctx.textAlign = "center";
        ctx.fillText(`-${Math.round(haircut * 100)}% haircut`, W / 2, 180);
      }

      // Cyprus reference
      if (cycle > 5) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.warning;
        ctx.textAlign = "center";
        ctx.fillText("Cyprus 2013: deposits over 100K", W / 2, 200);
        ctx.fillText("lost up to 47.5%", W / 2, 214);
      }

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Deposit bail-in", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Deposit bail-in" canvasRef={canvasRef} />;
}
