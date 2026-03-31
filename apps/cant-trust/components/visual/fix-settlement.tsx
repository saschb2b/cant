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
  slow: string;
  fast: string;
  block: string;
  blockStroke: string;
  fee: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    slow: isDark ? "#f87171" : "#dc2626",
    fast: isDark ? "#4ade80" : "#16a34a",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
    fee: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  SWIFT Settlement                                                   */
/* ------------------------------------------------------------------ */

export function SwiftSettlement() {
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
      ctx.fillText("SWIFT settlement", W / 2, 14);

      // Intermediary chain
      const nodes = [
        { x: 30, label: "Alice" },
        { x: 90, label: "Bank A" },
        { x: 150, label: "SWIFT" },
        { x: 210, label: "Corr." },
        { x: 270, label: "Bank B" },
        { x: 310, label: "Bob" },
      ];

      const nodeY = 55;

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const isBank = i > 0 && i < nodes.length - 1;
        ctx.fillStyle = isBank ? c.block : c.accent;
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodeY, isBank ? 14 : 10, 0, Math.PI * 2);
        ctx.fill();
        if (isBank) {
          ctx.strokeStyle = c.blockStroke;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.font = "6px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(nodes[i].label, nodes[i].x, nodeY + 3);
      }

      // Animated message bouncing through intermediaries
      const totalHops = nodes.length - 1;
      const messageProgress = (elapsed * 0.4) % (totalHops + 1);
      const currentHop = Math.floor(messageProgress);
      const hopFrac = messageProgress - currentHop;

      if (currentHop < totalHops) {
        const fromX = nodes[currentHop].x;
        const toX = nodes[currentHop + 1].x;
        const msgX = fromX + (toX - fromX) * hopFrac;
        ctx.fillStyle = c.slow;
        ctx.beginPath();
        ctx.arc(msgX, nodeY - 20, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connections between nodes
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.strokeStyle = c.blockStroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x + 15, nodeY);
        ctx.lineTo(nodes[i + 1].x - 15, nodeY);
        ctx.stroke();
      }

      // Day counter
      const day = Math.min(5, Math.floor(elapsed * 0.5) + 1);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.slow;
      ctx.textAlign = "center";
      ctx.fillText(`Day ${day}`, W / 2, 100);

      // Fee accumulation
      const fees = Math.min(150, Math.floor(elapsed * 15));
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.fee;
      ctx.fillText(`Fees: $${fees}`, W / 2, 120);

      // Hop details
      const hops = [
        "Alice's bank debits",
        "Correspondent routes via SWIFT",
        "Intermediary bank processes",
        "Bob's bank credits (eventually)",
      ];

      for (let i = 0; i < hops.length; i++) {
        const y = 140 + i * 16;
        const done = elapsed > (i + 1) * 1.5;
        ctx.font = "8px monospace";
        ctx.fillStyle = done ? c.slow : c.dimText;
        ctx.textAlign = "left";
        ctx.fillText(`${done ? "[done]" : "[....]"} ${hops[i]}`, 40, y);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("3-5 business days, $50-150 in fees", W / 2, 220);
      ctx.fillText("Each intermediary: failure point", W / 2, 234);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="SWIFT settlement" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Blockchain Settlement                                              */
/* ------------------------------------------------------------------ */

export function BlockchainSettlement() {
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
      ctx.fillText("Blockchain settlement", W / 2, 14);

      // Alice and Bob directly
      ctx.fillStyle = c.accent;
      ctx.beginPath();
      ctx.arc(60, 65, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "8px monospace";
      ctx.fillStyle = c.bg;
      ctx.textAlign = "center";
      ctx.fillText("Alice", 60, 68);

      ctx.fillStyle = c.accent;
      ctx.beginPath();
      ctx.arc(260, 65, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.bg;
      ctx.fillText("Bob", 260, 68);

      // Direct arrow
      const txProgress = Math.min(1, elapsed * 0.8);
      const txX = 78 + (260 - 78 - 18) * txProgress;

      ctx.strokeStyle = c.fast;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(78, 65);
      ctx.lineTo(txX, 65);
      ctx.stroke();

      if (txProgress > 0.3) {
        ctx.fillStyle = c.fast;
        ctx.beginPath();
        ctx.moveTo(txX - 5, 61);
        ctx.lineTo(txX + 1, 65);
        ctx.lineTo(txX - 5, 69);
        ctx.fill();
      }

      // Animated coin
      ctx.fillStyle = c.accent;
      ctx.beginPath();
      ctx.arc(txX - 10, 65, 5, 0, Math.PI * 2);
      ctx.fill();

      // One hop label
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.fast;
      ctx.textAlign = "center";
      ctx.fillText("1 hop, no intermediaries", W / 2, 55);

      // Timer
      const seconds = Math.min(300, Math.floor(elapsed * 30));
      const confirmed = seconds > 180;
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = confirmed ? c.fast : c.accent;
      ctx.fillText(confirmed ? "Confirmed" : `${seconds}s`, W / 2, 105);

      // Fee
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.fast;
      ctx.fillText("Fee: $0.50", W / 2, 125);

      // Steps
      const steps = [
        { label: "Sign transaction", time: 0.5 },
        { label: "Broadcast to network", time: 1.0 },
        { label: "Included in block", time: 1.5 },
        { label: "Confirmed (final)", time: 2.0 },
      ];

      for (let i = 0; i < steps.length; i++) {
        const y = 145 + i * 18;
        const done = elapsed > steps[i].time;

        ctx.font = "8px monospace";
        ctx.fillStyle = done ? c.fast : c.dimText;
        ctx.textAlign = "left";
        ctx.fillText(`${done ? "[done]" : "[....]"} ${steps[i].label}`, 60, y);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Minutes, not days. Cents, not $100+", W / 2, 222);
      ctx.fillText("Works 24/7/365, no business hours", W / 2, 236);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Blockchain settlement" canvasRef={canvasRef} />
  );
}
