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
  dead: string;
  alive: string;
  block: string;
  blockStroke: string;
}

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    accent: isDark ? "#f7931a" : "#c28a1a",
    dead: isDark ? "#f87171" : "#dc2626",
    alive: isDark ? "#4ade80" : "#16a34a",
    block: isDark ? "#334155" : "#e2e8f0",
    blockStroke: isDark ? "#64748b" : "#94a3b8",
  };
}

/* ------------------------------------------------------------------ */
/*  Fiat Graveyard Scroll                                              */
/* ------------------------------------------------------------------ */

export function FiatGraveyardScroll() {
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

    const tombstones = [
      { name: "Roman denarius", year: "~300 AD" },
      { name: "French assignat", year: "1796" },
      { name: "Continental dollar", year: "1781" },
      { name: "German papiermark", year: "1923" },
      { name: "Hungarian pengo", year: "1946" },
      { name: "Yugoslav dinar", year: "1994" },
      { name: "Zimbabwe dollar", year: "2009" },
      { name: "Venezuelan bolivar", year: "ongoing" },
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
      ctx.fillText("Fiat currency graveyard", W / 2, 14);

      // Scrolling tombstones
      const scrollSpeed = 20;
      const tombW = 130;
      const tombH = 45;
      const gap = 15;
      const totalW = (tombW + gap) * tombstones.length;
      const scrollX = -(elapsed * scrollSpeed) % totalW;

      for (let copy = 0; copy < 2; copy++) {
        for (let i = 0; i < tombstones.length; i++) {
          const x = scrollX + copy * totalW + i * (tombW + gap);
          if (x > W + tombW || x < -tombW) continue;

          const y = 30 + (i % 2) * 10;

          // Tombstone shape
          ctx.fillStyle = c.block;
          ctx.beginPath();
          ctx.moveTo(x, y + tombH);
          ctx.lineTo(x, y + 10);
          ctx.arcTo(x, y, x + tombW / 2, y, 10);
          ctx.arcTo(x + tombW, y, x + tombW, y + 10, 10);
          ctx.lineTo(x + tombW, y + tombH);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = c.dead;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.font = "7px monospace";
          ctx.fillStyle = c.dead;
          ctx.textAlign = "center";
          ctx.fillText("R.I.P.", x + tombW / 2, y + 15);
          ctx.font = "bold 7px monospace";
          ctx.fillText(tombstones[i].name, x + tombW / 2, y + 27);
          ctx.font = "6px monospace";
          ctx.fillStyle = c.dimText;
          ctx.fillText(tombstones[i].year, x + tombW / 2, y + 38);
        }
      }

      // Ground line
      ctx.fillStyle = c.block;
      ctx.fillRect(0, 88, W, 4);

      // Counter
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = c.dead;
      ctx.textAlign = "center";
      ctx.fillText("Average lifespan: ~27 years", W / 2, 115);

      // Failure stats
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Every fiat currency either fails", W / 2, 140);
      ctx.fillText("or is reformed into a new one", W / 2, 156);

      // US dollar
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("US dollar since 1971 (no gold):", W / 2, 180);
      ctx.fillStyle = c.dead;
      ctx.fillText("Lost ~98% purchasing power", W / 2, 196);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = c.dead;
      ctx.fillText("100% failure rate given enough time", W / 2, 225);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Fiat currency graveyard" canvasRef={canvasRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Bitcoin Lindy                                                      */
/* ------------------------------------------------------------------ */

export function BitcoinLindy() {
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

    const events = [
      { year: 2011, label: "Silk Road" },
      { year: 2014, label: "Mt. Gox" },
      { year: 2017, label: "China ban" },
      { year: 2020, label: "COVID crash" },
      { year: 2022, label: "FTX collapse" },
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
      ctx.fillText("Bitcoin: the Lindy effect", W / 2, 14);

      // Timeline
      const tlX = 30;
      const tlW = 260;
      const tlY = 50;

      // Growing timeline
      const timeProgress = Math.min(1, elapsed * 0.15);
      const currentW = tlW * timeProgress;

      ctx.strokeStyle = c.alive;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tlX, tlY);
      ctx.lineTo(tlX + currentW, tlY);
      ctx.stroke();

      // Arrow at end
      if (timeProgress > 0.5) {
        ctx.beginPath();
        ctx.moveTo(tlX + currentW - 5, tlY - 4);
        ctx.lineTo(tlX + currentW + 1, tlY);
        ctx.lineTo(tlX + currentW - 5, tlY + 4);
        ctx.fillStyle = c.alive;
        ctx.fill();
      }

      // Start and end labels
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.textAlign = "center";
      ctx.fillText("2009", tlX, tlY + 14);

      const currentYear = Math.floor(2009 + 17 * timeProgress);
      ctx.fillStyle = c.alive;
      ctx.fillText(`${currentYear}`, tlX + currentW, tlY + 14);

      // Attack survival events
      for (const ev of events) {
        const xFrac = (ev.year - 2009) / 17;
        const evX = tlX + xFrac * tlW;
        if (evX > tlX + currentW) continue;

        ctx.fillStyle = c.dead;
        ctx.beginPath();
        ctx.moveTo(evX, tlY - 8);
        ctx.lineTo(evX - 4, tlY - 16);
        ctx.lineTo(evX + 4, tlY - 16);
        ctx.closePath();
        ctx.fill();

        ctx.font = "6px monospace";
        ctx.fillStyle = c.dead;
        ctx.textAlign = "center";
        ctx.fillText(ev.label, evX, tlY - 19);

        // Survived checkmark below
        ctx.fillStyle = c.alive;
        ctx.font = "bold 7px monospace";
        ctx.fillText("OK", evX, tlY + 26);
      }

      // Years survived counter
      const years = Math.floor(17 * timeProgress);
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = c.alive;
      ctx.textAlign = "center";
      ctx.fillText(`${years} years survived`, W / 2, 100);

      // Uptime
      ctx.font = "9px monospace";
      ctx.fillStyle = c.alive;
      ctx.fillText("Network uptime: 99.99%", W / 2, 120);
      ctx.fillText("Never hacked, never inflated", W / 2, 136);

      // Gold comparison
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = c.accent;
      ctx.fillText("Gold: ~5,000 years as money", W / 2, 160);

      // Lindy explanation
      ctx.fillStyle = c.block;
      ctx.fillRect(30, 170, 260, 40);
      ctx.strokeStyle = c.alive;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 170, 260, 40);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = c.alive;
      ctx.textAlign = "center";
      ctx.fillText("Lindy effect: the longer it survives,", W / 2, 185);
      ctx.fillText("the longer it will survive", W / 2, 198);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Each attack survived = stronger", W / 2, 225);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <CanvasSimulation label="Bitcoin: the Lindy effect" canvasRef={canvasRef} />
  );
}
