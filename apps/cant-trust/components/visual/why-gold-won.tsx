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
  silver: string;
  silverTarnished: string;
  gold: string;
}

interface Coin {
  x: number;
  y: number;
  radius: number;
  age: number;
  spawned: number;
}

/* ------------------------------------------------------------------ */
/*  Silver comparison                                                  */
/* ------------------------------------------------------------------ */

export function SilverComparison() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsRef = useRef(getColors(isDark));
  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    const coins: Coin[] = [];
    let rafId = 0;
    let lastTime = 0;
    let elapsed = 0;
    let nextSpawn = 0.5;
    const CYCLE = 8;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      const cycleT = elapsed % CYCLE;

      // Reset coins at cycle start
      if (cycleT < dt * 2) {
        coins.length = 0;
        nextSpawn = 0.5;
      }

      // Spawn silver coins (more frequently, showing abundance)
      if (cycleT >= nextSpawn && coins.length < 20) {
        coins.push({
          x: 30 + Math.random() * (W - 60),
          y: 60 + Math.random() * 100,
          radius: 8 + Math.random() * 4,
          age: 0,
          spawned: cycleT,
        });
        nextSpawn += 0.3 + Math.random() * 0.2;
      }

      // Age coins
      for (const coin of coins) {
        coin.age += dt;
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
      ctx.fillText("Silver properties", W / 2, 18);

      // Draw coins (tarnishing over time)
      for (const coin of coins) {
        const tarnish = Math.min(1, coin.age / 3.0);
        const r = Math.round(
          parseInt(c.silver.slice(1, 3), 16) * (1 - tarnish * 0.5) +
            parseInt(c.silverTarnished.slice(1, 3), 16) * tarnish * 0.5,
        );
        const g = Math.round(
          parseInt(c.silver.slice(3, 5), 16) * (1 - tarnish * 0.5) +
            parseInt(c.silverTarnished.slice(3, 5), 16) * tarnish * 0.5,
        );
        const b = Math.round(
          parseInt(c.silver.slice(5, 7), 16) * (1 - tarnish * 0.5) +
            parseInt(c.silverTarnished.slice(5, 7), 16) * tarnish * 0.5,
        );
        const color = `rgb(${r},${g},${b})`;

        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = c.dimText;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Tarnish marks
        if (tarnish > 0.3) {
          ctx.globalAlpha = tarnish * 0.6;
          ctx.font = "6px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = c.silverTarnished;
          ctx.fillText("~", coin.x, coin.y + 2);
          ctx.globalAlpha = 1;
        }
      }

      // Properties list
      const propsY = 185;
      ctx.font = "9px monospace";
      ctx.textAlign = "left";

      const props = [
        { label: "Tarnish resistance: low", color: c.dimText },
        {
          label: "Supply: abundant (" + String(coins.length) + " coins)",
          color: c.dimText,
        },
        { label: "Value density: moderate", color: c.dimText },
      ];

      for (let i = 0; i < props.length; i++) {
        ctx.fillStyle = props[i]!.color;
        ctx.fillText(props[i]!.label, 20, propsY + i * 14);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Silver as money" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Gold comparison                                                    */
/* ------------------------------------------------------------------ */

export function GoldComparison() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsRef = useRef(getColors(isDark));
  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    const coins: Coin[] = [];
    let rafId = 0;
    let lastTime = 0;
    let elapsed = 0;
    let nextSpawn = 0.8;
    const CYCLE = 8;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      const cycleT = elapsed % CYCLE;

      if (cycleT < dt * 2) {
        coins.length = 0;
        nextSpawn = 0.8;
      }

      // Spawn gold coins (less frequently, showing scarcity)
      if (cycleT >= nextSpawn && coins.length < 8) {
        coins.push({
          x: 60 + Math.random() * (W - 120),
          y: 60 + Math.random() * 100,
          radius: 10 + Math.random() * 4,
          age: 0,
          spawned: cycleT,
        });
        nextSpawn += 0.8 + Math.random() * 0.4;
      }

      for (const coin of coins) {
        coin.age += dt;
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
      ctx.fillText("Gold properties", W / 2, 18);

      // Draw gold coins (no tarnishing, stays shiny)
      for (const coin of coins) {
        // Slight shimmer effect
        const shimmer = 0.85 + 0.15 * Math.sin(elapsed * 3 + coin.x * 0.1);

        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fillStyle = c.gold;
        ctx.globalAlpha = shimmer;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isDark ? "#b8860b" : "#8b6914";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Shine dot
        ctx.beginPath();
        ctx.arc(
          coin.x - coin.radius * 0.3,
          coin.y - coin.radius * 0.3,
          coin.radius * 0.2,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = isDark ? "#fff8" : "#fffbe6";
        ctx.fill();
      }

      // Properties list
      const propsY = 185;
      ctx.font = "9px monospace";
      ctx.textAlign = "left";

      const props = [
        { label: "Tarnish resistance: high", color: c.dimText },
        {
          label: "Supply: scarce (" + String(coins.length) + " coins)",
          color: c.dimText,
        },
        { label: "Value density: high", color: c.dimText },
      ];

      for (let i = 0; i < props.length; i++) {
        ctx.fillStyle = props[i]!.color;
        ctx.fillText(props[i]!.label, 20, propsY + i * 14);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Gold as money" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Color helper                                                       */
/* ------------------------------------------------------------------ */

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    silver: isDark ? "#c0c0c0" : "#a8a8a8",
    silverTarnished: isDark ? "#5a5a3a" : "#8a8a6a",
    gold: isDark ? "#fbbf24" : "#d97706",
  };
}
