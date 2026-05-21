"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * Hero background for the cant-ticket landing page.
 *
 * Visualizes a living "story graph" — the system of well-formed agile work
 * artifacts. Epics decompose into stories, stories spawn tasks, ACs hang off
 * stories like motes, owners and labels weave across, sprints frame slices of
 * the graph.
 *
 * Layers (back to front):
 *   1. Swim lanes (Backlog → Doing → Done) as faint vertical gradient bands.
 *   2. Cutting-mat grid of "+" marks.
 *   3. Sprint frames (dashed rectangles enclosing slices of work).
 *   4. Edges (encode relationship kind: parent / owner / label / task).
 *   5. Nodes (epics, stories, tasks, ACs, owners, labels).
 *   6. AC text fragments ("Given… / When… / Then…").
 *   7. The whole scene is rendered twice: a base layer with skeletal
 *      outlines, and a brighter layer with semantic detail revealed only
 *      inside a soft radial spotlight tracking the cursor.
 *
 * Animation: a single rAF loop reads cached metadata off each node and
 * writes inline transforms each frame combining a per-node sine-wave drift
 * with a per-layer parallax shift driven by the cursor position. Respects
 * prefers-reduced-motion by skipping motion entirely.
 */

// ───────────────────────────────────────────────────────────────────────────
// Data model
// ───────────────────────────────────────────────────────────────────────────

type NodeKind = "epic" | "story" | "task" | "ac" | "owner" | "label";

type StoryStatus = "todo" | "doing" | "done";

interface NodeSpec {
  id: string;
  kind: NodeKind;
  /** Position in % within the canvas (0..100). */
  x: number;
  y: number;
  text?: string;
  initials?: string;
  points?: number;
  status?: StoryStatus;
  /** Maximum cursor parallax shift in px. */
  parallax: number;
  /** Drift amplitude in px. */
  amp: number;
  /** Drift angular speed in rad/s. */
  speed: number;
  /** Drift phase offset in rad. */
  phase: number;
  rotate?: number;
}

const NODES: NodeSpec[] = [
  // Epics — backbone of the system.
  {
    id: "e1",
    kind: "epic",
    x: 18,
    y: 30,
    text: "Inbox redesign",
    parallax: 10,
    amp: 4,
    speed: 0.32,
    phase: 0.0,
  },
  {
    id: "e2",
    kind: "epic",
    x: 72,
    y: 64,
    text: "Auth overhaul",
    parallax: 10,
    amp: 4,
    speed: 0.28,
    phase: 1.5,
    rotate: -1,
  },

  // Stories.
  {
    id: "s1",
    kind: "story",
    x: 36,
    y: 18,
    text: "Add inbox filters",
    points: 5,
    status: "doing",
    parallax: 14,
    amp: 5,
    speed: 0.55,
    phase: 0.4,
  },
  {
    id: "s2",
    kind: "story",
    x: 42,
    y: 40,
    text: "Bulk archive flow",
    points: 3,
    status: "doing",
    parallax: 14,
    amp: 5,
    speed: 0.48,
    phase: 1.2,
  },
  {
    id: "s3",
    kind: "story",
    x: 12,
    y: 54,
    text: "Empty-state copy",
    points: 2,
    status: "done",
    parallax: 14,
    amp: 4.5,
    speed: 0.42,
    phase: 2.8,
    rotate: -2,
  },
  {
    id: "s4",
    kind: "story",
    x: 58,
    y: 52,
    text: "Magic links",
    points: 8,
    status: "doing",
    parallax: 14,
    amp: 5,
    speed: 0.5,
    phase: 3.1,
  },
  {
    id: "s5",
    kind: "story",
    x: 86,
    y: 46,
    text: "Session timeout",
    points: 3,
    status: "todo",
    parallax: 14,
    amp: 5,
    speed: 0.6,
    phase: 4.0,
    rotate: 1,
  },
  {
    id: "s6",
    kind: "story",
    x: 60,
    y: 80,
    text: "OAuth providers",
    points: 13,
    status: "todo",
    parallax: 14,
    amp: 6,
    speed: 0.38,
    phase: 5.0,
  },
  {
    id: "s7",
    kind: "story",
    x: 28,
    y: 70,
    text: "Saved searches",
    points: 8,
    status: "todo",
    parallax: 14,
    amp: 5.5,
    speed: 0.46,
    phase: 0.9,
    rotate: -1,
  },

  // Tasks — small dots clustered around their stories.
  {
    id: "t1",
    kind: "task",
    x: 32,
    y: 10,
    parallax: 22,
    amp: 7,
    speed: 0.9,
    phase: 0.2,
  },
  {
    id: "t2",
    kind: "task",
    x: 44,
    y: 26,
    parallax: 22,
    amp: 6,
    speed: 0.8,
    phase: 1.7,
  },
  {
    id: "t3",
    kind: "task",
    x: 50,
    y: 36,
    parallax: 22,
    amp: 6.5,
    speed: 0.95,
    phase: 2.4,
  },
  {
    id: "t4",
    kind: "task",
    x: 38,
    y: 46,
    parallax: 22,
    amp: 7,
    speed: 0.7,
    phase: 3.6,
  },
  {
    id: "t5",
    kind: "task",
    x: 18,
    y: 62,
    parallax: 22,
    amp: 6,
    speed: 1.1,
    phase: 4.8,
  },
  {
    id: "t6",
    kind: "task",
    x: 66,
    y: 58,
    parallax: 22,
    amp: 6.5,
    speed: 0.85,
    phase: 0.5,
  },
  {
    id: "t7",
    kind: "task",
    x: 82,
    y: 38,
    parallax: 22,
    amp: 7,
    speed: 0.95,
    phase: 2.0,
  },
  {
    id: "t8",
    kind: "task",
    x: 68,
    y: 86,
    parallax: 22,
    amp: 6,
    speed: 0.75,
    phase: 5.6,
  },

  // ACs — tiny diamonds, almost like motes.
  {
    id: "ac1",
    kind: "ac",
    x: 44,
    y: 12,
    parallax: 26,
    amp: 8,
    speed: 1.2,
    phase: 0.3,
  },
  {
    id: "ac2",
    kind: "ac",
    x: 50,
    y: 30,
    parallax: 26,
    amp: 8,
    speed: 1.0,
    phase: 1.8,
  },
  {
    id: "ac3",
    kind: "ac",
    x: 32,
    y: 32,
    parallax: 26,
    amp: 7,
    speed: 1.3,
    phase: 3.2,
  },
  {
    id: "ac4",
    kind: "ac",
    x: 70,
    y: 44,
    parallax: 26,
    amp: 8,
    speed: 0.9,
    phase: 4.5,
  },
  {
    id: "ac5",
    kind: "ac",
    x: 80,
    y: 56,
    parallax: 26,
    amp: 7,
    speed: 1.4,
    phase: 5.1,
  },
  {
    id: "ac6",
    kind: "ac",
    x: 52,
    y: 70,
    parallax: 26,
    amp: 8,
    speed: 1.05,
    phase: 0.7,
  },

  // Owners.
  {
    id: "o1",
    kind: "owner",
    initials: "AS",
    x: 6,
    y: 18,
    parallax: 8,
    amp: 3,
    speed: 0.4,
    phase: 1.1,
  },
  {
    id: "o2",
    kind: "owner",
    initials: "JM",
    x: 94,
    y: 30,
    parallax: 8,
    amp: 3,
    speed: 0.45,
    phase: 2.7,
  },
  {
    id: "o3",
    kind: "owner",
    initials: "RK",
    x: 4,
    y: 78,
    parallax: 8,
    amp: 3.5,
    speed: 0.36,
    phase: 4.1,
  },
  {
    id: "o4",
    kind: "owner",
    initials: "MW",
    x: 92,
    y: 80,
    parallax: 8,
    amp: 3,
    speed: 0.5,
    phase: 5.5,
  },

  // Labels.
  {
    id: "l1",
    kind: "label",
    text: "frontend",
    x: 48,
    y: 4,
    parallax: 12,
    amp: 4,
    speed: 0.5,
    phase: 0.6,
  },
  {
    id: "l2",
    kind: "label",
    text: "security",
    x: 78,
    y: 16,
    parallax: 12,
    amp: 4,
    speed: 0.55,
    phase: 2.1,
    rotate: -1,
  },
  {
    id: "l3",
    kind: "label",
    text: "polish",
    x: 14,
    y: 90,
    parallax: 12,
    amp: 4,
    speed: 0.48,
    phase: 3.7,
  },
  {
    id: "l4",
    kind: "label",
    text: "infra",
    x: 42,
    y: 94,
    parallax: 12,
    amp: 4,
    speed: 0.52,
    phase: 5.2,
  },
];

interface EdgeSpec {
  from: string;
  to: string;
  kind: "parent" | "owner" | "label" | "task";
}

const EDGES: EdgeSpec[] = [
  // Epic → Story (parent, solid)
  { from: "e1", to: "s1", kind: "parent" },
  { from: "e1", to: "s2", kind: "parent" },
  { from: "e1", to: "s3", kind: "parent" },
  { from: "e1", to: "s7", kind: "parent" },
  { from: "e2", to: "s4", kind: "parent" },
  { from: "e2", to: "s5", kind: "parent" },
  { from: "e2", to: "s6", kind: "parent" },

  // Story → Task (decomposition, double-thin)
  { from: "s1", to: "t1", kind: "task" },
  { from: "s1", to: "t2", kind: "task" },
  { from: "s2", to: "t3", kind: "task" },
  { from: "s2", to: "t4", kind: "task" },
  { from: "s7", to: "t5", kind: "task" },
  { from: "s4", to: "t6", kind: "task" },
  { from: "s5", to: "t7", kind: "task" },
  { from: "s6", to: "t8", kind: "task" },

  // Owner → Story (assignment, dashed curve)
  { from: "o1", to: "s1", kind: "owner" },
  { from: "o1", to: "s2", kind: "owner" },
  { from: "o2", to: "s4", kind: "owner" },
  { from: "o2", to: "s5", kind: "owner" },
  { from: "o3", to: "s3", kind: "owner" },
  { from: "o3", to: "s7", kind: "owner" },
  { from: "o4", to: "s6", kind: "owner" },

  // Label → Story (membership, dotted)
  { from: "l1", to: "s1", kind: "label" },
  { from: "l1", to: "s2", kind: "label" },
  { from: "l2", to: "s4", kind: "label" },
  { from: "l2", to: "s5", kind: "label" },
  { from: "l3", to: "s3", kind: "label" },
  { from: "l4", to: "s6", kind: "label" },
  { from: "l4", to: "s7", kind: "label" },
];

interface SprintSpec {
  id: string;
  label: string;
  /** Bounds in % of canvas. */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const SPRINTS: SprintSpec[] = [
  { id: "sp1", label: "Sprint 23", x1: 31, y1: 11, x2: 70, y2: 47 },
  { id: "sp2", label: "Sprint 24", x1: 54, y1: 44, x2: 95, y2: 88 },
];

interface FragmentSpec {
  id: string;
  x: number;
  y: number;
  text: string;
  parallax: number;
  amp: number;
  speed: number;
  phase: number;
  rotate?: number;
}

const FRAGMENTS: FragmentSpec[] = [
  {
    id: "f1",
    x: 49,
    y: 16,
    text: "When user clicks filter",
    parallax: 28,
    amp: 6,
    speed: 0.7,
    phase: 0.4,
    rotate: -1,
  },
  {
    id: "f2",
    x: 36,
    y: 34,
    text: "Given empty inbox",
    parallax: 28,
    amp: 7,
    speed: 0.6,
    phase: 1.6,
  },
  {
    id: "f3",
    x: 55,
    y: 30,
    text: "Then results < 200ms",
    parallax: 28,
    amp: 6,
    speed: 0.8,
    phase: 2.9,
  },
  {
    id: "f4",
    x: 74,
    y: 50,
    text: "Given expired token",
    parallax: 28,
    amp: 7,
    speed: 0.65,
    phase: 4.2,
    rotate: 1,
  },
  {
    id: "f5",
    x: 84,
    y: 64,
    text: "When user signs in",
    parallax: 28,
    amp: 6,
    speed: 0.75,
    phase: 5.4,
  },
  {
    id: "f6",
    x: 50,
    y: 72,
    text: "Then redirect to /",
    parallax: 28,
    amp: 7,
    speed: 0.62,
    phase: 0.9,
    rotate: -1,
  },
];

// ───────────────────────────────────────────────────────────────────────────
// SVG renderers per node kind
// ───────────────────────────────────────────────────────────────────────────

const STROKE = 1.25;

interface RenderProps {
  bright: boolean;
  node: NodeSpec;
}

function EpicCard({ bright, node }: RenderProps): ReactNode {
  const W = 152;
  const H = 44;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${String(W)} ${String(H)}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    >
      <rect
        x="0.75"
        y="0.75"
        width={W - 1.5}
        height={H - 1.5}
        rx="6"
        fill={bright ? "currentColor" : "none"}
        opacity={bright ? 0.18 : 1}
      />
      <rect
        x="0.75"
        y="0.75"
        width={W - 1.5}
        height={H - 1.5}
        rx="6"
        fill="none"
      />
      {bright && (
        <>
          <text
            x="12"
            y="18"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="7"
            fontWeight="700"
            fill="currentColor"
            opacity="0.55"
            letterSpacing="0.08em"
          >
            EPIC
          </text>
          <text
            x="12"
            y="32"
            fontFamily="var(--font-geist), sans-serif"
            fontSize="11"
            fontWeight="700"
            fill="currentColor"
          >
            {node.text ?? ""}
          </text>
        </>
      )}
    </svg>
  );
}

const POINT_BADGE = 16;

function StoryCard({ bright, node }: RenderProps): ReactNode {
  const W = 134;
  const H = 50;
  const status = node.status ?? "todo";
  const progressFill =
    status === "done" ? W - 12 : status === "doing" ? (W - 12) * 0.55 : 0;
  return (
    <svg
      width={W + POINT_BADGE}
      height={H + 6}
      viewBox={`-2 -2 ${String(W + POINT_BADGE + 4)} ${String(H + 8)}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    >
      {/* Card body */}
      <rect
        x="0.75"
        y="0.75"
        width={W - 1.5}
        height={H - 1.5}
        rx="5"
        fill={bright ? "var(--mui-palette-background-paper)" : "none"}
      />
      {/* Title line */}
      <rect
        x="8"
        y="8"
        width={W - 24}
        height="5"
        rx="2"
        fill="currentColor"
        opacity={bright ? 0.55 : 0.35}
        stroke="none"
      />
      {/* Body lines */}
      <line x1="8" y1="22" x2={W - 20} y2="22" opacity="0.4" />
      <line x1="8" y1="30" x2={W - 30} y2="30" opacity="0.3" />
      {/* Progress strip */}
      <rect
        x="6"
        y={H - 8}
        width={W - 12}
        height="2.5"
        rx="1.25"
        fill="currentColor"
        opacity="0.12"
        stroke="none"
      />
      {progressFill > 0 && (
        <rect
          x="6"
          y={H - 8}
          width={progressFill}
          height="2.5"
          rx="1.25"
          fill="currentColor"
          opacity={bright ? 0.7 : 0.3}
          stroke="none"
        />
      )}
      {/* Story point badge */}
      <circle
        cx={W - 1}
        cy="6"
        r="9"
        fill={bright ? "currentColor" : "none"}
        opacity={bright ? 1 : 1}
      />
      <circle cx={W - 1} cy="6" r="9" fill="none" />
      {bright && node.points !== undefined && (
        <text
          x={W - 1}
          y="9.5"
          textAnchor="middle"
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="9"
          fontWeight="700"
          fill="var(--mui-palette-background-paper)"
          stroke="none"
        >
          {node.points}
        </text>
      )}
      {/* Status dot */}
      {bright && (
        <circle
          cx="8"
          cy={H - 16}
          r="2.2"
          fill="currentColor"
          opacity={status === "done" ? 0.85 : status === "doing" ? 0.7 : 0.35}
          stroke="none"
        />
      )}
      {/* Story text label (mono, faint) */}
      {bright && node.text && (
        <text
          x="14"
          y={H - 14}
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="7.5"
          fontWeight="500"
          fill="currentColor"
          opacity="0.7"
          stroke="none"
        >
          {node.text}
        </text>
      )}
    </svg>
  );
}

function TaskDot({ bright }: RenderProps): ReactNode {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    >
      <rect
        x="2"
        y="2"
        width="18"
        height="18"
        rx="3"
        fill={bright ? "currentColor" : "none"}
        opacity={bright ? 0.5 : 1}
      />
      <rect x="2" y="2" width="18" height="18" rx="3" fill="none" />
      {bright && (
        <polyline
          points="6.5,11 9.5,14 15.5,7.5"
          stroke="var(--mui-palette-background-paper)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function AcDiamond({ bright }: RenderProps): ReactNode {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    >
      <rect
        x="3.2"
        y="3.2"
        width="7.6"
        height="7.6"
        transform="rotate(45 7 7)"
        fill={bright ? "currentColor" : "none"}
        opacity={bright ? 0.45 : 1}
      />
      <rect
        x="3.2"
        y="3.2"
        width="7.6"
        height="7.6"
        transform="rotate(45 7 7)"
        fill="none"
      />
    </svg>
  );
}

function OwnerAvatar({ bright, node }: RenderProps): ReactNode {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    >
      <circle
        cx="17"
        cy="17"
        r="15"
        fill={bright ? "currentColor" : "none"}
        opacity={bright ? 0.15 : 1}
      />
      <circle cx="17" cy="17" r="15" fill="none" />
      {bright && node.initials && (
        <text
          x="17"
          y="20.5"
          textAnchor="middle"
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="10"
          fontWeight="700"
          fill="currentColor"
          stroke="none"
        >
          {node.initials}
        </text>
      )}
    </svg>
  );
}

function LabelPill({ bright, node }: RenderProps): ReactNode {
  const text = node.text ?? "";
  // approx character width for mono 8.5px
  const W = Math.max(56, text.length * 6.5 + 16);
  const H = 18;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${String(W)} ${String(H)}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    >
      <rect
        x="0.75"
        y="0.75"
        width={W - 1.5}
        height={H - 1.5}
        rx={(H - 1.5) / 2}
        fill={bright ? "currentColor" : "none"}
        opacity={bright ? 0.18 : 1}
      />
      <rect
        x="0.75"
        y="0.75"
        width={W - 1.5}
        height={H - 1.5}
        rx={(H - 1.5) / 2}
        fill="none"
      />
      {bright && (
        <>
          <circle
            cx="9"
            cy="9"
            r="2.5"
            fill="currentColor"
            opacity="0.75"
            stroke="none"
          />
          <text
            x="16"
            y="12"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="8.5"
            fontWeight="600"
            fill="currentColor"
            stroke="none"
            opacity="0.85"
          >
            {text}
          </text>
        </>
      )}
    </svg>
  );
}

const RENDERERS: Record<NodeKind, (props: RenderProps) => ReactNode> = {
  epic: EpicCard,
  story: StoryCard,
  task: TaskDot,
  ac: AcDiamond,
  owner: OwnerAvatar,
  label: LabelPill,
};

// ───────────────────────────────────────────────────────────────────────────
// Layers
// ───────────────────────────────────────────────────────────────────────────

function SwimLanes() {
  // Three faint vertical bands suggesting Backlog → Doing → Done.
  const lanes = ["Backlog", "Doing", "Done"];
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        pointerEvents: "none",
      }}
    >
      {lanes.map((label, i) => (
        <Box
          key={label}
          sx={{
            position: "relative",
            borderLeft:
              i === 0
                ? 0
                : "1px dashed rgba(var(--mui-palette-primary-mainChannel) / 0.08)",
            background:
              i === 0
                ? "linear-gradient(180deg, rgba(var(--mui-palette-primary-mainChannel) / 0.02) 0%, transparent 80%)"
                : i === 1
                  ? "linear-gradient(180deg, rgba(var(--mui-palette-primary-mainChannel) / 0.035) 0%, transparent 80%)"
                  : "linear-gradient(180deg, rgba(var(--mui-palette-success-mainChannel) / 0.03) 0%, transparent 80%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "primary.main",
              opacity: 0.25,
            }}
          >
            {label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function CuttingGrid() {
  // Subtle "+" mark pattern — like a wireframe cutting mat.
  const PLUS =
    "linear-gradient(currentColor 0 0) center / 6px 1px no-repeat, linear-gradient(currentColor 0 0) center / 1px 6px no-repeat";
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        color: "primary.main",
        opacity: 0.08,
        backgroundImage: PLUS,
        backgroundSize: "48px 48px",
        backgroundRepeat: "repeat",
      }}
    />
  );
}

function SprintsLayer({ bright }: { bright: boolean }) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        color: "primary.main",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {SPRINTS.map((sp) => (
          <g key={sp.id}>
            <rect
              x={sp.x1}
              y={sp.y1}
              width={sp.x2 - sp.x1}
              height={sp.y2 - sp.y1}
              rx="1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.18"
              strokeDasharray="0.9 0.9"
              vectorEffect="non-scaling-stroke"
              opacity={bright ? 0.55 : 0.18}
            />
          </g>
        ))}
      </svg>
      {bright &&
        SPRINTS.map((sp) => (
          <Box
            key={`${sp.id}-label`}
            sx={{
              position: "absolute",
              left: `${String(sp.x1)}%`,
              top: `${String(sp.y1)}%`,
              transform: "translate(8px, -18px)",
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "primary.main",
              opacity: 0.7,
              textTransform: "uppercase",
            }}
          >
            {sp.label}
          </Box>
        ))}
    </Box>
  );
}

function EdgesLayer({ bright }: { bright: boolean }) {
  const byId = new Map(NODES.map((n) => [n.id, n]));

  function pathFor(
    e: EdgeSpec,
  ): { d: string; from: NodeSpec; to: NodeSpec } | null {
    const from = byId.get(e.from);
    const to = byId.get(e.to);
    if (!from || !to) return null;
    if (e.kind === "owner") {
      // gentle quadratic curve
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      // perpendicular offset for curve bend
      const bend = 6;
      const cx = midX + (-dy / len) * bend;
      const cy = midY + (dx / len) * bend;
      return {
        d: `M ${String(from.x)} ${String(from.y)} Q ${String(cx)} ${String(cy)} ${String(to.x)} ${String(to.y)}`,
        from,
        to,
      };
    }
    return {
      d: `M ${String(from.x)} ${String(from.y)} L ${String(to.x)} ${String(to.y)}`,
      from,
      to,
    };
  }

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        color: "primary.main",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <marker
            id={`ticket-arrow${bright ? "-b" : ""}`}
            viewBox="0 0 6 6"
            refX="5"
            refY="3"
            markerWidth="3"
            markerHeight="3"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 6 3 L 0 6 z" fill="currentColor" opacity="0.7" />
          </marker>
        </defs>
        {EDGES.map((e, i) => {
          const r = pathFor(e);
          if (!r) return null;
          if (e.kind === "parent") {
            return (
              <path
                key={i}
                d={r.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.2"
                vectorEffect="non-scaling-stroke"
                opacity={bright ? 0.55 : 0.18}
                markerEnd={bright ? `url(#ticket-arrow-b)` : undefined}
              />
            );
          }
          if (e.kind === "task") {
            return (
              <path
                key={i}
                d={r.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.14"
                strokeDasharray="0.4 0.4"
                vectorEffect="non-scaling-stroke"
                opacity={bright ? 0.6 : 0.22}
              />
            );
          }
          if (e.kind === "owner") {
            return (
              <path
                key={i}
                d={r.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.13"
                strokeDasharray="1.6 1.0"
                vectorEffect="non-scaling-stroke"
                opacity={bright ? 0.5 : 0.16}
              />
            );
          }
          // label
          return (
            <path
              key={i}
              d={r.d}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.12"
              strokeDasharray="0.2 1.0"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={bright ? 0.55 : 0.14}
            />
          );
        })}
      </svg>
    </Box>
  );
}

function NodeBox({ node, bright }: { node: NodeSpec; bright: boolean }) {
  const Render = RENDERERS[node.kind];
  return (
    <Box
      data-canvas-node
      data-amp={node.amp}
      data-speed={node.speed}
      data-phase={node.phase}
      data-parallax={node.parallax}
      sx={{
        position: "absolute",
        left: `${String(node.x)}%`,
        top: `${String(node.y)}%`,
        color: "primary.main",
        // anchor center + base rotation
        transformOrigin: "center",
        opacity: bright ? 1 : 0.36,
        willChange: "transform",
        // base translate(-50%, -50%) folded into wrapper below
      }}
    >
      <Box
        sx={{
          transform: `translate(-50%, -50%) rotate(${String(node.rotate ?? 0)}deg)`,
          transformOrigin: "center",
          display: "inline-block",
        }}
      >
        <Render bright={bright} node={node} />
      </Box>
    </Box>
  );
}

function FragmentBox({
  fragment,
  bright,
}: {
  fragment: FragmentSpec;
  bright: boolean;
}) {
  return (
    <Box
      data-canvas-node
      data-amp={fragment.amp}
      data-speed={fragment.speed}
      data-phase={fragment.phase}
      data-parallax={fragment.parallax}
      sx={{
        position: "absolute",
        left: `${String(fragment.x)}%`,
        top: `${String(fragment.y)}%`,
        opacity: bright ? 0.85 : 0,
        willChange: "transform",
        pointerEvents: "none",
      }}
    >
      <Typography
        component="span"
        sx={{
          display: "inline-block",
          transform: `translate(-50%, -50%) rotate(${String(fragment.rotate ?? 0)}deg)`,
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.02em",
          color: "primary.main",
          whiteSpace: "nowrap",
          // Tiny underline cursor on the "Then…" lines feels typewriter-y;
          // we keep it minimal so it doesn't read as a UI control.
        }}
      >
        {fragment.text}
      </Typography>
    </Box>
  );
}

function Scene({ bright }: { bright: boolean }) {
  return (
    <>
      <SprintsLayer bright={bright} />
      <EdgesLayer bright={bright} />
      {NODES.map((n) => (
        <NodeBox key={n.id} node={n} bright={bright} />
      ))}
      {FRAGMENTS.map((f) => (
        <FragmentBox key={f.id} fragment={f} bright={bright} />
      ))}
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Main component
// ───────────────────────────────────────────────────────────────────────────

const SPOTLIGHT_RADIUS = 260;

export function TicketCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-canvas-node]"),
    );
    const meta = nodes.map((el) => ({
      el,
      amp: Number(el.dataset.amp ?? "0"),
      speed: Number(el.dataset.speed ?? "0"),
      phase: Number(el.dataset.phase ?? "0"),
      parallax: Number(el.dataset.parallax ?? "0"),
    }));

    // Start spotlight off-screen so first paint has no halo.
    root.style.setProperty("--mx", "-9999px");
    root.style.setProperty("--my", "-9999px");

    let cx = 0.5;
    let cy = 0.5;
    let targetCx = 0.5;
    let targetCy = 0.5;

    const handleMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      root.style.setProperty("--mx", `${String(e.clientX - r.left)}px`);
      root.style.setProperty("--my", `${String(e.clientY - r.top)}px`);
      targetCx = (e.clientX - r.left) / r.width;
      targetCy = (e.clientY - r.top) / r.height;
    };
    const handleLeave = () => {
      root.style.setProperty("--mx", "-9999px");
      root.style.setProperty("--my", "-9999px");
      targetCx = 0.5;
      targetCy = 0.5;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);

    if (reduced) {
      // Apply a single static layout (no drift, no parallax) and stop.
      for (const m of meta) {
        m.el.style.transform = "translate3d(0, 0, 0)";
      }
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseleave", handleLeave);
      };
    }

    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const t = (now - start) / 1000;
      // Ease cursor toward target for smooth parallax.
      cx += (targetCx - cx) * 0.08;
      cy += (targetCy - cy) * 0.08;
      const pX = cx - 0.5;
      const pY = cy - 0.5;

      for (const m of meta) {
        const driftX = m.amp * Math.sin(t * m.speed + m.phase);
        // Slightly different vertical speed creates an organic Lissajous-y drift.
        const driftY =
          m.amp * 0.6 * Math.cos(t * m.speed * 0.85 + m.phase * 1.3);
        const parX = -pX * m.parallax;
        const parY = -pY * m.parallax;
        m.el.style.transform = `translate3d(${String(driftX + parX)}px, ${String(driftY + parY)}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // Soft radial mask that follows the cursor.
  const spotlight = `radial-gradient(circle ${String(SPOTLIGHT_RADIUS)}px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.6) 55%, transparent 100%)`;

  return (
    <Box
      ref={rootRef}
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Background structure — kanban swim lanes + cutting-mat grid. */}
      <SwimLanes />
      <CuttingGrid />

      {/* Base scene — skeletal outlines, no text or fills. */}
      <Scene bright={false} />

      {/* Bright scene — revealed inside the cursor spotlight. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          maskImage: spotlight,
          WebkitMaskImage: spotlight,
        }}
      >
        <Scene bright={true} />
      </Box>
    </Box>
  );
}
