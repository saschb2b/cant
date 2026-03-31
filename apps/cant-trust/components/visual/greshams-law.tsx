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
  gold: string;
  debased: string;
  market: string;
  savings: string;
  zone: string;
}

interface MovingCoin {
  x: number;
  y: number;
  tx: number;
  ty: number;
  progress: number;
  isGold: boolean;
  speed: number;
}

/* ------------------------------------------------------------------ */
/*  No Gresham effect (both circulate equally)                         */
/* ------------------------------------------------------------------ */

export function GreshamNoEffect() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsRef = useRef(getColors(isDark));
  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    const coins: MovingCoin[] = [];
    let rafId = 0;
    let lastTime = 0;
    let elapsed = 0;
    let nextSpawn = 0.3;

    // Market zone center
    const marketCX = W / 2;
    const marketCY = H / 2;

    function spawnCoin() {
      const isGold = Math.random() > 0.5;
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
      const startAngle = Math.random() * Math.PI * 2;
      const startDist = 40 + Math.random() * 60;

      coins.push({
        x: marketCX + Math.cos(startAngle) * startDist,
        y: marketCY + Math.sin(startAngle) * startDist,
        tx: marketCX + Math.cos(angle) * dist,
        ty: marketCY + Math.sin(angle) * dist,
        progress: 0,
        isGold,
        speed: 0.3 + Math.random() * 0.3,
      });
    }

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      if (elapsed >= nextSpawn && coins.length < 20) {
        spawnCoin();
        nextSpawn += 0.4 + Math.random() * 0.3;
      }

      for (const coin of coins) {
        coin.progress += dt * coin.speed;
        if (coin.progress >= 1) {
          // Reset to new target
          coin.x = coin.tx;
          coin.y = coin.ty;
          const angle = Math.random() * Math.PI * 2;
          const dist = 40 + Math.random() * 60;
          coin.tx = marketCX + Math.cos(angle) * dist;
          coin.ty = marketCY + Math.sin(angle) * dist;
          coin.progress = 0;
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

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Equal circulation model", W / 2, 18);

      // Market zone
      ctx.beginPath();
      ctx.arc(marketCX, marketCY, 90, 0, Math.PI * 2);
      ctx.strokeStyle = c.zone;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Market", marketCX, marketCY + 100);

      // Draw coins
      let goldCount = 0;
      let debasedCount = 0;
      for (const coin of coins) {
        const px = coin.x + (coin.tx - coin.x) * coin.progress;
        const py = coin.y + (coin.ty - coin.y) * coin.progress;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = coin.isGold ? c.gold : c.debased;
        ctx.fill();
        if (coin.isGold) goldCount++;
        else debasedCount++;
      }

      // Legend
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.beginPath();
      ctx.arc(15, H - 30, 5, 0, Math.PI * 2);
      ctx.fillStyle = c.gold;
      ctx.fill();
      ctx.fillStyle = c.text;
      ctx.fillText("Gold: " + String(goldCount), 25, H - 27);

      ctx.beginPath();
      ctx.arc(15, H - 14, 5, 0, Math.PI * 2);
      ctx.fillStyle = c.debased;
      ctx.fill();
      ctx.fillStyle = c.text;
      ctx.fillText("Debased: " + String(debasedCount), 25, H - 11);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Circulation model A" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Gresham's Law in action (bad money drives out good)                */
/* ------------------------------------------------------------------ */

export function GreshamCirculation() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsRef = useRef(getColors(isDark));
  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    const marketCoins: MovingCoin[] = [];
    const savedGold: { x: number; y: number }[] = [];
    let rafId = 0;
    let lastTime = 0;
    let elapsed = 0;
    let nextSpawn = 0.3;

    const marketCX = W / 2;
    const marketCY = 100;
    const savingsX = W / 2;
    const savingsY = H - 35;

    function spawnCoin() {
      const isGold = Math.random() > 0.5;
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 50;

      marketCoins.push({
        x: marketCX + Math.cos(angle) * dist,
        y: marketCY + Math.sin(angle) * dist,
        tx: marketCX + Math.cos(angle + 1) * dist,
        ty: marketCY + Math.sin(angle + 1) * dist,
        progress: 0,
        isGold,
        speed: 0.3 + Math.random() * 0.3,
      });
    }

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      elapsed += dt;

      if (elapsed >= nextSpawn && marketCoins.length < 18) {
        spawnCoin();
        nextSpawn += 0.4 + Math.random() * 0.3;
      }

      // Process coins: gold gets hoarded, debased stays
      for (let i = marketCoins.length - 1; i >= 0; i--) {
        const coin = marketCoins[i]!;
        coin.progress += dt * coin.speed;

        if (coin.progress >= 1) {
          if (coin.isGold && savedGold.length < 12) {
            // Hoard gold
            savedGold.push({
              x: savingsX - 55 + savedGold.length * 10,
              y: savingsY,
            });
            marketCoins.splice(i, 1);
          } else {
            // Reset debased coin to keep circulating
            coin.x = coin.tx;
            coin.y = coin.ty;
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 50;
            coin.tx = marketCX + Math.cos(angle) * dist;
            coin.ty = marketCY + Math.sin(angle) * dist;
            coin.progress = 0;
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

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Selective hoarding model", W / 2, 18);

      // Market zone
      ctx.beginPath();
      ctx.arc(marketCX, marketCY, 70, 0, Math.PI * 2);
      ctx.strokeStyle = c.zone;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Market", marketCX, marketCY + 78);

      // Savings zone
      ctx.strokeStyle = c.savings;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(savingsX - 65, savingsY - 12, 130, 24);
      ctx.setLineDash([]);
      ctx.font = "8px monospace";
      ctx.fillStyle = c.savings;
      ctx.fillText("Savings (hoarded)", savingsX, savingsY + 24);

      // Draw market coins
      let goldInMarket = 0;
      let debasedInMarket = 0;
      for (const coin of marketCoins) {
        const px = coin.x + (coin.tx - coin.x) * coin.progress;
        const py = coin.y + (coin.ty - coin.y) * coin.progress;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = coin.isGold ? c.gold : c.debased;
        ctx.fill();
        if (coin.isGold) goldInMarket++;
        else debasedInMarket++;
      }

      // Draw saved gold
      for (const g of savedGold) {
        ctx.beginPath();
        ctx.arc(g.x, g.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = c.gold;
        ctx.fill();
      }

      // Stats
      ctx.font = "9px monospace";
      ctx.textAlign = "left";

      ctx.beginPath();
      ctx.arc(10, 35, 4, 0, Math.PI * 2);
      ctx.fillStyle = c.debased;
      ctx.fill();
      ctx.fillStyle = c.text;
      ctx.fillText("Circulating: " + String(debasedInMarket), 20, 38);

      ctx.beginPath();
      ctx.arc(10, 50, 4, 0, Math.PI * 2);
      ctx.fillStyle = c.gold;
      ctx.fill();
      ctx.fillStyle = c.text;
      ctx.fillText(
        "In market: " +
          String(goldInMarket) +
          "  Saved: " +
          String(savedGold.length),
        20,
        53,
      );

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Circulation model B" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Color helper                                                       */
/* ------------------------------------------------------------------ */

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    gold: isDark ? "#fbbf24" : "#d97706",
    debased: isDark ? "#a78bfa" : "#7c3aed",
    market: isDark ? "#60a5fa" : "#2563eb",
    savings: isDark ? "#4ade80" : "#16a34a",
    zone: isDark ? "#555" : "#aaa",
  };
}
