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
  print: string;
  blame: string;
  money: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    print: isDark ? "#fbbf24" : "#d97706",
    blame: isDark ? "#f87171" : "#dc2626",
    money: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Printing Causes Hyperinflation                                     */
/* ------------------------------------------------------------------ */

export function PrintingCausesHyperinflation() {
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
      ctx.fillText("Caused by money printing", W / 2, 14);

      // Three cases with accelerating prices
      const cases = [
        { name: "Weimar 1923", doubles: "every 3.7 days" },
        { name: "Zimbabwe 2008", doubles: "every 24.7 hours" },
        { name: "Venezuela 2018", doubles: "1,700,000%/year" },
      ];

      const startY = 35;
      for (let i = 0; i < cases.length; i++) {
        const iy = startY + i * 48;

        // Printer icon
        ctx.fillStyle = c.print;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(20, iy, 30, 20);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.print;
        ctx.lineWidth = 1;
        ctx.strokeRect(20, iy, 30, 20);
        ctx.font = "8px monospace";
        ctx.fillStyle = c.print;
        ctx.textAlign = "center";
        ctx.fillText("$$$", 35, iy + 14);

        // Arrow
        ctx.strokeStyle = c.dimText;
        ctx.beginPath();
        ctx.moveTo(55, iy + 10);
        ctx.lineTo(70, iy + 10);
        ctx.stroke();

        // Case label
        const cs = cases[i]!;
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "left";
        ctx.fillText(cs.name, 75, iy + 8);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.print;
        ctx.fillText(`Prices ${cs.doubles}`, 75, iy + 20);

        // Price bar expanding
        const growth = Math.min(elapsed * 0.15 * (i + 1), 1);
        const barW = 80 * growth;
        ctx.fillStyle = c.print;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(220, iy, barW, 20);
        ctx.globalAlpha = 1;
      }

      // Common pattern
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.print;
      ctx.textAlign = "center";
      ctx.fillText("Common pattern:", W / 2, 195);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("Government prints to cover expenses", W / 2, 210);

      ctx.fillStyle = c.print;
      ctx.fillText("Every case: excessive money creation", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Caused by money printing" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Blame Shifting                                                     */
/* ------------------------------------------------------------------ */

export function HyperinflationBlameShift() {
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
      ctx.fillText("Blamed on supply shocks", W / 2, 14);

      // Rotating blame targets
      const blames = [
        '"Greedy businesses"',
        '"Foreign speculators"',
        '"Supply chain disruptions"',
        '"Price gouging"',
      ];

      const cycleIdx = Math.floor(elapsed * 0.5) % blames.length;

      // Pointing finger
      ctx.font = "10px monospace";
      ctx.fillStyle = c.blame;
      ctx.textAlign = "center";
      ctx.fillText("BLAME:", W / 2, 45);

      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.blame;
      ctx.fillText(blames[cycleIdx]!, W / 2, 65);

      // X marks on solutions that don't work
      const solutions = [
        { label: "Price controls", result: "Creates shortages" },
        { label: "Freeze wages", result: "Workers suffer" },
        { label: "Blame merchants", result: "Scapegoating" },
      ];

      const solY = 90;
      for (let i = 0; i < solutions.length; i++) {
        const iy = solY + i * 32;

        const sol = solutions[i]!;
        ctx.font = "9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "left";
        ctx.fillText(sol.label, 30, iy + 10);

        // X
        ctx.strokeStyle = c.blame;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(160, iy);
        ctx.lineTo(172, iy + 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(172, iy);
        ctx.lineTo(160, iy + 12);
        ctx.stroke();

        ctx.font = "8px monospace";
        ctx.fillStyle = c.blame;
        ctx.textAlign = "left";
        ctx.fillText(sol.result, 180, iy + 10);
      }

      // Hidden printer
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Meanwhile, the printer keeps running", W / 2, 200);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.blame;
      ctx.fillText("Price controls never stop inflation", W / 2, H - 4);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Blamed on supply shocks" canvasRef={canvasRef} />
  );
}
