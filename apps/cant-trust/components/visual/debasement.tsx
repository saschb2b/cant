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
  gold: string;
  goldDark: string;
  copper: string;
  king: string;
  warning: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    gold: isDark ? "#fbbf24" : "#d97706",
    goldDark: isDark ? "#b8860b" : "#92400e",
    copper: isDark ? "#cd7f32" : "#a0522d",
    king: isDark ? "#c084fc" : "#7c3aed",
    warning: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  Honest Coinage                                                     */
/* ------------------------------------------------------------------ */

export function HonestCoinage() {
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

      // Gold coin
      const cx = W / 2;
      const cy = 100;
      const r = 40;
      const pulse = 1 + 0.02 * Math.sin(elapsed * 2);

      ctx.beginPath();
      ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = c.gold;
      ctx.fill();
      ctx.strokeStyle = c.goldDark;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Coin face
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.goldDark;
      ctx.fillText("10g", cx, cy - 5);
      ctx.font = "10px monospace";
      ctx.fillText("Pure Gold", cx, cy + 12);

      // Weight label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.gold;
      ctx.fillText("Consistent weight", cx, cy + r + 20);

      // Properties
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("10g gold = 10g gold", W / 2, 185);
      ctx.fillText("Every coin identical", W / 2, 200);
      ctx.fillText("Trusted by weight", W / 2, 215);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Honest coinage", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Honest coinage" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Debased Coinage                                                    */
/* ------------------------------------------------------------------ */

export function DebasedCoinage() {
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

      const cycle = elapsed % 8;

      // Phase 1: original coin melted (0-2s)
      // Phase 2: mixed with copper (2-4s)
      // Phase 3: re-stamped (4-6s)
      // Phase 4: king keeps difference (6-8s)

      const coinX = 100;
      const coinY = 95;
      const coinR = 30;

      if (cycle < 2) {
        // Original coin melting
        const meltProgress = cycle / 2;
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinR, 0, Math.PI * 2);
        ctx.fillStyle = c.gold;
        ctx.globalAlpha = 1 - meltProgress * 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.dimText;
        ctx.fillText("Melting...", coinX, coinY + coinR + 18);

        // Drip effect
        for (let i = 0; i < 3; i++) {
          const dripY = coinY + coinR + meltProgress * 30 + i * 8;
          ctx.beginPath();
          ctx.arc(coinX - 8 + i * 8, dripY, 3, 0, Math.PI * 2);
          ctx.fillStyle = c.gold;
          ctx.globalAlpha = 1 - meltProgress;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      } else if (cycle < 4) {
        // Mixing with copper
        const mixProgress = (cycle - 2) / 2;
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinR, 0, Math.PI * 2);
        ctx.fillStyle = c.gold;
        ctx.fill();

        // Copper overlay
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinR * mixProgress, 0, Math.PI * 2);
        ctx.fillStyle = c.copper;
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.copper;
        ctx.fillText("+ copper added", coinX, coinY + coinR + 18);
      } else if (cycle < 6) {
        // Re-stamped coin
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinR, 0, Math.PI * 2);
        // Mix of gold and copper
        ctx.fillStyle = c.copper;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinR - 5, 0, Math.PI * 2);
        ctx.fillStyle = c.gold;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.strokeStyle = c.goldDark;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.goldDark;
        ctx.fillText("8g Au", coinX, coinY - 3);
        ctx.fillText("2g Cu", coinX, coinY + 12);

        ctx.font = "9px monospace";
        ctx.fillStyle = c.warning;
        ctx.fillText("Same face value!", coinX, coinY + coinR + 18);
      } else {
        // King keeps the difference
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinR, 0, Math.PI * 2);
        ctx.fillStyle = c.copper;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(coinX, coinY, coinR - 5, 0, Math.PI * 2);
        ctx.fillStyle = c.gold;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.goldDark;
        ctx.fillText("8g + 2g", coinX, coinY + 5);
      }

      // King's profit (right side)
      if (cycle > 5) {
        const alpha = Math.min(1, (cycle - 5) / 0.5);
        ctx.globalAlpha = alpha;

        // Small gold nugget
        const kx = 230;
        const ky = 80;
        ctx.beginPath();
        ctx.arc(kx, ky, 15, 0, Math.PI * 2);
        ctx.fillStyle = c.gold;
        ctx.fill();

        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.goldDark;
        ctx.fillText("2g", kx, ky + 4);

        ctx.font = "9px monospace";
        ctx.fillStyle = c.king;
        ctx.fillText("King keeps", kx, ky + 28);
        ctx.fillText("the gold", kx, ky + 40);

        // Arrow from coin to king
        ctx.strokeStyle = c.king;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(coinX + coinR + 5, coinY);
        ctx.lineTo(kx - 20, ky);
        ctx.stroke();

        ctx.globalAlpha = 1;
      }

      // Bottom explanation
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Less gold per coin, same denomination", W / 2, 185);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Currency debasement", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Currency debasement" canvasRef={canvasRef} />;
}
