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
  node: string;
  link: string;
  danger: string;
  safe: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    node: isDark ? "#60a5fa" : "#2563eb",
    link: isDark ? "#64748b" : "#94a3b8",
    danger: isDark ? "#f87171" : "#dc2626",
    safe: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Pseudonymous Addresses                                             */
/* ------------------------------------------------------------------ */

export function PseudonymousAddresses() {
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

    const addrs = [
      { x: 60, y: 60, label: "addr_1" },
      { x: 180, y: 50, label: "addr_2" },
      { x: 270, y: 80, label: "addr_3" },
      { x: 50, y: 130, label: "addr_4" },
      { x: 160, y: 140, label: "addr_5" },
      { x: 260, y: 150, label: "addr_6" },
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
      ctx.fillText("Pseudonymous addresses", W / 2, 14);

      // Draw separate, unconnected addresses
      for (const addr of addrs) {
        const bobY = addr.y + Math.sin(elapsed * 0.5 + addr.x * 0.05) * 3;

        ctx.fillStyle = c.node;
        ctx.beginPath();
        ctx.arc(addr.x, bobY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(addr.label, addr.x, bobY + 22);
      }

      // "Seemingly unlinked"
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.safe;
      ctx.textAlign = "center";
      ctx.fillText("Addresses appear unconnected", W / 2, 185);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Different addresses, no visible links", W / 2, 203);
      ctx.fillText('"Pseudonymous = anonymous" (wrong)', W / 2, 220);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Pseudonymous addresses" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Clustered Addresses                                                */
/* ------------------------------------------------------------------ */

export function ClusteredAddresses() {
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

    const addrs = [
      { x: 60, y: 60, label: "addr_1" },
      { x: 180, y: 50, label: "addr_2" },
      { x: 270, y: 80, label: "addr_3" },
      { x: 50, y: 130, label: "addr_4" },
      { x: 160, y: 140, label: "addr_5" },
      { x: 260, y: 150, label: "addr_6" },
    ];

    const links = [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [4, 1],
      [2, 5],
      [4, 5],
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
      ctx.fillText("Chain analysis overlay", W / 2, 14);

      // Draw links (analytics connections) - fade in
      const linkProgress = Math.min(1, elapsed / 3);
      for (let i = 0; i < links.length; i++) {
        const [a, b] = links[i];
        const segProgress = Math.min(1, linkProgress * links.length - i);
        if (segProgress <= 0) continue;

        ctx.strokeStyle = c.danger;
        ctx.globalAlpha = segProgress * 0.6;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(addrs[a].x, addrs[a].y);
        const endX = addrs[a].x + (addrs[b].x - addrs[a].x) * segProgress;
        const endY = addrs[a].y + (addrs[b].y - addrs[a].y) * segProgress;
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      // Draw addresses
      for (const addr of addrs) {
        ctx.fillStyle = c.danger;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(addr.x, addr.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(addr.label, addr.x, addr.y + 22);
      }

      // Cluster label
      if (linkProgress > 0.5) {
        ctx.strokeStyle = c.danger;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.ellipse(W / 2, 100, 140, 70, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = "bold 8px monospace";
        ctx.fillStyle = c.danger;
        ctx.textAlign = "right";
        ctx.fillText("CLUSTER: same owner", W - 15, 35);
      }

      // Analytics labels
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("Analytics links addresses together", W / 2, 185);

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Common inputs, timing, exchange deposits", W / 2, 201);
      ctx.fillText("Clusters reveal identity", W / 2, 215);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("Pseudonymous != anonymous", W / 2, 233);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Chain analysis overlay" canvasRef={canvasRef} />
  );
}
