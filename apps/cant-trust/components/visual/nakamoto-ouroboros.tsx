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
  block: string;
  blockStroke: string;
  progress: string;
  warning: string;
  success: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
    progress: isDark ? "#f7931a" : "#c28a1a",
    warning: isDark ? "#fbbf24" : "#d97706",
    success: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Nakamoto (Probabilistic) Finality                                  */
/* ------------------------------------------------------------------ */

export function NakamotoFinality() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(getColors(isDark));

  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    let rafId = 0;
    let lastTime = 0;
    let confirmations = 0;
    let confirmTimer = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      confirmTimer += dt;

      if (confirmTimer > 1.5 && confirmations < 12) {
        confirmations++;
        confirmTimer = 0;
      }
      if (confirmations >= 12) {
        confirmations = 0;
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
      ctx.fillText("Probabilistic finality", W / 2, 16);

      // Draw blocks chain
      const blockW = 36;
      const blockH = 28;
      const startX = 20;
      const chainY = 60;
      const shown = Math.min(confirmations, 7);

      for (let i = 0; i < shown; i++) {
        const x = startX + i * (blockW + 6);
        ctx.fillStyle = c.block;
        ctx.fillRect(x, chainY, blockW, blockH);
        ctx.strokeStyle = c.blockStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, chainY, blockW, blockH);
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(`#${i + 1}`, x + blockW / 2, chainY + blockH / 2 + 3);

        if (i > 0) {
          ctx.strokeStyle = c.blockStroke;
          ctx.beginPath();
          ctx.moveTo(x - 6, chainY + blockH / 2);
          ctx.lineTo(x, chainY + blockH / 2);
          ctx.stroke();
        }
      }

      // Confidence
      const confidence =
        confirmations === 0
          ? 0
          : confirmations === 1
            ? 0
            : confirmations === 2
              ? 50
              : confirmations === 3
                ? 85
                : confirmations === 4
                  ? 95
                  : confirmations === 5
                    ? 99
                    : confirmations >= 6
                      ? 99.9
                      : 0;

      // Progress bar
      const barX = 30;
      const barY = 120;
      const barW = 260;
      const barH = 24;
      ctx.fillStyle = c.block;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = c.blockStroke;
      ctx.strokeRect(barX, barY, barW, barH);

      const fillW = (confidence / 100) * barW;
      ctx.fillStyle = c.progress;
      ctx.fillRect(barX, barY, fillW, barH);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      const pctStr = confidence > 0 ? `~${confidence}%` : "0%";
      ctx.fillText(pctStr, barX + barW / 2, barY + 16);

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText(
        `${confirmations} confirmation${confirmations !== 1 ? "s" : ""}`,
        W / 2,
        barY + 44,
      );

      ctx.font = "9px monospace";
      ctx.fillStyle = c.warning;
      ctx.fillText("Never reaches 100%", W / 2, barY + 60);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Small chance of reversal always remains", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Probabilistic finality" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Ouroboros (Deterministic) Finality                                  */
/* ------------------------------------------------------------------ */

export function OuroborosFinality() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(getColors(isDark));

  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    let rafId = 0;
    let lastTime = 0;
    let slot = 0;
    let slotTimer = 0;
    const epochLength = 6;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      slotTimer += dt;

      if (slotTimer > 1.2) {
        slot++;
        slotTimer = 0;
        if (slot > epochLength + 3) slot = 0;
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
      ctx.fillText("Deterministic finality", W / 2, 16);

      // Draw blocks
      const blockW = 36;
      const blockH = 28;
      const startX = 20;
      const chainY = 60;
      const shown = Math.min(slot, 7);
      const finalized = slot >= epochLength;

      for (let i = 0; i < shown; i++) {
        const x = startX + i * (blockW + 6);
        const isFinal = finalized && i < epochLength;
        ctx.fillStyle = isFinal ? c.success : c.block;
        ctx.globalAlpha = isFinal ? 0.3 : 1;
        ctx.fillRect(x, chainY, blockW, blockH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isFinal ? c.success : c.blockStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, chainY, blockW, blockH);
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(`S${i + 1}`, x + blockW / 2, chainY + blockH / 2 + 3);

        if (i > 0) {
          ctx.strokeStyle = c.blockStroke;
          ctx.beginPath();
          ctx.moveTo(x - 6, chainY + blockH / 2);
          ctx.lineTo(x, chainY + blockH / 2);
          ctx.stroke();
        }

        // Epoch boundary line
        if (i === epochLength - 1 && shown > epochLength - 1) {
          const lineX = x + blockW + 3;
          ctx.strokeStyle = c.success;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(lineX, chainY - 10);
          ctx.lineTo(lineX, chainY + blockH + 10);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.font = "7px monospace";
          ctx.fillStyle = c.success;
          ctx.textAlign = "center";
          ctx.fillText("EPOCH", lineX, chainY - 14);
        }
      }

      // Progress bar
      const barX = 30;
      const barY = 120;
      const barW = 260;
      const barH = 24;
      ctx.fillStyle = c.block;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = c.blockStroke;
      ctx.strokeRect(barX, barY, barW, barH);

      const progress = finalized ? 100 : (slot / epochLength) * 100;
      const fillW = (progress / 100) * barW;
      ctx.fillStyle = finalized ? c.success : c.progress;
      ctx.fillRect(barX, barY, fillW, barH);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText(
        finalized ? "100%" : `${Math.floor(progress)}%`,
        barX + barW / 2,
        barY + 16,
      );

      // Status
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText(
        finalized ? "Epoch boundary reached" : `Slot ${slot} of ${epochLength}`,
        W / 2,
        barY + 44,
      );

      if (finalized) {
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.success;
        ctx.fillText("\u2713 Mathematically proven final", W / 2, barY + 62);
      } else {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText("Awaiting epoch boundary...", W / 2, barY + 62);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Deterministic finality" canvasRef={canvasRef} />
  );
}
