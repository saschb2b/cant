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
  shells: string;
  beads: string;
  cattle: string;
  salt: string;
  gold: string;
  fadedOut: string;
  timeline: string;
}

interface FloatingItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  color: string;
  alpha: number;
  size: number;
}

/* ------------------------------------------------------------------ */
/*  Scatter (chaotic, no order)                                        */
/* ------------------------------------------------------------------ */

export function MoneyTimelineScatter() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsRef = useRef(getColors(isDark));
  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    const items: FloatingItem[] = [];
    const labels = ["Shells", "Beads", "Cattle", "Salt", "Gold"];

    function spawnItem() {
      const idx = Math.floor(Math.random() * labels.length);
      const c = colorsRef.current;
      const colorMap = [c.shells, c.beads, c.cattle, c.salt, c.gold];
      items.push({
        x: Math.random() * (W - 40) + 20,
        y: Math.random() * (H - 60) + 40,
        vx: (Math.random() - 0.5) * 40,
        vy: (Math.random() - 0.5) * 40,
        label: labels[idx]!,
        color: colorMap[idx]!,
        alpha: 1,
        size: 10 + Math.random() * 8,
      });
    }

    for (let i = 0; i < 8; i++) spawnItem();

    let rafId = 0;
    let lastTime = 0;
    let spawnTimer = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      spawnTimer += dt;

      if (spawnTimer > 0.6 && items.length < 14) {
        spawnItem();
        spawnTimer = 0;
      }

      for (const item of items) {
        item.x += item.vx * dt;
        item.y += item.vy * dt;
        if (item.x < 15 || item.x > W - 15) item.vx *= -1;
        if (item.y < 30 || item.y > H - 15) item.vy *= -1;
        item.alpha -= dt * 0.12;
      }

      // Remove faded items, respawn
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i]!.alpha <= 0) {
          items.splice(i, 1);
          spawnItem();
        }
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
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Money forms (scattered)", W / 2, 18);

      for (const item of items) {
        ctx.globalAlpha = Math.max(0, item.alpha);
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(item.label, item.x, item.y + item.size + 12);
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Money forms (scattered)" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Progression (historical timeline)                                  */
/* ------------------------------------------------------------------ */

export function MoneyTimelineProgression() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsRef = useRef(getColors(isDark));
  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    const stages = [
      { label: "Shells", year: "3000 BC", fades: true },
      { label: "Beads", year: "2000 BC", fades: true },
      { label: "Cattle", year: "1500 BC", fades: true },
      { label: "Salt", year: "800 BC", fades: true },
      { label: "Gold", year: "600 BC", fades: false },
    ];

    let rafId = 0;
    let lastTime = 0;
    let elapsed = 0;
    const CYCLE = 8;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      const cycleT = elapsed % CYCLE;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const c = colorsRef.current;
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);

      // Timeline line
      const lineY = 130;
      const startX = 30;
      const endX = W - 30;
      ctx.strokeStyle = c.timeline;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, lineY);
      ctx.lineTo(endX, lineY);
      ctx.stroke();

      // Arrow
      ctx.beginPath();
      ctx.moveTo(endX - 8, lineY - 5);
      ctx.lineTo(endX, lineY);
      ctx.lineTo(endX - 8, lineY + 5);
      ctx.stroke();

      const colorMap = [c.shells, c.beads, c.cattle, c.salt, c.gold];
      const spacing = (endX - startX) / (stages.length - 1);

      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i]!;
        const cx = startX + i * spacing;
        const appearTime = (i / stages.length) * (CYCLE * 0.6);
        const fadeTime = appearTime + CYCLE * 0.25;

        if (cycleT < appearTime) continue;

        let alpha = Math.min(1, (cycleT - appearTime) / 0.5);
        if (stage.fades && cycleT > fadeTime) {
          alpha = Math.max(0.15, 1 - (cycleT - fadeTime) / 1.0);
        }

        ctx.globalAlpha = alpha;

        // Circle
        const radius = stage.fades ? 10 : 14;
        ctx.beginPath();
        ctx.arc(cx, lineY - 30, radius, 0, Math.PI * 2);
        ctx.fillStyle = colorMap[i]!;
        ctx.fill();

        // Label
        ctx.font = stage.fades ? "9px monospace" : "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(stage.label, cx, lineY + 20);

        // Year
        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText(stage.year, cx, lineY + 32);

        // Gold highlight ring
        if (!stage.fades && cycleT > fadeTime) {
          ctx.strokeStyle = c.gold;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, lineY - 30, radius + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Title
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Money forms (ordered)", W / 2, 18);

      // Surviving label at bottom
      if (cycleT > CYCLE * 0.7) {
        const a = Math.min(1, (cycleT - CYCLE * 0.7) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.gold;
        ctx.fillText("Selection over time", W / 2, H - 20);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Money forms (ordered)" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Color helper                                                       */
/* ------------------------------------------------------------------ */

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    shells: isDark ? "#f9a8d4" : "#ec4899",
    beads: isDark ? "#93c5fd" : "#3b82f6",
    cattle: isDark ? "#a78bfa" : "#7c3aed",
    salt: isDark ? "#d4d4d4" : "#737373",
    gold: isDark ? "#fbbf24" : "#d97706",
    fadedOut: isDark ? "#444" : "#ccc",
    timeline: isDark ? "#555" : "#aaa",
  };
}
