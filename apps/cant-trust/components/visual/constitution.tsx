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
  central: string;
  pillar: string;
  danger: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    central: isDark ? "#f87171" : "#dc2626",
    pillar: isDark ? "#4ade80" : "#16a34a",
    danger: isDark ? "#f87171" : "#dc2626",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Single Authority                                                   */
/* ------------------------------------------------------------------ */

export function SingleAuthority() {
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
      ctx.fillText("Single authority", W / 2, 14);

      // Central authority figure
      ctx.fillStyle = c.central;
      ctx.beginPath();
      ctx.arc(W / 2, 60, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("ONE", W / 2, 57);
      ctx.fillText("ENTITY", W / 2, 67);

      // Decisions flowing down
      const decisions = [
        "Change supply cap",
        "Redirect treasury",
        "Block addresses",
        "Modify rules",
      ];

      for (let i = 0; i < decisions.length; i++) {
        const y = 100 + i * 24;
        const appear = elapsed > i * 0.5;
        if (!appear) continue;

        ctx.strokeStyle = c.central;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W / 2, 84);
        ctx.lineTo(W / 2, y - 5);
        ctx.stroke();

        ctx.fillStyle = c.block;
        ctx.fillRect(80, y, 160, 18);
        ctx.strokeStyle = c.central;
        ctx.strokeRect(80, y, 160, 18);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.central;
        ctx.textAlign = "center";
        ctx.fillText(decisions[i], W / 2, y + 13);
      }

      // "Trust us"
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.central;
      ctx.textAlign = "center";
      ctx.fillText('"Trust us"', W / 2, 210);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Fast decisions, no checks", W / 2, 228);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Single authority" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Three Pillar Governance                                            */
/* ------------------------------------------------------------------ */

export function ThreePillarGovernance() {
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
      ctx.fillText("Three-pillar governance", W / 2, 14);

      // Three pillars
      const pillars = [
        { x: 55, label: "DReps", sub: "Representatives" },
        { x: 160, label: "CC", sub: "Constitutional" },
        { x: 265, label: "SPOs", sub: "Stake Pools" },
      ];

      const pillarH = 90;
      const pillarW = 60;
      const baseY = 130;

      // Animated highlight cycling
      const highlightIdx = Math.floor(elapsed * 0.7) % 3;

      for (let i = 0; i < pillars.length; i++) {
        const p = pillars[i];
        const isHighlight = i === highlightIdx;
        const glow = isHighlight ? 0.3 + 0.1 * Math.sin(elapsed * 4) : 0.15;

        // Pillar body
        ctx.fillStyle = c.pillar;
        ctx.globalAlpha = glow;
        ctx.fillRect(p.x - pillarW / 2, baseY - pillarH, pillarW, pillarH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isHighlight ? c.pillar : c.blockStroke;
        ctx.lineWidth = isHighlight ? 2 : 1.5;
        ctx.strokeRect(p.x - pillarW / 2, baseY - pillarH, pillarW, pillarH);

        // Pillar cap
        ctx.fillStyle = c.block;
        ctx.fillRect(
          p.x - pillarW / 2 - 5,
          baseY - pillarH - 8,
          pillarW + 10,
          10,
        );
        ctx.strokeStyle = c.blockStroke;
        ctx.strokeRect(
          p.x - pillarW / 2 - 5,
          baseY - pillarH - 8,
          pillarW + 10,
          10,
        );

        ctx.font = "bold 8px monospace";
        ctx.fillStyle = isHighlight ? c.pillar : c.text;
        ctx.textAlign = "center";
        ctx.fillText(p.label, p.x, baseY - pillarH + 20);
        ctx.font = "6px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText(p.sub, p.x, baseY - pillarH + 32);
      }

      // Base (floor)
      ctx.fillStyle = c.block;
      ctx.fillRect(15, baseY, 290, 10);
      ctx.strokeStyle = c.blockStroke;
      ctx.strokeRect(15, baseY, 290, 10);

      // Checks and balances arrows between pillars
      ctx.strokeStyle = c.pillar;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      for (let i = 0; i < 3; i++) {
        const next = (i + 1) % 3;
        ctx.beginPath();
        ctx.moveTo(pillars[i].x, baseY - pillarH / 2);
        ctx.lineTo(pillars[next].x, baseY - pillarH / 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Constitution label at bottom
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.pillar;
      ctx.textAlign = "center";
      ctx.fillText("Checks and balances", W / 2, 155);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Constitutional guardrails protect", W / 2, 175);
      ctx.fillText("foundational principles from override", W / 2, 191);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.pillar;
      ctx.fillText("No single body has absolute power", W / 2, 215);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Three-pillar governance" canvasRef={canvasRef} />
  );
}
