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
  asset: string;
  owner: string;
  claim: string;
  warning: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    asset: isDark ? "#fbbf24" : "#d97706",
    owner: isDark ? "#4ade80" : "#16a34a",
    claim: isDark ? "#f87171" : "#dc2626",
    warning: isDark ? "#f59e0b" : "#ea580c",
  };
}

/* ------------------------------------------------------------------ */
/*  Single Claim                                                       */
/* ------------------------------------------------------------------ */

export function SingleClaim() {
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

      // Asset (gold bar)
      const ax = W / 2;
      const ay = 80;
      ctx.fillStyle = c.asset;
      ctx.fillRect(ax - 30, ay, 60, 30);
      ctx.strokeStyle = c.asset;
      ctx.lineWidth = 2;
      ctx.strokeRect(ax - 30, ay, 60, 30);
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("ASSET", ax, ay + 20);

      // Owner circle
      const ox = W / 2;
      const oy = 175;
      ctx.beginPath();
      ctx.arc(ox, oy, 15, 0, Math.PI * 2);
      ctx.fillStyle = c.owner;
      ctx.fill();
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Owner", ox, oy + 30);

      // Arrow from owner to asset (pulsing)
      const pulse = 0.6 + 0.4 * Math.sin(elapsed * 2);
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = c.owner;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ox, oy - 15);
      ctx.lineTo(ax, ay + 32);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ax - 5, ay + 37);
      ctx.lineTo(ax, ay + 30);
      ctx.lineTo(ax + 5, ay + 37);
      ctx.fillStyle = c.owner;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("1 asset, 1 owner", W / 2, 225);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Single claim on asset", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Single claim on asset" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Multiple Claims (rehypothecation)                                  */
/* ------------------------------------------------------------------ */

export function MultipleClaims() {
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

    const claimants = [
      { label: "Bank A", angle: -Math.PI * 0.7 },
      { label: "Fund B", angle: -Math.PI * 0.3 },
      { label: "Bank C", angle: Math.PI * 0.1 },
      { label: "Fund D", angle: Math.PI * 0.5 },
    ];

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

      // Asset at center
      const ax = W / 2;
      const ay = 110;
      ctx.fillStyle = c.asset;
      ctx.fillRect(ax - 25, ay - 12, 50, 24);
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("ASSET", ax, ay + 4);

      // Claimants around the asset
      const cycle = elapsed % 6;
      const radius = 80;

      for (let i = 0; i < claimants.length; i++) {
        const claimant = claimants[i]!;
        const appearTime = i * 1.2;
        if (cycle < appearTime) continue;

        const progress = Math.min(1, (cycle - appearTime) / 0.8);
        const cx = ax + Math.cos(claimant.angle) * radius;
        const cy = ay + Math.sin(claimant.angle) * radius;

        ctx.globalAlpha = progress;

        // Claimant circle
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fillStyle = c.claim;
        ctx.fill();

        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.fillText(claimant.label, cx, cy + 24);

        // Arrow to asset
        const arrowPulse = 0.5 + 0.5 * Math.sin(elapsed * 3 + i);
        ctx.globalAlpha = progress * arrowPulse;
        ctx.strokeStyle = c.claim;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ax, ay);
        ctx.stroke();

        ctx.globalAlpha = 1;
      }

      // Warning label
      if (cycle > 4) {
        const wAlpha = Math.min(1, (cycle - 4) / 0.5);
        ctx.globalAlpha = wAlpha;
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.warning;
        ctx.fillText("Same asset pledged 4 times", W / 2, 220);
        ctx.globalAlpha = 1;
      }

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Rehypothecation chain", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Rehypothecation chain" canvasRef={canvasRef} />
  );
}
