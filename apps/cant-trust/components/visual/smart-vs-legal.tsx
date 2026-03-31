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
  danger: string;
  success: string;
  accent: string;
  arrow: string;
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
    arrow: isDark ? "#93c5fd" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  Legal Contract                                                     */
/* ------------------------------------------------------------------ */

export function LegalContract() {
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
      ctx.fillText("Traditional contract", W / 2, 16);

      // Document icon
      const docX = 30;
      const docY = 35;
      ctx.fillStyle = c.box;
      ctx.fillRect(docX, docY, 50, 60);
      ctx.strokeStyle = c.boxStroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(docX, docY, 50, 60);
      // Text lines on doc
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = c.dimText;
        ctx.fillRect(docX + 8, docY + 10 + i * 12, 34, 3);
      }
      ctx.font = "7px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("contract", docX + 25, docY + 72);

      // Dispute arrow
      const disputeProgress = (elapsed % 8) / 8;
      const arrowY = docY + 30;

      // Step arrows: doc -> court -> judge -> result
      const steps = [
        { x: 100, label: "dispute" },
        { x: 170, label: "court" },
        { x: 240, label: "judge" },
      ];

      for (let i = 0; i < steps.length; i++) {
        const s = steps[i];
        const revealed = disputeProgress > (i + 1) * 0.25;
        if (!revealed) continue;

        ctx.fillStyle = c.danger;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(s.x - 20, arrowY - 12, 40, 24);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.danger;
        ctx.strokeRect(s.x - 20, arrowY - 12, 40, 24);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(s.label, s.x, arrowY + 4);

        // Arrow from previous
        const prevX = i === 0 ? docX + 50 : steps[i - 1].x + 20;
        ctx.strokeStyle = c.arrow;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(prevX, arrowY);
        ctx.lineTo(s.x - 20, arrowY);
        ctx.stroke();
      }

      // Clock ticking
      const clockX = W / 2;
      const clockY = 130;
      const clockR = 18;
      ctx.strokeStyle = c.danger;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(clockX, clockY, clockR, 0, Math.PI * 2);
      ctx.stroke();

      // Clock hand
      const handAngle = elapsed * 0.5;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(
        clockX + Math.cos(handAngle) * (clockR - 4),
        clockY + Math.sin(handAngle) * (clockR - 4),
      );
      ctx.stroke();

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("Months to years", clockX, clockY + clockR + 16);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText("Requires trust in court system", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Traditional contract" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Smart Contract                                                     */
/* ------------------------------------------------------------------ */

export function SmartContract() {
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
      ctx.fillText("Smart contract", W / 2, 16);

      // Code icon
      const codeX = 40;
      const codeY = 40;
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(codeX, codeY, 70, 50);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(codeX, codeY, 70, 50);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("if (cond)", codeX + 35, codeY + 20);
      ctx.fillText("execute()", codeX + 35, codeY + 35);

      // Condition check
      const checkX = 150;
      const checkY = 50;
      const phase = (elapsed % 4) / 4;
      const condMet = phase > 0.3;

      ctx.fillStyle = condMet ? c.success : c.box;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(checkX, checkY, 60, 30);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = condMet ? c.success : c.boxStroke;
      ctx.strokeRect(checkX, checkY, 60, 30);
      ctx.font = "8px monospace";
      ctx.fillStyle = condMet ? c.success : c.text;
      ctx.textAlign = "center";
      ctx.fillText(condMet ? "MET" : "check", checkX + 30, checkY + 19);

      // Arrow code -> check
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(codeX + 70, codeY + 25);
      ctx.lineTo(checkX, checkY + 15);
      ctx.stroke();

      // Auto-execution
      const execX = 240;
      const execY = 50;
      if (condMet && phase > 0.5) {
        const execAlpha = Math.min(1, (phase - 0.5) * 4);
        ctx.globalAlpha = execAlpha;
        ctx.fillStyle = c.success;
        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.fillText("\u2713", execX + 20, execY + 24);
        ctx.font = "8px monospace";
        ctx.fillText("executed", execX + 20, execY + 40);
        ctx.globalAlpha = 1;

        // Arrow check -> execute
        ctx.strokeStyle = c.success;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(checkX + 60, checkY + 15);
        ctx.lineTo(execX, execY + 15);
        ctx.stroke();
      }

      // Timing comparison
      const timeY = 120;
      ctx.font = "9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("Seconds to minutes", W / 2, timeY);
      ctx.fillText("No intermediary needed", W / 2, timeY + 18);

      // Cost bar
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Cost: transaction fee only", W / 2, timeY + 40);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.success;
      ctx.fillText("Self-executing, trustless", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Smart contract" canvasRef={canvasRef} />;
}
