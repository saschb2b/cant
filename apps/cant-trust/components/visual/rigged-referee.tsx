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
  player1: string;
  player2: string;
  player3: string;
  referee: string;
  bonus: string;
  bar: string;
}

/* ------------------------------------------------------------------ */
/*  Production-based scoring                                            */
/* ------------------------------------------------------------------ */

export function FairScoring() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsRef = useRef(getColors(isDark));
  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    const scores = [0, 0, 0];
    const names = ["Alice", "Bob", "Carol"];
    let rafId = 0;
    let lastTime = 0;
    let elapsed = 0;
    let nextProduce = 1.0;
    const flashTimers = [0, 0, 0];

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      for (let i = 0; i < 3; i++) {
        if (flashTimers[i]! > 0) flashTimers[i]! -= dt;
      }

      // Each player produces at similar rate
      if (elapsed >= nextProduce) {
        const who = Math.floor(Math.random() * 3);
        scores[who]! += 10;
        flashTimers[who] = 0.4;
        nextProduce += 0.6 + Math.random() * 0.4;
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

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Points earned by producing", W / 2, 18);

      const playerColors = [c.player1, c.player2, c.player3];
      const maxScore = Math.max(1, ...scores);
      const barMaxW = 180;
      const barH = 20;
      const startY = 50;
      const gap = 45;

      for (let i = 0; i < 3; i++) {
        const y = startY + i * gap;

        // Name
        ctx.font = "10px monospace";
        ctx.textAlign = "right";
        ctx.fillStyle = c.text;
        ctx.fillText(names[i]!, 65, y + 14);

        // Bar background
        ctx.fillStyle = c.dimText + "33";
        ctx.fillRect(75, y, barMaxW, barH);

        // Bar fill
        const w = (scores[i]! / maxScore) * barMaxW;
        ctx.fillStyle = playerColors[i]!;
        ctx.fillRect(75, y, w, barH);

        // Score
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = c.text;
        ctx.fillText(String(scores[i]), 75 + barMaxW + 8, y + 14);

        // Flash
        if (flashTimers[i]! > 0) {
          ctx.font = "bold 9px monospace";
          ctx.fillStyle = playerColors[i]!;
          ctx.fillText("+10", 75 + w + 4, y - 2);
        }
      }

      // Status
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Points from production", W / 2, H - 20);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Production-based scoring" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Adjusted scoring (referee gives bonuses to top player)              */
/* ------------------------------------------------------------------ */

export function RiggedScoring() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsRef = useRef(getColors(isDark));
  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    const scores = [0, 0, 0];
    const names = ["Alice", "Bob", "Carol"];
    let rafId = 0;
    let lastTime = 0;
    let elapsed = 0;
    let nextProduce = 1.0;
    let nextBonus = 3.0;
    const flashTimers = [0, 0, 0];
    let bonusFlash = 0;
    let bonusTarget = -1;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      for (let i = 0; i < 3; i++) {
        if (flashTimers[i]! > 0) flashTimers[i]! -= dt;
      }
      if (bonusFlash > 0) bonusFlash -= dt;

      // Normal production
      if (elapsed >= nextProduce) {
        const who = Math.floor(Math.random() * 3);
        scores[who]! += 10;
        flashTimers[who] = 0.4;
        nextProduce += 0.6 + Math.random() * 0.4;
      }

      // Referee bonus to top player
      if (elapsed >= nextBonus) {
        let topIdx = 0;
        for (let i = 1; i < 3; i++) {
          if (scores[i]! >= scores[topIdx]!) topIdx = i;
        }
        // Default to first player (Alice) if all equal
        scores[topIdx]! += 50;
        bonusFlash = 0.8;
        bonusTarget = topIdx;
        flashTimers[topIdx] = 0.8;
        nextBonus += 2.5 + Math.random() * 1.0;
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

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Points with referee intervention", W / 2, 18);

      const playerColors = [c.player1, c.player2, c.player3];
      const maxScore = Math.max(1, ...scores);
      const barMaxW = 180;
      const barH = 20;
      const startY = 50;
      const gap = 45;

      for (let i = 0; i < 3; i++) {
        const y = startY + i * gap;

        ctx.font = "10px monospace";
        ctx.textAlign = "right";
        ctx.fillStyle = c.text;
        ctx.fillText(names[i]!, 65, y + 14);

        ctx.fillStyle = c.dimText + "33";
        ctx.fillRect(75, y, barMaxW, barH);

        const w = (scores[i]! / maxScore) * barMaxW;
        ctx.fillStyle = playerColors[i]!;
        ctx.fillRect(75, y, w, barH);

        ctx.font = "bold 10px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = c.text;
        ctx.fillText(String(scores[i]), 75 + barMaxW + 8, y + 14);

        // Flash for normal production
        if (flashTimers[i]! > 0 && bonusTarget !== i) {
          ctx.font = "bold 9px monospace";
          ctx.fillStyle = playerColors[i]!;
          ctx.fillText("+10", 75 + w + 4, y - 2);
        }

        // Bonus flash
        if (bonusFlash > 0 && bonusTarget === i) {
          ctx.font = "bold 11px monospace";
          ctx.fillStyle = c.bonus;
          ctx.fillText("+50 BONUS", 75 + w + 4, y - 2);
        }
      }

      // Referee figure
      const refY = H - 50;
      ctx.beginPath();
      ctx.arc(W / 2, refY, 10, 0, Math.PI * 2);
      ctx.fillStyle = c.referee;
      ctx.fill();
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.text;
      ctx.fillText("Referee", W / 2, refY + 20);

      if (bonusFlash > 0) {
        ctx.font = "bold 8px monospace";
        ctx.fillStyle = c.bonus;
        ctx.fillText("Bonus to leader!", W / 2, refY - 16);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Adjusted scoring" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Color helper                                                       */
/* ------------------------------------------------------------------ */

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    player1: isDark ? "#60a5fa" : "#2563eb",
    player2: isDark ? "#4ade80" : "#16a34a",
    player3: isDark ? "#f472b6" : "#db2777",
    referee: isDark ? "#f87171" : "#dc2626",
    bonus: isDark ? "#fbbf24" : "#d97706",
    bar: isDark ? "#333" : "#e5e5e5",
  };
}
