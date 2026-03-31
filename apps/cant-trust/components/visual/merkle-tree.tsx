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
  highlight: string;
  line: string;
  bad: string;
  good: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    node: isDark ? "#60a5fa" : "#2563eb",
    highlight: isDark ? "#fbbf24" : "#d97706",
    line: isDark ? "#555" : "#aaa",
    bad: isDark ? "#f87171" : "#dc2626",
    good: isDark ? "#4ade80" : "#16a34a",
  };
}

/* ------------------------------------------------------------------ */
/*  Flat list verification (check every item)                          */
/* ------------------------------------------------------------------ */

export function MerkleFlat() {
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
    const CYCLE = 5;
    const items = ["Tx1", "Tx2", "Tx3", "Tx4", "Tx5", "Tx6", "Tx7", "Tx8"];

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
      ctx.fillText("Flat list verification", W / 2, 18);

      // Draw items in two rows
      const checkedCount = Math.min(Math.floor(t / 0.5), items.length);

      for (let i = 0; i < items.length; i++) {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const x = 50 + col * 65;
        const y = 60 + row * 50;

        const checked = i < checkedCount;
        ctx.fillStyle = checked ? c.highlight : c.node;
        ctx.fillRect(x - 20, y - 12, 40, 24);
        ctx.font = "9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(items[i]!, x, y + 4);

        if (checked) {
          ctx.font = "8px monospace";
          ctx.fillStyle = c.highlight;
          ctx.fillText("check", x, y + 18);
        }
      }

      // Stats
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.bad;
      ctx.fillText(`Checked: ${checkedCount}/${items.length}`, W / 2, H - 55);
      ctx.fillText("Must verify ALL items", W / 2, H - 40);
      ctx.fillText(`O(n) operations for n items`, W / 2, H - 25);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Check every transaction" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Merkle tree verification (logarithmic proof)                       */
/* ------------------------------------------------------------------ */

export function MerkleTree() {
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
    const CYCLE = 6;

    // Tree layout: root, 2 middle, 4 leaves
    const treeNodes = [
      { x: W / 2, y: 50, label: "Root", level: 0 },
      { x: W / 4, y: 100, label: "H(1+2)", level: 1 },
      { x: (3 * W) / 4, y: 100, label: "H(3+4)", level: 1 },
      { x: W / 8 + 10, y: 155, label: "H(Tx1)", level: 2 },
      { x: (3 * W) / 8 - 10, y: 155, label: "H(Tx2)", level: 2 },
      { x: (5 * W) / 8 + 10, y: 155, label: "H(Tx3)", level: 2 },
      { x: (7 * W) / 8 - 10, y: 155, label: "H(Tx4)", level: 2 },
    ];

    // Proof path to verify Tx3: Tx3 -> H(Tx4) -> H(1+2) -> Root
    const proofPath = [5, 6, 1, 0]; // indices in treeNodes

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
      ctx.fillText("Merkle tree verification", W / 2, 18);

      // Draw edges
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1;
      const edges = [
        [0, 1],
        [0, 2],
        [1, 3],
        [1, 4],
        [2, 5],
        [2, 6],
      ];
      for (const [a, b] of edges) {
        const na = treeNodes[a!]!;
        const nb = treeNodes[b!]!;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y + 10);
        ctx.lineTo(nb.x, nb.y - 10);
        ctx.stroke();
      }

      // How many proof steps visible
      const stepsVisible = Math.min(Math.floor(t / 1), proofPath.length);

      // Draw nodes
      for (let i = 0; i < treeNodes.length; i++) {
        const node = treeNodes[i]!;
        const isInProof = proofPath.slice(0, stepsVisible).includes(i);

        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = isInProof ? c.highlight : c.node;
        ctx.fill();

        ctx.font = "7px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + 3);
      }

      // Stats
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.good;
      ctx.fillText(
        `Proof steps: ${stepsVisible} of ${proofPath.length}`,
        W / 2,
        H - 45,
      );
      ctx.fillText("Only need log(n) hashes", W / 2, H - 30);
      ctx.fillText("O(log n) verification", W / 2, H - 15);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Logarithmic proof path" canvasRef={canvasRef} />
  );
}
