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
/*  Probabilistic Finality                                             */
/* ------------------------------------------------------------------ */

export function FinalityProbabilistic() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(getColors(isDark));

  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    let rafId = 0;
    let lastTime = 0;
    let blockCount = 0;
    let blockTimer = 0;

    const confidenceLevels = [0, 50, 75, 90, 95, 99, 99.5, 99.9, 99.95, 99.99];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      blockTimer += dt;

      if (blockTimer > 1.3) {
        blockCount++;
        blockTimer = 0;
        if (blockCount >= confidenceLevels.length) blockCount = 0;
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

      // Blocks row
      const blockW = 28;
      const blockH = 22;
      const startX = 16;
      const chainY = 36;
      const shown = Math.min(blockCount, 8);

      for (let i = 0; i < shown; i++) {
        const x = startX + i * (blockW + 4);
        ctx.fillStyle = c.block;
        ctx.fillRect(x, chainY, blockW, blockH);
        ctx.strokeStyle = c.blockStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, chainY, blockW, blockH);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(`${i + 1}`, x + blockW / 2, chainY + blockH / 2 + 3);
      }

      // Confidence display
      const confidence = confidenceLevels[blockCount] ?? 0;
      const barX = 30;
      const barY = 90;
      const barW = 260;
      const barH = 30;

      ctx.fillStyle = c.block;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = c.blockStroke;
      ctx.strokeRect(barX, barY, barW, barH);

      const fillW = (confidence / 100) * barW;
      ctx.fillStyle = c.progress;
      ctx.fillRect(barX, barY, fillW, barH);

      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText(`${confidence}%`, barX + barW / 2, barY + 20);

      // Gap to 100%
      if (confidence > 0 && confidence < 100) {
        const gapX = barX + fillW;
        const gapW = barW - fillW;
        if (gapW > 2) {
          ctx.fillStyle = isDark ? "#4a1a1a" : "#fee2e2";
          ctx.fillRect(gapX, barY, gapW, barH);
          if (gapW > 15) {
            ctx.font = "7px monospace";
            ctx.fillStyle = c.warning;
            ctx.textAlign = "center";
            ctx.fillText("gap", gapX + gapW / 2, barY + barH / 2 + 3);
          }
        }
      }

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText(
        `${blockCount} confirmation${blockCount !== 1 ? "s" : ""}`,
        W / 2,
        barY + 50,
      );

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.warning;
      ctx.fillText("Wait for more confirmations...", W / 2, barY + 68);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Confidence grows but never reaches 100%", W / 2, H - 10);

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
/*  Deterministic Finality                                             */
/* ------------------------------------------------------------------ */

export function FinalityDeterministic() {
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
    const epochLen = 5;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      slotTimer += dt;

      if (slotTimer > 1.3) {
        slot++;
        slotTimer = 0;
        if (slot > epochLen + 3) slot = 0;
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

      const finalized = slot >= epochLen;

      // Blocks row
      const blockW = 28;
      const blockH = 22;
      const startX = 30;
      const chainY = 36;
      const shown = Math.min(slot, 7);

      for (let i = 0; i < shown; i++) {
        const x = startX + i * (blockW + 4);
        const isFinal = finalized && i < epochLen;
        ctx.fillStyle = isFinal ? c.success : c.block;
        ctx.globalAlpha = isFinal ? 0.3 : 1;
        ctx.fillRect(x, chainY, blockW, blockH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isFinal ? c.success : c.blockStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, chainY, blockW, blockH);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(`${i + 1}`, x + blockW / 2, chainY + blockH / 2 + 3);

        // Epoch boundary
        if (i === epochLen - 1 && shown >= epochLen) {
          const lineX = x + blockW + 2;
          ctx.strokeStyle = c.success;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(lineX, chainY - 8);
          ctx.lineTo(lineX, chainY + blockH + 8);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Progress bar
      const barX = 30;
      const barY = 90;
      const barW = 260;
      const barH = 30;

      ctx.fillStyle = c.block;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = c.blockStroke;
      ctx.strokeRect(barX, barY, barW, barH);

      const progress = finalized ? 100 : (slot / epochLen) * 90;
      ctx.fillStyle = finalized ? c.success : c.progress;
      ctx.fillRect(barX, barY, (progress / 100) * barW, barH);

      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText(
        finalized ? "100%" : `${Math.floor(progress)}%`,
        barX + barW / 2,
        barY + 20,
      );

      // Status
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      if (finalized) {
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = c.success;
        ctx.fillText("\u2713 100% final", W / 2, barY + 54);

        ctx.font = "9px monospace";
        ctx.fillStyle = c.success;
        ctx.fillText("Epoch boundary crossed", W / 2, barY + 70);
      } else {
        ctx.fillStyle = c.dimText;
        ctx.fillText(`Slot ${slot} of ${epochLen}`, W / 2, barY + 54);
        ctx.fillText("Building toward epoch boundary...", W / 2, barY + 70);
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText(
        finalized ? "Cannot be reversed" : "Finality at epoch boundary",
        W / 2,
        H - 10,
      );

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Deterministic finality" canvasRef={canvasRef} />
  );
}
