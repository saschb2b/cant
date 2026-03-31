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
  publicC: string;
  privateC: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    publicC: isDark ? "#4ade80" : "#16a34a",
    privateC: isDark ? "#a78bfa" : "#7c3aed",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Fully Public Chain                                                 */
/* ------------------------------------------------------------------ */

export function FullyPublicChain() {
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
      ctx.fillText("Fully public chain", W / 2, 14);

      // Single lane - everything visible
      const laneX = 40;
      const laneW = 240;
      const laneY = 35;
      const laneH = 140;

      ctx.fillStyle = c.publicC;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(laneX, laneY, laneW, laneH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.publicC;
      ctx.lineWidth = 2;
      ctx.strokeRect(laneX, laneY, laneW, laneH);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.publicC;
      ctx.textAlign = "center";
      ctx.fillText("ALL STATE PUBLIC", laneX + laneW / 2, laneY + 14);

      // Visible items scrolling
      const items = ["Contracts", "Balances", "Logic", "Inputs", "Outputs"];
      for (let i = 0; i < items.length; i++) {
        const y = laneY + 30 + i * 20;
        const xOff = Math.sin(elapsed * 0.5 + i) * 10;

        ctx.fillStyle = c.block;
        ctx.fillRect(laneX + 20 + xOff, y, 100, 14);
        ctx.strokeStyle = c.blockStroke;
        ctx.strokeRect(laneX + 20 + xOff, y, 100, 14);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.publicC;
        ctx.textAlign = "left";
        ctx.fillText(`${items[i]}: visible`, laneX + 25 + xOff, y + 10);
      }

      // Eye icon
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Everyone sees everything", W / 2, 192);
      ctx.fillText("No confidentiality option", W / 2, 208);
      ctx.fillText("No choice for developers", W / 2, 224);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Fully public chain" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Midnight Split                                                     */
/* ------------------------------------------------------------------ */

export function MidnightSplit() {
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
      ctx.fillText("Midnight: dual state", W / 2, 14);

      // Public lane (left)
      const pubX = 20;
      const laneW = 125;
      const laneY = 30;
      const laneH = 130;

      ctx.fillStyle = c.publicC;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(pubX, laneY, laneW, laneH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.publicC;
      ctx.lineWidth = 2;
      ctx.strokeRect(pubX, laneY, laneW, laneH);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.publicC;
      ctx.textAlign = "center";
      ctx.fillText("PUBLIC STATE", pubX + laneW / 2, laneY + 14);

      // Public items
      const pubItems = ["Auditable", "Transparent", "Verifiable"];
      for (let i = 0; i < pubItems.length; i++) {
        const y = laneY + 30 + i * 28;
        ctx.fillStyle = c.block;
        ctx.fillRect(pubX + 10, y, laneW - 20, 18);
        ctx.font = "8px monospace";
        ctx.fillStyle = c.publicC;
        ctx.textAlign = "center";
        ctx.fillText(pubItems[i], pubX + laneW / 2, y + 13);
      }

      // Private lane (right)
      const privX = 175;
      ctx.fillStyle = c.privateC;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(privX, laneY, laneW, laneH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.privateC;
      ctx.lineWidth = 2;
      ctx.strokeRect(privX, laneY, laneW, laneH);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.privateC;
      ctx.textAlign = "center";
      ctx.fillText("PRIVATE STATE", privX + laneW / 2, laneY + 14);

      // Private items
      const privItems = ["Shielded", "ZK-proven", "Confidential"];
      for (let i = 0; i < privItems.length; i++) {
        const y = laneY + 30 + i * 28;
        ctx.fillStyle = c.block;
        ctx.fillRect(privX + 10, y, laneW - 20, 18);
        ctx.font = "8px monospace";
        ctx.fillStyle = c.privateC;
        ctx.textAlign = "center";
        ctx.fillText(privItems[i], privX + laneW / 2, y + 13);
      }

      // Animated arrow between lanes
      const arrowY = laneY + laneH / 2;
      const arrowPhase = (Math.sin(elapsed * 2) + 1) / 2;
      const arrowX =
        pubX + laneW + 5 + arrowPhase * (privX - pubX - laneW - 10);
      ctx.fillStyle = c.accent;
      ctx.beginPath();
      ctx.arc(arrowX, arrowY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Developer choice label
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("Developer chooses per-field", W / 2, 175);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Public for auditing, private for users", W / 2, 195);
      ctx.fillText("Best of both worlds", W / 2, 211);
      ctx.fillText("Selective disclosure via ZK proofs", W / 2, 227);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Midnight: dual state" canvasRef={canvasRef} />
  );
}
