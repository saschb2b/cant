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
  visible: string;
  hidden: string;
  line: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    visible: isDark ? "#4ade80" : "#16a34a",
    hidden: isDark ? "#a78bfa" : "#7c3aed",
    line: isDark ? "#64748b" : "#94a3b8",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Transparent Ledger                                                 */
/* ------------------------------------------------------------------ */

export function TransparentLedger() {
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

    const txs = [
      { from: "Alice", to: "Bob", amt: "0.5 BTC" },
      { from: "Carol", to: "Dave", amt: "1.2 BTC" },
      { from: "Eve", to: "Frank", amt: "0.3 BTC" },
      { from: "Grace", to: "Hank", amt: "2.0 BTC" },
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
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Transparent ledger", W / 2, 14);

      // Eye icon (watching)
      ctx.font = "16px monospace";
      ctx.fillText("\u{1F441}", 280, 38);

      // Table header
      const startY = 38;
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("From", 25, startY);
      ctx.fillText("To", 100, startY);
      ctx.fillText("Amount", 170, startY);
      ctx.fillText("Status", 245, startY);

      // Divider
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, startY + 5);
      ctx.lineTo(300, startY + 5);
      ctx.stroke();

      // Transactions (all visible)
      const visibleCount = Math.min(txs.length, Math.floor(elapsed * 0.8) + 1);
      for (let i = 0; i < visibleCount; i++) {
        const y = startY + 20 + i * 28;

        // Row highlight
        ctx.fillStyle = c.block;
        ctx.fillRect(20, y - 10, 280, 22);

        ctx.font = "9px monospace";
        ctx.fillStyle = c.visible;
        ctx.textAlign = "left";
        ctx.fillText(txs[i].from, 25, y);
        ctx.fillText(txs[i].to, 100, y);
        ctx.fillText(txs[i].amt, 170, y);
        ctx.fillText("Visible", 245, y);

        // Sub-label
        ctx.font = "7px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText("public", 25, y + 9);
        ctx.fillText("public", 100, y + 9);
        ctx.fillText("public", 170, y + 9);
      }

      // Warning
      ctx.font = "9px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("Everyone can see every transaction", W / 2, 180);

      ctx.fillStyle = c.dimText;
      ctx.fillText("Sender, receiver, amount all public", W / 2, 198);
      ctx.fillText("Full financial history exposed", W / 2, 214);
      ctx.fillText("No privacy whatsoever", W / 2, 230);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Transparent ledger" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Shielded Ledger                                                    */
/* ------------------------------------------------------------------ */

export function ShieldedLedger() {
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
      ctx.fillText("Shielded ledger", W / 2, 14);

      // Table header
      const startY = 38;
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("From", 25, startY);
      ctx.fillText("To", 100, startY);
      ctx.fillText("Amount", 170, startY);
      ctx.fillText("Proof", 245, startY);

      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, startY + 5);
      ctx.lineTo(300, startY + 5);
      ctx.stroke();

      // Transactions (all hidden except proof)
      const txCount = Math.min(4, Math.floor(elapsed * 0.8) + 1);
      for (let i = 0; i < txCount; i++) {
        const y = startY + 20 + i * 28;

        ctx.fillStyle = c.block;
        ctx.fillRect(20, y - 10, 280, 22);

        ctx.font = "9px monospace";
        ctx.fillStyle = c.hidden;
        ctx.textAlign = "left";

        // Scrambled text animation
        const scramble = () => {
          const chars = "?*#@$%";
          let s = "";
          for (let j = 0; j < 5; j++) {
            s += chars[Math.floor((elapsed * 3 + i + j) % chars.length)];
          }
          return s;
        };

        ctx.fillText(scramble(), 25, y);
        ctx.fillText(scramble(), 100, y);
        ctx.fillText(scramble(), 170, y);

        // Valid proof checkmark
        ctx.fillStyle = c.visible;
        ctx.fillText("Valid", 245, y);

        ctx.font = "7px monospace";
        ctx.fillStyle = c.hidden;
        ctx.fillText("hidden", 25, y + 9);
        ctx.fillText("hidden", 100, y + 9);
        ctx.fillText("hidden", 170, y + 9);
      }

      // Shield icon area
      ctx.font = "9px monospace";
      ctx.fillStyle = c.hidden;
      ctx.textAlign = "center";
      ctx.fillText("Zero-knowledge proofs verify validity", W / 2, 180);

      ctx.fillStyle = c.dimText;
      ctx.fillText("Sender, receiver, amount encrypted", W / 2, 198);
      ctx.fillText("Only parties involved see details", W / 2, 214);
      ctx.fillText("Selective disclosure supported", W / 2, 230);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Shielded ledger" canvasRef={canvasRef} />;
}
