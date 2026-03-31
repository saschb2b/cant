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
  informal: string;
  formal: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    informal: isDark ? "#fbbf24" : "#d97706",
    formal: isDark ? "#4ade80" : "#16a34a",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Off-Chain Consensus                                                */
/* ------------------------------------------------------------------ */

export function OffChainConsensus() {
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
      ctx.fillText("Off-chain governance", W / 2, 14);

      // Discussion bubbles floating around
      const bubbles = [
        { x: 60, y: 60, text: "Forum post" },
        { x: 180, y: 45, text: "Tweet" },
        { x: 270, y: 70, text: "Email" },
        { x: 100, y: 100, text: "IRC chat" },
        { x: 220, y: 110, text: "Meeting" },
      ];

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        const yOff = Math.sin(elapsed * 0.8 + i * 1.3) * 5;

        ctx.fillStyle = c.block;
        ctx.fillRect(b.x - 30, b.y + yOff - 10, 60, 20);
        ctx.strokeStyle = c.informal;
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x - 30, b.y + yOff - 10, 60, 20);

        ctx.font = "7px monospace";
        ctx.fillStyle = c.informal;
        ctx.textAlign = "center";
        ctx.fillText(b.text, b.x, b.y + yOff + 4);
      }

      // People icons (small core group)
      const people = [
        { x: 80, y: 145 },
        { x: 130, y: 140 },
        { x: 180, y: 148 },
      ];
      for (const p of people) {
        ctx.fillStyle = c.informal;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Core developers decide", W / 2, 170);

      // "We kinda agree" label
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.informal;
      ctx.fillText('"We kinda agree"', W / 2, 195);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("No formal votes, no binding results", W / 2, 215);
      ctx.fillText("Scattered across platforms", W / 2, 230);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Off-chain governance" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  On-Chain Voting                                                    */
/* ------------------------------------------------------------------ */

export function OnChainVoting() {
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
      ctx.fillText("On-chain governance", W / 2, 14);

      // Ballot box
      const boxX = 110;
      const boxY = 30;
      const boxW = 100;
      const boxH = 70;
      ctx.fillStyle = c.block;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = c.formal;
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      // Slot at top
      ctx.fillStyle = c.bg;
      ctx.fillRect(boxX + 30, boxY - 2, 40, 8);
      ctx.strokeStyle = c.formal;
      ctx.strokeRect(boxX + 30, boxY - 2, 40, 8);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.formal;
      ctx.textAlign = "center";
      ctx.fillText("ON-CHAIN", boxX + boxW / 2, boxY + 25);
      ctx.fillText("BALLOT", boxX + boxW / 2, boxY + 40);

      // Animated votes coming in
      const voteY = boxY - 15 - ((elapsed * 15) % 25);
      if ((elapsed * 2) % 2 < 1.5) {
        ctx.fillStyle = c.formal;
        ctx.fillRect(boxX + 42, voteY, 16, 10);
        ctx.font = "6px monospace";
        ctx.fillStyle = c.bg;
        ctx.textAlign = "center";
        ctx.fillText("VOTE", boxX + 50, voteY + 7);
      }

      // Vote count
      const yesVotes = Math.min(67, Math.floor(elapsed * 5));
      const noVotes = Math.min(33, Math.floor(elapsed * 2.5));

      // Yes bar
      const barY = 115;
      const maxBarW = 200;
      ctx.fillStyle = c.formal;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(60, barY, (yesVotes / 100) * maxBarW, 16);
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.formal;
      ctx.textAlign = "left";
      ctx.fillText(`Yes: ${yesVotes}%`, 62, barY + 12);

      // No bar
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(60, barY + 22, (noVotes / 100) * maxBarW, 16);
      ctx.globalAlpha = 1;
      ctx.font = "8px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText(`No: ${noVotes}%`, 62, barY + 34);

      // Result
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.formal;
      ctx.textAlign = "center";
      ctx.fillText("Transparent, auditable on-chain", W / 2, 175);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Any staker can vote", W / 2, 195);
      ctx.fillText("Results binding, enforced by protocol", W / 2, 211);
      ctx.fillText("Permanent, auditable record", W / 2, 227);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="On-chain governance" canvasRef={canvasRef} />;
}
