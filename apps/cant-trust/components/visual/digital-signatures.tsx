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
  msg: string;
  sig: string;
  bad: string;
  good: string;
  box: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dim: isDark ? "#888" : "#666",
    msg: isDark ? "#60a5fa" : "#2563eb",
    sig: isDark ? "#a78bfa" : "#7c3aed",
    bad: isDark ? "#f87171" : "#dc2626",
    good: isDark ? "#4ade80" : "#16a34a",
    box: isDark ? "#333" : "#e5e5e5",
  };
}

/* ------------------------------------------------------------------ */
/*  Unsigned message (can be tampered)                                 */
/* ------------------------------------------------------------------ */

export function SignatureUnsigned() {
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
      ctx.fillText("Unsigned message", W / 2, 18);

      // Message box
      const boxY = 50;
      ctx.fillStyle = c.box;
      ctx.fillRect(40, boxY, W - 80, 40);
      ctx.font = "10px monospace";
      ctx.fillStyle = c.msg;
      ctx.textAlign = "center";

      const tampered = t > 3;
      if (!tampered) {
        ctx.fillText('"Send $100 to Bob"', W / 2, boxY + 24);
      } else {
        ctx.fillText('"Send $10000 to Eve"', W / 2, boxY + 24);
      }

      // No signature
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dim;
      ctx.textAlign = "center";
      ctx.fillText("No signature attached", W / 2, boxY + 60);

      // Tamper animation
      if (t > 2 && t < 3) {
        const flash = Math.sin((t - 2) * Math.PI * 4) > 0;
        if (flash) {
          ctx.font = "bold 10px monospace";
          ctx.fillStyle = c.bad;
          ctx.fillText("TAMPERING...", W / 2, boxY + 80);
        }
      }

      if (tampered) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.bad;
        ctx.textAlign = "center";
        ctx.fillText("Message altered in transit", W / 2, 150);
        ctx.fillText("Receiver cannot detect the change", W / 2, 166);
        ctx.fillText("No proof of who sent it", W / 2, 182);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="No integrity guarantee" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Signed + verified message                                          */
/* ------------------------------------------------------------------ */

export function SignatureSigned() {
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
      ctx.fillText("Digitally signed message", W / 2, 18);

      // Message box
      const boxY = 45;
      ctx.fillStyle = c.box;
      ctx.fillRect(40, boxY, W - 80, 40);
      ctx.font = "10px monospace";
      ctx.fillStyle = c.msg;
      ctx.textAlign = "center";
      ctx.fillText('"Send $100 to Bob"', W / 2, boxY + 24);

      // Signature
      if (t > 1) {
        ctx.fillStyle = isDark ? "#2d2040" : "#ede9fe";
        ctx.fillRect(40, boxY + 42, W - 80, 22);
        ctx.font = "9px monospace";
        ctx.fillStyle = c.sig;
        ctx.fillText("SIG: 3045022100a8b7...", W / 2, boxY + 57);
      }

      // Verification
      if (t > 2.5) {
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = c.good;
        ctx.textAlign = "center";

        // Checkmark animation
        const verifyProgress = Math.min((t - 2.5) / 0.5, 1);
        ctx.globalAlpha = verifyProgress;
        ctx.fillText("VERIFIED", W / 2, boxY + 90);
        ctx.globalAlpha = 1;
      }

      // Properties
      if (t > 3.5) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.good;
        ctx.textAlign = "center";
        ctx.fillText("Integrity: message not altered", W / 2, 170);
        ctx.fillText("Authentication: Alice signed it", W / 2, 186);
        ctx.fillText("Non-repudiation: Alice cannot deny it", W / 2, 202);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation
      label="Tamper-proof with proof of origin"
      canvasRef={canvasRef}
    />
  );
}
