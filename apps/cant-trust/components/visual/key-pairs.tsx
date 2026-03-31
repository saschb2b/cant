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
  dim: string;
  key: string;
  pub: string;
  priv: string;
  bad: string;
  good: string;
  line: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    key: isDark ? "#fbbf24" : "#d97706",
    pub: isDark ? "#4ade80" : "#16a34a",
    priv: isDark ? "#f87171" : "#dc2626",
    bad: isDark ? "#f87171" : "#dc2626",
    good: isDark ? "#4ade80" : "#16a34a",
    line: isDark ? "#555" : "#aaa",
  };
}

/* ------------------------------------------------------------------ */
/*  Shared secret (symmetric, risky)                                   */
/* ------------------------------------------------------------------ */

export function KeySharedSecret() {
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
    const CYCLE = 5;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      const t = elapsed % CYCLE;

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
      ctx.fillStyle = c.dim;
      ctx.fillText("Shared secret key", W / 2, 18);

      // Alice and Bob
      const aliceX = 60;
      const bobX = W - 60;
      const midY = 80;

      ctx.beginPath();
      ctx.arc(aliceX, midY, 20, 0, Math.PI * 2);
      ctx.fillStyle = c.key;
      ctx.fill();
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Alice", aliceX, midY + 32);

      ctx.beginPath();
      ctx.arc(bobX, midY, 20, 0, Math.PI * 2);
      ctx.fillStyle = c.key;
      ctx.fill();
      ctx.fillText("Bob", bobX, midY + 32);

      // Same key label
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("KEY", aliceX, midY + 4);
      ctx.fillText("KEY", bobX, midY + 4);

      // Line between them
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(aliceX + 22, midY);
      ctx.lineTo(bobX - 22, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Key transfer problem
      if (t > 1.5) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.bad;
        ctx.textAlign = "center";
        ctx.fillText("How to share the key safely?", W / 2, midY - 30);
      }

      // Eavesdropper
      if (t > 2.5) {
        const spyX = W / 2;
        const spyY = midY + 60;
        ctx.beginPath();
        ctx.arc(spyX, spyY, 14, 0, Math.PI * 2);
        ctx.fillStyle = c.bad;
        ctx.fill();
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText("SPY", spyX, spyY + 4);
        ctx.fillText("Eve", spyX, spyY + 26);

        ctx.font = "9px monospace";
        ctx.fillStyle = c.bad;
        ctx.fillText("Intercepts the shared key", W / 2, H - 30);
        ctx.fillText("Now Eve can read everything", W / 2, H - 16);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Shared secret problem" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Public/private key pair (asymmetric)                                */
/* ------------------------------------------------------------------ */

export function KeyPairAsymmetric() {
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
    const CYCLE = 5;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      const t = elapsed % CYCLE;

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
      ctx.fillStyle = c.dim;
      ctx.fillText("Public/private key pair", W / 2, 18);

      const aliceX = 60;
      const bobX = W - 60;
      const midY = 70;

      // Alice with two keys
      ctx.beginPath();
      ctx.arc(aliceX, midY - 15, 12, 0, Math.PI * 2);
      ctx.fillStyle = c.pub;
      ctx.fill();
      ctx.font = "7px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("PUB", aliceX, midY - 12);

      ctx.beginPath();
      ctx.arc(aliceX, midY + 15, 12, 0, Math.PI * 2);
      ctx.fillStyle = c.priv;
      ctx.fill();
      ctx.fillText("PRIV", aliceX, midY + 18);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Alice", aliceX, midY + 40);

      // Bob with two keys
      ctx.beginPath();
      ctx.arc(bobX, midY - 15, 12, 0, Math.PI * 2);
      ctx.fillStyle = c.pub;
      ctx.fill();
      ctx.font = "7px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("PUB", bobX, midY - 12);

      ctx.beginPath();
      ctx.arc(bobX, midY + 15, 12, 0, Math.PI * 2);
      ctx.fillStyle = c.priv;
      ctx.fill();
      ctx.fillText("PRIV", bobX, midY + 18);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Bob", bobX, midY + 40);

      // Public key shared freely
      if (t > 1) {
        const progress = Math.min((t - 1) / 1, 1);
        const px = aliceX + (bobX - aliceX) * progress;
        ctx.beginPath();
        ctx.arc(px, midY - 15, 6, 0, Math.PI * 2);
        ctx.fillStyle = c.pub;
        ctx.fill();

        ctx.font = "8px monospace";
        ctx.fillStyle = c.pub;
        ctx.textAlign = "center";
        ctx.fillText("Public key shared openly", W / 2, midY - 30);
      }

      // Private key stays
      if (t > 2.5) {
        ctx.font = "8px monospace";
        ctx.fillStyle = c.priv;
        ctx.textAlign = "center";
        ctx.fillText("Private key never leaves", W / 2, midY + 55);
      }

      // Security result
      if (t > 3.5) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.good;
        ctx.textAlign = "center";
        ctx.fillText("No secret needs to be transmitted", W / 2, H - 35);
        ctx.fillText(
          "Encrypt with public, decrypt with private",
          W / 2,
          H - 20,
        );
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Asymmetric key pair" canvasRef={canvasRef} />;
}
