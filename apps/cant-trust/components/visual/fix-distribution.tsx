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
  accent: string;
  top: string;
  bottom: string;
  fair: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    top: isDark ? "#4ade80" : "#16a34a",
    bottom: isDark ? "#f87171" : "#dc2626",
    fair: isDark ? "#4ade80" : "#16a34a",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Cantillon Unfair                                                   */
/* ------------------------------------------------------------------ */

export function CantillonUnfair() {
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
      ctx.fillText("Cantillon effect", W / 2, 14);

      // Pyramid of recipients
      const layers = [
        { label: "Banks", y: 40, color: c.top, price: "old prices" },
        {
          label: "Corporations",
          y: 80,
          color: c.accent,
          price: "rising prices",
        },
        {
          label: "Middle class",
          y: 120,
          color: c.dimText,
          price: "high prices",
        },
        {
          label: "Wage earners",
          y: 160,
          color: c.bottom,
          price: "highest prices",
        },
      ];

      // New money entering at top
      const moneyDrop = (elapsed * 40) % 160;
      ctx.fillStyle = c.top;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(W / 2, 25 + moneyDrop, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Printer at top
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.top;
      ctx.textAlign = "center";
      ctx.fillText("New money enters here", W / 2, 32);

      for (let i = 0; i < layers.length; i++) {
        const l = layers[i];
        const layerW = 80 + i * 40;
        const x = (W - layerW) / 2;

        ctx.fillStyle = l.color;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(x, l.y, layerW, 30);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = l.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, l.y, layerW, 30);

        ctx.font = "8px monospace";
        ctx.fillStyle = l.color;
        ctx.textAlign = "left";
        ctx.fillText(l.label, x + 5, l.y + 13);

        ctx.textAlign = "right";
        ctx.fillText(l.price, x + layerW - 5, l.y + 13);

        // Arrow showing benefit shrinking
        const benefit = Math.max(0.1, 1 - i * 0.3);
        ctx.fillStyle = l.color;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(x + 5, l.y + 20, (layerW - 10) * benefit, 6);
        ctx.globalAlpha = 1;
        ctx.font = "6px monospace";
        ctx.fillStyle = l.color;
        ctx.textAlign = "left";
        ctx.fillText("benefit", x + 5, l.y + 27);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.bottom;
      ctx.textAlign = "center";
      ctx.fillText("First receivers buy at old prices", W / 2, 205);
      ctx.fillText("Last receivers pay inflated prices", W / 2, 221);
      ctx.font = "bold 9px monospace";
      ctx.fillText("Same money, unequal purchasing power", W / 2, 237);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Cantillon effect" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Mining Fair                                                        */
/* ------------------------------------------------------------------ */

export function MiningFair() {
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
      ctx.fillText("Fair distribution", W / 2, 14);

      // Equal participants at same level
      const participants = [
        { x: 55, label: "Miner A" },
        { x: 130, label: "Miner B" },
        { x: 205, label: "Staker C" },
        { x: 275, label: "Staker D" },
      ];

      const pY = 55;
      for (const p of participants) {
        ctx.fillStyle = c.fair;
        ctx.beginPath();
        ctx.arc(p.x, pY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "6px monospace";
        ctx.fillStyle = c.bg;
        ctx.textAlign = "center";
        ctx.fillText(p.label, p.x, pY + 3);
      }

      // All at same level line
      ctx.strokeStyle = c.blockStroke;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(30, pY);
      ctx.lineTo(290, pY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "right";
      ctx.fillText("same level", 315, pY + 3);

      // Energy/work input arrows going up
      for (const p of participants) {
        const arrowPhase = Math.sin(elapsed * 2 + p.x * 0.05) * 3;
        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, pY + 14);
        ctx.lineTo(p.x, pY + 30 + arrowPhase);
        ctx.stroke();
        ctx.font = "6px monospace";
        ctx.fillStyle = c.accent;
        ctx.textAlign = "center";
        ctx.fillText("work", p.x, pY + 42);
      }

      // Reward distribution (equal arrows coming down)
      const rewardY = 110;
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.fair;
      ctx.textAlign = "center";
      ctx.fillText("PROTOCOL RULES", W / 2, rewardY);

      ctx.strokeStyle = c.fair;
      ctx.lineWidth = 1.5;
      for (const p of participants) {
        ctx.beginPath();
        ctx.moveTo(p.x, rewardY + 5);
        ctx.lineTo(p.x, rewardY + 25);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x - 3, rewardY + 21);
        ctx.lineTo(p.x, rewardY + 27);
        ctx.lineTo(p.x + 3, rewardY + 21);
        ctx.fillStyle = c.fair;
        ctx.fill();
      }

      // Equal rewards
      ctx.font = "7px monospace";
      ctx.fillStyle = c.fair;
      for (const p of participants) {
        ctx.textAlign = "center";
        ctx.fillText("reward", p.x, rewardY + 40);
      }

      // Rules
      const rules = [
        "No special access needed",
        "Anyone can participate",
        "Earn proportional to contribution",
        "Rules are the same for everyone",
      ];

      for (let i = 0; i < rules.length; i++) {
        const y = 160 + i * 14;
        ctx.font = "8px monospace";
        ctx.fillStyle = c.fair;
        ctx.textAlign = "left";
        ctx.fillText(`[OK] ${rules[i]}`, 50, y);
      }

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.fair;
      ctx.textAlign = "center";
      ctx.fillText("No Cantillon effect", W / 2, 225);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Fair distribution" canvasRef={canvasRef} />;
}
