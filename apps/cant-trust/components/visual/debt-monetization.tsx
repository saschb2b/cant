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
  tax: string;
  print: string;
  money: string;
  arrow: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    tax: isDark ? "#4ade80" : "#16a34a",
    print: isDark ? "#f87171" : "#dc2626",
    money: isDark ? "#fbbf24" : "#d97706",
    arrow: isDark ? "#93c5fd" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  Tax Funded                                                         */
/* ------------------------------------------------------------------ */

export function TaxFundedSpending() {
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
      ctx.fillText("Tax-funded spending", W / 2, 14);

      // Citizens box
      const citY = 40;
      ctx.fillStyle = c.tax;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(30, citY, 120, 40);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.tax;
      ctx.lineWidth = 1;
      ctx.strokeRect(30, citY, 120, 40);
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Citizens", 90, citY + 16);
      ctx.fillText("$$$", 90, citY + 30);

      // Arrow: citizens -> government
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(155, citY + 20);
      ctx.lineTo(185, citY + 20);
      ctx.stroke();
      ctx.fillStyle = c.arrow;
      ctx.beginPath();
      ctx.moveTo(180, citY + 16);
      ctx.lineTo(185, citY + 20);
      ctx.lineTo(180, citY + 24);
      ctx.fill();

      // Government box
      ctx.fillStyle = c.tax;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(190, citY, 100, 40);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.tax;
      ctx.strokeRect(190, citY, 100, 40);
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Government", 240, citY + 25);

      // Properties
      const propY = 105;
      const props = [
        { label: "New money created:", value: "No", color: c.tax },
        { label: "Total supply:", value: "Same", color: c.tax },
        { label: "Purchasing power:", value: "Stable", color: c.tax },
        { label: "Accountability:", value: "Elections", color: c.tax },
        { label: "Visibility:", value: "Paystub", color: c.tax },
      ];

      for (let i = 0; i < props.length; i++) {
        const prop = props[i]!;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "left";
        ctx.fillText(prop.label, 30, propY + i * 17);
        ctx.fillStyle = prop.color;
        ctx.textAlign = "right";
        ctx.fillText(prop.value, 290, propY + i * 17);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.tax;
      ctx.textAlign = "center";
      ctx.fillText("Painful but transparent", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Tax-funded spending" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Debt Monetization                                                  */
/* ------------------------------------------------------------------ */

export function DebtMonetization() {
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
      ctx.fillText("Debt monetization", W / 2, 14);

      // Government issues bonds
      ctx.fillStyle = c.print;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(20, 30, 80, 35);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.print;
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 30, 80, 35);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Government", 60, 44);
      ctx.fillText("issues bonds", 60, 56);

      // Arrow
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(105, 48);
      ctx.lineTo(130, 48);
      ctx.stroke();

      // Central bank buys with new money
      ctx.fillStyle = c.money;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(135, 30, 85, 35);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.money;
      ctx.strokeRect(135, 30, 85, 35);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Central bank", 177, 44);
      ctx.fillText("buys with NEW $", 177, 56);

      // Arrow down showing money entering
      ctx.strokeStyle = c.print;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(177, 68);
      ctx.lineTo(177, 85);
      ctx.stroke();

      // New money indicator
      const pulse = 0.5 + Math.sin(elapsed * 3) * 0.3;
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.money;
      ctx.globalAlpha = pulse;
      ctx.fillText("+ $1 TRILLION NEW MONEY", W / 2, 98);
      ctx.globalAlpha = 1;

      // Properties
      const propY = 115;
      const props = [
        { label: "Taxes raised:", value: "None", color: c.print },
        { label: "Vote required:", value: "None", color: c.print },
        { label: "Public debate:", value: "None", color: c.print },
        { label: "Total supply:", value: "+$1T", color: c.print },
        { label: "Purchasing power:", value: "Diluted", color: c.print },
      ];

      for (let i = 0; i < props.length; i++) {
        const prop = props[i]!;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "left";
        ctx.fillText(prop.label, 30, propY + i * 17);
        ctx.fillStyle = prop.color;
        ctx.textAlign = "right";
        ctx.fillText(prop.value, 290, propY + i * 17);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.print;
      ctx.textAlign = "center";
      ctx.fillText("The bill comes later, paid by all", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Debt monetization" canvasRef={canvasRef} />;
}
