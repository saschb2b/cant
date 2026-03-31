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
  private: string;
  watched: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    private: isDark ? "#4ade80" : "#16a34a",
    watched: isDark ? "#f87171" : "#dc2626",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Cash Privacy                                                       */
/* ------------------------------------------------------------------ */

export function CashPrivacy() {
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
      ctx.fillText("Cash transaction", W / 2, 14);

      // Person A
      ctx.fillStyle = c.private;
      ctx.beginPath();
      ctx.arc(80, 80, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "9px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("Alice", 80, 83);

      // Person B
      ctx.fillStyle = c.private;
      ctx.beginPath();
      ctx.arc(240, 80, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.bg;
      ctx.fillText("Bob", 240, 83);

      // Cash moving between them
      const t = (elapsed % 3) / 3;
      const cashX = 80 + (240 - 80) * t;
      ctx.fillStyle = c.accent;
      ctx.fillRect(cashX - 12, 72, 24, 16);
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("$$$", cashX, 83);

      // No record
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.private;
      ctx.textAlign = "center";
      ctx.fillText("No digital record created", W / 2, 125);

      // Eye with X
      ctx.strokeStyle = c.private;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(W / 2, 155, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = "10px monospace";
      ctx.fillStyle = c.private;
      ctx.fillText("X", W / 2, 159);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("No surveillance", W / 2, 180);

      // Benefits
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Private by default", W / 2, 200);
      ctx.fillText("No third party involved", W / 2, 216);
      ctx.fillText("No data trail to exploit", W / 2, 232);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Cash transaction" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Digital Surveillance                                               */
/* ------------------------------------------------------------------ */

export function DigitalSurveillance() {
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
      ctx.fillText("Digital CBDC transaction", W / 2, 14);

      // Person A
      ctx.fillStyle = c.watched;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(80, 55, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("Alice", 80, 58);

      // Person B
      ctx.fillStyle = c.watched;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(240, 55, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.bg;
      ctx.fillText("Bob", 240, 58);

      // Transaction arrow
      ctx.strokeStyle = c.watched;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(98, 55);
      ctx.lineTo(222, 55);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(218, 51);
      ctx.lineTo(224, 55);
      ctx.lineTo(218, 59);
      ctx.fillStyle = c.watched;
      ctx.fill();

      // Eye watching
      ctx.strokeStyle = c.watched;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(W / 2, 40, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = c.watched;
      ctx.beginPath();
      ctx.arc(W / 2, 40, 4, 0, Math.PI * 2);
      ctx.fill();

      // Data logged
      const logItems = [
        { label: "Who:", value: "Alice -> Bob" },
        { label: "Amount:", value: "$50.00" },
        { label: "When:", value: "2024-01-15 14:23" },
        { label: "Where:", value: "GPS: 40.7, -74.0" },
        { label: "Category:", value: "Retail purchase" },
      ];

      const logCount = Math.min(logItems.length, Math.floor(elapsed * 0.8) + 1);
      for (let i = 0; i < logCount; i++) {
        const y = 85 + i * 18;
        ctx.fillStyle = c.block;
        ctx.fillRect(40, y, 240, 14);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "left";
        ctx.fillText(logItems[i].label, 48, y + 11);
        ctx.fillStyle = c.watched;
        ctx.fillText(logItems[i].value, 110, y + 11);
      }

      // Data flowing to database
      const dbY = 190;
      ctx.fillStyle = c.block;
      ctx.fillRect(110, dbY, 100, 30);
      ctx.strokeStyle = c.watched;
      ctx.lineWidth = 2;
      ctx.strokeRect(110, dbY, 100, 30);
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.watched;
      ctx.textAlign = "center";
      ctx.fillText("GOV DATABASE", W / 2, dbY + 20);

      // Arrow from log to database
      ctx.strokeStyle = c.watched;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2, 178);
      ctx.lineTo(W / 2, dbY);
      ctx.stroke();

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Every detail logged permanently", W / 2, 232);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Digital CBDC transaction" canvasRef={canvasRef} />
  );
}
