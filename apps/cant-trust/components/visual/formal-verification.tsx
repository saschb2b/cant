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
  box: string;
  boxStroke: string;
  test: string;
  gap: string;
  bug: string;
  proof: string;
  success: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    box: isDark ? "#334155" : "#e2e8f0",
    boxStroke: isDark ? "#64748b" : "#94a3b8",
    test: isDark ? "#4ade80" : "#16a34a",
    gap: isDark ? "#4a1a1a" : "#fee2e2",
    bug: isDark ? "#f87171" : "#dc2626",
    proof: isDark ? "#93c5fd" : "#3b82f6",
    success: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Test and Hope                                                      */
/* ------------------------------------------------------------------ */

export function TestAndHope() {
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
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Testing-based verification", W / 2, 16);

      // Coverage bar with gaps
      const barX = 30;
      const barY = 40;
      const barW = 260;
      const barH = 30;

      ctx.fillStyle = c.box;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = c.boxStroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barW, barH);

      // Test coverage segments (with gaps)
      const segments = [
        { start: 0, end: 0.15, tested: true },
        { start: 0.15, end: 0.22, tested: false },
        { start: 0.22, end: 0.45, tested: true },
        { start: 0.45, end: 0.5, tested: false },
        { start: 0.5, end: 0.72, tested: true },
        { start: 0.72, end: 0.78, tested: false },
        { start: 0.78, end: 0.95, tested: true },
        { start: 0.95, end: 1.0, tested: false },
      ];

      for (const seg of segments) {
        const x = barX + seg.start * barW;
        const w = (seg.end - seg.start) * barW;
        ctx.fillStyle = seg.tested ? c.test : c.gap;
        ctx.globalAlpha = seg.tested ? 0.4 : 0.6;
        ctx.fillRect(x, barY, w, barH);
        ctx.globalAlpha = 1;
      }

      // Test checkmarks
      const checks = [0.08, 0.33, 0.6, 0.86];
      for (const pos of checks) {
        ctx.font = "12px monospace";
        ctx.fillStyle = c.test;
        ctx.textAlign = "center";
        ctx.fillText("\u2713", barX + pos * barW, barY + 21);
      }

      // Gap labels
      ctx.font = "7px monospace";
      ctx.fillStyle = c.bug;
      ctx.textAlign = "center";
      ctx.fillText("gap", barX + 0.185 * barW, barY + barH + 12);
      ctx.fillText("gap", barX + 0.475 * barW, barY + barH + 12);
      ctx.fillText("gap", barX + 0.75 * barW, barY + barH + 12);

      // Bug sneaking through gap
      const bugGap = 0.75;
      const bugX = barX + bugGap * barW;
      const bugY = barY + barH + 20;
      const bugPulse = (Math.sin(elapsed * 3) + 1) / 2;

      ctx.fillStyle = c.bug;
      ctx.globalAlpha = 0.5 + bugPulse * 0.5;
      ctx.beginPath();
      ctx.arc(bugX, bugY + 10, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("BUG", bugX, bugY + 13);

      // Arrow showing bug entry
      ctx.strokeStyle = c.bug;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(bugX, barY + barH);
      ctx.lineTo(bugX, bugY + 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Tested cases pass", W / 2, bugY + 36);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.bug;
      ctx.fillText("Edge cases not covered", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Testing-based" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Mathematical Proof                                                 */
/* ------------------------------------------------------------------ */

export function MathematicalProof() {
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
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Formal verification", W / 2, 16);

      // Full coverage bar (no gaps)
      const barX = 30;
      const barY = 40;
      const barW = 260;
      const barH = 30;

      ctx.fillStyle = c.box;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = c.boxStroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barW, barH);

      // Proof coverage sweep
      const sweep = (elapsed % 5) / 5;
      const coverW = sweep * barW;

      ctx.fillStyle = c.proof;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(barX, barY, coverW, barH);
      ctx.globalAlpha = 1;

      // Full coverage outline
      if (sweep >= 0.95) {
        ctx.strokeStyle = c.success;
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barW, barH);
      }

      // "ALL states" label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.proof;
      ctx.textAlign = "center";
      ctx.fillText(
        sweep >= 0.95 ? "ALL STATES COVERED" : "Proving all states...",
        barX + barW / 2,
        barY + 20,
      );

      // No gaps indicator
      ctx.font = "8px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("No gaps in coverage", W / 2, barY + barH + 16);

      // Property proven
      const propY = barY + barH + 30;
      ctx.fillStyle = c.proof;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(barX, propY, barW, 50);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.proof;
      ctx.strokeRect(barX, propY, barW, 50);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Property: for ALL inputs x,", barX + barW / 2, propY + 16);
      ctx.fillText("for ALL states s,", barX + barW / 2, propY + 30);
      ctx.fillText("invariant holds", barX + barW / 2, propY + 44);

      if (sweep >= 0.95) {
        ctx.font = "bold 12px monospace";
        ctx.fillStyle = c.success;
        ctx.fillText("\u2713 PROVEN", barX + barW - 30, propY - 6);
      }

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("Proven correct for all inputs", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Formal verification" canvasRef={canvasRef} />;
}
