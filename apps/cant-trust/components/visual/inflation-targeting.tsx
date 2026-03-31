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
  zero: string;
  two: string;
  barBg: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    zero: isDark ? "#4ade80" : "#16a34a",
    two: isDark ? "#f87171" : "#dc2626",
    barBg: isDark ? "#334155" : "#e2e8f0",
  };
}

/* ------------------------------------------------------------------ */
/*  Zero Percent Target                                                */
/* ------------------------------------------------------------------ */

export function ZeroPercentTarget() {
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
      ctx.fillText("0% inflation target", W / 2, 14);

      // Flat purchasing power line
      const lineY = 80;
      const lineStartX = 40;
      const lineEndX = 280;

      ctx.strokeStyle = c.zero;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lineStartX, lineY);
      ctx.lineTo(lineEndX, lineY);
      ctx.stroke();

      // Year markers
      for (let y = 0; y <= 30; y += 10) {
        const x = lineStartX + (y / 30) * (lineEndX - lineStartX);
        ctx.strokeStyle = c.dimText;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, lineY - 5);
        ctx.lineTo(x, lineY + 5);
        ctx.stroke();
        ctx.font = "7px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(`${y}yr`, x, lineY + 15);
      }

      // $100 label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.zero;
      ctx.textAlign = "left";
      ctx.fillText("$100", lineStartX - 5, lineY - 10);
      ctx.textAlign = "right";
      ctx.fillText("$100", lineEndX + 5, lineY - 10);

      // Benefits
      const benY = 120;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("A dollar saved = a dollar kept", W / 2, benY);
      ctx.fillText("No forced investment pressure", W / 2, benY + 16);
      ctx.fillText("Retirement math is simple", W / 2, benY + 32);
      ctx.fillText("Wages reflect real productivity", W / 2, benY + 48);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.zero;
      ctx.fillText("$100 today = $100 in 30 years", W / 2, 210);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.zero;
      ctx.fillText("The only honest target", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="0% inflation target" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Two Percent Target                                                 */
/* ------------------------------------------------------------------ */

export function TwoPercentTarget() {
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
      ctx.fillText("2% inflation target", W / 2, 14);

      // Declining purchasing power curve
      const lineStartX = 40;
      const lineEndX = 280;
      const lineTopY = 50;
      const lineBotY = 130;

      ctx.strokeStyle = c.two;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const drawProgress = Math.min(elapsed * 0.05, 1);
      for (let i = 0; i <= 100 * drawProgress; i++) {
        const t = i / 100;
        const x = lineStartX + t * (lineEndX - lineStartX);
        const years = t * 50;
        const pp = Math.pow(0.98, years);
        const y = lineTopY + (1 - pp) * (lineBotY - lineTopY);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Year markers
      const yearMarks = [
        { yr: 10, pp: 82 },
        { yr: 20, pp: 67 },
        { yr: 30, pp: 55 },
        { yr: 50, pp: 36 },
      ];

      for (const m of yearMarks) {
        const x = lineStartX + (m.yr / 50) * (lineEndX - lineStartX);
        const pp = Math.pow(0.98, m.yr);
        const y = lineTopY + (1 - pp) * (lineBotY - lineTopY);

        ctx.fillStyle = c.two;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "7px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(`${m.yr}yr`, x, lineBotY + 14);
        ctx.fillStyle = c.two;
        ctx.fillText(`-${100 - m.pp}%`, x, y - 8);
      }

      // Labels
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.two;
      ctx.textAlign = "left";
      ctx.fillText("$100", lineStartX - 5, lineTopY - 5);

      // Summary
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText('"A little inflation is healthy"', W / 2, 165);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.two;
      ctx.fillText("30 years: -45% purchasing power", W / 2, 185);
      ctx.fillText("50 years: -64% purchasing power", W / 2, 200);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.two;
      ctx.fillText("Savings cut in half over a career", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="2% inflation target" canvasRef={canvasRef} />;
}
