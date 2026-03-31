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
  alice: string;
  bob: string;
  carol: string;
  gold: string;
  fail: string;
  success: string;
  arrow: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    alice: isDark ? "#f87171" : "#dc2626",
    bob: isDark ? "#60a5fa" : "#2563eb",
    carol: isDark ? "#4ade80" : "#16a34a",
    gold: isDark ? "#fbbf24" : "#d97706",
    fail: isDark ? "#ef4444" : "#dc2626",
    success: isDark ? "#22c55e" : "#16a34a",
    arrow: isDark ? "#93c5fd" : "#3b82f6",
  };
}

/* ------------------------------------------------------------------ */
/*  Barter Direct                                                      */
/* ------------------------------------------------------------------ */

export function BarterDirect() {
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

    const people = [
      { name: "Alice", has: "wheat", wants: "shoes", x: 80, y: 80 },
      { name: "Bob", has: "shoes", wants: "fish", x: 240, y: 80 },
      { name: "Carol", has: "fish", wants: "wheat", x: 160, y: 190 },
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

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Direct barter", W / 2, 14);

      const personColors = [c.alice, c.bob, c.carol];

      // Draw people as circles with labels
      for (let i = 0; i < people.length; i++) {
        const p = people[i]!;
        const pc = personColors[i]!;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = pc;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = pc;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(p.name, p.x, p.y - 2);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText(`has: ${p.has}`, p.x, p.y + 10);
      }

      // Animate failed trade attempts with X marks
      const cycle = (elapsed * 0.5) % 3;
      const pairs = [
        [0, 1],
        [1, 2],
        [2, 0],
      ] as const;

      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i]!;
        const pA = people[pair[0]]!;
        const pB = people[pair[1]]!;

        // Dashed arrow between pairs
        const progress =
          i === Math.floor(cycle) ? cycle % 1 : i < Math.floor(cycle) ? 1 : 0;
        if (progress > 0) {
          const mx = (pA.x + pB.x) / 2;
          const my = (pA.y + pB.y) / 2;

          ctx.strokeStyle = c.fail;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(
            pA.x + 24 * Math.sign(pB.x - pA.x),
            pA.y + 24 * Math.sign(pB.y - pA.y),
          );
          ctx.lineTo(
            pA.x + (pB.x - pA.x) * progress * 0.6,
            pA.y + (pB.y - pA.y) * progress * 0.6,
          );
          ctx.stroke();
          ctx.setLineDash([]);

          // X mark at midpoint if complete
          if (progress > 0.8) {
            ctx.strokeStyle = c.fail;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(mx - 6, my - 6);
            ctx.lineTo(mx + 6, my + 6);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(mx + 6, my - 6);
            ctx.lineTo(mx - 6, my + 6);
            ctx.stroke();
          }
        }
      }

      // Bottom label
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Double coincidence needed", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Direct barter" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Medium of Exchange                                                  */
/* ------------------------------------------------------------------ */

export function MediumOfExchange() {
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

    const people = [
      { name: "Alice", has: "wheat", x: 60, y: 80 },
      { name: "Bob", has: "shoes", x: 260, y: 80 },
      { name: "Carol", has: "fish", x: 160, y: 190 },
    ];

    interface TradeParticle {
      fromIdx: number;
      progress: number;
      toCenter: boolean;
    }

    const particles: TradeParticle[] = [];
    let spawnTimer = 0;
    let spawnIdx = 0;
    let completedTrades = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;
      spawnTimer += dt;

      if (spawnTimer > 1.0) {
        particles.push({ fromIdx: spawnIdx % 3, progress: 0, toCenter: true });
        spawnIdx++;
        spawnTimer = 0;
      }

      for (const p of particles) {
        p.progress += dt * 1.2;
      }

      // Remove completed particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const part = particles[i]!;
        if (part.progress >= 1) {
          if (part.toCenter) {
            particles[i] = {
              fromIdx: part.fromIdx,
              progress: 0,
              toCenter: false,
            };
            completedTrades++;
            if (completedTrades >= 6) {
              completedTrades = 0;
            }
          } else {
            particles.splice(i, 1);
          }
        }
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

      // Title
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Medium of exchange", W / 2, 14);

      const cx = 160;
      const cy = 120;

      // Gold coin in center
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = c.gold;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.gold;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.gold;
      ctx.fillText("$", cx, cy + 5);

      const personColors = [c.alice, c.bob, c.carol];

      // Draw people
      for (let i = 0; i < people.length; i++) {
        const p = people[i]!;
        const pc = personColors[i]!;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = pc;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = pc;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = "bold 9px monospace";
        ctx.fillStyle = c.text;
        ctx.textAlign = "center";
        ctx.fillText(p.name, p.x, p.y - 2);

        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText(p.has, p.x, p.y + 10);

        // Connecting lines to center
        ctx.strokeStyle = c.arrow;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        ctx.moveTo(p.x + (dx / dist) * 24, p.y + (dy / dist) * 24);
        ctx.lineTo(cx - (dx / dist) * 20, cy - (dy / dist) * 20);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      // Draw trade particles
      for (const part of particles) {
        const p = people[part.fromIdx]!;
        let sx: number, sy: number, ex: number, ey: number;
        if (part.toCenter) {
          sx = p.x;
          sy = p.y;
          ex = cx;
          ey = cy;
        } else {
          sx = cx;
          sy = cy;
          ex = p.x;
          ey = p.y;
        }
        const px = sx + (ex - sx) * part.progress;
        const py = sy + (ey - sy) * part.progress;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = c.gold;
        ctx.fill();
      }

      // Checkmarks for completed trades
      const checks = Math.min(completedTrades, 6);
      if (checks > 0) {
        ctx.font = "9px monospace";
        ctx.fillStyle = c.dimText;
        ctx.textAlign = "center";
        ctx.fillText(`${checks} trades completed`, W / 2, H - 22);
      }

      // Bottom label
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("Any good for any other", W / 2, H - 10);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Medium of exchange" canvasRef={canvasRef} />;
}
