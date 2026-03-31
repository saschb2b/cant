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
  dim: string;
  loyal: string;
  traitor: string;
  msg: string;
  bad: string;
  good: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    loyal: isDark ? "#60a5fa" : "#2563eb",
    traitor: isDark ? "#f87171" : "#dc2626",
    msg: isDark ? "#fbbf24" : "#d97706",
    bad: isDark ? "#f87171" : "#dc2626",
    good: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Trust everyone (no fault tolerance)                                */
/* ------------------------------------------------------------------ */

export function ByzantineTrustAll() {
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
    const CYCLE = 6;

    const generals = [
      { x: W / 2, y: 40, label: "Gen A" },
      { x: 50, y: 120, label: "Gen B" },
      { x: W - 50, y: 120, label: "Gen C" },
      { x: W / 2, y: 190, label: "Gen D" },
    ];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      const t = elapsed % CYCLE;

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
      ctx.fillStyle = c.dim;
      ctx.fillText("Trust all messages", W / 2, 18);

      // Draw generals (Gen C is traitor but not marked yet)
      for (let i = 0; i < generals.length; i++) {
        const g = generals[i]!;
        ctx.beginPath();
        ctx.arc(g.x, g.y, 16, 0, Math.PI * 2);
        const isTraitor = i === 2 && t > 2;
        ctx.fillStyle = isTraitor ? c.traitor : c.loyal;
        ctx.fill();
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(g.label, g.x, g.y + 4);
      }

      // Messages phase
      if (t > 1 && t < 3) {
        // Gen C sends conflicting messages
        ctx.font = "8px monospace";
        ctx.fillStyle = c.msg;
        ctx.textAlign = "center";
        ctx.fillText('"ATTACK"', (generals[2]!.x + generals[0]!.x) / 2, 75);
        ctx.fillText('"RETREAT"', (generals[2]!.x + generals[3]!.x) / 2, 160);
      }

      // Chaos
      if (t > 3) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.bad;
        ctx.textAlign = "center";
        ctx.fillText("Conflicting orders accepted", W / 2, H - 40);
        ctx.fillText("Army splits, attack fails", W / 2, H - 25);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="No traitor tolerance" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  BFT consensus (tolerates traitors)                                 */
/* ------------------------------------------------------------------ */

export function ByzantineBFT() {
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
    const CYCLE = 6;

    const generals = [
      { x: W / 2, y: 40, label: "Gen A", loyal: true },
      { x: 50, y: 120, label: "Gen B", loyal: true },
      { x: W - 50, y: 120, label: "Gen C", loyal: false },
      { x: W / 2, y: 190, label: "Gen D", loyal: true },
    ];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      const t = elapsed % CYCLE;

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
      ctx.fillStyle = c.dim;
      ctx.fillText("BFT consensus", W / 2, 18);

      // Draw generals
      for (const g of generals) {
        ctx.beginPath();
        ctx.arc(g.x, g.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = g.loyal ? c.loyal : c.traitor;
        ctx.fill();
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(g.label, g.x, g.y + 4);
      }

      // Voting phase
      if (t > 1.5) {
        ctx.font = "8px monospace";
        ctx.textAlign = "center";

        // Loyal votes
        ctx.fillStyle = c.good;
        ctx.fillText("ATTACK", generals[0]!.x + 25, generals[0]!.y);
        ctx.fillText("ATTACK", generals[1]!.x + 25, generals[1]!.y);
        ctx.fillText("ATTACK", generals[3]!.x + 25, generals[3]!.y);

        // Traitor vote
        ctx.fillStyle = c.bad;
        ctx.fillText("RETREAT", generals[2]!.x - 30, generals[2]!.y);
      }

      // Majority wins
      if (t > 3) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.good;
        ctx.textAlign = "center";
        ctx.fillText("3 of 4 agree: ATTACK", W / 2, H - 55);
        ctx.fillText("Traitor outvoted (need >2/3 honest)", W / 2, H - 40);
        ctx.fillText("Consensus reached despite traitor", W / 2, H - 25);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Tolerates up to 1/3 traitors"
      canvasRef={canvasRef}
    />
  );
}
