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
  visible: string;
  hidden: string;
  accent: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    visible: isDark ? "#4ade80" : "#16a34a",
    hidden: isDark ? "#f87171" : "#dc2626",
    accent: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Explicit Tax                                                       */
/* ------------------------------------------------------------------ */

export function ExplicitTax() {
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
      ctx.fillText("Explicit taxation", W / 2, 14);

      // Paystub
      const stubX = 50;
      const stubY = 35;
      const stubW = 220;
      const stubH = 130;
      ctx.fillStyle = isDark ? "#262626" : "#f5f5f5";
      ctx.fillRect(stubX, stubY, stubW, stubH);
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.strokeRect(stubX, stubY, stubW, stubH);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("PAYSTUB", stubX + 10, stubY + 18);

      // Line items
      const items = [
        { label: "Gross pay:", value: "$5,000", color: c.text },
        { label: "Federal tax:", value: "-$750", color: c.visible },
        { label: "State tax:", value: "-$250", color: c.visible },
        { label: "FICA:", value: "-$380", color: c.visible },
        { label: "Net pay:", value: "$3,620", color: c.text },
      ];

      for (let i = 0; i < items.length; i++) {
        const item = items[i]!;
        const iy = stubY + 35 + i * 18;
        ctx.font = "9px monospace";
        ctx.fillStyle = item.color;
        ctx.textAlign = "left";
        ctx.fillText(item.label, stubX + 15, iy);
        ctx.textAlign = "right";
        ctx.fillText(item.value, stubX + stubW - 15, iy);
      }

      // Separator before net
      ctx.strokeStyle = c.dimText;
      ctx.beginPath();
      ctx.moveTo(stubX + 15, stubY + 117);
      ctx.lineTo(stubX + stubW - 15, stubY + 117);
      ctx.stroke();

      // Checkmarks
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.visible;
      ctx.textAlign = "center";
      ctx.fillText("Visible", W / 2 - 50, H - 40);
      ctx.fillText("Voted on", W / 2 + 50, H - 40);
      ctx.fillText("Accountable", W / 2, H - 22);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.visible;
      ctx.fillText("You see exactly what you pay", W / 2, H - 8);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Explicit taxation" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Inflation Tax                                                      */
/* ------------------------------------------------------------------ */

export function InflationTax() {
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
      ctx.fillText("Inflation as hidden tax", W / 2, 14);

      // Savings bar shrinking
      const barX = 40;
      const barY = 40;
      const barW = 240;
      const barH = 30;
      const erosion = Math.min(elapsed * 0.02, 0.5);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText("Your savings:", barX, barY - 5);

      // Full bar (what you had)
      ctx.fillStyle = c.hidden;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.globalAlpha = 1;

      // Remaining purchasing power
      const remainingW = barW * (1 - erosion);
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(barX, barY, remainingW, barH);
      ctx.globalAlpha = 1;

      // Eroded portion label
      if (erosion > 0.05) {
        ctx.font = "8px monospace";
        ctx.fillStyle = c.hidden;
        ctx.textAlign = "center";
        ctx.fillText(
          `${Math.floor(erosion * 100)}% lost`,
          barX + remainingW + (barW - remainingW) / 2,
          barY + 18,
        );
      }

      // No paystub line
      const noY = 90;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "left";
      ctx.fillText("On your paystub:", barX, noY);
      ctx.fillStyle = c.hidden;
      ctx.fillText("nothing", barX + 120, noY);

      // No vote
      ctx.fillText("Vote required:", barX, noY + 18);
      ctx.fillStyle = c.hidden;
      ctx.fillText("none", barX + 120, noY + 18);

      // No debate
      ctx.fillText("Public debate:", barX, noY + 36);
      ctx.fillStyle = c.hidden;
      ctx.fillText("none", barX + 120, noY + 36);

      // 7% rate
      const rateY = 165;
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.hidden;
      ctx.textAlign = "center";
      ctx.fillText("7% inflation = 7% tax", W / 2, rateY);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("on all cash holdings, every year", W / 2, rateY + 16);
      ctx.fillText("no exemptions, no oversight", W / 2, rateY + 30);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.hidden;
      ctx.fillText("Silent, invisible, no consent", W / 2, H - 8);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Inflation as hidden tax" canvasRef={canvasRef} />
  );
}
