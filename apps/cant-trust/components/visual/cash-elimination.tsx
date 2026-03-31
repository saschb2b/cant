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
  path: string;
  blocked: string;
  block: string;
  blockStroke: string;
  cash: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    path: isDark ? "#4ade80" : "#16a34a",
    blocked: isDark ? "#f87171" : "#dc2626",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
    cash: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Cash As Exit                                                       */
/* ------------------------------------------------------------------ */

export function CashAsExit() {
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
      ctx.fillText("Multiple payment paths", W / 2, 14);

      // Person at left
      ctx.fillStyle = c.path;
      ctx.beginPath();
      ctx.arc(40, 100, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("You", 40, 103);

      // Three paths
      const paths = [
        { label: "Digital", y: 50, color: c.accent },
        { label: "Crypto", y: 100, color: c.path },
        { label: "Cash", y: 150, color: c.cash },
      ];

      for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        // Path line
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(56, 100);
        ctx.lineTo(200, p.y);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(196, p.y - 4);
        ctx.lineTo(202, p.y);
        ctx.lineTo(196, p.y + 4);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Label box
        ctx.fillStyle = c.block;
        ctx.fillRect(205, p.y - 12, 90, 24);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(205, p.y - 12, 90, 24);

        ctx.font = "bold 8px monospace";
        ctx.fillStyle = p.color;
        ctx.textAlign = "center";
        ctx.fillText(p.label, 250, p.y + 4);

        // Animated dot on path
        const t = ((elapsed * 0.8 + i * 1.2) % 3) / 3;
        const dx = 56 + (200 - 56) * t;
        const dy = 100 + (p.y - 100) * t;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Labels
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.path;
      ctx.textAlign = "center";
      ctx.fillText("Cash = freedom backup", W / 2, 192);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("If one path is restricted,", W / 2, 210);
      ctx.fillText("alternatives remain available", W / 2, 226);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Multiple payment paths" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Cashless Trapped                                                   */
/* ------------------------------------------------------------------ */

export function CashlessTrapped() {
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
      ctx.fillText("Cashless society", W / 2, 14);

      // Person at left
      ctx.fillStyle = c.blocked;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(40, 100, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("You", 40, 103);

      // Only digital path
      ctx.strokeStyle = c.blocked;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(56, 100);
      ctx.lineTo(200, 70);
      ctx.stroke();

      // Digital label
      ctx.fillStyle = c.block;
      ctx.fillRect(205, 58, 90, 24);
      ctx.strokeStyle = c.blocked;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(205, 58, 90, 24);
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.blocked;
      ctx.textAlign = "center";
      ctx.fillText("CBDC Only", 250, 74);

      // Blocked paths with X
      const blockedPaths = [
        { label: "Crypto", y: 110 },
        { label: "Cash", y: 150 },
      ];

      for (const bp of blockedPaths) {
        // Greyed out path
        ctx.strokeStyle = c.dimText;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(56, 100);
        ctx.lineTo(200, bp.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // X mark
        const mx = 130;
        ctx.strokeStyle = c.blocked;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(mx - 8, bp.y - 12);
        ctx.lineTo(mx + 8, bp.y - 4);
        ctx.moveTo(mx + 8, bp.y - 12);
        ctx.lineTo(mx - 8, bp.y - 4);
        ctx.stroke();

        // Blocked label
        ctx.fillStyle = c.block;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(205, bp.y - 12, 90, 24);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.dimText;
        ctx.lineWidth = 1;
        ctx.strokeRect(205, bp.y - 12, 90, 24);
        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(bp.label, 250, bp.y + 2);
        ctx.fillStyle = c.blocked;
        ctx.fillText("REMOVED", 250, bp.y - 5);
      }

      // "No exit" label with blink
      const blink = Math.sin(elapsed * 3) > 0;
      if (blink) {
        ctx.font = "bold 12px monospace";
        ctx.fillStyle = c.blocked;
        ctx.textAlign = "center";
        ctx.fillText("NO EXIT", W / 2, 192);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("No alternative if wallet frozen", W / 2, 212);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.blocked;
      ctx.fillText("System controls everything", W / 2, 230);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Cashless society" canvasRef={canvasRef} />;
}
