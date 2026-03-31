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
  visible: string;
  hidden: string;
  danger: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    visible: isDark ? "#4ade80" : "#16a34a",
    hidden: isDark ? "#a78bfa" : "#7c3aed",
    danger: isDark ? "#f87171" : "#dc2626",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Reveal All To Prove                                                */
/* ------------------------------------------------------------------ */

export function RevealAllToProve() {
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

    const fields = [
      { label: "Name", value: "Jane Smith" },
      { label: "DOB", value: "1990-05-14" },
      { label: "Address", value: "123 Main St" },
      { label: "Photo", value: "[EXPOSED]" },
      { label: "ID #", value: "X12345678" },
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
      ctx.fillText("Full disclosure", W / 2, 14);

      // Question
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText('"Prove you are over 18"', W / 2, 32);

      // ID card
      const cardX = 60;
      const cardY = 44;
      const cardW = 200;
      const cardH = 130;
      ctx.fillStyle = c.block;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeStyle = c.blockStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("IDENTITY DOCUMENT", cardX + cardW / 2, cardY + 14);

      // All fields visible (exposed)
      const revealCount = Math.min(fields.length, Math.floor(elapsed) + 1);
      for (let i = 0; i < revealCount; i++) {
        const y = cardY + 28 + i * 18;
        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "left";
        const field = fields[i];
        if (!field) continue;
        ctx.fillText(field.label + ":", cardX + 15, y);
        ctx.fillStyle = c.danger;
        ctx.fillText(field.value, cardX + 75, y);
      }

      // "All data exposed" warning
      if (revealCount >= fields.length) {
        const blink = Math.sin(elapsed * 4) > 0;
        if (blink) {
          ctx.fillStyle = c.danger;
          ctx.globalAlpha = 0.15;
          ctx.fillRect(cardX + 2, cardY + 2, cardW - 4, cardH - 4);
          ctx.globalAlpha = 1;
        }
      }

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("All personal data exposed", W / 2, 192);

      ctx.fillStyle = c.dimText;
      ctx.fillText("Oversharing to prove one fact", W / 2, 210);
      ctx.fillText("Every verifier gets a full copy", W / 2, 226);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Full disclosure" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  ZK Prove Without                                                   */
/* ------------------------------------------------------------------ */

export function ZkProveWithout() {
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
      ctx.fillText("Zero-knowledge proof", W / 2, 14);

      // Question
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.text;
      ctx.fillText('"Prove you are over 18"', W / 2, 32);

      // ZK proof card
      const cardX = 60;
      const cardY = 44;
      const cardW = 200;
      const cardH = 100;
      ctx.fillStyle = c.block;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeStyle = c.hidden;
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.hidden;
      ctx.textAlign = "center";
      ctx.fillText("ZK PROOF", cardX + cardW / 2, cardY + 14);

      // Hidden fields
      const hiddenFields = ["Name", "DOB", "Address", "Photo", "ID #"];
      for (let i = 0; i < hiddenFields.length; i++) {
        const y = cardY + 30 + i * 13;
        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "left";
        ctx.fillText(hiddenFields[i] + ":", cardX + 15, y);
        ctx.fillStyle = c.hidden;
        ctx.fillText("[hidden]", cardX + 75, y);
      }

      // Result box
      const resY = cardY + cardH + 12;
      const resH = 30;
      ctx.fillStyle = c.visible;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(cardX, resY, cardW, resH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.visible;
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX, resY, cardW, resH);

      // Animated checkmark
      const showCheck = elapsed > 1.5;
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.visible;
      ctx.textAlign = "center";
      if (showCheck) {
        ctx.fillText("Age >= 18:  VERIFIED", cardX + cardW / 2, resY + 20);
      } else {
        const dots = ".".repeat((Math.floor(elapsed * 3) % 3) + 1);
        ctx.fillText(`Verifying${dots}`, cardX + cardW / 2, resY + 20);
      }

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = c.visible;
      ctx.textAlign = "center";
      ctx.fillText("Prove the fact, reveal nothing else", W / 2, 210);

      ctx.fillStyle = c.dimText;
      ctx.fillText("Mathematical proof, no data shared", W / 2, 228);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Zero-knowledge proof" canvasRef={canvasRef} />
  );
}
