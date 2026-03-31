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
  accent: string;
  danger: string;
  success: string;
  arrow: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    box: isDark ? "#334155" : "#e2e8f0",
    boxStroke: isDark ? "#64748b" : "#94a3b8",
    accent: isDark ? "#f7931a" : "#c28a1a",
    danger: isDark ? "#f87171" : "#dc2626",
    success: isDark ? "#4ade80" : "#16a34a",
    arrow: isDark ? "#93c5fd" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  Custodial Wallet                                                   */
/* ------------------------------------------------------------------ */

export function CustodialWallet() {
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
      ctx.fillText("Custodial wallet", W / 2, 16);

      // You (left)
      const youX = 40;
      const youY = 90;
      ctx.fillStyle = c.box;
      ctx.fillRect(youX, youY, 60, 40);
      ctx.strokeStyle = c.boxStroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(youX, youY, 60, 40);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("YOU", youX + 30, youY + 25);

      // Exchange (middle)
      const exX = 130;
      const exY = 60;
      const exW = 80;
      const exH = 100;
      ctx.fillStyle = c.danger;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(exX, exY, exW, exH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.danger;
      ctx.lineWidth = 2;
      ctx.strokeRect(exX, exY, exW, exH);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("EXCHANGE", exX + exW / 2, exY + 18);

      // Key icon inside exchange
      ctx.font = "14px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("\u{1F511}", exX + exW / 2, exY + 45);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("holds your key", exX + exW / 2, exY + 60);

      // Coins in exchange vault
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(exX + 10, exY + 68, exW - 20, 20);
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("your coins", exX + exW / 2, exY + 82);

      // Arrow: you -> request -> exchange
      const arrowProgress = (Math.sin(elapsed * 1.5) + 1) / 2;
      const arrowY = youY + 20;
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(youX + 60, arrowY);
      ctx.lineTo(youX + 60 + (exX - youX - 60) * arrowProgress, arrowY);
      ctx.stroke();

      ctx.font = "7px monospace";
      ctx.fillStyle = c.arrow;
      ctx.textAlign = "center";
      ctx.fillText("request", (youX + 60 + exX) / 2, arrowY - 8);

      // Exchange response (maybe)
      const responsePhase = elapsed % 6 > 3;
      const responseX = exX + exW;
      const coinY = exY + exH / 2;

      if (responsePhase) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.danger;
        ctx.textAlign = "left";
        ctx.fillText("DENIED", responseX + 10, coinY + 4);
      } else {
        ctx.strokeStyle = c.success;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(responseX, coinY);
        ctx.lineTo(responseX + 40, coinY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.success;
        ctx.textAlign = "left";
        ctx.fillText("maybe", responseX + 10, coinY - 8);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("Exchange can freeze or deny access", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Custodial wallet" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Non-Custodial Wallet                                               */
/* ------------------------------------------------------------------ */

export function NonCustodialWallet() {
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
      ctx.fillText("Non-custodial wallet", W / 2, 16);

      // You with key (left-center)
      const youX = 60;
      const youY = 60;
      const youW = 100;
      const youH = 80;
      ctx.fillStyle = c.success;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(youX, youY, youW, youH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.success;
      ctx.lineWidth = 2;
      ctx.strokeRect(youX, youY, youW, youH);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("YOU", youX + youW / 2, youY + 18);

      // Key in your hand
      ctx.font = "16px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("\u{1F511}", youX + youW / 2 - 20, youY + 48);

      // Coins directly accessible
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(youX + youW / 2 + 5, youY + 34, 30, 20);
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("coins", youX + youW / 2 + 20, youY + 48);

      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("your key", youX + youW / 2, youY + 68);

      // Direct arrow to network
      const netX = 210;
      const netY = 80;
      const sendProgress = (Math.sin(elapsed * 2) + 1) / 2;

      ctx.strokeStyle = c.success;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(youX + youW, youY + youH / 2);
      const endX = youX + youW + (netX - youX - youW) * sendProgress;
      ctx.lineTo(endX, youY + youH / 2);
      ctx.stroke();

      // Arrowhead
      if (sendProgress > 0.5) {
        ctx.beginPath();
        ctx.moveTo(endX - 5, youY + youH / 2 - 4);
        ctx.lineTo(endX, youY + youH / 2);
        ctx.lineTo(endX - 5, youY + youH / 2 + 4);
        ctx.fillStyle = c.success;
        ctx.fill();
      }

      ctx.font = "7px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("direct", (youX + youW + netX) / 2, youY + youH / 2 - 10);

      // Network
      ctx.fillStyle = c.box;
      ctx.fillRect(netX, netY, 70, 50);
      ctx.strokeStyle = c.boxStroke;
      ctx.strokeRect(netX, netY, 70, 50);
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("NETWORK", netX + 35, netY + 20);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("no middleman", netX + 35, netY + 36);

      // No intermediary label
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("No permission needed", W / 2, youY + youH + 30);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.success;
      ctx.fillText("Your keys, your coins", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Non-custodial wallet" canvasRef={canvasRef} />
  );
}
