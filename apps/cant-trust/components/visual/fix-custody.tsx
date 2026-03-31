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
  bank: string;
  self: string;
  danger: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    bank: isDark ? "#f87171" : "#dc2626",
    self: isDark ? "#4ade80" : "#16a34a",
    danger: isDark ? "#f87171" : "#dc2626",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Bank Custody                                                       */
/* ------------------------------------------------------------------ */

export function BankCustody() {
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
      ctx.fillText("Bank custody", W / 2, 14);

      // You (small, pleading)
      ctx.fillStyle = c.dimText;
      ctx.beginPath();
      ctx.arc(60, 80, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("You", 60, 83);

      // Arrow to bank door
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(74, 80);
      ctx.lineTo(130, 80);
      ctx.stroke();

      // Bank door (closed)
      ctx.fillStyle = c.block;
      ctx.fillRect(135, 40, 80, 80);
      ctx.strokeStyle = c.bank;
      ctx.lineWidth = 2;
      ctx.strokeRect(135, 40, 80, 80);

      // Lock on door
      ctx.fillStyle = c.bank;
      ctx.beginPath();
      ctx.arc(175, 75, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("BANK", 175, 65);

      // Money behind door
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(225, 50, 60, 60);
      ctx.globalAlpha = 1;
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("$$$", 255, 85);

      // Blocking actions
      const blocks = [
        "Freeze account",
        "Limit withdrawals",
        "Become insolvent",
        "Bail-in your deposit",
      ];

      const activeBlock = Math.floor(elapsed * 0.6) % blocks.length;
      for (let i = 0; i < blocks.length; i++) {
        const y = 132 + i * 18;
        const isActive = i === activeBlock;

        ctx.font = "8px monospace";
        ctx.fillStyle = isActive ? c.danger : c.dimText;
        ctx.textAlign = "left";
        ctx.fillText(`Bank can: ${blocks[i]}`, 50, y);

        if (isActive) {
          const blink = Math.sin(elapsed * 5) > 0;
          if (blink) {
            ctx.fillStyle = c.danger;
            ctx.textAlign = "right";
            ctx.fillText("!", 290, y);
          }
        }
      }

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.bank;
      ctx.textAlign = "center";
      ctx.fillText("You own a promise, not the money", W / 2, 220);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Bank custody" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Self Custody                                                       */
/* ------------------------------------------------------------------ */

export function SelfCustody() {
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
      ctx.fillText("Self-custody", W / 2, 14);

      // You (larger, empowered)
      ctx.fillStyle = c.self;
      ctx.beginPath();
      ctx.arc(W / 2, 55, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("You", W / 2, 58);

      // Key in hand
      ctx.fillStyle = c.accent;
      ctx.fillRect(W / 2 + 22, 48, 25, 8);
      ctx.beginPath();
      ctx.arc(W / 2 + 50, 52, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = "7px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("KEY", W / 2 + 50, 55);

      // Direct connection to money
      ctx.strokeStyle = c.self;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2, 73);
      ctx.lineTo(W / 2, 100);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W / 2 - 4, 96);
      ctx.lineTo(W / 2, 102);
      ctx.lineTo(W / 2 + 4, 96);
      ctx.fillStyle = c.self;
      ctx.fill();

      // Money (directly accessible)
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(W / 2 - 40, 105, 80, 40);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.self;
      ctx.lineWidth = 2;
      ctx.strokeRect(W / 2 - 40, 105, 80, 40);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("$$$", W / 2, 130);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.self;
      ctx.fillText("Direct access", W / 2, 155);

      // No intermediary benefits
      const benefits = [
        "No one can freeze it",
        "No withdrawal limits",
        "Cannot become insolvent",
        "No one can seize it",
      ];

      for (let i = 0; i < benefits.length; i++) {
        const y = 172 + i * 14;
        ctx.font = "8px monospace";
        ctx.fillStyle = c.self;
        ctx.textAlign = "left";
        ctx.fillText(`[OK] ${benefits[i]}`, 70, y);
      }

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.self;
      ctx.textAlign = "center";
      ctx.fillText("You own the money, not a promise", W / 2, 232);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Self-custody" canvasRef={canvasRef} />;
}
