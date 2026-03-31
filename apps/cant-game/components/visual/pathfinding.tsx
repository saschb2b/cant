"use client";

import { useRef, useEffect } from "react";
import {
  CanvasSimulation,
  useIsDarkMode,
} from "@cant/shared/components/canvas-simulation";

/* ------------------------------------------------------------------ */
/*  Grid and A* types                                                  */
/* ------------------------------------------------------------------ */

const CANVAS_W = 320;
const CANVAS_H = 240;
const COLS = 16;
const ROWS = 12;
const CELL_W = CANVAS_W / COLS;
const CELL_H = CANVAS_H / ROWS;

const START: [number, number] = [1, 1];
const END: [number, number] = [14, 10];

const SQRT2 = Math.sqrt(2);

/** 8-directional movement: dx, dy, cost multiplier */
const DIRS: [number, number][] = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

interface Node {
  x: number;
  y: number;
  g: number;
  f: number;
  parentX: number;
  parentY: number;
}

/** Build obstacle grid. 1 = wall, 0 = open. */
function buildWalls(): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y < ROWS; y++) {
    const row: number[] = [];
    for (let x = 0; x < COLS; x++) {
      row.push(0);
    }
    grid.push(row);
  }

  function set(wx: number, wy: number) {
    const r = grid[wy];
    if (r) r[wx] = 1;
  }

  // Vertical wall in the left-center area
  for (let y = 2; y <= 8; y++) {
    set(5, y);
  }
  // Horizontal wall across the middle
  for (let x = 5; x <= 11; x++) {
    set(x, 6);
  }
  // Vertical wall on the right side
  for (let y = 2; y <= 6; y++) {
    set(11, y);
  }
  // Small wall block near top
  set(8, 3);
  set(9, 3);
  set(8, 4);
  // Block near bottom-right
  set(10, 9);
  set(11, 9);
  set(10, 10);

  return grid;
}

const WALLS = buildWalls();

function isBlocked(x: number, y: number): boolean {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
  const row = WALLS[y];
  if (!row) return true;
  return row[x] === 1;
}

function nodeKey(x: number, y: number): string {
  return String(x) + "," + String(y);
}

/* ------------------------------------------------------------------ */
/*  Heuristic functions                                                */
/* ------------------------------------------------------------------ */

function manhattanHeuristic(
  x: number,
  y: number,
  ex: number,
  ey: number,
): number {
  return Math.abs(x - ex) + Math.abs(y - ey);
}

function octileHeuristic(x: number, y: number, ex: number, ey: number): number {
  const dx = Math.abs(x - ex);
  const dy = Math.abs(y - ey);
  return Math.max(dx, dy) + (SQRT2 - 1) * Math.min(dx, dy);
}

/* ------------------------------------------------------------------ */
/*  A* pathfinding (returns exploration order + final path)            */
/* ------------------------------------------------------------------ */

interface AStarResult {
  explored: [number, number][];
  path: [number, number][];
}

function astar(
  heuristic: (x: number, y: number, ex: number, ey: number) => number,
): AStarResult {
  const [sx, sy] = START;
  const [ex, ey] = END;

  const open: Node[] = [];
  const closed = new Set<string>();
  const nodeMap = new Map<string, Node>();
  const explored: [number, number][] = [];

  const startH = heuristic(sx, sy, ex, ey);
  const startNode: Node = {
    x: sx,
    y: sy,
    g: 0,
    f: startH,
    parentX: -1,
    parentY: -1,
  };
  open.push(startNode);
  nodeMap.set(nodeKey(sx, sy), startNode);

  while (open.length > 0) {
    // Find node with lowest f
    let bestIdx = 0;
    for (let i = 1; i < open.length; i++) {
      const candidate = open[i];
      const best = open[bestIdx];
      if (candidate && best && candidate.f < best.f) {
        bestIdx = i;
      }
    }

    const current = open[bestIdx];
    if (!current) break;
    open.splice(bestIdx, 1);

    const key = nodeKey(current.x, current.y);
    if (closed.has(key)) continue;
    closed.add(key);
    explored.push([current.x, current.y]);

    // Reached goal
    if (current.x === ex && current.y === ey) {
      const path: [number, number][] = [];
      let trace: Node | undefined = current;
      while (trace && trace.parentX !== -1) {
        path.unshift([trace.x, trace.y]);
        trace = nodeMap.get(nodeKey(trace.parentX, trace.parentY));
      }
      path.unshift([sx, sy]);
      return { explored, path };
    }

    // Expand neighbors
    for (const [dx, dy] of DIRS) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (isBlocked(nx, ny)) continue;
      if (closed.has(nodeKey(nx, ny))) continue;

      // Prevent diagonal cutting through wall corners
      const isDiagonal = dx !== 0 && dy !== 0;
      if (isDiagonal) {
        if (
          isBlocked(current.x + dx, current.y) ||
          isBlocked(current.x, current.y + dy)
        ) {
          continue;
        }
      }

      const moveCost = isDiagonal ? SQRT2 : 1;
      const newG = current.g + moveCost;
      const nKey = nodeKey(nx, ny);
      const existing = nodeMap.get(nKey);

      if (!existing || newG < existing.g) {
        const h = heuristic(nx, ny, ex, ey);
        const node: Node = {
          x: nx,
          y: ny,
          g: newG,
          f: newG + h,
          parentX: current.x,
          parentY: current.y,
        };
        nodeMap.set(nKey, node);
        open.push(node);
      }
    }
  }

  return { explored, path: [] };
}

/* ------------------------------------------------------------------ */
/*  Pre-compute results for both heuristics                            */
/* ------------------------------------------------------------------ */

const MANHATTAN_RESULT = astar(manhattanHeuristic);
const OCTILE_RESULT = astar(octileHeuristic);

/* ------------------------------------------------------------------ */
/*  Animation and rendering                                            */
/* ------------------------------------------------------------------ */

interface Colors {
  wall: string;
  explored: string;
  path: string;
  startEnd: string;
  gridLine: string;
  text: string;
  bg: string;
}

/** Frames to reveal one explored cell */
const EXPLORE_SPEED = 2;
/** Frames to reveal one path cell */
const PATH_SPEED = 4;
/** Frames to pause after completion before restarting */
const PAUSE_FRAMES = 120;

function drawGrid(ctx: CanvasRenderingContext2D, colors: Colors) {
  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Grid lines
  ctx.strokeStyle = colors.gridLine;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.2;
  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL_W, 0);
    ctx.lineTo(x * CELL_W, CANVAS_H);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL_H);
    ctx.lineTo(CANVAS_W, y * CELL_H);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Walls
  ctx.fillStyle = colors.wall;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (isBlocked(x, y)) {
        ctx.fillRect(x * CELL_W + 1, y * CELL_H + 1, CELL_W - 2, CELL_H - 2);
      }
    }
  }
}

function drawExploredCells(
  ctx: CanvasRenderingContext2D,
  cells: [number, number][],
  count: number,
  color: string,
) {
  ctx.fillStyle = color;
  const limit = Math.min(count, cells.length);
  for (let i = 0; i < limit; i++) {
    const cell = cells[i];
    if (!cell) continue;
    ctx.fillRect(
      cell[0] * CELL_W + 1,
      cell[1] * CELL_H + 1,
      CELL_W - 2,
      CELL_H - 2,
    );
  }
}

function drawPathCells(
  ctx: CanvasRenderingContext2D,
  path: [number, number][],
  count: number,
  color: string,
) {
  if (count <= 0) return;
  const limit = Math.min(count, path.length);

  // Draw path line through cell centers
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (let i = 0; i < limit; i++) {
    const cell = path[i];
    if (!cell) continue;
    const cx = cell[0] * CELL_W + CELL_W / 2;
    const cy = cell[1] * CELL_H + CELL_H / 2;
    if (i === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  }
  ctx.stroke();

  // Draw dots at path nodes
  ctx.fillStyle = color;
  for (let i = 0; i < limit; i++) {
    const cell = path[i];
    if (!cell) continue;
    ctx.beginPath();
    ctx.arc(
      cell[0] * CELL_W + CELL_W / 2,
      cell[1] * CELL_H + CELL_H / 2,
      3,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}

function drawStartEnd(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;

  // Start marker
  ctx.beginPath();
  ctx.arc(
    START[0] * CELL_W + CELL_W / 2,
    START[1] * CELL_H + CELL_H / 2,
    6,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // End marker
  ctx.beginPath();
  ctx.arc(
    END[0] * CELL_W + CELL_W / 2,
    END[1] * CELL_H + CELL_H / 2,
    6,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Labels
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "S",
    START[0] * CELL_W + CELL_W / 2,
    START[1] * CELL_H + CELL_H / 2,
  );
  ctx.fillText("E", END[0] * CELL_W + CELL_W / 2, END[1] * CELL_H + CELL_H / 2);
}

function usePathfindingAnimation(result: AStarResult, colors: Colors) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const statsRef = useRef({ explored: 0, path: 0, done: false });

  useEffect(() => {
    const totalExploreFrames = result.explored.length * EXPLORE_SPEED;
    const totalPathFrames = result.path.length * PATH_SPEED;
    const totalFrames = totalExploreFrames + totalPathFrames + PAUSE_FRAMES;

    function tick() {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const frame = frameRef.current;

      // How many explored cells to show
      const exploredCount = Math.min(
        Math.floor(frame / EXPLORE_SPEED),
        result.explored.length,
      );

      // How many path cells to show (starts after exploration finishes)
      let pathCount = 0;
      if (frame > totalExploreFrames) {
        pathCount = Math.min(
          Math.floor((frame - totalExploreFrames) / PATH_SPEED),
          result.path.length,
        );
      }

      // Track stats
      statsRef.current = {
        explored: exploredCount,
        path: pathCount,
        done: frame >= totalExploreFrames + totalPathFrames,
      };

      // Draw
      drawGrid(ctx, colors);
      drawExploredCells(ctx, result.explored, exploredCount, colors.explored);
      drawPathCells(ctx, result.path, pathCount, colors.path);
      drawStartEnd(ctx, colors.startEnd);

      // Stats overlay
      const showExplored = statsRef.current.done
        ? result.explored.length
        : exploredCount;
      const showPath = statsRef.current.done ? result.path.length : pathCount;
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = colors.text;
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillText(
        "Explored: " + String(showExplored) + "  Path: " + String(showPath),
        CANVAS_W - 6,
        4,
      );

      // Advance frame, loop
      frameRef.current = (frame + 1) % totalFrames;
      rafRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [result, colors]);

  return canvasRef;
}

/* ------------------------------------------------------------------ */
/*  Exported components                                                */
/* ------------------------------------------------------------------ */

export function PathfindingManhattan() {
  const isDark = useIsDarkMode();

  const colors: Colors = {
    wall: isDark ? "#B8A8A8" : "#4B5563",
    explored: isDark ? "rgba(248,113,113,0.15)" : "rgba(220,38,38,0.1)",
    path: isDark ? "#F87171" : "#DC2626",
    startEnd: isDark ? "#22C55E" : "#15803D",
    gridLine: isDark ? "#B8A8A8" : "#4B5563",
    text: isDark ? "#F5F1F1" : "#111827",
    bg: isDark ? "#1E1E1E" : "#FAFAFA",
  };

  const canvasRef = usePathfindingAnimation(MANHATTAN_RESULT, colors);

  return (
    <CanvasSimulation
      label="Manhattan distance heuristic"
      canvasRef={canvasRef}
    />
  );
}

export function PathfindingOctile() {
  const isDark = useIsDarkMode();

  const colors: Colors = {
    wall: isDark ? "#B8A8A8" : "#4B5563",
    explored: isDark ? "rgba(248,113,113,0.15)" : "rgba(220,38,38,0.1)",
    path: isDark ? "#F87171" : "#DC2626",
    startEnd: isDark ? "#22C55E" : "#15803D",
    gridLine: isDark ? "#B8A8A8" : "#4B5563",
    text: isDark ? "#F5F1F1" : "#111827",
    bg: isDark ? "#1E1E1E" : "#FAFAFA",
  };

  const canvasRef = usePathfindingAnimation(OCTILE_RESULT, colors);

  return (
    <CanvasSimulation label="Octile distance heuristic" canvasRef={canvasRef} />
  );
}
