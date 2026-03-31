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
  bank: string;
  borrower: string;
  collateral: string;
  threshold: string;
  approved: string;
  delay: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    bank: isDark ? "#334155" : "#e2e8f0",
    borrower: isDark ? "#60a5fa" : "#2563eb",
    collateral: isDark ? "#4ade80" : "#16a34a",
    threshold: isDark ? "#f87171" : "#dc2626",
    approved: isDark ? "#4ade80" : "#16a34a",
    delay: isDark ? "#fbbf24" : "#d97706",
  };
}

/* ------------------------------------------------------------------ */
/*  Bank Lending                                                       */
/* ------------------------------------------------------------------ */

export function BankLending() {
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

    const steps = [
      "Credit check...",
      "Income verify...",
      "Identity (KYC)...",
      "Committee review...",
      "Approval pending...",
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
      ctx.fillText("Bank lending", W / 2, 14);

      // Borrower
      ctx.fillStyle = c.borrower;
      ctx.beginPath();
      ctx.arc(60, 65, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText("You", 60, 68);

      // Arrow to bank
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(76, 65);
      ctx.lineTo(130, 65);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(126, 61);
      ctx.lineTo(132, 65);
      ctx.lineTo(126, 69);
      ctx.fillStyle = c.dimText;
      ctx.fill();

      // Bank building
      ctx.fillStyle = c.bank;
      ctx.fillRect(140, 40, 80, 50);
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(140, 40, 80, 50);

      // Bank roof
      ctx.beginPath();
      ctx.moveTo(135, 40);
      ctx.lineTo(180, 25);
      ctx.lineTo(225, 40);
      ctx.closePath();
      ctx.fillStyle = c.bank;
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("BANK", 180, 58);
      ctx.font = "7px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Decides", 180, 70);

      // Processing steps
      const activeStep = Math.floor(elapsed * 0.7) % (steps.length + 2);
      for (let i = 0; i < steps.length; i++) {
        const y = 105 + i * 18;
        const done = i < activeStep;
        const current = i === activeStep;

        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = done ? c.approved : current ? c.delay : c.dimText;

        const prefix = done ? "[done]" : current ? "[....]" : "[    ]";
        ctx.fillText(`${prefix} ${steps[i]}`, 50, y);

        if (current) {
          const dots = ".".repeat((Math.floor(elapsed * 3) % 3) + 1);
          ctx.fillStyle = c.delay;
          ctx.textAlign = "right";
          ctx.fillText(dots, 280, y);
        }
      }

      // Day counter
      const day = Math.min(Math.floor(elapsed * 0.5) + 1, 14);
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.delay;
      ctx.textAlign = "center";
      ctx.fillText(`Day ${day} of processing`, W / 2, 210);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Slow, requires trust and identity", W / 2, 230);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Bank lending" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Protocol Lending                                                   */
/* ------------------------------------------------------------------ */

export function ProtocolLending() {
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

    let collateralLevel = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      // Collateral animates up then oscillates
      if (elapsed < 3) {
        collateralLevel = Math.min(1, elapsed / 2.5);
      } else {
        collateralLevel = 0.7 + 0.3 * Math.sin((elapsed - 3) * 0.5);
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
      ctx.fillText("Protocol lending", W / 2, 14);

      // Collateral bar
      const barX = 50;
      const barY = 35;
      const barW = 40;
      const barH = 130;

      ctx.fillStyle = c.bank;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(barX, barY, barW, barH);

      // Fill level
      const fillH = collateralLevel * (barH - 4);
      ctx.fillStyle = c.collateral;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(barX + 2, barY + barH - fillH - 2, barW - 4, fillH);
      ctx.globalAlpha = 1;

      ctx.font = "8px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("Collateral", barX + barW / 2, barY - 5);

      // Liquidation threshold line
      const threshY = barY + barH * 0.35;
      ctx.strokeStyle = c.threshold;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(barX - 5, threshY);
      ctx.lineTo(barX + barW + 5, threshY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "7px monospace";
      ctx.fillStyle = c.threshold;
      ctx.textAlign = "left";
      ctx.fillText("Liquidation", barX + barW + 8, threshY - 2);
      ctx.fillText("threshold", barX + barW + 8, threshY + 8);

      // Protocol box
      const pX = 160;
      const pY = 50;
      const pW = 120;
      const pH = 60;
      ctx.fillStyle = c.bank;
      ctx.fillRect(pX, pY, pW, pH);
      ctx.strokeStyle = c.dimText;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(pX, pY, pW, pH);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.fillText("SMART CONTRACT", pX + pW / 2, pY + 18);

      // Auto-approve logic
      const sufficient = collateralLevel > 0.35;
      ctx.font = "8px monospace";
      ctx.fillStyle = sufficient ? c.approved : c.threshold;
      ctx.fillText(
        sufficient ? "Collateral OK" : "Insufficient",
        pX + pW / 2,
        pY + 35,
      );
      ctx.fillText(
        sufficient ? "Loan approved" : "Deposit more",
        pX + pW / 2,
        pY + 48,
      );

      // Arrow from collateral to protocol
      ctx.strokeStyle = c.collateral;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(barX + barW + 2, barY + barH / 2);
      ctx.lineTo(pX - 2, pY + pH / 2);
      ctx.stroke();

      // Status
      const pct = Math.floor(collateralLevel * 150);
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.accent;
      ctx.textAlign = "center";
      ctx.fillText(`${pct}% collateralized`, W / 2, 145);

      // Features
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("No credit check needed", W / 2, 170);
      ctx.fillText("No identity required", W / 2, 186);
      ctx.fillText("Instant, trustless, 24/7", W / 2, 202);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.approved;
      ctx.fillText("Auto-liquidation protects lenders", W / 2, 225);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Protocol lending" canvasRef={canvasRef} />;
}
