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
  bar: string;
  highlight: string;
  danger: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    bar: isDark ? "#334155" : "#cbd5e1",
    highlight: isDark ? "#4ade80" : "#16a34a",
    danger: isDark ? "#f87171" : "#dc2626",
  };
}

/* ------------------------------------------------------------------ */
/*  Random Selection (no stake weighting)                              */
/* ------------------------------------------------------------------ */

export function PosRandomSelection() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(getColors(isDark));

  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    let rafId = 0;
    let lastTime = 0;
    let selectedIdx = 0;
    let selectTimer = 0;

    const validators = [
      { label: "V1", stake: 10 },
      { label: "V2", stake: 500 },
      { label: "V3", stake: 50 },
      { label: "V4", stake: 200 },
      { label: "V5", stake: 5 },
    ];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      selectTimer += dt;

      if (selectTimer > 2) {
        selectedIdx = Math.floor(Math.random() * validators.length);
        selectTimer = 0;
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
      ctx.fillText("Random selection", W / 2, 16);

      const barW = 40;
      const gap = 12;
      const totalW = validators.length * barW + (validators.length - 1) * gap;
      const startX = (W - totalW) / 2;
      const maxH = 100;
      const maxStake = 500;
      const baseY = 180;

      for (let i = 0; i < validators.length; i++) {
        const v = validators[i];
        const x = startX + i * (barW + gap);
        const barH = (v.stake / maxStake) * maxH;

        ctx.fillStyle = i === selectedIdx ? c.highlight : c.bar;
        ctx.fillRect(x, baseY - barH, barW, barH);

        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(v.label, x + barW / 2, baseY + 14);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText(`${v.stake}`, x + barW / 2, baseY + 24);

        if (i === selectedIdx) {
          ctx.fillStyle = c.highlight;
          ctx.fillText("SELECTED", x + barW / 2, baseY - barH - 8);
        }
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.danger;
      ctx.textAlign = "center";
      ctx.fillText("Equal chance regardless of stake", W / 2, H - 8);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Stake size shown below each validator", W / 2, 32);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Random selection" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Stake-Weighted Selection                                           */
/* ------------------------------------------------------------------ */

export function PosStakeWeighted() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(getColors(isDark));

  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    let rafId = 0;
    let lastTime = 0;
    let selectedIdx = -1;
    let selectTimer = 0;

    const validators = [
      { label: "V1", stake: 10 },
      { label: "V2", stake: 500 },
      { label: "V3", stake: 50 },
      { label: "V4", stake: 200 },
      { label: "V5", stake: 5 },
    ];
    const totalStake = validators.reduce((s, v) => s + v.stake, 0);

    function weightedSelect(): number {
      let r = Math.random() * totalStake;
      for (let i = 0; i < validators.length; i++) {
        r -= validators[i].stake;
        if (r <= 0) return i;
      }
      return validators.length - 1;
    }

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      selectTimer += dt;

      if (selectTimer > 2) {
        selectedIdx = weightedSelect();
        selectTimer = 0;
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
      ctx.fillText("Stake-weighted selection", W / 2, 16);

      const barW = 40;
      const gap = 12;
      const totalW = validators.length * barW + (validators.length - 1) * gap;
      const startX = (W - totalW) / 2;
      const maxH = 100;
      const maxStake = 500;
      const baseY = 180;

      for (let i = 0; i < validators.length; i++) {
        const v = validators[i];
        const x = startX + i * (barW + gap);
        const barH = (v.stake / maxStake) * maxH;

        ctx.fillStyle = i === selectedIdx ? c.highlight : c.bar;
        ctx.fillRect(x, baseY - barH, barW, barH);

        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(v.label, x + barW / 2, baseY + 14);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        const pct = ((v.stake / totalStake) * 100).toFixed(0);
        ctx.fillText(`${v.stake} (${pct}%)`, x + barW / 2, baseY + 24);

        if (i === selectedIdx) {
          ctx.fillStyle = c.highlight;
          ctx.fillText("LEADER", x + barW / 2, baseY - barH - 8);
        }
      }

      ctx.font = "9px monospace";
      ctx.fillStyle = c.highlight;
      ctx.textAlign = "center";
      ctx.fillText("Higher stake = higher chance of selection", W / 2, H - 8);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Selection probability proportional to stake", W / 2, 32);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Stake-weighted selection" canvasRef={canvasRef} />
  );
}
