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
  gold: string;
  crime: string;
  ridge: string;
  accent: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    gold: isDark ? "#fbbf24" : "#d97706",
    crime: isDark ? "#f87171" : "#dc2626",
    ridge: isDark ? "#4ade80" : "#16a34a",
    accent: isDark ? "#93c5fd" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  Coin Clipping                                                      */
/* ------------------------------------------------------------------ */

export function CoinClipping() {
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
      ctx.fillText("Citizen clipping coins", W / 2, 14);

      // Smooth coin being clipped
      const coinX = W / 2;
      const coinY = 80;
      const clipAmount = Math.min(elapsed * 0.3, 3);
      const coinR = 35 - clipAmount;

      // Coin
      ctx.beginPath();
      ctx.arc(coinX, coinY, coinR, 0, Math.PI * 2);
      ctx.fillStyle = c.gold;
      ctx.globalAlpha = 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.gold;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Smooth edge label
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Smooth edge", coinX, coinY + coinR + 15);

      // Shavings flying off
      const shavingCount = Math.floor(clipAmount * 3);
      for (let i = 0; i < shavingCount; i++) {
        const angle = (i * 1.2 + elapsed * 0.5) % (Math.PI * 2);
        const dist = coinR + 10 + i * 5;
        const sx = coinX + Math.cos(angle) * dist;
        const sy = coinY + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fillStyle = c.gold;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Gold dust collecting
      ctx.fillStyle = c.gold;
      ctx.globalAlpha = 0.5;
      const dustW = Math.min(clipAmount * 20, 60);
      ctx.fillRect(coinX - dustW / 2, 145, dustW, 8);
      ctx.globalAlpha = 1;

      ctx.font = "8px monospace";
      ctx.fillStyle = c.gold;
      ctx.fillText("Gold shavings collected", coinX, 168);

      // Ridges added as solution
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.ridge;
      ctx.fillText("Solution: add ridges", W / 2, 188);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Any clipping is visible", W / 2, 200);
      ctx.fillText("Isaac Newton enforced this", W / 2, 212);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.crime;
      ctx.fillText("Clippers faced severe punishment", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Citizen clipping coins" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Royal Debasement                                                   */
/* ------------------------------------------------------------------ */

export function RoyalDebasement() {
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
      ctx.fillText("Meanwhile, the king debases", W / 2, 14);

      // Ridged coin (protected from citizens)
      const coinX = 100;
      const coinY = 65;
      const coinR = 28;

      ctx.beginPath();
      ctx.arc(coinX, coinY, coinR, 0, Math.PI * 2);
      ctx.fillStyle = c.gold;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Ridges
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(
          coinX + Math.cos(a) * (coinR - 2),
          coinY + Math.sin(a) * (coinR - 2),
        );
        ctx.lineTo(
          coinX + Math.cos(a) * (coinR + 2),
          coinY + Math.sin(a) * (coinR + 2),
        );
        ctx.strokeStyle = c.gold;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = c.ridge;
      ctx.fillText("Ridged (protected)", coinX, coinY + coinR + 14);

      // But king's mint has less gold
      const mintX = 230;
      const mintY = 65;
      const mintR = 28;

      // Debased coin (less gold, more copper)
      ctx.beginPath();
      ctx.arc(mintX, mintY, mintR, 0, Math.PI * 2);
      ctx.fillStyle = c.dimText;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Small gold center
      ctx.beginPath();
      ctx.arc(mintX, mintY, mintR * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = c.gold;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.font = "8px monospace";
      ctx.fillStyle = c.crime;
      ctx.fillText("Less gold, same face value", mintX, mintY + mintR + 14);

      // Double standard
      const dsY = 115;
      ctx.fillStyle = c.crime;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(20, dsY, W - 40, 55);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.crime;
      ctx.lineWidth = 1;
      ctx.strokeRect(20, dsY, W - 40, 55);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.crime;
      ctx.textAlign = "center";
      ctx.fillText("The double standard:", W / 2, dsY + 15);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Clipping by citizens: ILLEGAL", W / 2, dsY + 32);
      ctx.fillText("Debasement by rulers: POLICY", W / 2, dsY + 46);

      // Modern parallel
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("This double standard persists today", W / 2, 195);
      ctx.fillText("as monetary inflation", W / 2, 210);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.crime;
      ctx.fillText("Only the issuer may debase", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Meanwhile, the king debases"
      canvasRef={canvasRef}
    />
  );
}
