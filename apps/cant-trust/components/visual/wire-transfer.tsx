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
  dim: string;
  node: string;
  nodeActive: string;
  line: string;
  packet: string;
  slow: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    node: isDark ? "#555" : "#ccc",
    nodeActive: isDark ? "#4ade80" : "#16a34a",
    line: isDark ? "#444" : "#bbb",
    packet: isDark ? "#60a5fa" : "#2563eb",
    slow: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  5-hop wire transfer chain (slow)                                   */
/* ------------------------------------------------------------------ */

export function WireTransferChain() {
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
    const CYCLE = 8;

    const nodes = [
      { x: 30, y: 120, label: "Sender" },
      { x: 90, y: 60, label: "Bank A" },
      { x: 150, y: 120, label: "Corresp." },
      { x: 210, y: 60, label: "Corresp." },
      { x: 270, y: 120, label: "Bank B" },
      { x: 290, y: 200, label: "Receiver" },
    ];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      const t = elapsed % CYCLE;

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
      ctx.fillStyle = c.dim;
      ctx.fillText("Multi-hop wire transfer", W / 2, 18);

      // Draw connections
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i]!.x, nodes[i]!.y);
        ctx.lineTo(nodes[i + 1]!.x, nodes[i + 1]!.y);
        ctx.stroke();
      }

      // Current hop
      const hopProgress = t / CYCLE;
      const currentHop = Math.min(
        Math.floor(hopProgress * nodes.length),
        nodes.length - 1,
      );
      const hopFrac = (hopProgress * nodes.length) % 1;

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = i <= currentHop ? c.nodeActive : c.node;
        ctx.fill();
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(n.label, n.x, n.y + 22);
      }

      // Animated packet
      if (currentHop < nodes.length - 1) {
        const from = nodes[currentHop]!;
        const to = nodes[currentHop + 1]!;
        const px = from.x + (to.x - from.x) * hopFrac;
        const py = from.y + (to.y - from.y) * hopFrac;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = c.packet;
        ctx.fill();
      }

      // Delay labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.slow;
      ctx.textAlign = "center";
      ctx.fillText("Each hop: 1-2 days", W / 2, H - 30);
      ctx.fillText(`Total: 3-5 business days`, W / 2, H - 16);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Correspondent banking chain"
      canvasRef={canvasRef}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Direct transfer (peer to peer, fast)                               */
/* ------------------------------------------------------------------ */

export function WireTransferDirect() {
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
    const CYCLE = 3;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      const t = elapsed % CYCLE;

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
      ctx.fillStyle = c.dim;
      ctx.fillText("Direct peer-to-peer", W / 2, 18);

      const senderX = 60;
      const receiverX = W - 60;
      const midY = 120;

      // Line
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(senderX, midY);
      ctx.lineTo(receiverX, midY);
      ctx.stroke();

      // Sender node
      ctx.beginPath();
      ctx.arc(senderX, midY, 14, 0, Math.PI * 2);
      ctx.fillStyle = c.nodeActive;
      ctx.fill();
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Sender", senderX, midY + 28);

      // Receiver node
      ctx.beginPath();
      ctx.arc(receiverX, midY, 14, 0, Math.PI * 2);
      const arrived = t > 1;
      ctx.fillStyle = arrived ? c.nodeActive : c.node;
      ctx.fill();
      ctx.fillStyle = c.text;
      ctx.fillText("Receiver", receiverX, midY + 28);

      // Animated packet
      const progress = Math.min(t / 1, 1);
      const px = senderX + (receiverX - senderX) * progress;
      ctx.beginPath();
      ctx.arc(px, midY, 6, 0, Math.PI * 2);
      ctx.fillStyle = c.packet;
      ctx.fill();

      // Status
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      if (arrived) {
        ctx.fillStyle = c.nodeActive;
        ctx.fillText("Settled in seconds", W / 2, H - 30);
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dim;
        ctx.fillText("No intermediaries needed", W / 2, H - 16);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Direct peer-to-peer transfer"
      canvasRef={canvasRef}
    />
  );
}
