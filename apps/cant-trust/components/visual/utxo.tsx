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
  box: string;
  boxStroke: string;
  accent: string;
  spent: string;
  created: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    box: isDark ? "#334155" : "#e2e8f0",
    boxStroke: isDark ? "#64748b" : "#94a3b8",
    accent: isDark ? "#f7931a" : "#c28a1a",
    spent: isDark ? "#f87171" : "#dc2626",
    created: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Account Balance Model                                              */
/* ------------------------------------------------------------------ */

export function AccountBalance() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(getColors(isDark));

  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    let rafId = 0;
    let lastTime = 0;
    let balance = 500;
    let targetBalance = 500;
    let displayBalance = 500;
    let timer = 0;
    let phase = 0;

    const changes = [-100, -50, 200, -75, 25, -150];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      timer += dt;

      if (timer > 2) {
        timer = 0;
        const change = changes[phase % changes.length];
        targetBalance = balance + change;
        balance = targetBalance;
        phase++;
        if (phase >= changes.length) {
          phase = 0;
          balance = 500;
          targetBalance = 500;
          displayBalance = 500;
        }
      }

      displayBalance += (targetBalance - displayBalance) * 5 * dt;

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
      ctx.fillText("Account balance model", W / 2, 16);

      // Ledger box
      const bx = 60;
      const by = 50;
      const bw = 200;
      const bh = 120;
      ctx.fillStyle = c.box;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = c.boxStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("LEDGER", bx + bw / 2, by + 20);

      // Balance display
      ctx.font = "bold 24px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText(`$${Math.round(displayBalance)}`, bx + bw / 2, by + 65);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Balance modified in place", bx + bw / 2, by + 90);

      // Mutation arrow
      const change = changes[(phase > 0 ? phase - 1 : 0) % changes.length];
      if (timer < 1 && phase > 0) {
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = change > 0 ? c.created : c.spent;
        ctx.fillText(
          change > 0 ? `+$${change}` : `-$${Math.abs(change)}`,
          bx + bw / 2,
          by + bh + 20,
        );
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Mutable state: single value updated", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Account balance model" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  UTXO Model                                                         */
/* ------------------------------------------------------------------ */

export function UtxoModel() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(getColors(isDark));

  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    let rafId = 0;
    let lastTime = 0;
    let phase = 0;
    let timer = 0;
    let animProgress = 0;

    // Phases: 0=show input, 1=consuming, 2=show outputs
    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      timer += dt;
      animProgress = Math.min(1, animProgress + dt * 1.5);

      if (timer > 3) {
        timer = 0;
        phase = (phase + 1) % 3;
        animProgress = 0;
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

      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("UTXO model", W / 2, 16);

      // Input UTXO
      const inputX = 30;
      const inputY = 60;
      const boxW = 80;
      const boxH = 40;

      const spent = phase >= 1;
      ctx.fillStyle = spent ? c.bg : c.box;
      ctx.fillRect(inputX, inputY, boxW, boxH);
      ctx.strokeStyle = spent ? c.spent : c.boxStroke;
      ctx.lineWidth = 2;
      ctx.setLineDash(spent ? [4, 4] : []);
      ctx.strokeRect(inputX, inputY, boxW, boxH);
      ctx.setLineDash([]);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = spent ? c.spent : c.text;
      ctx.textAlign = "center";
      ctx.fillText("50 BTC", inputX + boxW / 2, inputY + 18);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText(spent ? "SPENT" : "UTXO", inputX + boxW / 2, inputY + 32);

      if (spent) {
        // Cross-out
        ctx.strokeStyle = c.spent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(inputX, inputY);
        ctx.lineTo(inputX + boxW, inputY + boxH);
        ctx.moveTo(inputX + boxW, inputY);
        ctx.lineTo(inputX, inputY + boxH);
        ctx.stroke();
      }

      // Transaction box
      const txX = 130;
      const txY = 75;
      const txW = 50;
      const txH = 80;
      if (phase >= 1) {
        ctx.fillStyle = c.accent;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(txX, txY, txW, txH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 1;
        ctx.strokeRect(txX, txY, txW, txH);
        ctx.font = "bold 8px monospace";
        ctx.fillStyle = c.accent;
        ctx.textAlign = "center";
        ctx.fillText("TX", txX + txW / 2, txY + 14);

        // Arrow from input to TX
        ctx.strokeStyle = c.spent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(inputX + boxW, inputY + boxH / 2);
        ctx.lineTo(txX, txY + 20);
        ctx.stroke();
      }

      // Output UTXOs
      if (phase >= 2) {
        const outX = 210;
        const outY1 = 50;
        const outY2 = 130;
        const outW = 80;
        const outH = 36;

        // Output 1: 10 BTC to Bob
        const alpha1 = Math.min(1, animProgress * 2);
        ctx.globalAlpha = alpha1;
        ctx.fillStyle = c.created;
        ctx.globalAlpha = alpha1 * 0.15;
        ctx.fillRect(outX, outY1, outW, outH);
        ctx.globalAlpha = alpha1;
        ctx.strokeStyle = c.created;
        ctx.lineWidth = 2;
        ctx.strokeRect(outX, outY1, outW, outH);
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText("10 BTC", outX + outW / 2, outY1 + 15);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.created;
        ctx.fillText("to Bob", outX + outW / 2, outY1 + 28);

        // Output 2: 40 BTC change
        ctx.fillStyle = c.created;
        ctx.globalAlpha = alpha1 * 0.15;
        ctx.fillRect(outX, outY2, outW, outH);
        ctx.globalAlpha = alpha1;
        ctx.strokeStyle = c.created;
        ctx.strokeRect(outX, outY2, outW, outH);
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.fillText("40 BTC", outX + outW / 2, outY2 + 15);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.created;
        ctx.fillText("change", outX + outW / 2, outY2 + 28);

        ctx.globalAlpha = 1;

        // Arrows from TX to outputs
        ctx.strokeStyle = c.created;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(txX + txW, txY + 20);
        ctx.lineTo(outX, outY1 + outH / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(txX + txW, txY + txH - 20);
        ctx.lineTo(outX, outY2 + outH / 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Inputs consumed, new outputs created", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="UTXO model" canvasRef={canvasRef} />;
}
