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
  key: string;
  danger: string;
  success: string;
  link: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    box: isDark ? "#334155" : "#e2e8f0",
    boxStroke: isDark ? "#64748b" : "#94a3b8",
    key: isDark ? "#f7931a" : "#c28a1a",
    danger: isDark ? "#f87171" : "#dc2626",
    success: isDark ? "#4ade80" : "#16a34a",
    link: isDark ? "#93c5fd" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  Single Key Reuse                                                   */
/* ------------------------------------------------------------------ */

export function SingleKeyReuse() {
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
      ctx.fillText("Single key reuse", W / 2, 16);

      // Single key at top
      const keyX = W / 2;
      const keyY = 50;
      ctx.fillStyle = c.key;
      ctx.fillRect(keyX - 40, keyY - 12, 80, 24);
      ctx.strokeStyle = c.key;
      ctx.strokeRect(keyX - 40, keyY - 12, 80, 24);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.bg;
      ctx.fillText("ONE KEY", keyX, keyY + 4);

      // Single address
      const addrY = keyY + 40;
      ctx.fillStyle = c.box;
      ctx.fillRect(keyX - 50, addrY, 100, 24);
      ctx.strokeStyle = c.boxStroke;
      ctx.strokeRect(keyX - 50, addrY, 100, 24);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("1BvBM...addr1", keyX, addrY + 15);

      // Arrow from key to address
      ctx.strokeStyle = c.link;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(keyX, keyY + 12);
      ctx.lineTo(keyX, addrY);
      ctx.stroke();

      // Transaction arrows all pointing to same address
      const txY = addrY + 50;
      const numTx = 5;
      for (let i = 0; i < numTx; i++) {
        const txX = 40 + i * 60;
        const pulse = Math.sin(elapsed * 2 + i) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.strokeStyle = c.danger;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(txX, txY + 20);
        ctx.lineTo(keyX, addrY + 24);
        ctx.stroke();
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(`tx${i + 1}`, txX, txY + 32);
        ctx.globalAlpha = 1;
      }

      // Privacy warning
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("All transactions visible at one address", W / 2, H - 26);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText("Privacy leak: full history exposed", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Single key reuse" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  HD Derivation                                                      */
/* ------------------------------------------------------------------ */

export function HdDerivation() {
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
      ctx.fillText("HD wallet derivation", W / 2, 16);

      // Seed at top
      const seedX = W / 2;
      const seedY = 40;
      ctx.fillStyle = c.key;
      ctx.fillRect(seedX - 30, seedY - 10, 60, 20);
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("SEED", seedX, seedY + 4);

      // Master key
      const masterY = seedY + 30;
      ctx.fillStyle = c.key;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(seedX - 35, masterY, 70, 16);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.key;
      ctx.strokeRect(seedX - 35, masterY, 70, 16);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("master key", seedX, masterY + 11);

      ctx.strokeStyle = c.link;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(seedX, seedY + 10);
      ctx.lineTo(seedX, masterY);
      ctx.stroke();

      // Branch to accounts
      const accY = masterY + 30;
      const accounts = ["acct 0", "acct 1"];
      const accXs = [seedX - 60, seedX + 60];

      for (let a = 0; a < accounts.length; a++) {
        const ax = accXs[a];
        ctx.fillStyle = c.box;
        ctx.fillRect(ax - 25, accY, 50, 16);
        ctx.strokeStyle = c.boxStroke;
        ctx.strokeRect(ax - 25, accY, 50, 16);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(accounts[a], ax, accY + 11);

        ctx.strokeStyle = c.link;
        ctx.beginPath();
        ctx.moveTo(seedX, masterY + 16);
        ctx.lineTo(ax, accY);
        ctx.stroke();

        // Addresses per account
        const addrY = accY + 28;
        const numAddrs = 3;
        for (let i = 0; i < numAddrs; i++) {
          const addrX = ax - 25 + i * 20;
          const pulse = Math.sin(elapsed * 1.5 + a * 2 + i) * 0.3 + 0.7;
          ctx.fillStyle = c.success;
          ctx.globalAlpha = pulse;
          ctx.fillRect(addrX - 6, addrY + i * 18, 18, 12);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = c.success;
          ctx.lineWidth = 1;
          ctx.strokeRect(addrX - 6, addrY + i * 18, 18, 12);
          ctx.font = "6px monospace";
          ctx.fillStyle = c.text;
          ctx.textAlign = "center";
          ctx.fillText(`a${i}`, addrX + 3, addrY + i * 18 + 9);

          ctx.strokeStyle = c.link;
          ctx.beginPath();
          ctx.moveTo(ax, accY + 16);
          ctx.lineTo(addrX + 3, addrY + i * 18);
          ctx.stroke();
        }
      }

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("Fresh address per transaction", W / 2, H - 26);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.success;
      ctx.fillText("One seed backs up all addresses", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="HD wallet derivation" canvasRef={canvasRef} />
  );
}
