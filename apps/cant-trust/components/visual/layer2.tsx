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
  chain: string;
  chainStroke: string;
  tx: string;
  congestion: string;
  l2: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    chain: isDark ? "#334155" : "#e2e8f0",
    chainStroke: isDark ? "#64748b" : "#94a3b8",
    tx: isDark ? "#60a5fa" : "#2563eb",
    congestion: isDark ? "#f87171" : "#dc2626",
    l2: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Everything On L1                                                   */
/* ------------------------------------------------------------------ */

export function EverythingOnL1() {
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

    interface Tx {
      x: number;
      speed: number;
      y: number;
    }
    const txs: Tx[] = [];
    let spawnTimer = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      spawnTimer += dt;

      // Spawn transactions
      if (spawnTimer > 0.15 && txs.length < 40) {
        txs.push({
          x: -10,
          speed: 15 + Math.random() * 10,
          y: 95 + Math.random() * 50,
        });
        spawnTimer = 0;
      }

      // Move but slow down as congestion builds
      const congestionFactor = Math.max(0.1, 1 - txs.length / 50);
      for (const tx of txs) {
        tx.x += tx.speed * congestionFactor * dt;
      }

      // Remove completed
      for (let i = txs.length - 1; i >= 0; i--) {
        if (txs[i].x > W + 10) txs.splice(i, 1);
      }

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
      ctx.fillText("All transactions on L1", W / 2, 14);

      // Road/chain
      ctx.fillStyle = c.chain;
      ctx.fillRect(0, 80, W, 80);
      ctx.strokeStyle = c.chainStroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 80);
      ctx.lineTo(W, 80);
      ctx.moveTo(0, 160);
      ctx.lineTo(W, 160);
      ctx.stroke();

      // Center line (dashed)
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = c.chainStroke;
      ctx.beginPath();
      ctx.moveTo(0, 120);
      ctx.lineTo(W, 120);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("L1 CHAIN", 10, 75);

      // Draw transactions as small squares (traffic jam)
      for (const tx of txs) {
        ctx.fillStyle = c.tx;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(tx.x - 4, tx.y - 4, 8, 8);
        ctx.globalAlpha = 1;
      }

      // Congestion indicator
      const congPct = Math.min(100, Math.floor(txs.length * 2.5));
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.congestion;
      ctx.textAlign = "center";
      ctx.fillText(`Congestion: ${congPct}%`, W / 2, 180);

      // Fee indicator
      const fee = (congPct * 0.5).toFixed(0);
      ctx.fillText(`Fee: $${fee}`, W / 2, 198);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("All txs crammed on one chain", W / 2, 218);
      ctx.fillText("High fees, slow blocks", W / 2, 232);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="All transactions on L1" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  L1 Plus L2                                                         */
/* ------------------------------------------------------------------ */

export function L1PlusL2() {
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

    interface Tx {
      x: number;
      speed: number;
      lane: "l1" | "l2";
    }
    const txs: Tx[] = [];
    let spawnTimer = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      spawnTimer += dt;

      if (spawnTimer > 0.2 && txs.length < 30) {
        const isL2 = Math.random() > 0.2;
        txs.push({
          x: -10,
          speed: isL2 ? 60 + Math.random() * 20 : 20 + Math.random() * 10,
          lane: isL2 ? "l2" : "l1",
        });
        spawnTimer = 0;
      }

      for (const tx of txs) {
        tx.x += tx.speed * dt;
      }

      for (let i = txs.length - 1; i >= 0; i--) {
        if (txs[i].x > W + 10) txs.splice(i, 1);
      }

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
      ctx.fillText("L1 settlement + L2 execution", W / 2, 14);

      // L2 lane (top, wider, faster)
      ctx.fillStyle = c.l2;
      ctx.globalAlpha = 0.08;
      ctx.fillRect(0, 35, W, 55);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.l2;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 35);
      ctx.lineTo(W, 35);
      ctx.moveTo(0, 90);
      ctx.lineTo(W, 90);
      ctx.stroke();

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.l2;
      ctx.textAlign = "left";
      ctx.fillText("L2 (fast, cheap)", 10, 30);

      // L1 lane (bottom, narrow)
      ctx.fillStyle = c.chain;
      ctx.fillRect(0, 110, W, 40);
      ctx.strokeStyle = c.chainStroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 110);
      ctx.lineTo(W, 110);
      ctx.moveTo(0, 150);
      ctx.lineTo(W, 150);
      ctx.stroke();

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "left";
      ctx.fillText("L1 (settlement only)", 10, 106);

      // Anchor arrows from L2 to L1
      const anchorX = 160 + Math.sin(elapsed * 0.8) * 40;
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(anchorX, 90);
      ctx.lineTo(anchorX, 110);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText("anchor", anchorX, 103);

      // Draw transactions
      for (const tx of txs) {
        const y =
          tx.lane === "l2" ? 55 + Math.random() * 20 : 125 + Math.random() * 10;
        ctx.fillStyle = tx.lane === "l2" ? c.l2 : c.tx;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(tx.x - 3, y - 3, 6, 6);
        ctx.globalAlpha = 1;
      }

      // Labels
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.l2;
      ctx.textAlign = "center";
      ctx.fillText("Most txs on L2: fast and cheap", W / 2, 172);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("L1 handles settlement only", W / 2, 192);
      ctx.fillText("Decentralized base, scalable top", W / 2, 208);
      ctx.fillText("Best of both worlds", W / 2, 224);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="L1 settlement + L2 execution"
      canvasRef={canvasRef}
    />
  );
}
