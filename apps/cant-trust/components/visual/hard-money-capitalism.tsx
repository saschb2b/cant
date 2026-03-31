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
  money: string;
  price: string;
  red: string;
  green: string;
  printer: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    money: isDark ? "#fbbf24" : "#d97706",
    price: isDark ? "#60a5fa" : "#3b82f6",
    red: isDark ? "#f87171" : "#dc2626",
    green: isDark ? "#4ade80" : "#16a34a",
    printer: isDark ? "#a78bfa" : "#7c3aed",
  };
}

/* ------------------------------------------------------------------ */
/*  Soft money: printer distorts market                                */
/* ------------------------------------------------------------------ */

export function SoftMoneyCap() {
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
      ctx.fillText("Soft money market", W / 2, 18);

      // Printer icon
      const printerX = W / 2 - 20;
      const printerY = 30;
      ctx.fillStyle = c.printer;
      ctx.fillRect(printerX, printerY, 40, 20);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(printerX, printerY, 40, 20);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("PRINTER", W / 2, printerY + 13);

      // Dollar signs flowing out
      const dollarCount = 5;
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.money;
      for (let i = 0; i < dollarCount; i++) {
        const t = (elapsed * 0.5 + i * 0.2) % 1;
        const angle =
          (i / dollarCount) * Math.PI -
          Math.PI / 2 +
          Math.sin(elapsed + i) * 0.3;
        const dist = 25 + t * 50;
        const dx = W / 2 + Math.cos(angle) * dist;
        const dy =
          printerY + 10 + Math.sin(angle + Math.PI / 2) * dist * 0.6 + t * 30;
        ctx.globalAlpha = 1 - t;
        ctx.fillText("$", dx, dy);
      }
      ctx.globalAlpha = 1;

      // Market participants (3 boxes)
      const boxY = 130;
      const boxW = 60;
      const boxH = 30;
      const labels = ["Big Bank", "Corp", "Worker"];
      const sizes = [1.0, 0.7, 0.3]; // Who gets money first

      for (let i = 0; i < 3; i++) {
        const bx = 30 + i * 95;
        const fillAmt = sizes[i]! * Math.min(1, elapsed / 2);

        ctx.strokeStyle = c.dimText;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, boxY, boxW, boxH);

        // Fill representing money received
        ctx.fillStyle = c.money;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(bx, boxY, boxW * fillAmt, boxH);
        ctx.globalAlpha = 1;

        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(labels[i]!, bx + boxW / 2, boxY + boxH + 12);
      }

      // Price tags wobbling
      const priceY = 185;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.red;
      ctx.textAlign = "center";
      const wobble1 = Math.sin(elapsed * 3) * 3;
      const wobble2 = Math.sin(elapsed * 2.5 + 1) * 4;
      ctx.fillText("$" + (100 + Math.round(elapsed * 8 + wobble1)), 70, priceY);
      ctx.fillText("$" + (50 + Math.round(elapsed * 5 + wobble2)), 160, priceY);
      ctx.fillText("$" + (200 + Math.round(elapsed * 12)), 250, priceY);

      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Chaotic prices", W / 2, priceY + 14);

      // Bottom label
      if (elapsed > 2) {
        const a = Math.min(1, (elapsed - 2) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.red;
        ctx.textAlign = "center";
        ctx.fillText("First receivers gain at others' expense", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Printer-distorted market" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Hard money: fixed supply, fair competition                         */
/* ------------------------------------------------------------------ */

export function HardMoneyCap() {
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
      ctx.fillText("Hard money market", W / 2, 18);

      // Fixed supply icon
      const supplyX = W / 2 - 25;
      const supplyY = 30;
      ctx.fillStyle = c.money;
      ctx.fillRect(supplyX, supplyY, 50, 20);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(supplyX, supplyY, 50, 20);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("FIXED SUPPLY", W / 2, supplyY + 13);

      // Lock icon
      ctx.strokeStyle = c.money;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(W / 2, supplyY - 5, 6, Math.PI, 0);
      ctx.stroke();

      // Market participants (3 equal boxes)
      const boxY = 80;
      const boxW = 60;
      const boxH = 30;
      const labels = ["Small Biz", "Corp", "Worker"];

      for (let i = 0; i < 3; i++) {
        const bx = 30 + i * 95;
        const fillAmt = Math.min(1, elapsed / 2);

        ctx.strokeStyle = c.dimText;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, boxY, boxW, boxH);

        // Equal fill
        ctx.fillStyle = c.money;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(bx, boxY, boxW * fillAmt * 0.5, boxH);
        ctx.globalAlpha = 1;

        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(labels[i]!, bx + boxW / 2, boxY + boxH + 12);
      }

      // Stable prices
      const priceY = 150;
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.green;
      ctx.textAlign = "center";
      ctx.fillText("$100", 70, priceY);
      ctx.fillText("$50", 160, priceY);
      ctx.fillText("$200", 250, priceY);

      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Stable prices", W / 2, priceY + 14);

      // Efficiency meter
      if (elapsed > 1.5) {
        const a = Math.min(1, (elapsed - 1.5) / 0.5);
        ctx.globalAlpha = a;
        const meterY = 185;
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "left";
        ctx.fillText("Competition:", 40, meterY);
        ctx.fillStyle = c.green;
        ctx.fillText("Fair", 130, meterY);

        ctx.fillStyle = c.text;
        ctx.fillText("Price signal:", 40, meterY + 14);
        ctx.fillStyle = c.green;
        ctx.fillText("Accurate", 130, meterY + 14);
        ctx.globalAlpha = 1;
      }

      if (elapsed > 2.5) {
        const a = Math.min(1, (elapsed - 2.5) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.green;
        ctx.textAlign = "center";
        ctx.fillText("Efficiency rewarded, no shortcuts", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Sound money market" canvasRef={canvasRef} />;
}
