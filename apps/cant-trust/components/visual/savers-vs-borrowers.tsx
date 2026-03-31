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
  sound: string;
  eroded: string;
  bar: string;
  barBg: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    sound: isDark ? "#4ade80" : "#16a34a",
    eroded: isDark ? "#f87171" : "#dc2626",
    bar: isDark ? "#fbbf24" : "#d97706",
    barBg: isDark ? "#334155" : "#e2e8f0",
  };
}

/* ------------------------------------------------------------------ */
/*  Sound Money Savings                                                */
/* ------------------------------------------------------------------ */

export function SoundMoneySavings() {
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
      ctx.fillText("Sound money environment", W / 2, 14);

      // Year counter
      const year = Math.floor(elapsed * 0.5) % 11;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText(`Year ${year}`, W / 2, 32);

      // Savings bar stays same or slightly grows
      const barX = 40;
      const barY = 50;
      const barW = 200;
      const barH = 25;

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText("$10,000 saved:", barX, barY - 5);

      ctx.fillStyle = c.barBg;
      ctx.fillRect(barX, barY, barW + 30, barH);

      // Purchasing power slightly grows with deflation
      const ppGrowth = 1 + year * 0.01;
      ctx.fillStyle = c.sound;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(barX, barY, barW * Math.min(ppGrowth, 1.1), barH);
      ctx.globalAlpha = 1;

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText(
        `$${(10000 * ppGrowth).toFixed(0)} buying power`,
        W / 2,
        barY + 17,
      );

      // Benefits list
      const listY = 100;
      const benefits = [
        "Saving is rewarded",
        "Patience builds wealth",
        "No forced investment pressure",
        "Cash holds its value",
        "Retirement math is simple",
      ];

      for (let i = 0; i < benefits.length; i++) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.sound;
        ctx.textAlign = "left";
        ctx.fillText("+ " + benefits[i], 40, listY + i * 18);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.sound;
      ctx.textAlign = "center";
      ctx.fillText("Saving works as expected", W / 2, H - 8);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Sound money environment" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Inflationary Savings                                                */
/* ------------------------------------------------------------------ */

export function InflationarySavings() {
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
      ctx.fillText("Inflationary environment", W / 2, 14);

      const year = Math.floor(elapsed * 0.5) % 11;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText(`Year ${year}`, W / 2, 32);

      // Savings bar shrinking
      const barX = 40;
      const barY = 50;
      const barW = 200;
      const barH = 25;

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText("$10,000 saved:", barX, barY - 5);

      ctx.fillStyle = c.barBg;
      ctx.fillRect(barX, barY, barW + 30, barH);

      // Purchasing power shrinks 6% per year
      const ppFactor = Math.pow(0.94, year);
      ctx.fillStyle = c.eroded;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(barX, barY, barW * ppFactor, barH);
      ctx.globalAlpha = 1;

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText(
        `$${(10000 * ppFactor).toFixed(0)} buying power`,
        W / 2,
        barY + 17,
      );

      // Problems
      const listY = 100;
      const problems = [
        "Saving is punished",
        "Cash loses value by design",
        "Forced into risky investments",
        "Must speculate to keep up",
        "Guaranteed loss under mattress",
      ];

      for (let i = 0; i < problems.length; i++) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.eroded;
        ctx.textAlign = "left";
        ctx.fillText("- " + problems[i], 40, listY + i * 18);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.eroded;
      ctx.textAlign = "center";
      ctx.fillText("Saving is a losing strategy", W / 2, H - 8);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Inflationary environment" canvasRef={canvasRef} />
  );
}
