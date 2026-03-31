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
  central: string;
  node: string;
  line: string;
  danger: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    central: isDark ? "#f87171" : "#dc2626",
    node: isDark ? "#60a5fa" : "#2563eb",
    line: isDark ? "#64748b" : "#94a3b8",
    danger: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  CBDC Centralized                                                   */
/* ------------------------------------------------------------------ */

export function CbdcCentralized() {
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
      ctx.fillText("CBDC: centralized control", W / 2, 14);

      // Central bank at top
      const cx = W / 2;
      const cy = 55;
      ctx.fillStyle = c.central;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("CENTRAL", cx, cy - 3);
      ctx.fillText("BANK", cx, cy + 7);

      // Users around the bottom in a semi-circle
      const userCount = 6;
      const userRadius = 8;
      for (let i = 0; i < userCount; i++) {
        const angle = Math.PI * 0.2 + (Math.PI * 0.6 * i) / (userCount - 1);
        const ux = cx + Math.cos(angle) * 100;
        const uy = cy + Math.sin(angle) * 80;

        // Line to central bank
        ctx.strokeStyle = c.line;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy + 22);
        ctx.lineTo(ux, uy);
        ctx.stroke();

        // Animated data flowing to center
        const t = (elapsed * 0.5 + i * 0.15) % 1;
        const dx = ux + (cx - ux) * t;
        const dy = uy + (cy + 22 - uy) * t;
        ctx.fillStyle = c.central;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // User circle
        ctx.fillStyle = c.node;
        ctx.beginPath();
        ctx.arc(ux, uy, userRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Kill switch
      const killBlink = Math.sin(elapsed * 3) > 0;
      if (killBlink) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.danger;
        ctx.textAlign = "center";
        ctx.fillText("KILL SWITCH", cx + 60, cy - 15);
      }

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("All transactions flow through center", W / 2, 180);
      ctx.fillText("Central bank sees and controls all", W / 2, 196);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.danger;
      ctx.fillText("Single point of control and failure", W / 2, 218);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="CBDC: centralized control" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Crypto Decentralized                                               */
/* ------------------------------------------------------------------ */

export function CryptoDecentralized() {
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

    const nodes = [
      { x: 80, y: 60 },
      { x: 240, y: 55 },
      { x: 160, y: 90 },
      { x: 60, y: 130 },
      { x: 260, y: 130 },
      { x: 110, y: 160 },
      { x: 210, y: 165 },
      { x: 160, y: 50 },
    ];

    const links = [
      [0, 2],
      [1, 2],
      [0, 3],
      [1, 4],
      [2, 5],
      [2, 6],
      [3, 5],
      [4, 6],
      [5, 6],
      [0, 7],
      [1, 7],
      [7, 2],
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
      ctx.fillText("Cryptocurrency: decentralized", W / 2, 14);

      // Draw links
      for (const [a, b] of links) {
        ctx.strokeStyle = c.line;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Animated peer-to-peer transactions
      for (let i = 0; i < 3; i++) {
        const linkIdx = Math.floor((elapsed * 0.7 + i * 4) % links.length);
        const [a, b] = links[linkIdx];
        const t = ((elapsed * 1.5 + i * 2) % 2) / 2;
        const dx = nodes[a].x + (nodes[b].x - nodes[a].x) * t;
        const dy = nodes[a].y + (nodes[b].y - nodes[a].y) * t;

        ctx.fillStyle = c.accent;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.fillStyle = c.node;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("No center, peer-to-peer network", W / 2, 192);
      ctx.fillText("No single point of control", W / 2, 208);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("No single point of failure", W / 2, 228);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Cryptocurrency: decentralized"
      canvasRef={canvasRef}
    />
  );
}
