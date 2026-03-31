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
  honest: string;
  hidden: string;
  accent: string;
  barBg: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    honest: isDark ? "#4ade80" : "#16a34a",
    hidden: isDark ? "#f87171" : "#dc2626",
    accent: isDark ? "#fbbf24" : "#d97706",
    barBg: isDark ? "#334155" : "#e2e8f0",
  };
}

/* ------------------------------------------------------------------ */
/*  Explicit Default                                                   */
/* ------------------------------------------------------------------ */

export function ExplicitDefault() {
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
      ctx.fillText("Explicit default", W / 2, 14);

      // Announcement
      ctx.fillStyle = c.honest;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(30, 28, W - 60, 35);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.honest;
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 28, W - 60, 35);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText('"We cannot pay our debts"', W / 2, 50);

      // Consequences (visible, immediate)
      const items = [
        { label: "Creditors take losses", type: "visible" },
        { label: "Bond prices collapse", type: "visible" },
        { label: "Credit rating downgraded", type: "visible" },
        { label: "Everyone knows the situation", type: "visible" },
        { label: "Markets reprice and move on", type: "visible" },
      ];

      for (let i = 0; i < items.length; i++) {
        const iy = 75 + i * 20;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.honest;
        ctx.textAlign = "left";
        ctx.fillText(">> " + items[i]!.label, 40, iy);
      }

      // Historical examples
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Argentina, Greece, Russia", W / 2, 195);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.honest;
      ctx.fillText("Painful but transparent", W / 2, 215);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.honest;
      ctx.fillText("Government must rebuild trust", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Explicit default" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Soft Default via Inflation                                         */
/* ------------------------------------------------------------------ */

export function SoftDefault() {
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
      ctx.fillText("Soft default via inflation", W / 2, 14);

      // Debt bar and its real value shrinking
      const barX = 30;
      const barY = 35;
      const barW = 260;
      const barH = 30;
      const erosion = Math.min(elapsed * 0.03, 0.5);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText("$1T debt (nominal):", barX, barY - 4);

      ctx.fillStyle = c.barBg;
      ctx.fillRect(barX, barY, barW, barH);

      // Nominal (full bar)
      ctx.fillStyle = c.hidden;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.globalAlpha = 1;

      // Real value (shrinking)
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(barX, barY, barW * (1 - erosion), barH);
      ctx.globalAlpha = 1;

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText(
        `Real value: $${((1 - erosion) * 1000).toFixed(0)}B`,
        W / 2,
        barY + 20,
      );

      // Process
      const steps = [
        "Government never says 'default'",
        "Prints money to pay debts",
        "Debt repaid in nominal terms",
        "...but with debased currency",
        "Creditors 'paid' in worthless $",
      ];

      for (let i = 0; i < steps.length; i++) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.hidden;
        ctx.textAlign = "left";
        ctx.fillText(i + 1 + ". " + steps[i], 30, 88 + i * 18);
      }

      // Bottom
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.hidden;
      ctx.textAlign = "center";
      ctx.fillText("No headlines, no crisis", W / 2, 200);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.hidden;
      ctx.fillText("A slow, silent theft from every saver", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Soft default via inflation"
      canvasRef={canvasRef}
    />
  );
}
