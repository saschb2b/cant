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
  header: string;
  tx: string;
  link: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    box: isDark ? "#334155" : "#e2e8f0",
    boxStroke: isDark ? "#64748b" : "#94a3b8",
    header: isDark ? "#f7931a" : "#c28a1a",
    tx: isDark ? "#93c5fd" : "#3b82f6",
    link: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Unstructured Transactions                                          */
/* ------------------------------------------------------------------ */

export function UnstructuredTxns() {
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

    interface FloatingTx {
      x: number;
      y: number;
      vx: number;
      vy: number;
      label: string;
    }

    const txns: FloatingTx[] = [];
    for (let i = 0; i < 8; i++) {
      txns.push({
        x: 40 + Math.random() * 240,
        y: 50 + Math.random() * 150,
        vx: (Math.random() - 0.5) * 30,
        vy: (Math.random() - 0.5) * 30,
        label: `tx${i + 1}`,
      });
    }

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      for (const tx of txns) {
        tx.x += tx.vx * dt;
        tx.y += tx.vy * dt;
        if (tx.x < 20 || tx.x > 300) tx.vx *= -1;
        if (tx.y < 40 || tx.y > 210) tx.vy *= -1;
        tx.x = Math.max(20, Math.min(300, tx.x));
        tx.y = Math.max(40, Math.min(210, tx.y));
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
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Unstructured transactions", W / 2, 16);

      for (const tx of txns) {
        ctx.fillStyle = c.tx;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(tx.x - 16, tx.y - 10, 32, 20);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.tx;
        ctx.lineWidth = 1;
        ctx.strokeRect(tx.x - 16, tx.y - 10, 32, 20);
        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(tx.label, tx.x, tx.y + 3);
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("No organization, no linking, no proof", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Unstructured transactions" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Merkle Block Structure                                             */
/* ------------------------------------------------------------------ */

export function BlockStructured() {
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
      ctx.fillText("Merkle block structure", W / 2, 16);

      // Block outline
      const bx = 30;
      const by = 30;
      const bw = 260;
      const bh = 185;
      ctx.strokeStyle = c.boxStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      // Header bar
      const hh = 35;
      ctx.fillStyle = c.header;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(bx, by, bw, hh);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.header;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, bw, hh);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.header;
      ctx.textAlign = "left";
      ctx.fillText("prev: 00a1b2..", bx + 6, by + 13);
      ctx.fillText(
        "nonce: " + (Math.floor(elapsed * 3) % 9999),
        bx + 6,
        by + 26,
      );
      ctx.textAlign = "right";
      ctx.fillText("merkle: 7f9c3d..", bx + bw - 6, by + 13);
      ctx.fillText("time: 1632000", bx + bw - 6, by + 26);

      // Merkle tree
      const treeTop = by + hh + 15;
      const cx2 = bx + bw / 2;

      // Root
      ctx.fillStyle = c.link;
      ctx.beginPath();
      ctx.arc(cx2, treeTop, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "7px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("root", cx2, treeTop - 10);

      // Level 2
      const l2y = treeTop + 35;
      const l2x1 = cx2 - 60;
      const l2x2 = cx2 + 60;
      ctx.fillStyle = c.link;
      ctx.beginPath();
      ctx.arc(l2x1, l2y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(l2x2, l2y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Lines to root
      ctx.strokeStyle = c.link;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx2, treeTop + 6);
      ctx.lineTo(l2x1, l2y - 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx2, treeTop + 6);
      ctx.lineTo(l2x2, l2y - 5);
      ctx.stroke();

      // Leaf transactions
      const leafY = l2y + 35;
      const txLabels = ["tx1", "tx2", "tx3", "tx4"];
      const leafXs = [l2x1 - 30, l2x1 + 30, l2x2 - 30, l2x2 + 30];

      for (let i = 0; i < 4; i++) {
        const lx = leafXs[i];
        const parent = i < 2 ? l2x1 : l2x2;

        // Pulse animation
        const pulse = Math.sin(elapsed * 2 + i) * 0.3 + 0.7;

        ctx.fillStyle = c.tx;
        ctx.globalAlpha = pulse;
        ctx.fillRect(lx - 14, leafY - 8, 28, 16);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.tx;
        ctx.strokeRect(lx - 14, leafY - 8, 28, 16);

        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(txLabels[i], lx, leafY + 3);

        ctx.strokeStyle = c.link;
        ctx.beginPath();
        ctx.moveTo(parent, l2y + 5);
        ctx.lineTo(lx, leafY - 8);
        ctx.stroke();
      }

      // Previous block link indicator
      const arrowX = bx - 5;
      const arrowY = by + hh / 2;
      ctx.strokeStyle = c.link;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 18, arrowY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(arrowX - 18, arrowY - 4);
      ctx.lineTo(arrowX - 24, arrowY);
      ctx.lineTo(arrowX - 18, arrowY + 4);
      ctx.fillStyle = c.link;
      ctx.fill();

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Header + Merkle tree, O(log n) verification", W / 2, H - 6);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Merkle block structure" canvasRef={canvasRef} />
  );
}
