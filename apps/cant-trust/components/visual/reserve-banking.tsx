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
  vault: string;
  vaultStroke: string;
  deposit: string;
  loan: string;
  reserve: string;
  arrow: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    vault: isDark ? "#334155" : "#e2e8f0",
    vaultStroke: isDark ? "#64748b" : "#94a3b8",
    deposit: isDark ? "#4ade80" : "#16a34a",
    loan: isDark ? "#f87171" : "#dc2626",
    reserve: isDark ? "#fbbf24" : "#d97706",
    arrow: isDark ? "#93c5fd" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  Full Reserve                                                       */
/* ------------------------------------------------------------------ */

export function FullReserveBank() {
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

    const deposits: { y: number; targetY: number; alpha: number }[] = [];
    let spawnTimer = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      spawnTimer += dt;

      if (spawnTimer > 1.5 && deposits.length < 8) {
        deposits.push({ y: 40, targetY: 140 + deposits.length * 12, alpha: 1 });
        spawnTimer = 0;
      }

      for (const d of deposits) {
        d.y += (d.targetY - d.y) * 3 * dt;
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

      // Vault
      const vx = 100;
      const vy = 100;
      const vw = 120;
      const vh = 120;
      ctx.fillStyle = c.vault;
      ctx.fillRect(vx, vy, vw, vh);
      ctx.strokeStyle = c.vaultStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(vx, vy, vw, vh);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("VAULT", vx + vw / 2, vy + 15);

      // Deposits inside vault
      for (const d of deposits) {
        ctx.fillStyle = c.deposit;
        ctx.globalAlpha = d.alpha;
        ctx.fillRect(vx + 15, d.y, vw - 30, 8);
        ctx.globalAlpha = 1;
      }

      // Label: deposit arrow
      const arrowX = vx + vw / 2;
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(arrowX, 30);
      ctx.lineTo(arrowX, vy - 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(arrowX - 5, vy - 12);
      ctx.lineTo(arrowX, vy - 5);
      ctx.lineTo(arrowX + 5, vy - 12);
      ctx.fill();

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Deposits in", arrowX, 22);

      // Reserve label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.reserve;
      ctx.fillText("100% reserved", vx + vw / 2, vy + vh + 16);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Full reserve banking", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Full reserve banking" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Fractional Reserve                                                  */
/* ------------------------------------------------------------------ */

export function FractionalReserveBank() {
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

    interface LoanArrow {
      x: number;
      progress: number;
      active: boolean;
    }

    const loans: LoanArrow[] = [];
    let depositCount = 0;
    let spawnTimer = 0;
    let loanTimer = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      spawnTimer += dt;
      loanTimer += dt;

      if (spawnTimer > 1.2 && depositCount < 8) {
        depositCount++;
        spawnTimer = 0;
      }

      if (loanTimer > 1.8 && loans.length < 6) {
        loans.push({
          x: 220 + (loans.length % 3) * 30,
          progress: 0,
          active: true,
        });
        loanTimer = 0;
      }

      for (const l of loans) {
        if (l.active) l.progress = Math.min(1, l.progress + dt * 1.5);
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

      // Vault (smaller, partially empty)
      const vx = 40;
      const vy = 100;
      const vw = 100;
      const vh = 120;
      ctx.fillStyle = c.vault;
      ctx.fillRect(vx, vy, vw, vh);
      ctx.strokeStyle = c.vaultStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(vx, vy, vw, vh);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("VAULT", vx + vw / 2, vy + 15);

      // Only 1-2 deposits remain (reserve)
      const reserveCount = Math.min(2, Math.ceil(depositCount * 0.1));
      for (let i = 0; i < reserveCount; i++) {
        ctx.fillStyle = c.reserve;
        ctx.fillRect(vx + 10, vy + vh - 20 - i * 14, vw - 20, 8);
      }

      // Reserve label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.loan;
      ctx.fillText("~10% reserved", vx + vw / 2, vy + vh + 16);

      // Loan arrows going out
      for (const l of loans) {
        const startX = vx + vw;
        const startY = vy + 30 + loans.indexOf(l) * 16;
        const endX = startX + 80 * l.progress;
        ctx.strokeStyle = c.loan;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, startY);
        ctx.stroke();
        if (l.progress > 0.3) {
          ctx.beginPath();
          ctx.moveTo(endX - 5, startY - 4);
          ctx.lineTo(endX, startY);
          ctx.lineTo(endX - 5, startY + 4);
          ctx.fillStyle = c.loan;
          ctx.fill();
        }
      }

      // Lent out label
      if (loans.length > 0) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.loan;
        ctx.textAlign = "left";
        ctx.fillText("Lent out", vx + vw + 10, vy - 5);
        ctx.fillText("(90%)", vx + vw + 10, vy + 7);
      }

      // Deposit arrow
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(vx + vw / 2, 30);
      ctx.lineTo(vx + vw / 2, vy - 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = c.arrow;
      ctx.moveTo(vx + vw / 2 - 5, vy - 12);
      ctx.lineTo(vx + vw / 2, vy - 5);
      ctx.lineTo(vx + vw / 2 + 5, vy - 12);
      ctx.fill();

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Deposits in", vx + vw / 2, 22);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Fractional reserve banking", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Fractional reserve banking"
      canvasRef={canvasRef}
    />
  );
}
