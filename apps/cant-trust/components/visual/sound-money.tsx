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
  barFill: string;
  barEmpty: string;
  headerBg: string;
  highlight: string;
  gold: string;
  rowAlt: string;
}

/* ------------------------------------------------------------------ */
/*  Few traits (misleading comparison)                                 */
/* ------------------------------------------------------------------ */

export function SoundMoneyFewTraits() {
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

    const items = ["Glass beads", "Gold"];
    const traits = ["Shiny", "Rare"];
    // Beads: shiny=5, rare=2.  Gold: shiny=3, rare=5.
    const scores: number[][] = [
      [5, 2],
      [3, 5],
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

      const tableTop = 40;
      const rowH = 36;
      const colW = 90;
      const startX = 40;

      // Header
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("2 properties compared", W / 2, 20);

      // Column headers
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("", startX, tableTop);
      for (let j = 0; j < traits.length; j++) {
        ctx.textAlign = "center";
        ctx.fillText(traits[j]!, startX + 80 + j * colW, tableTop);
      }
      ctx.textAlign = "center";
      ctx.fillText("Total", startX + 80 + traits.length * colW, tableTop);

      // Rows
      for (let i = 0; i < items.length; i++) {
        const y = tableTop + 16 + i * rowH;

        // Alternating row bg
        if (i % 2 === 1) {
          ctx.fillStyle = c.rowAlt;
          ctx.fillRect(startX - 5, y - 10, W - 70, rowH);
        }

        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = c.text;
        ctx.fillText(items[i]!, startX, y + 4);

        let total = 0;
        for (let j = 0; j < traits.length; j++) {
          const score = scores[i]![j]!;
          total += score;
          const bx = startX + 50 + j * colW;
          const barW = 50;
          const barH = 8;

          // Animate fill
          const progress = Math.min(1, (elapsed - 0.3 * j) / 0.8);
          const fillW = (score / 5) * barW * Math.max(0, progress);

          ctx.fillStyle = c.barEmpty;
          ctx.fillRect(bx, y - 2, barW, barH);
          ctx.fillStyle = c.barFill;
          ctx.fillRect(bx, y - 2, fillW, barH);
        }

        // Total
        const totalProgress = Math.min(1, (elapsed - 0.6) / 0.5);
        if (totalProgress > 0) {
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = c.text;
          ctx.fillText(
            String(total),
            startX + 80 + traits.length * colW,
            y + 4,
          );
        }
      }

      // Conclusion arrow
      if (elapsed > 2) {
        const a = Math.min(1, (elapsed - 2) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.highlight;
        ctx.fillText("Glass beads score: 7", W / 2, 170);
        ctx.fillText("Gold score: 8", W / 2, 188);
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText("Scores appear similar", W / 2, 210);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Two-property comparison" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  All traits (complete scorecard)                                    */
/* ------------------------------------------------------------------ */

export function SoundMoneyAllTraits() {
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

    const items = ["Shells", "Silver", "Gold", "Bitcoin"];
    const traits = ["Durabl", "Divis", "Port", "Scarce", "Fungi"];
    // scores out of 5
    const scores: number[][] = [
      [1, 1, 2, 2, 3], // Shells
      [3, 4, 3, 3, 4], // Silver
      [5, 4, 3, 4, 5], // Gold
      [5, 5, 5, 5, 4], // Bitcoin
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

      const tableTop = 38;
      const rowH = 28;
      const colW = 42;
      const startX = 10;
      const dataStartX = startX + 60;

      // Title
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("5 properties of sound money", W / 2, 16);

      // Column headers
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.text;
      for (let j = 0; j < traits.length; j++) {
        ctx.textAlign = "center";
        ctx.fillText(traits[j]!, dataStartX + j * colW + 16, tableTop);
      }
      ctx.fillText("Sum", dataStartX + traits.length * colW + 10, tableTop);

      // Rows
      for (let i = 0; i < items.length; i++) {
        const y = tableTop + 14 + i * rowH;

        if (i % 2 === 1) {
          ctx.fillStyle = c.rowAlt;
          ctx.fillRect(startX, y - 10, W - 20, rowH);
        }

        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = c.text;
        ctx.fillText(items[i]!, startX + 2, y + 4);

        let total = 0;
        for (let j = 0; j < traits.length; j++) {
          const score = scores[i]![j]!;
          total += score;

          const bx = dataStartX + j * colW;
          const barW = 32;
          const barH = 6;

          const progress = Math.min(1, (elapsed - 0.15 * (i + j)) / 0.6);
          const fillW = (score / 5) * barW * Math.max(0, progress);

          ctx.fillStyle = c.barEmpty;
          ctx.fillRect(bx, y - 1, barW, barH);
          ctx.fillStyle =
            score >= 4 ? c.gold : score >= 3 ? c.barFill : c.highlight;
          ctx.fillRect(bx, y - 1, fillW, barH);
        }

        // Total
        const totalProgress = Math.min(1, (elapsed - 0.15 * i - 0.8) / 0.4);
        if (totalProgress > 0) {
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          const isTop = total >= 21;
          ctx.fillStyle = isTop ? c.gold : c.text;
          ctx.fillText(
            String(total),
            dataStartX + traits.length * colW + 10,
            y + 4,
          );
        }
      }

      // Bottom note
      if (elapsed > 2.5) {
        const a = Math.min(1, (elapsed - 2.5) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.gold;
        ctx.fillText(
          "Gold: 21/25  Bitcoin: 24/25",
          W / 2,
          tableTop + 14 + items.length * rowH + 16,
        );
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Five-property scorecard" canvasRef={canvasRef} />
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
    barFill: isDark ? "#60a5fa" : "#3b82f6",
    barEmpty: isDark ? "#333" : "#e5e5e5",
    headerBg: isDark ? "#2a2a2a" : "#f0f0f0",
    highlight: isDark ? "#f87171" : "#dc2626",
    gold: isDark ? "#fbbf24" : "#d97706",
    rowAlt: isDark ? "#222" : "#f5f5f5",
  };
}
