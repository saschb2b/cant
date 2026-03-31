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
  house: string;
  salary: string;
  red: string;
  green: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    house: isDark ? "#60a5fa" : "#3b82f6",
    salary: isDark ? "#4ade80" : "#16a34a",
    red: isDark ? "#f87171" : "#dc2626",
    green: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Then: house costs ~3 years salary                                  */
/* ------------------------------------------------------------------ */

export function HousingThen() {
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

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("1970s housing", W / 2, 18);

      // House shape
      const houseX = W / 2;
      const houseY = 60;
      const houseW = 80;
      const houseH = 60;

      // Roof
      ctx.fillStyle = c.house;
      ctx.beginPath();
      ctx.moveTo(houseX - houseW / 2 - 10, houseY + 20);
      ctx.lineTo(houseX, houseY - 15);
      ctx.lineTo(houseX + houseW / 2 + 10, houseY + 20);
      ctx.fill();

      // Body
      ctx.fillRect(houseX - houseW / 2, houseY + 20, houseW, houseH);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(houseX - houseW / 2, houseY + 20, houseW, houseH);

      // Price tag
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("$24,000", houseX, houseY + 55);

      // Salary bar filling house price
      const barX = 40;
      const barY = 150;
      const barW = W - 80;
      const barH = 20;
      const yearsNeeded = 3;
      const fillProgress = Math.min(1, (elapsed % 5) / 3);

      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barW, barH);

      ctx.fillStyle = c.salary;
      ctx.fillRect(barX, barY, barW * fillProgress, barH);

      // Year markers
      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      for (let i = 1; i <= yearsNeeded; i++) {
        const x = barX + (i / yearsNeeded) * barW;
        ctx.fillText("Yr " + i, x, barY + barH + 12);
      }

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("Salary: $8,000/yr", barX, barY - 8);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.green;
      ctx.fillText("3 years salary", W / 2, barY + barH + 30);

      if (elapsed > 2) {
        const a = Math.min(1, (elapsed - 2) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.green;
        ctx.fillText("Achievable on a single income", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="1970s affordability" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Now: house costs 10+ years salary                                  */
/* ------------------------------------------------------------------ */

export function HousingNow() {
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

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("2024 housing", W / 2, 18);

      // Bigger house shape
      const houseX = W / 2;
      const houseY = 50;
      const houseW = 100;
      const houseH = 65;

      // Roof
      ctx.fillStyle = c.house;
      ctx.beginPath();
      ctx.moveTo(houseX - houseW / 2 - 10, houseY + 20);
      ctx.lineTo(houseX, houseY - 20);
      ctx.lineTo(houseX + houseW / 2 + 10, houseY + 20);
      ctx.fill();

      // Body
      ctx.fillRect(houseX - houseW / 2, houseY + 20, houseW, houseH);
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(houseX - houseW / 2, houseY + 20, houseW, houseH);

      // Price tag
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.red;
      ctx.textAlign = "center";
      ctx.fillText("$420,000", houseX, houseY + 55);

      // Salary bar barely filling
      const barX = 40;
      const barY = 150;
      const barW = W - 80;
      const barH = 20;
      const yearsNeeded = 10;
      const fillProgress = Math.min(1, (elapsed % 12) / 10);

      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barW, barH);

      ctx.fillStyle = c.salary;
      ctx.fillRect(barX, barY, barW * fillProgress, barH);

      // Year markers
      ctx.font = "6px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      for (let i = 2; i <= yearsNeeded; i += 2) {
        const x = barX + (i / yearsNeeded) * barW;
        ctx.fillText("Yr " + i, x, barY + barH + 10);
      }

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("Salary: $40,000/yr", barX, barY - 8);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.red;
      ctx.fillText("10+ years salary", W / 2, barY + barH + 28);

      if (elapsed > 2) {
        const a = Math.min(1, (elapsed - 2) / 0.5);
        ctx.globalAlpha = a;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.red;
        ctx.fillText("Often requires dual income + 30yr loan", W / 2, H - 8);
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="2024 affordability" canvasRef={canvasRef} />;
}
