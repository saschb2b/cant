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
  highlight: string;
  dim: string;
  line: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    highlight: isDark ? "#4ade80" : "#16a34a",
    dim: isDark ? "#444" : "#ccc",
    line: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Centralized Fast                                                   */
/* ------------------------------------------------------------------ */

export function CentralizedFast() {
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

    // Triangle vertices
    const cx = W / 2;
    const topY = 40;
    const botY = 165;
    const triW = 180;
    const pts = [
      { x: cx, y: topY, label: "Decentralization" },
      { x: cx - triW / 2, y: botY, label: "Security" },
      { x: cx + triW / 2, y: botY, label: "Scalability" },
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
      ctx.fillText("Maximize two, sacrifice one", W / 2, 14);

      // Draw triangle
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[1].x, pts[1].y);
      ctx.lineTo(pts[2].x, pts[2].y);
      ctx.closePath();
      ctx.stroke();

      // Highlight Security and Scalability, dim Decentralization
      for (let i = 0; i < pts.length; i++) {
        const isDimmed = i === 0;
        const radius = isDimmed ? 8 : 12;

        ctx.fillStyle = isDimmed ? c.dim : c.highlight;
        ctx.globalAlpha = isDimmed ? 0.4 : 0.8 + 0.2 * Math.sin(elapsed * 3);
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = isDimmed ? "8px monospace" : "bold 9px monospace";
        ctx.fillStyle = isDimmed ? c.dim : c.text;
        ctx.textAlign = "center";
        const labelY = i === 0 ? pts[i].y - 14 : pts[i].y + 22;
        ctx.fillText(pts[i].label, pts[i].x, labelY);
      }

      // X on decentralization
      ctx.strokeStyle = c.dim;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pts[0].x - 5, pts[0].y - 5);
      ctx.lineTo(pts[0].x + 5, pts[0].y + 5);
      ctx.moveTo(pts[0].x + 5, pts[0].y - 5);
      ctx.lineTo(pts[0].x - 5, pts[0].y + 5);
      ctx.stroke();

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("Fast but centralized", W / 2, 198);

      ctx.fillStyle = c.dimText;
      ctx.fillText("100 data center nodes only", W / 2, 214);
      ctx.fillText("Single point of failure", W / 2, 228);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Maximize two, sacrifice one"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Trilemma Balanced                                                  */
/* ------------------------------------------------------------------ */

export function TrilemmaBalanced() {
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

    const cx = W / 2;
    const topY = 40;
    const botY = 165;
    const triW = 180;
    const pts = [
      { x: cx, y: topY, label: "Decentralization" },
      { x: cx - triW / 2, y: botY, label: "Security" },
      { x: cx + triW / 2, y: botY, label: "Scalability" },
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
      ctx.fillText("Balance all three", W / 2, 14);

      // Draw triangle
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[1].x, pts[1].y);
      ctx.lineTo(pts[2].x, pts[2].y);
      ctx.closePath();
      ctx.stroke();

      // Animated highlight cycling through pairs
      const cycle = Math.floor(elapsed * 0.5) % 3;
      for (let i = 0; i < pts.length; i++) {
        const isStrong = i === cycle || i === (cycle + 1) % 3;
        const pulse = isStrong ? 0.8 + 0.2 * Math.sin(elapsed * 3) : 0.5;

        ctx.fillStyle = c.highlight;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, isStrong ? 12 : 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = isStrong ? "bold 9px monospace" : "8px monospace";
        ctx.fillStyle = isStrong ? c.text : c.dimText;
        ctx.textAlign = "center";
        const labelY = i === 0 ? pts[i].y - 14 : pts[i].y + 22;
        ctx.fillText(pts[i].label, pts[i].x, labelY);
      }

      // Trade-off text
      const tradeoffs = [
        "Security + Scalability (L1)",
        "Decentralization + Security (base)",
        "Scalability + Decentralization (L2)",
      ];
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText(tradeoffs[cycle], W / 2, 196);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Secure base layer, scale via L2", W / 2, 214);
      ctx.fillText("Acknowledge trade-offs, optimize layers", W / 2, 228);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Balance all three" canvasRef={canvasRef} />;
}
