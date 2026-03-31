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
  node: string;
  nodeStroke: string;
  arrow: string;
  message: string;
  cost: string;
  person: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    node: isDark ? "#334155" : "#e2e8f0",
    nodeStroke: isDark ? "#64748b" : "#94a3b8",
    arrow: isDark ? "#64748b" : "#94a3b8",
    message: isDark ? "#4ade80" : "#16a34a",
    cost: isDark ? "#f87171" : "#dc2626",
    person: isDark ? "#93c5fd" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  Direct Transfer                                                    */
/* ------------------------------------------------------------------ */

export function DirectTransfer() {
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

      const ay = 120;
      const leftX = 60;
      const rightX = 260;

      // Person A
      ctx.beginPath();
      ctx.arc(leftX, ay, 18, 0, Math.PI * 2);
      ctx.fillStyle = c.person;
      ctx.fill();
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("A", leftX, ay + 5);
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Sender", leftX, ay + 35);

      // Person B
      ctx.beginPath();
      ctx.arc(rightX, ay, 18, 0, Math.PI * 2);
      ctx.fillStyle = c.person;
      ctx.fill();
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("B", rightX, ay + 5);
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Receiver", rightX, ay + 35);

      // Animated message traveling
      const cycle = elapsed % 3;
      const progress = Math.min(1, cycle / 1.5);
      const msgX = leftX + 20 + progress * (rightX - leftX - 40);

      // Arrow line
      ctx.strokeStyle = c.arrow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftX + 20, ay);
      ctx.lineTo(rightX - 20, ay);
      ctx.stroke();

      // Message dot
      ctx.beginPath();
      ctx.arc(msgX, ay, 6, 0, Math.PI * 2);
      ctx.fillStyle = c.message;
      ctx.fill();

      // Labels
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.message;
      ctx.textAlign = "center";
      ctx.fillText("Direct", W / 2, ay - 30);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Fast, low cost", W / 2, ay + 60);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Direct peer-to-peer transfer", W / 2, 14);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Direct transfer" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Correspondent Chain                                                */
/* ------------------------------------------------------------------ */

export function CorrespondentChain() {
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
      { label: "A", x: 20, y: 120 },
      { label: "Bank1", x: 65, y: 70 },
      { label: "Corr1", x: 120, y: 120 },
      { label: "SWIFT", x: 170, y: 70 },
      { label: "Corr2", x: 220, y: 120 },
      { label: "Bank2", x: 265, y: 70 },
      { label: "B", x: 300, y: 120 },
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

      const cycle = elapsed % 8;
      const activeHop = Math.floor(cycle / 1.0);
      const hopProgress = (cycle % 1.0) / 1.0;
      let totalCost = 0;

      // Draw connections and nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!;
        const isPerson = node.label === "A" || node.label === "B";
        const r = isPerson ? 14 : 12;

        // Connection to next node
        if (i < nodes.length - 1) {
          const next = nodes[i + 1]!;
          ctx.strokeStyle = i < activeHop ? c.message : c.arrow;
          ctx.lineWidth = i < activeHop ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(node.x + r, node.y);
          ctx.lineTo(next.x - r, next.y);
          ctx.stroke();
        }

        // Node
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isPerson ? c.person : c.node;
        ctx.fill();
        ctx.strokeStyle = c.nodeStroke;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = isPerson ? "bold 10px monospace" : "7px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(node.label, node.x, node.y + 4);

        // Cost per hop
        if (!isPerson && i <= activeHop) {
          totalCost += 15;
        }
      }

      // Animated message at current hop
      if (activeHop < nodes.length - 1) {
        const from = nodes[activeHop]!;
        const to = nodes[activeHop + 1]!;
        const isPerson = from.label === "A" || from.label === "B";
        const r1 = isPerson ? 14 : 12;
        const isPersonTo = to.label === "A" || to.label === "B";
        const r2 = isPersonTo ? 14 : 12;
        const mx = from.x + r1 + hopProgress * (to.x - r2 - from.x - r1);
        const my = from.y + hopProgress * (to.y - from.y);

        ctx.beginPath();
        ctx.arc(mx, my, 5, 0, Math.PI * 2);
        ctx.fillStyle = c.message;
        ctx.fill();
      }

      // Cost counter
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.cost;
      ctx.textAlign = "center";
      ctx.fillText(`Cost: $${totalCost}`, W / 2, 170);

      // Delay counter
      const days = Math.min(5, Math.floor(activeHop * 0.8));
      ctx.font = "10px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText(`Delay: ${days} days`, W / 2, 188);
      ctx.fillText("Each hop adds fees and time", W / 2, 210);

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Correspondent banking chain", W / 2, 14);

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
