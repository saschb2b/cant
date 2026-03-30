import type { Cell, DifficultyConfig, Grid } from "./types";
import { createRng, hashSeed } from "@cant/shared/lib/game";

/** Create an empty grid with no bugs. */
export function createEmptyGrid(rows: number, cols: number): Grid {
  const grid: Grid = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        hasBug: false,
        adjacentBugs: 0,
        state: "hidden",
      });
    }
    grid.push(row);
  }
  return grid;
}

/** Get the up-to-8 neighbors of a cell. */
export function getNeighbors(grid: Grid, row: number, col: number): Cell[] {
  const neighbors: Cell[] = [];
  const firstRow = grid[0];
  if (!firstRow) return neighbors;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < firstRow.length) {
        const gridRow = grid[nr];
        const cell = gridRow?.[nc];
        if (cell) neighbors.push(cell);
      }
    }
  }
  return neighbors;
}

/** Calculate adjacentBugs for every cell in the grid (mutates in place). */
export function calculateAdjacency(grid: Grid): void {
  for (let r = 0; r < grid.length; r++) {
    const gridRow = grid[r];
    if (!gridRow) continue;
    for (let c = 0; c < gridRow.length; c++) {
      const cell = gridRow[c];
      if (cell) {
        cell.adjacentBugs = getNeighbors(grid, r, c).filter(
          (n) => n.hasBug,
        ).length;
      }
    }
  }
}

/**
 * Create a grid with bugs placed using seeded RNG.
 * If safeRow/safeCol are provided, that cell and its neighbors are bug-free.
 */
export function createGrid(
  config: DifficultyConfig,
  seed: string,
  safeRow?: number,
  safeCol?: number,
): Grid {
  const { rows, cols, bugCount } = config;
  const grid = createEmptyGrid(rows, cols);

  // Build list of all positions, then exclude the safe zone
  const positions: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (safeRow !== undefined && safeCol !== undefined) {
        const dr = Math.abs(r - safeRow);
        const dc = Math.abs(c - safeCol);
        if (dr <= 1 && dc <= 1) continue;
      }
      positions.push([r, c]);
    }
  }

  // Fisher-Yates shuffle using seeded RNG
  const rng = createRng(hashSeed(seed));
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const pi = positions[i];
    const pj = positions[j];
    if (pi && pj) {
      positions[i] = pj;
      positions[j] = pi;
    }
  }

  // Place bugs
  const count = Math.min(bugCount, positions.length);
  for (let i = 0; i < count; i++) {
    const pos = positions[i];
    if (!pos) continue;
    const [r, c] = pos;
    const gridRow = grid[r];
    const cell = gridRow?.[c];
    if (cell) cell.hasBug = true;
  }

  calculateAdjacency(grid);
  return grid;
}

/** Deep-clone a grid for immutable updates. */
export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}
