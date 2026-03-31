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
  tx: string;
  danger: string;
  success: string;
  queue: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    box: isDark ? "#334155" : "#e2e8f0",
    boxStroke: isDark ? "#64748b" : "#94a3b8",
    tx: isDark ? "#93c5fd" : "#3b82f6",
    danger: isDark ? "#f87171" : "#dc2626",
    success: isDark ? "#4ade80" : "#16a34a",
    queue: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Account Model                                                      */
/* ------------------------------------------------------------------ */

export function AccountModel() {
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
      ctx.fillText("Account model", W / 2, 16);

      // Global state box
      const stateX = 110;
      const stateY = 40;
      const stateW = 100;
      const stateH = 70;
      ctx.fillStyle = c.danger;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(stateX, stateY, stateW, stateH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.danger;
      ctx.lineWidth = 2;
      ctx.strokeRect(stateX, stateY, stateW, stateH);
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("GLOBAL STATE", stateX + stateW / 2, stateY + 14);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("balance[A]: 100", stateX + stateW / 2, stateY + 32);
      ctx.fillText("balance[B]: 50", stateX + stateW / 2, stateY + 44);
      ctx.fillText("balance[C]: 75", stateX + stateW / 2, stateY + 56);

      // Queued transactions
      const queueY = stateY + stateH + 20;
      const txs = ["tx1", "tx2", "tx3", "tx4"];
      const activeIdx = Math.floor(elapsed * 0.8) % txs.length;

      ctx.font = "7px monospace";
      ctx.fillStyle = c.queue;
      ctx.textAlign = "center";
      ctx.fillText("Queue (one at a time):", W / 2, queueY);

      for (let i = 0; i < txs.length; i++) {
        const txX = 60 + i * 55;
        const txYpos = queueY + 10;
        const isActive = i === activeIdx;
        const isWaiting = i > activeIdx;

        ctx.fillStyle = isActive ? c.tx : c.box;
        ctx.globalAlpha = isWaiting ? 0.4 : 0.8;
        ctx.fillRect(txX, txYpos, 40, 20);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isActive ? c.tx : c.boxStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(txX, txYpos, 40, 20);
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(txs[i], txX + 20, txYpos + 14);

        if (isWaiting) {
          ctx.font = "7px monospace";
          ctx.fillStyle = c.queue;
          ctx.fillText("wait", txX + 20, txYpos + 32);
        }

        // Arrow from active to state
        if (isActive) {
          ctx.strokeStyle = c.tx;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(txX + 20, txYpos);
          ctx.lineTo(stateX + stateW / 2, stateY + stateH);
          ctx.stroke();
        }
      }

      // Bottleneck label
      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("Bottleneck: sequential execution", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Account model" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  eUTXO Model                                                        */
/* ------------------------------------------------------------------ */

export function EutxoModel() {
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
      ctx.fillText("eUTXO model", W / 2, 16);

      // Local UTXOs
      const utxos = [
        { x: 40, y: 40, label: "UTXO-A" },
        { x: 160, y: 40, label: "UTXO-B" },
        { x: 100, y: 100, label: "UTXO-C" },
        { x: 220, y: 100, label: "UTXO-D" },
      ];

      // Transactions processing in parallel
      const pairs = [
        [0, 1],
        [2, 3],
      ];

      for (let i = 0; i < utxos.length; i++) {
        const u = utxos[i];
        const pulse = Math.sin(elapsed * 2 + i * 1.5) * 0.2 + 0.8;
        ctx.fillStyle = c.success;
        ctx.globalAlpha = 0.15 * pulse;
        ctx.fillRect(u.x, u.y, 60, 28);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.success;
        ctx.lineWidth = 1;
        ctx.strokeRect(u.x, u.y, 60, 28);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(u.label, u.x + 30, u.y + 12);
        ctx.fillStyle = c.dimText;
        ctx.fillText("local", u.x + 30, u.y + 22);
      }

      // Parallel processing arrows
      const procY = 150;
      for (let p = 0; p < pairs.length; p++) {
        const txX = 60 + p * 140;
        const progress = (Math.sin(elapsed * 1.5 + p * Math.PI) + 1) / 2;

        ctx.fillStyle = c.tx;
        ctx.globalAlpha = 0.3 + progress * 0.5;
        ctx.fillRect(txX, procY, 60, 22);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.tx;
        ctx.strokeRect(txX, procY, 60, 22);
        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(`tx${p + 1}`, txX + 30, procY + 15);

        // Arrows from UTXOs to tx
        for (const idx of pairs[p]) {
          ctx.strokeStyle = c.success;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(utxos[idx].x + 30, utxos[idx].y + 28);
          ctx.lineTo(txX + 30, procY);
          ctx.stroke();
        }
      }

      // Parallel label
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.success;
      ctx.textAlign = "center";
      ctx.fillText("Processing simultaneously", W / 2, procY + 40);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.success;
      ctx.fillText("Local state, parallel validation", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="eUTXO model" canvasRef={canvasRef} />;
}
