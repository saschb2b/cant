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
  banked: string;
  unbanked: string;
  border: string;
  counter: string;
  requirement: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    banked: isDark ? "#4ade80" : "#16a34a",
    unbanked: isDark ? "#f87171" : "#dc2626",
    border: isDark ? "#555" : "#bbb",
    counter: isDark ? "#fbbf24" : "#d97706",
    requirement: isDark ? "#93c5fd" : "#3b82f6",
  };
}

// Simplified world regions as rectangles
interface Region {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  bankedRate: number; // 0 to 1
}

const REGIONS: Region[] = [
  { label: "N.America", x: 15, y: 45, w: 55, h: 40, bankedRate: 0.94 },
  { label: "S.America", x: 35, y: 95, w: 35, h: 45, bankedRate: 0.74 },
  { label: "Europe", x: 105, y: 40, w: 50, h: 35, bankedRate: 0.95 },
  { label: "Africa", x: 105, y: 85, w: 50, h: 55, bankedRate: 0.43 },
  { label: "M.East", x: 165, y: 60, w: 30, h: 30, bankedRate: 0.58 },
  { label: "S.Asia", x: 195, y: 65, w: 40, h: 35, bankedRate: 0.56 },
  { label: "E.Asia", x: 240, y: 50, w: 45, h: 35, bankedRate: 0.85 },
  { label: "Oceania", x: 250, y: 105, w: 35, h: 25, bankedRate: 0.95 },
];

/* ------------------------------------------------------------------ */
/*  Banked Population (optimistic view)                                */
/* ------------------------------------------------------------------ */

export function BankedPopulation() {
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

      // All regions green
      for (const region of REGIONS) {
        ctx.fillStyle = c.banked;
        ctx.globalAlpha = 0.6 + 0.1 * Math.sin(elapsed * 1.5);
        ctx.fillRect(region.x, region.y, region.w, region.h);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(region.x, region.y, region.w, region.h);

        ctx.font = "7px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(
          region.label,
          region.x + region.w / 2,
          region.y + region.h / 2 + 3,
        );
      }

      // "Has bank account" label
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.banked;
      ctx.textAlign = "center";
      ctx.fillText("Everyone has access", W / 2, 165);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Assumes universal bank coverage", W / 2, 182);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Banked population (assumption)", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Banked population assumption"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Unbanked Reality                                                   */
/* ------------------------------------------------------------------ */

export function UnbankedReality() {
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

    const requirements = [
      "Government ID",
      "Proof of address",
      "Minimum balance",
      "Credit history",
      "Employer letter",
      "Utility bills",
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

      // Regions colored by banked rate
      for (const region of REGIONS) {
        if (region.bankedRate > 0.8) {
          ctx.fillStyle = c.banked;
          ctx.globalAlpha = 0.5;
        } else if (region.bankedRate > 0.6) {
          ctx.fillStyle = c.counter;
          ctx.globalAlpha = 0.5;
        } else {
          ctx.fillStyle = c.unbanked;
          ctx.globalAlpha = 0.6;
        }
        ctx.fillRect(region.x, region.y, region.w, region.h);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(region.x, region.y, region.w, region.h);

        ctx.font = "7px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(
          region.label,
          region.x + region.w / 2,
          region.y + region.h / 2 + 3,
        );

        // Percentage
        if (region.bankedRate < 0.8) {
          ctx.font = "bold 7px monospace";
          ctx.fillStyle = c.unbanked;
          ctx.fillText(
            `${Math.round(region.bankedRate * 100)}%`,
            region.x + region.w / 2,
            region.y + region.h / 2 + 13,
          );
        }
      }

      // Counter
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.unbanked;
      ctx.textAlign = "center";
      ctx.fillText("1.4 billion excluded", W / 2, 155);

      // Scrolling requirements
      const reqIndex = Math.floor(elapsed * 0.7) % requirements.length;
      const req = requirements[reqIndex]!;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.requirement;
      ctx.fillText(`Required: ${req}`, W / 2, 175);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Many lack documents to open accounts", W / 2, 195);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Unbanked reality", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Unbanked reality" canvasRef={canvasRef} />;
}
