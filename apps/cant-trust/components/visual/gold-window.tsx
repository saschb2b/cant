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
  green: string;
  red: string;
  dollarBg: string;
  arrow: string;
  line: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    gold: isDark ? "#fbbf24" : "#d97706",
    green: isDark ? "#4ade80" : "#16a34a",
    red: isDark ? "#f87171" : "#dc2626",
    dollarBg: isDark ? "#2d4a2d" : "#d1fae5",
    arrow: isDark ? "#60a5fa" : "#3b82f6",
    line: isDark ? "#555" : "#ccc",
  };
}

/* ------------------------------------------------------------------ */
/*  Gold Window Open: dollar connected to gold, stable                 */
/* ------------------------------------------------------------------ */

export function GoldWindowOpen() {
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

      // Title
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Dollar backed by gold", W / 2, 18);

      // Gold bar
      const goldX = W / 2 - 30;
      const goldY = 140;
      ctx.fillStyle = c.gold;
      ctx.fillRect(goldX, goldY, 60, 30);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(goldX, goldY, 60, 30);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("GOLD", W / 2, goldY + 19);

      // Dollar bill
      const dollarY = 45;
      const bob = Math.sin(elapsed * 0.5) * 2;
      ctx.fillStyle = c.dollarBg;
      ctx.fillRect(W / 2 - 35, dollarY + bob, 70, 35);
      ctx.strokeStyle = c.green;
      ctx.lineWidth = 2;
      ctx.strokeRect(W / 2 - 35, dollarY + bob, 70, 35);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.green;
      ctx.textAlign = "center";
      ctx.fillText("$35", W / 2, dollarY + bob + 23);

      // Arrow connecting them
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(W / 2, dollarY + bob + 35);
      ctx.lineTo(W / 2, goldY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow head
      ctx.fillStyle = c.arrow;
      ctx.beginPath();
      ctx.moveTo(W / 2, goldY);
      ctx.lineTo(W / 2 - 5, goldY - 8);
      ctx.lineTo(W / 2 + 5, goldY - 8);
      ctx.fill();

      // Redeemable label
      const labelAlpha = Math.min(1, elapsed / 1);
      ctx.globalAlpha = labelAlpha;
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.green;
      ctx.textAlign = "center";
      ctx.fillText("= 1 oz gold", W / 2, goldY + 55);

      // Stable label
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Redeemable on demand", W / 2, goldY + 70);
      ctx.globalAlpha = 1;

      // Exchange rate
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("$35 = 1 oz", 20, H - 15);
      ctx.fillStyle = c.green;
      ctx.fillText(" FIXED", 90, H - 15);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Gold-backed dollar" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Gold Window Closed: connection broken, dollar floats free           */
/* ------------------------------------------------------------------ */

export function GoldWindowClosed() {
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

      // Title
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Dollar unlinked from gold", W / 2, 18);

      // Gold bar (stays put)
      const goldX = W / 2 - 30;
      const goldY = 140;
      ctx.fillStyle = c.gold;
      ctx.fillRect(goldX, goldY, 60, 30);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(goldX, goldY, 60, 30);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("GOLD", W / 2, goldY + 19);

      // Dollar floats and wobbles
      const dollarY = 45;
      const wobbleX = Math.sin(elapsed * 2.5) * 8;
      const wobbleY = Math.sin(elapsed * 1.8) * 5;
      ctx.fillStyle = c.dollarBg;
      ctx.fillRect(W / 2 - 35 + wobbleX, dollarY + wobbleY, 70, 35);
      ctx.strokeStyle = c.red;
      ctx.lineWidth = 2;
      ctx.strokeRect(W / 2 - 35 + wobbleX, dollarY + wobbleY, 70, 35);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.red;
      ctx.textAlign = "center";
      ctx.fillText("$??", W / 2 + wobbleX, dollarY + wobbleY + 23);

      // Broken connection - X marks
      const breakY = (dollarY + wobbleY + 35 + goldY) / 2;
      ctx.strokeStyle = c.red;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 8, breakY - 8);
      ctx.lineTo(W / 2 + 8, breakY + 8);
      ctx.moveTo(W / 2 + 8, breakY - 8);
      ctx.lineTo(W / 2 - 8, breakY + 8);
      ctx.stroke();

      // Faded broken line
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(W / 2 + wobbleX, dollarY + wobbleY + 35);
      ctx.lineTo(W / 2, goldY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Not redeemable label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.red;
      ctx.textAlign = "center";
      ctx.fillText("Not redeemable", W / 2, goldY + 55);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Value determined by trust", W / 2, goldY + 70);

      // Floating exchange rate
      const rate = 1800 + Math.sin(elapsed * 1.2) * 200;
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("$" + Math.round(rate) + " = 1 oz", 20, H - 15);
      ctx.fillStyle = c.red;
      ctx.fillText(" FLOATING", 130, H - 15);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Unbacked dollar" canvasRef={canvasRef} />;
}
