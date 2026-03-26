"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

/**
 * Animated cluster visualization for the landing page hero.
 *
 * Shows a control-plane hub connected to three worker nodes.
 * Pods (small squares) appear and cycle through the workers
 * in a looping animation to convey orchestration.
 */

const PHASE_COUNT = 5;
const PHASE_DURATIONS = [2200, 1800, 2000, 1800, 1600];

/* ---- layout constants (SVG viewBox = 320 x 240) ---- */
const HUB = { x: 160, y: 48 };
const WORKERS: { x: number; y: number }[] = [
  { x: 60, y: 170 },
  { x: 160, y: 190 },
  { x: 260, y: 170 },
];
const NODE_RX = 14;
const POD_SIZE = 12;

/* pods per worker at each phase (sequence loops cleanly: last -> first) */
const POD_GRID: number[][] = [
  [0, 0, 0], // phase 0: empty cluster
  [1, 0, 1], // phase 1: initial deploy to node-1 + node-3
  [2, 1, 1], // phase 2: scale up
  [2, 2, 2], // phase 3: balanced
  [1, 1, 1], // phase 4: scale down evenly
];

const STATUS_LABELS = [
  "cluster ready",
  "deploying containers...",
  "scaling replicas...",
  "cluster balanced",
  "scaling down...",
];

const DEFAULT_PODS = [0, 0, 0];

function podPositions(
  cx: number,
  cy: number,
  count: number,
): { px: number; py: number }[] {
  const gap = POD_SIZE + 3;
  const totalW = count * POD_SIZE + (count - 1) * 3;
  const startX = cx - totalW / 2 + POD_SIZE / 2;
  return Array.from({ length: count }, (_, i) => ({
    px: startX + i * gap,
    py: cy + NODE_RX + 14,
  }));
}

export function HeroAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let current = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const loop = () => {
      timeout = setTimeout(() => {
        current = (current + 1) % PHASE_COUNT;
        setPhase(current);
        loop();
      }, PHASE_DURATIONS[current]);
    };

    loop();
    return () => clearTimeout(timeout);
  }, []);

  const pods = POD_GRID[phase] ?? DEFAULT_PODS;
  const statusLabel = STATUS_LABELS[phase] ?? "";

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 480,
        mx: "auto",
      }}
    >
      {/* Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          height: "80%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(var(--mui-palette-primary-mainChannel) / 0.14) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <svg
        viewBox="0 0 320 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <style>{`
            @keyframes dashFlow {
              to { stroke-dashoffset: -12; }
            }
            .conn-line {
              stroke-dasharray: 6 6;
              animation: dashFlow 1.5s linear infinite;
            }
          `}</style>
        </defs>

        {/* Connection lines from hub to workers */}
        {WORKERS.map((w, i) => (
          <line
            key={`conn-${String(i)}`}
            className="conn-line"
            x1={HUB.x}
            y1={HUB.y + NODE_RX}
            x2={w.x}
            y2={w.y - NODE_RX}
            stroke="var(--mui-palette-primary-main)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
        ))}

        {/* Hub pulse ring (opacity-based, no r animation) */}
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r={NODE_RX + 8}
          fill="var(--mui-palette-primary-main)"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.18;0"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Hub node */}
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r={NODE_RX}
          fill="var(--mui-palette-primary-main)"
          fillOpacity="0.15"
          stroke="var(--mui-palette-primary-main)"
          strokeWidth="2"
        />
        {/* Helm-style spokes */}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const innerR = 5;
          const outerR = NODE_RX - 2;
          return (
            <line
              key={`spoke-${String(deg)}`}
              x1={HUB.x + Math.cos(rad) * innerR}
              y1={HUB.y + Math.sin(rad) * innerR}
              x2={HUB.x + Math.cos(rad) * outerR}
              y2={HUB.y + Math.sin(rad) * outerR}
              stroke="var(--mui-palette-primary-main)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          );
        })}
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r={3.5}
          fill="var(--mui-palette-primary-main)"
        />

        {/* Hub label */}
        <text
          x={HUB.x}
          y={HUB.y - NODE_RX - 8}
          textAnchor="middle"
          fill="var(--mui-palette-text-secondary)"
          fontSize="8"
          fontFamily="var(--font-geist-mono), monospace"
        >
          control-plane
        </text>

        {/* Worker nodes */}
        {WORKERS.map((w, i) => {
          const podCount = pods[i] ?? (0 as number);
          const isActive = podCount > 0;
          return (
            <g key={`worker-${String(i)}`}>
              {/* Node body */}
              <rect
                x={w.x - 28}
                y={w.y - NODE_RX}
                width={56}
                height={NODE_RX * 2}
                rx={6}
                fill={
                  isActive
                    ? "var(--mui-palette-primary-main)"
                    : "var(--mui-palette-text-primary)"
                }
                fillOpacity={isActive ? 0.12 : 0.04}
                stroke={
                  isActive
                    ? "var(--mui-palette-primary-main)"
                    : "var(--mui-palette-text-primary)"
                }
                strokeWidth="1.5"
                strokeOpacity={isActive ? 0.6 : 0.15}
                style={{
                  transition: "all 0.6s ease",
                }}
              />

              {/* Node label */}
              <text
                x={w.x}
                y={w.y + 3}
                textAnchor="middle"
                fill="var(--mui-palette-text-secondary)"
                fontSize="7"
                fontFamily="var(--font-geist-mono), monospace"
                style={{ transition: "fill 0.6s ease" }}
              >
                node-{i + 1}
              </text>

              {/* Pods (opacity-only entrance for cross-browser safety) */}
              {podPositions(w.x, w.y, podCount).map((p, pi) => (
                <rect
                  key={`pod-${String(i)}-${String(pi)}-phase-${String(phase)}`}
                  x={p.px - POD_SIZE / 2}
                  y={p.py - POD_SIZE / 2}
                  width={POD_SIZE}
                  height={POD_SIZE}
                  rx={3}
                  fill="var(--mui-palette-primary-main)"
                  fillOpacity={0.35}
                  stroke="var(--mui-palette-primary-main)"
                  strokeWidth="1"
                  strokeOpacity={0.6}
                >
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.4s"
                    begin={`${String(pi * 0.12)}s`}
                    fill="freeze"
                  />
                </rect>
              ))}
            </g>
          );
        })}

        {/* Status text */}
        <text
          x="160"
          y="232"
          textAnchor="middle"
          fill="var(--mui-palette-text-secondary)"
          fontSize="7"
          fontFamily="var(--font-geist-mono), monospace"
          style={{
            transition: "opacity 0.4s ease",
          }}
        >
          {statusLabel}
        </text>
      </svg>
    </Box>
  );
}
