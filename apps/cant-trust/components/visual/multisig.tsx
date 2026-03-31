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
  box: string;
  boxStroke: string;
  key: string;
  danger: string;
  success: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    box: isDark ? "#334155" : "#e2e8f0",
    boxStroke: isDark ? "#64748b" : "#94a3b8",
    key: isDark ? "#f7931a" : "#c28a1a",
    danger: isDark ? "#f87171" : "#dc2626",
    success: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Single Signature                                                   */
/* ------------------------------------------------------------------ */

export function SingleSignature() {
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
      ctx.fillText("Single signature (1-of-1)", W / 2, 16);

      // Single key
      const keyX = W / 2;
      const keyY = 60;
      ctx.fillStyle = c.key;
      ctx.fillRect(keyX - 30, keyY, 60, 30);
      ctx.strokeStyle = c.key;
      ctx.strokeRect(keyX - 30, keyY, 60, 30);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("KEY", keyX, keyY + 19);

      // Arrow to funds
      ctx.strokeStyle = c.boxStroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(keyX, keyY + 30);
      ctx.lineTo(keyX, keyY + 55);
      ctx.stroke();

      // Funds box
      const fundsY = keyY + 55;
      ctx.fillStyle = c.box;
      ctx.fillRect(keyX - 40, fundsY, 80, 30);
      ctx.strokeStyle = c.boxStroke;
      ctx.strokeRect(keyX - 40, fundsY, 80, 30);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("FUNDS", keyX, fundsY + 19);

      // Failure scenarios
      const scenarios = [
        { label: "Key stolen", icon: "STOLEN" },
        { label: "Key lost", icon: "LOST" },
        { label: "Coerced", icon: "FORCED" },
      ];

      const phase = Math.floor(elapsed / 2.5) % scenarios.length;
      const scenario = scenarios[phase];

      // Danger indicator
      const dangerY = fundsY + 50;
      const pulse = (Math.sin(elapsed * 4) + 1) / 2;
      ctx.fillStyle = c.danger;
      ctx.globalAlpha = 0.5 + pulse * 0.5;
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(scenario.icon, keyX, dangerY + 10);
      ctx.globalAlpha = 1;

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText(scenario.label + " = funds gone", keyX, dangerY + 28);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText("Single point of failure", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Single signature" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Multisig Threshold                                                 */
/* ------------------------------------------------------------------ */

export function MultisigThreshold() {
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
      ctx.fillText("Multisig (2-of-3)", W / 2, 16);

      // Three keys
      const keys = [
        { x: 55, label: "Key A", loc: "home" },
        { x: 160, label: "Key B", loc: "office" },
        { x: 265, label: "Key C", loc: "vault" },
      ];

      // Signing animation: cycle which 2 are signing
      const sigPhase = Math.floor(elapsed / 3) % 3;
      const sigPairs = [
        [0, 1],
        [1, 2],
        [0, 2],
      ];
      const activePair = sigPairs[sigPhase];

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const isActive = activePair.includes(i);

        ctx.fillStyle = isActive ? c.success : c.box;
        ctx.globalAlpha = isActive ? 0.3 : 1;
        ctx.fillRect(k.x - 25, 40, 50, 28);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isActive ? c.success : c.boxStroke;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.strokeRect(k.x - 25, 40, 50, 28);

        ctx.font = "bold 8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(k.label, k.x, 54);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText(k.loc, k.x, 64);

        if (isActive) {
          ctx.font = "8px monospace";
          ctx.fillStyle = c.success;
          ctx.fillText("\u2713 signs", k.x, 82);
        }
      }

      // Transaction box
      const txY = 100;
      ctx.fillStyle = c.box;
      ctx.fillRect(W / 2 - 50, txY, 100, 28);
      ctx.strokeStyle = c.success;
      ctx.lineWidth = 2;
      ctx.strokeRect(W / 2 - 50, txY, 100, 28);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("TRANSACTION", W / 2, txY + 18);

      // Lines from signing keys to tx
      for (const idx of activePair) {
        ctx.strokeStyle = c.success;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(keys[idx].x, 68);
        ctx.lineTo(W / 2, txY);
        ctx.stroke();
      }

      // Safety scenarios
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("1 key lost: still have access", W / 2, txY + 48);
      ctx.fillText("1 key stolen: attacker blocked", W / 2, txY + 64);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.success;
      ctx.fillText("No single point of failure", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Multisig threshold" canvasRef={canvasRef} />;
}
