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
  person: string;
  flow: string;
  blocked: string;
  frozen: string;
  stamp: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    person: isDark ? "#93c5fd" : "#3b82f6",
    flow: isDark ? "#4ade80" : "#16a34a",
    blocked: isDark ? "#f87171" : "#dc2626",
    frozen: isDark ? "#ef4444" : "#b91c1c",
    stamp: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Free Access                                                        */
/* ------------------------------------------------------------------ */

export function FreeAccess() {
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

      // Person at center
      const px = 100;
      const py = 120;
      ctx.beginPath();
      ctx.arc(px, py, 18, 0, Math.PI * 2);
      ctx.fillStyle = c.person;
      ctx.fill();
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("YOU", px, py + 5);

      // Actions flowing freely
      const actions = [
        { label: "Withdraw", angle: -0.8, dx: 120, dy: -50 },
        { label: "Transfer", angle: -0.2, dx: 140, dy: -10 },
        { label: "Spend", angle: 0.4, dx: 130, dy: 40 },
        { label: "Save", angle: 1.0, dx: 110, dy: 80 },
      ];

      for (let i = 0; i < actions.length; i++) {
        const action = actions[i]!;
        const tx = px + action.dx;
        const ty = py + action.dy;
        const progress = ((elapsed * 0.8 + i * 0.3) % 2) / 2;

        // Arrow
        const midX = px + 18 + (tx - px - 18) * progress;
        const midY = py + action.dy * progress;

        ctx.strokeStyle = c.flow;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px + 18, py + action.dy * 0.2);
        ctx.lineTo(midX, midY);
        ctx.stroke();

        // Dot at end
        ctx.beginPath();
        ctx.arc(midX, midY, 4, 0, Math.PI * 2);
        ctx.fillStyle = c.flow;
        ctx.fill();

        // Label
        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = c.dimText;
        ctx.fillText(action.label, tx + 5, ty + 4);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.flow;
      ctx.textAlign = "center";
      ctx.fillText("Full control of your funds", W / 2, 220);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Free account access", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Free account access" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Frozen Account                                                     */
/* ------------------------------------------------------------------ */

export function FrozenAccount() {
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

      const cycle = elapsed % 6;

      // Person at center
      const px = 100;
      const py = 120;
      ctx.beginPath();
      ctx.arc(px, py, 18, 0, Math.PI * 2);
      ctx.fillStyle = cycle > 2 ? c.blocked : c.person;
      ctx.fill();
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("YOU", px, py + 5);

      // Blocked arrows
      const actions = [
        { label: "Withdraw", dy: -50 },
        { label: "Transfer", dy: -10 },
        { label: "Spend", dy: 40 },
        { label: "Save", dy: 80 },
      ];

      for (let i = 0; i < actions.length; i++) {
        const action = actions[i]!;
        const tx = px + 120;
        const ty = py + action.dy;

        if (cycle > 2) {
          // Blocked: X marks
          ctx.strokeStyle = c.blocked;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px + 25, py + action.dy * 0.2);
          ctx.lineTo(px + 50, ty * 0.5 + py * 0.5);
          ctx.stroke();

          // X at end
          const xPos = px + 50;
          const yPos = ty * 0.5 + py * 0.5;
          ctx.beginPath();
          ctx.moveTo(xPos - 5, yPos - 5);
          ctx.lineTo(xPos + 5, yPos + 5);
          ctx.moveTo(xPos + 5, yPos - 5);
          ctx.lineTo(xPos - 5, yPos + 5);
          ctx.stroke();

          ctx.font = "9px monospace";
          ctx.textAlign = "left";
          ctx.fillStyle = c.blocked;
          ctx.fillText(action.label, tx + 5, ty + 4);
        } else {
          ctx.strokeStyle = c.flow;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px + 18, py + action.dy * 0.2);
          ctx.lineTo(tx, ty);
          ctx.stroke();

          ctx.font = "9px monospace";
          ctx.textAlign = "left";
          ctx.fillStyle = c.dimText;
          ctx.fillText(action.label, tx + 5, ty + 4);
        }
      }

      // Government order stamp animation
      if (cycle > 1.5 && cycle < 3) {
        const stampProgress = Math.min(1, (cycle - 1.5) / 0.3);
        const stampSize = 60 * stampProgress;
        ctx.save();
        ctx.translate(W / 2, py);
        ctx.rotate(-0.2);
        ctx.globalAlpha = stampProgress;
        ctx.strokeStyle = c.stamp;
        ctx.lineWidth = 3;
        ctx.strokeRect(-stampSize / 2, -stampSize / 2, stampSize, stampSize);
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.stamp;
        ctx.fillText("GOV", 0, -5);
        ctx.fillText("ORDER", 0, 10);
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // FROZEN overlay
      if (cycle > 2.5) {
        const alpha = Math.min(0.8, (cycle - 2.5) / 0.5);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = c.frozen;
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillText("FROZEN", W / 2, 215);
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText("No due process required", W / 2, 232);
        ctx.globalAlpha = 1;
      }

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Account freezing", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Account freezing" canvasRef={canvasRef} />;
}
