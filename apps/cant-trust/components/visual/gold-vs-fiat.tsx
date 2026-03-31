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
  note: string;
  noteBorder: string;
  arrow: string;
}

/* ------------------------------------------------------------------ */
/*  Gold-backed note                                                   */
/* ------------------------------------------------------------------ */

export function GoldBackedNote() {
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

      // Gold bar (behind the note)
      const goldX = W / 2 - 30;
      const goldY = 40;
      ctx.fillStyle = c.gold;
      ctx.fillRect(goldX, goldY, 60, 30);
      ctx.strokeStyle = isDark ? "#b8860b" : "#8b6914";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(goldX, goldY, 60, 30);
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.bg;
      ctx.fillText("GOLD", W / 2, goldY + 19);

      // Paper note (in front, slightly offset)
      const noteX = W / 2 - 45;
      const noteY = 85;
      const noteW = 90;
      const noteH = 50;
      ctx.fillStyle = c.note;
      ctx.fillRect(noteX, noteY, noteW, noteH);
      ctx.strokeStyle = c.noteBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(noteX, noteY, noteW, noteH);
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("$20 NOTE", W / 2, noteY + 20);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Redeemable in gold", W / 2, noteY + 34);

      // Arrow between gold and note
      const arrowPulse = 0.5 + 0.5 * Math.sin(elapsed * 2);
      ctx.globalAlpha = 0.6 + arrowPulse * 0.4;
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2, goldY + 30);
      ctx.lineTo(W / 2, noteY);
      ctx.stroke();
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(W / 2 - 5, goldY + 36);
      ctx.lineTo(W / 2, goldY + 30);
      ctx.lineTo(W / 2 + 5, goldY + 36);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W / 2 - 5, noteY - 6);
      ctx.lineTo(W / 2, noteY);
      ctx.lineTo(W / 2 + 5, noteY - 6);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Value indicator (stable)
      const meterX = W / 2 - 50;
      const meterY = 160;
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Purchasing power:", meterX, meterY);

      const barW = 100;
      const barH = 10;
      ctx.fillStyle = c.dimText + "33";
      ctx.fillRect(meterX, meterY + 6, barW, barH);

      // Bar (stays near full)
      const stableVal = 0.9 + Math.sin(elapsed * 0.5) * 0.05;
      ctx.fillStyle = c.gold;
      ctx.fillRect(meterX, meterY + 6, barW * stableVal, barH);

      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Purchasing power over time", W / 2, meterY + 30);

      // Trust level
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Backed by physical gold", W / 2, H - 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Gold-backed note" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Unbacked fiat                                                      */
/* ------------------------------------------------------------------ */

export function UnbackedFiat() {
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

      // Government decree backing
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.strokeRect(W / 2 - 30, 40, 60, 30);
      ctx.setLineDash([]);
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Gov. decree", W / 2, 60);

      // Paper note
      const noteX = W / 2 - 45;
      const noteY = 85;
      const noteW = 90;
      const noteH = 50;
      ctx.fillStyle = c.note;
      ctx.fillRect(noteX, noteY, noteW, noteH);
      ctx.strokeStyle = c.noteBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(noteX, noteY, noteW, noteH);
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("$20 NOTE", W / 2, noteY + 20);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Legal tender by decree", W / 2, noteY + 34);

      // Arrow from decree to note
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2, 70);
      ctx.lineTo(W / 2, noteY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W / 2 - 4, noteY - 5);
      ctx.lineTo(W / 2, noteY);
      ctx.lineTo(W / 2 + 4, noteY - 5);
      ctx.stroke();

      // Value indicator (declining)
      const meterX = W / 2 - 50;
      const meterY = 160;
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Purchasing power:", meterX, meterY);

      const barW = 100;
      const barH = 10;
      ctx.fillStyle = c.dimText + "33";
      ctx.fillRect(meterX, meterY + 6, barW, barH);

      // Bar (cycles down over time)
      const cycle = elapsed % 10;
      const declVal = Math.max(0.1, 0.95 - cycle * 0.085);
      ctx.fillStyle = c.note;
      ctx.fillRect(meterX, meterY + 6, barW * declVal, barH);

      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Purchasing power over time", W / 2, meterY + 30);

      // Trust level
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Backed by government decree", W / 2, H - 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Fiat note" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Color helper                                                       */
/* ------------------------------------------------------------------ */

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    gold: isDark ? "#fbbf24" : "#d97706",
    note: isDark ? "#2a3a2a" : "#f0f7e8",
    noteBorder: isDark ? "#4a5a4a" : "#a0b090",
    arrow: isDark ? "#fbbf24" : "#d97706",
  };
}
