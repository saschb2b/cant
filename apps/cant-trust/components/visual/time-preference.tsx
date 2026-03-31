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
  low: string;
  high: string;
  accent: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    low: isDark ? "#4ade80" : "#16a34a",
    high: isDark ? "#f87171" : "#dc2626",
    accent: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Low Time Preference                                                */
/* ------------------------------------------------------------------ */

export function LowTimePreference() {
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
      ctx.fillText("Low time preference (hard money)", W / 2, 14);

      // Building a cathedral over time
      const buildProgress = Math.min(elapsed * 0.05, 1);

      // Cathedral shape (triangle roof + rectangle)
      const cx = W / 2;
      const baseY = 170;
      const buildH = 100 * buildProgress;

      ctx.fillStyle = c.low;
      ctx.globalAlpha = 0.3;
      // Base
      ctx.fillRect(cx - 40, baseY - buildH * 0.6, 80, buildH * 0.6);
      // Spire
      if (buildProgress > 0.5) {
        ctx.beginPath();
        ctx.moveTo(cx - 40, baseY - buildH * 0.6);
        ctx.lineTo(cx, baseY - buildH);
        ctx.lineTo(cx + 40, baseY - buildH * 0.6);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.low;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - 40, baseY - buildH * 0.6, 80, buildH * 0.6);
      if (buildProgress > 0.5) {
        ctx.beginPath();
        ctx.moveTo(cx - 40, baseY - buildH * 0.6);
        ctx.lineTo(cx, baseY - buildH);
        ctx.lineTo(cx + 40, baseY - buildH * 0.6);
        ctx.closePath();
        ctx.stroke();
      }

      // Timeline labels
      const years = [
        { label: "Cathedral: 100 years", y: 185 },
        { label: "Orchard: 20 years", y: 198 },
        { label: "Retirement: 40 years", y: 211 },
      ];

      for (const yr of years) {
        ctx.font = "8px monospace";
        ctx.fillStyle = c.low;
        ctx.textAlign = "center";
        ctx.fillText(yr.label, cx, yr.y);
      }

      // Side labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("Patient capital", 15, 45);
      ctx.fillText("Invest in quality", 15, 60);
      ctx.fillText("Plan for grandchildren", 15, 75);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.low;
      ctx.textAlign = "center";
      ctx.fillText('"What can I build that lasts?"', W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Low time preference (hard money)"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  High Time Preference                                               */
/* ------------------------------------------------------------------ */

export function HighTimePreference() {
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

    interface FallingItem {
      x: number;
      y: number;
      label: string;
      speed: number;
    }

    const items: FallingItem[] = [];
    let spawnTimer = 0;
    const labels = ["buy!", "now!", "sale!", "spend!", "hurry!", "FOMO!"];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      spawnTimer += dt;

      if (spawnTimer > 0.6 && items.length < 15) {
        items.push({
          x: 30 + Math.random() * (W - 60),
          y: 30,
          label: labels[Math.floor(Math.random() * labels.length)]!,
          speed: 30 + Math.random() * 40,
        });
        spawnTimer = 0;
      }

      for (const item of items) {
        item.y += item.speed * dt;
      }

      // Remove off-screen
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i]!.y > H + 10) items.splice(i, 1);
      }

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
      ctx.fillText("High time preference (soft money)", W / 2, 14);

      // Falling consumer items
      for (const item of items) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.high;
        ctx.globalAlpha = 0.5;
        ctx.textAlign = "center";
        ctx.fillText(item.label, item.x, item.y);
        ctx.globalAlpha = 1;
      }

      // Central message
      ctx.fillStyle = c.bg;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(60, 80, 200, 80);
      ctx.globalAlpha = 1;

      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Why save if savings shrink?", W / 2, 98);
      ctx.fillText("Spending now is rational", W / 2, 114);
      ctx.fillText("Short-term thinking dominates", W / 2, 130);
      ctx.fillText("Disposable goods, consume now", W / 2, 146);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.high;
      ctx.fillText('"Get it before prices go up"', W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="High time preference (soft money)"
      canvasRef={canvasRef}
    />
  );
}
