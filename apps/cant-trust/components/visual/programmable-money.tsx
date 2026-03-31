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
  free: string;
  restricted: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    free: isDark ? "#4ade80" : "#16a34a",
    restricted: isDark ? "#f87171" : "#dc2626",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Free Money                                                         */
/* ------------------------------------------------------------------ */

export function FreeMoney() {
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
      ctx.fillText("Unrestricted money", W / 2, 14);

      // Dollar bill representation
      const billX = 80;
      const billY = 35;
      const billW = 160;
      const billH = 80;
      ctx.fillStyle = c.free;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(billX, billY, billW, billH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.free;
      ctx.lineWidth = 2;
      ctx.strokeRect(billX, billY, billW, billH);

      ctx.font = "bold 20px monospace";
      ctx.fillStyle = c.free;
      ctx.textAlign = "center";
      ctx.fillText("$", billX + billW / 2, billY + 35);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("No restrictions", billX + billW / 2, billY + 55);
      ctx.fillText("No expiration", billX + billW / 2, billY + 68);

      // Checkmarks for all categories
      const categories = [
        "Spend anywhere",
        "Spend anytime",
        "Spend on anything",
        "Save indefinitely",
        "Universal acceptance",
      ];

      for (let i = 0; i < categories.length; i++) {
        const y = 132 + i * 18;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.free;
        ctx.textAlign = "left";
        ctx.fillText("[OK]", 60, y);
        ctx.fillStyle = c.text;
        ctx.fillText(categories[i], 95, y);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Your money, your choice", W / 2, 232);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Unrestricted money" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Programmable Money                                                 */
/* ------------------------------------------------------------------ */

export function ProgrammableMoney() {
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
      ctx.fillText("Programmable restrictions", W / 2, 14);

      // Digital token
      const tokenX = 100;
      const tokenY = 30;
      const tokenW = 120;
      const tokenH = 40;
      ctx.fillStyle = c.restricted;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(tokenX, tokenY, tokenW, tokenH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.restricted;
      ctx.lineWidth = 2;
      ctx.strokeRect(tokenX, tokenY, tokenW, tokenH);

      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.restricted;
      ctx.textAlign = "center";
      ctx.fillText("CBDC$", tokenX + tokenW / 2, tokenY + 28);

      // Restrictions animated
      const restrictions = [
        {
          label: "Expires in:",
          value: () => `${Math.max(0, 30 - Math.floor(elapsed % 31))} days`,
        },
        { label: "Merchants:", value: () => "approved only" },
        { label: "Radius:", value: () => "max 50km" },
        { label: "Category:", value: () => "food only" },
      ];

      for (let i = 0; i < restrictions.length; i++) {
        const y = 82 + i * 22;
        const r = restrictions[i];

        ctx.fillStyle = c.block;
        ctx.fillRect(40, y, 240, 18);
        ctx.strokeStyle = c.blockStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(40, y, 240, 18);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "left";
        ctx.fillText(r.label, 48, y + 13);

        ctx.fillStyle = c.restricted;
        ctx.textAlign = "right";
        ctx.fillText(r.value(), 272, y + 13);
      }

      // Geofence circle animation
      const geoY = 185;
      const geoR = 20 + 3 * Math.sin(elapsed * 2);
      ctx.strokeStyle = c.restricted;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(W / 2, geoY, geoR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "7px monospace";
      ctx.fillStyle = c.restricted;
      ctx.textAlign = "center";
      ctx.fillText("50km", W / 2, geoY + 4);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Money as a control mechanism", W / 2, 222);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Programmable restrictions" canvasRef={canvasRef} />
  );
}
