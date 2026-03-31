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
  danger: string;
  success: string;
  accent: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    box: isDark ? "#334155" : "#e2e8f0",
    boxStroke: isDark ? "#64748b" : "#94a3b8",
    danger: isDark ? "#f87171" : "#dc2626",
    success: isDark ? "#4ade80" : "#16a34a",
    accent: isDark ? "#f7931a" : "#c28a1a",
  };
}

/* ------------------------------------------------------------------ */
/*  Raw Key Storage                                                    */
/* ------------------------------------------------------------------ */

export function RawKeyStorage() {
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

    const hexKey = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ";

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
      ctx.fillText("Raw private key", W / 2, 16);

      // Key display box
      const bx = 20;
      const by = 40;
      const bw = 280;
      const bh = 60;
      ctx.fillStyle = c.box;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = c.danger;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      // Long hex string (hard to read)
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText(hexKey.slice(0, 26), bx + 8, by + 25);
      ctx.fillText(hexKey.slice(26), bx + 8, by + 40);

      // Highlight a character being wrong
      const errorChar = Math.floor(elapsed * 2) % hexKey.length;
      const charW = 5.2;
      const row = errorChar < 26 ? 0 : 1;
      const col = row === 0 ? errorChar : errorChar - 26;
      const errorX = bx + 8 + col * charW;
      const errorY = row === 0 ? by + 16 : by + 31;
      ctx.fillStyle = c.danger;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(errorX - 1, errorY, 6, 12);
      ctx.globalAlpha = 1;

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("One wrong character = lost funds", W / 2, by + bh + 20);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Impossible to memorize", W / 2, by + bh + 38);
      ctx.fillText("No error detection", W / 2, by + bh + 54);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText("No human-readable backup", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Raw private key" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  BIP-39 Mnemonic                                                    */
/* ------------------------------------------------------------------ */

export function BipMnemonic() {
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

    const words = [
      "abandon",
      "ability",
      "able",
      "about",
      "above",
      "absent",
      "absorb",
      "abstract",
      "absurd",
      "abuse",
      "access",
      "actor",
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

      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("BIP-39 mnemonic", W / 2, 16);

      // Word grid (4 columns x 3 rows)
      const gridX = 30;
      const gridY = 36;
      const cellW = 65;
      const cellH = 22;
      const cols = 4;

      for (let i = 0; i < words.length; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = gridX + col * cellW;
        const y = gridY + row * (cellH + 4);

        const isChecksum = i === words.length - 1;

        ctx.fillStyle = isChecksum ? c.accent : c.success;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(x, y, cellW - 4, cellH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isChecksum ? c.accent : c.success;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellW - 4, cellH);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(`${i + 1}. ${words[i]}`, x + (cellW - 4) / 2, y + 14);
      }

      // Checksum highlight
      const checksumIdx = words.length - 1;
      const csCol = checksumIdx % cols;
      const csRow = Math.floor(checksumIdx / cols);
      const csX = gridX + csCol * cellW;
      const csY = gridY + csRow * (cellH + 4);
      const pulse = (Math.sin(elapsed * 3) + 1) / 2;
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5 + pulse * 0.5;
      ctx.strokeRect(csX - 1, csY - 1, cellW - 2, cellH + 2);
      ctx.globalAlpha = 1;

      // Arrow to checksum
      ctx.font = "8px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "left";
      ctx.fillText("checksum word", csX + cellW + 4, csY + 14);

      // Labels
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText(
        "Human-readable, memorable",
        W / 2,
        gridY + 3 * (cellH + 4) + 20,
      );

      ctx.font = "9px monospace";
      ctx.fillStyle = c.success;
      ctx.fillText(
        "Error detection built in",
        W / 2,
        gridY + 3 * (cellH + 4) + 38,
      );

      ctx.font = "9px monospace";
      ctx.fillStyle = c.success;
      ctx.fillText("12 words = complete backup", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="BIP-39 mnemonic" canvasRef={canvasRef} />;
}
