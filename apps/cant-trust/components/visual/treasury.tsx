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
  donation: string;
  treasury: string;
  block: string;
  blockStroke: string;
  warning: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    donation: isDark ? "#fbbf24" : "#d97706",
    treasury: isDark ? "#4ade80" : "#16a34a",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
    warning: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  Donation Funded                                                    */
/* ------------------------------------------------------------------ */

export function DonationFunded() {
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
      ctx.fillText("Donation-based funding", W / 2, 14);

      // Hat (collection bowl)
      ctx.fillStyle = c.block;
      ctx.beginPath();
      ctx.ellipse(W / 2, 70, 50, 20, 0, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = c.blockStroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(W / 2, 70, 50, 20, 0, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(W / 2, 70, 50, 8, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Please donate", W / 2, 55);

      // Sporadic coins dropping in
      const coinPhase = elapsed % 5;
      if (coinPhase < 1 || (coinPhase > 2.5 && coinPhase < 3)) {
        const coinY = 30 + (coinPhase % 2.5) * 15;
        ctx.fillStyle = c.donation;
        ctx.beginPath();
        ctx.arc(W / 2 + Math.sin(elapsed * 3) * 15, coinY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Funding bar (erratic)
      const barY = 100;
      const barW = 200;
      const barH = 20;
      ctx.fillStyle = c.block;
      ctx.fillRect(60, barY, barW, barH);
      ctx.strokeStyle = c.blockStroke;
      ctx.strokeRect(60, barY, barW, barH);

      // Erratic funding level
      const funding =
        0.2 +
        0.6 *
          Math.abs(Math.sin(elapsed * 0.3)) *
          Math.abs(Math.cos(elapsed * 0.7));
      ctx.fillStyle = c.donation;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(60, barY, barW * funding, barH);
      ctx.globalAlpha = 1;

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText(`Funding: ${Math.floor(funding * 100)}%`, W / 2, barY + 14);

      // Sources
      const sources = ["VC funding", "Sponsors", "Donations", "Volunteers"];
      for (let i = 0; i < sources.length; i++) {
        const y = 138 + i * 16;
        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "left";
        ctx.fillText(`- ${sources[i]}`, 80, y);
        // Inconsistent indicator
        ctx.fillStyle = c.warning;
        ctx.textAlign = "right";
        ctx.fillText("unreliable", 250, y);
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.warning;
      ctx.textAlign = "center";
      ctx.fillText("Inconsistent, depends on goodwill", W / 2, 215);
      ctx.fillText("Developers burn out, funding dries up", W / 2, 231);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Donation-based funding" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Protocol Treasury                                                  */
/* ------------------------------------------------------------------ */

export function ProtocolTreasury() {
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
      ctx.fillText("On-chain treasury", W / 2, 14);

      // Block rewards flowing into treasury
      const blockX = 30;
      const blockY = 30;
      ctx.fillStyle = c.block;
      ctx.fillRect(blockX, blockY, 60, 30);
      ctx.strokeStyle = c.blockStroke;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(blockX, blockY, 60, 30);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Block", blockX + 30, blockY + 13);
      ctx.fillText("rewards", blockX + 30, blockY + 23);

      // Arrow to treasury
      ctx.strokeStyle = c.treasury;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(blockX + 62, blockY + 15);
      ctx.lineTo(125, blockY + 15);
      ctx.stroke();

      // Animated coin flowing
      const coinT = (elapsed * 1.5) % 1;
      const coinX = blockX + 62 + coinT * 60;
      ctx.fillStyle = c.treasury;
      ctx.beginPath();
      ctx.arc(coinX, blockY + 15, 3, 0, Math.PI * 2);
      ctx.fill();

      // Treasury box
      const tx = 130;
      const ty = 25;
      const tw = 80;
      const th = 40;
      ctx.fillStyle = c.treasury;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(tx, ty, tw, th);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.treasury;
      ctx.lineWidth = 2;
      ctx.strokeRect(tx, ty, tw, th);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.treasury;
      ctx.textAlign = "center";
      ctx.fillText("TREASURY", tx + tw / 2, ty + 18);

      const amount = Math.floor(elapsed * 100);
      ctx.font = "7px monospace";
      ctx.fillText(`${amount.toLocaleString()} ADA`, tx + tw / 2, ty + 32);

      // Proposals voted on by community
      const proposals = [
        "Wallet dev: 50k",
        "Security audit: 100k",
        "Education: 25k",
      ];

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Community votes on proposals:", W / 2, 80);

      for (let i = 0; i < proposals.length; i++) {
        const y = 95 + i * 30;
        const propW = 200;
        const propX = 60;

        ctx.fillStyle = c.block;
        ctx.fillRect(propX, y, propW, 22);
        ctx.strokeStyle = c.blockStroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(propX, y, propW, 22);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "left";
        ctx.fillText(proposals[i], propX + 8, y + 14);

        // Vote progress
        const voteProgress = Math.min(1, (elapsed - i * 0.5) * 0.3);
        if (voteProgress > 0) {
          ctx.fillStyle = c.treasury;
          ctx.globalAlpha = 0.3;
          ctx.fillRect(propX, y, propW * voteProgress, 22);
          ctx.globalAlpha = 1;
        }

        ctx.font = "bold 8px monospace";
        ctx.fillStyle = c.treasury;
        ctx.textAlign = "right";
        ctx.fillText(
          voteProgress >= 1 ? "Funded" : "Voting",
          propX + propW - 5,
          y + 14,
        );
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.treasury;
      ctx.textAlign = "center";
      ctx.fillText("Self-sustaining, community-directed", W / 2, 200);
      ctx.fillStyle = c.dimText;
      ctx.fillText("Grows with adoption, no donors needed", W / 2, 216);
      ctx.fillText("Catalyst (Cardano)", W / 2, 232);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="On-chain treasury" canvasRef={canvasRef} />;
}
