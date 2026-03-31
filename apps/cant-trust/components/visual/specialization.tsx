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
  person: string;
  food: string;
  wood: string;
  tool: string;
  trade: string;
  counter: string;
}

interface Person {
  x: number;
  y: number;
  role: string;
  taskTimer: number;
  producing: boolean;
  output: number;
}

/* ------------------------------------------------------------------ */
/*  Generalist economy (everyone does everything)                      */
/* ------------------------------------------------------------------ */

export function GeneralistEconomy() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsRef = useRef(getColors(isDark));
  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    const people: Person[] = [
      { x: 60, y: 80, role: "All", taskTimer: 0, producing: false, output: 0 },
      {
        x: 160,
        y: 80,
        role: "All",
        taskTimer: 0,
        producing: false,
        output: 0,
      },
      {
        x: 260,
        y: 80,
        role: "All",
        taskTimer: 0,
        producing: false,
        output: 0,
      },
    ];

    const tasks = ["Food", "Wood", "Tools"];
    let totalOutput = 0;
    let rafId = 0;
    let lastTime = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;

      for (const p of people) {
        p.taskTimer += dt;
        // Generalists are slow: produce 1 unit every 2.5 seconds
        if (p.taskTimer >= 2.5) {
          p.taskTimer = 0;
          p.output++;
          totalOutput++;
          p.producing = true;
          // Rotate through tasks
          const idx = tasks.indexOf(p.role === "All" ? tasks[0]! : p.role);
          p.role = tasks[((idx >= 0 ? idx : 0) + 1) % tasks.length]!;
        } else {
          p.producing = false;
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
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Each person does everything", W / 2, 18);

      for (const p of people) {
        // Person circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = c.person;
        ctx.fill();

        // Task label cycling
        const currentTask =
          tasks[Math.floor(p.taskTimer / 0.8) % tasks.length]!;
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.text;
        ctx.fillText(currentTask, p.x, p.y + 4);

        // Progress bar
        const progress = p.taskTimer / 2.5;
        const barW = 30;
        ctx.fillStyle = c.dimText;
        ctx.fillRect(p.x - barW / 2, p.y + 22, barW, 4);
        ctx.fillStyle = c.food;
        ctx.fillRect(p.x - barW / 2, p.y + 22, barW * progress, 4);

        // "Generalist" label
        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText("Generalist", p.x, p.y + 38);

        // Flash on produce
        if (p.producing) {
          ctx.font = "bold 9px monospace";
          ctx.fillStyle = c.counter;
          ctx.fillText("+1", p.x, p.y - 24);
        }
      }

      // Total output
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.counter;
      ctx.fillText("Total output: " + String(totalOutput), W / 2, H - 40);

      // Rate
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("1 unit per person per 2.5s", W / 2, H - 22);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Generalist economy" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Specialist economy (division of labor + trade)                     */
/* ------------------------------------------------------------------ */

export function SpecialistEconomy() {
  const isDark = useIsDarkMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsRef = useRef(getColors(isDark));
  useEffect(() => {
    colorsRef.current = getColors(isDark);
  });

  useEffect(() => {
    const people: Person[] = [
      {
        x: 60,
        y: 80,
        role: "Farmer",
        taskTimer: 0,
        producing: false,
        output: 0,
      },
      {
        x: 160,
        y: 80,
        role: "Builder",
        taskTimer: 0,
        producing: false,
        output: 0,
      },
      {
        x: 260,
        y: 80,
        role: "Smith",
        taskTimer: 0,
        producing: false,
        output: 0,
      },
    ];

    interface TradeParticle {
      x: number;
      y: number;
      tx: number;
      ty: number;
      progress: number;
      color: string;
    }

    const trades: TradeParticle[] = [];
    let totalOutput = 0;
    let rafId = 0;
    let lastTime = 0;

    function tick(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;

      const c = colorsRef.current;

      for (const p of people) {
        p.taskTimer += dt;
        // Specialists are fast: produce 1 unit every 1.0 seconds
        if (p.taskTimer >= 1.0) {
          p.taskTimer = 0;
          p.output++;
          totalOutput++;
          p.producing = true;
          // Create trade particle to random other person
          const others = people.filter((o) => o !== p);
          const target = others[Math.floor(Math.random() * others.length)]!;
          trades.push({
            x: p.x,
            y: p.y + 50,
            tx: target.x,
            ty: target.y + 50,
            progress: 0,
            color: c.trade,
          });
        } else {
          p.producing = false;
        }
      }

      // Update trades
      for (const t of trades) {
        t.progress += dt * 1.5;
      }
      // Remove finished
      for (let i = trades.length - 1; i >= 0; i--) {
        if (trades[i]!.progress >= 1) trades.splice(i, 1);
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);

      // Title
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.dimText;
      ctx.fillText("Specialize and trade", W / 2, 18);

      const roleColors: Record<string, string> = {
        Farmer: c.food,
        Builder: c.wood,
        Smith: c.tool,
      };

      for (const p of people) {
        // Person circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = roleColors[p.role] ?? c.person;
        ctx.fill();

        // Role label
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = c.bg;
        ctx.fillText(p.role, p.x, p.y + 4);

        // Progress bar (faster)
        const progress = p.taskTimer / 1.0;
        const barW = 30;
        ctx.fillStyle = c.dimText;
        ctx.fillRect(p.x - barW / 2, p.y + 22, barW, 4);
        ctx.fillStyle = roleColors[p.role] ?? c.food;
        ctx.fillRect(p.x - barW / 2, p.y + 22, barW * progress, 4);

        // Specialist label
        ctx.font = "8px monospace";
        ctx.fillStyle = c.dimText;
        ctx.fillText("Specialist", p.x, p.y + 38);

        if (p.producing) {
          ctx.font = "bold 9px monospace";
          ctx.fillStyle = c.counter;
          ctx.fillText("+1", p.x, p.y - 24);
        }
      }

      // Trade particles
      for (const t of trades) {
        const px = t.x + (t.tx - t.x) * t.progress;
        const py =
          t.y + (t.ty - t.y) * t.progress - Math.sin(t.progress * Math.PI) * 20;
        ctx.globalAlpha = 1 - t.progress * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = c.trade;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Total output
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = c.counter;
      ctx.fillText("Total output: " + String(totalOutput), W / 2, H - 40);

      // Rate
      ctx.font = "9px monospace";
      ctx.fillStyle = c.dimText;
      ctx.fillText("1 unit per person per 1.0s", W / 2, H - 22);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <CanvasSimulation label="Specialist economy" canvasRef={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Color helper                                                       */
/* ------------------------------------------------------------------ */

function getColors(isDark: boolean): Colors {
  return {
    bg: isDark ? "#1a1a1a" : "#fafafa",
    text: isDark ? "#e5e5e5" : "#1a1a1a",
    dimText: isDark ? "#888" : "#666",
    person: isDark ? "#6b7280" : "#9ca3af",
    food: isDark ? "#4ade80" : "#16a34a",
    wood: isDark ? "#c084fc" : "#9333ea",
    tool: isDark ? "#60a5fa" : "#2563eb",
    trade: isDark ? "#fbbf24" : "#d97706",
    counter: isDark ? "#34d399" : "#059669",
  };
}
