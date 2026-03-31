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
  line: string;
  accent: string;
  cap: string;
  danger: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    line: isDark ? "#f87171" : "#dc2626",
    accent: isDark ? "#f7931a" : "#c28a1a",
    cap: isDark ? "#4ade80" : "#16a34a",
    danger: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  Unlimited Supply                                                   */
/* ------------------------------------------------------------------ */

export function UnlimitedSupply() {
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
      ctx.fillText("Constant issuance", W / 2, 16);

      // Axes
      const ox = 50;
      const oy = 190;
      const axW = 240;
      const axH = 140;

      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox, oy - axH);
      ctx.lineTo(ox, oy);
      ctx.lineTo(ox + axW, oy);
      ctx.stroke();

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Time", ox + axW / 2, oy + 16);
      ctx.save();
      ctx.translate(ox - 16, oy - axH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Supply", 0, 0);
      ctx.restore();

      // Animated line going up linearly
      const progress = (elapsed % 8) / 8;
      const linePoints = Math.floor(progress * 100);

      ctx.strokeStyle = c.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= linePoints; i++) {
        const t = i / 100;
        const x = ox + t * axW;
        const y = oy - t * axH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Arrow at end indicating it keeps going
      if (linePoints > 10) {
        const endX = ox + (linePoints / 100) * axW;
        const endY = oy - (linePoints / 100) * axH;
        ctx.fillStyle = c.line;
        ctx.beginPath();
        ctx.moveTo(endX - 3, endY + 6);
        ctx.lineTo(endX + 2, endY - 2);
        ctx.lineTo(endX + 5, endY + 4);
        ctx.fill();
      }

      // Counter
      const supply = Math.floor(progress * 200);
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "right";
      ctx.fillText(`${supply}M coins`, ox + axW, oy - axH - 8);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("No cap, infinite supply", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Constant issuance" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Halving Supply Curve                                               */
/* ------------------------------------------------------------------ */

export function HalvingSupply() {
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
      ctx.fillText("Halving schedule", W / 2, 16);

      // Axes
      const ox = 50;
      const oy = 190;
      const axW = 240;
      const axH = 140;

      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox, oy - axH);
      ctx.lineTo(ox, oy);
      ctx.lineTo(ox + axW, oy);
      ctx.stroke();

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Time", ox + axW / 2, oy + 16);

      // 21M cap line
      ctx.strokeStyle = c.cap;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ox, oy - axH + 5);
      ctx.lineTo(ox + axW, oy - axH + 5);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.cap;
      ctx.textAlign = "right";
      ctx.fillText("21,000,000", ox + axW, oy - axH - 2);

      // Asymptotic supply curve
      const progress = (elapsed % 10) / 10;
      const points = Math.floor(progress * 200);

      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const t = i / 200;
        // Asymptotic curve: 21M * (1 - e^(-kt))
        const supply = 1 - Math.exp(-4 * t);
        const x = ox + t * axW;
        const y = oy - supply * (axH - 5);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Halving event markers
      const halvings = [0.15, 0.3, 0.45, 0.6];
      const rewards = ["50", "25", "12.5", "6.25"];
      for (let i = 0; i < halvings.length; i++) {
        if (halvings[i] <= progress) {
          const x = ox + halvings[i] * axW;
          ctx.strokeStyle = c.dimText;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(x, oy);
          ctx.lineTo(x, oy - axH);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.font = "7px monospace";
          ctx.fillStyle = c.accent;
          ctx.textAlign = "center";
          ctx.fillText(rewards[i], x, oy + 10);
        }
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.cap;
      ctx.textAlign = "center";
      ctx.fillText("Supply approaches 21M asymptotically", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Halving schedule" canvasRef={canvasRef} />;
}
