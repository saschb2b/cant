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
  money: string;
  marker: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    gold: isDark ? "#fbbf24" : "#d97706",
    money: isDark ? "#4ade80" : "#16a34a",
    marker: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  Gold-backed supply: both bars grow together                        */
/* ------------------------------------------------------------------ */

export function GoldBackedSupply() {
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
      ctx.fillText("Gold-backed: constrained supply", W / 2, 18);

      const barW = 50;
      const barMaxH = 140;
      const barY = H - 45;

      // Animated growth (slow, constrained)
      const cycle = (elapsed % 6) / 6;
      const growFactor = 0.4 + 0.3 * Math.sin(cycle * Math.PI * 2);

      // Gold reserves bar
      const goldH = barMaxH * growFactor;
      const goldX = W / 2 - 70;
      ctx.fillStyle = c.gold;
      ctx.fillRect(goldX, barY - goldH, barW, goldH);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(goldX, barY - goldH, barW, goldH);

      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Gold", goldX + barW / 2, barY + 14);
      ctx.fillText("Reserves", goldX + barW / 2, barY + 24);

      // Money supply bar (tracks gold closely)
      const moneyH = barMaxH * (growFactor * 1.05);
      const moneyX = W / 2 + 20;
      ctx.fillStyle = c.money;
      ctx.fillRect(moneyX, barY - moneyH, barW, moneyH);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(moneyX, barY - moneyH, barW, moneyH);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Money", moneyX + barW / 2, barY + 14);
      ctx.fillText("Supply", moneyX + barW / 2, barY + 24);

      // Constraint indicator
      ctx.strokeStyle = c.gold;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(goldX + barW + 5, barY - goldH);
      ctx.lineTo(moneyX - 5, barY - moneyH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.gold;
      ctx.textAlign = "center";
      ctx.fillText("Linked", W / 2, barY - Math.max(goldH, moneyH) - 8);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Constrained supply" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Unbacked supply: money explodes, gold stays flat                   */
/* ------------------------------------------------------------------ */

export function UnbackedSupply() {
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
      ctx.fillText("Post-1971: unconstrained supply", W / 2, 18);

      const barW = 50;
      const barMaxH = 160;
      const barY = H - 45;

      // Gold stays flat
      const goldH = barMaxH * 0.25;
      const goldX = W / 2 - 70;
      ctx.fillStyle = c.gold;
      ctx.fillRect(goldX, barY - goldH, barW, goldH);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(goldX, barY - goldH, barW, goldH);

      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Gold", goldX + barW / 2, barY + 14);
      ctx.fillText("Reserves", goldX + barW / 2, barY + 24);

      // Money supply explodes
      const growProgress = Math.min(1, elapsed / 4);
      const moneyFactor = 0.25 + growProgress * 0.7;
      const moneyH = barMaxH * moneyFactor;
      const moneyX = W / 2 + 20;
      ctx.fillStyle = c.money;
      ctx.fillRect(moneyX, barY - moneyH, barW, moneyH);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(moneyX, barY - moneyH, barW, moneyH);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Money", moneyX + barW / 2, barY + 14);
      ctx.fillText("Supply", moneyX + barW / 2, barY + 24);

      // Broken link
      ctx.strokeStyle = c.marker;
      ctx.lineWidth = 2;
      const midX = W / 2;
      const midY = barY - goldH;
      ctx.beginPath();
      ctx.moveTo(midX - 6, midY - 6);
      ctx.lineTo(midX + 6, midY + 6);
      ctx.moveTo(midX + 6, midY - 6);
      ctx.lineTo(midX - 6, midY + 6);
      ctx.stroke();

      // Ratio label
      if (elapsed > 2) {
        const ratio = (moneyFactor / 0.25).toFixed(1);
        const a = Math.min(1, (elapsed - 2) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.marker;
        ctx.textAlign = "center";
        ctx.fillText("Supply " + ratio + "x reserves", W / 2, 36);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Unconstrained supply" canvasRef={canvasRef} />
  );
}
