import { describe, it, expect } from "vitest";
import { createGrid, createEmptyGrid, getNeighbors, cloneGrid } from "./grid";
import type { DifficultyConfig, Cell } from "./types";
import { DIFFICULTY_CONFIGS } from "./config";

const easyConfig = DIFFICULTY_CONFIGS.easy;

/** Safely access a grid cell, throwing on out-of-bounds. */
function at(grid: Cell[][], row: number, col: number): Cell {
  const r = grid[row];
  if (!r) throw new Error(`Row ${String(row)} out of bounds`);
  const c = r[col];
  if (!c) throw new Error(`Col ${String(col)} out of bounds`);
  return c;
}

describe("createEmptyGrid", () => {
  it("creates a grid with the correct dimensions", () => {
    const grid = createEmptyGrid(8, 10);
    expect(grid.length).toBe(8);
    expect(grid[0]?.length).toBe(10);
  });

  it("all cells start hidden with no bugs", () => {
    const grid = createEmptyGrid(4, 4);
    for (const row of grid) {
      for (const cell of row) {
        expect(cell.state).toBe("hidden");
        expect(cell.hasBug).toBe(false);
        expect(cell.adjacentBugs).toBe(0);
      }
    }
  });

  it("each cell has correct row and col coordinates", () => {
    const grid = createEmptyGrid(3, 3);
    expect(at(grid, 2, 1).row).toBe(2);
    expect(at(grid, 2, 1).col).toBe(1);
  });
});

describe("getNeighbors", () => {
  const grid = createEmptyGrid(5, 5);

  it("returns 8 neighbors for a center cell", () => {
    expect(getNeighbors(grid, 2, 2).length).toBe(8);
  });

  it("returns 3 neighbors for a corner cell", () => {
    expect(getNeighbors(grid, 0, 0).length).toBe(3);
  });

  it("returns 5 neighbors for an edge cell", () => {
    expect(getNeighbors(grid, 0, 2).length).toBe(5);
  });

  it("does not include the cell itself", () => {
    const neighbors = getNeighbors(grid, 2, 2);
    expect(neighbors.every((n) => !(n.row === 2 && n.col === 2))).toBe(true);
  });
});

describe("createGrid", () => {
  it("places the correct number of bugs", () => {
    const grid = createGrid(easyConfig, "test-seed");
    let bugCount = 0;
    for (const row of grid) {
      for (const cell of row) {
        if (cell.hasBug) bugCount++;
      }
    }
    expect(bugCount).toBe(easyConfig.bugCount);
  });

  it("has correct dimensions for each difficulty", () => {
    for (const config of Object.values(DIFFICULTY_CONFIGS)) {
      const grid = createGrid(config, "seed");
      expect(grid.length).toBe(config.rows);
      expect(grid[0]?.length).toBe(config.cols);
    }
  });

  it("is deterministic with the same seed", () => {
    const grid1 = createGrid(easyConfig, "deterministic");
    const grid2 = createGrid(easyConfig, "deterministic");
    for (const row of grid1) {
      for (const cell of row) {
        expect(cell.hasBug).toBe(at(grid2, cell.row, cell.col).hasBug);
      }
    }
  });

  it("produces different grids with different seeds", () => {
    const grid1 = createGrid(easyConfig, "seed-alpha");
    const grid2 = createGrid(easyConfig, "seed-beta");
    let differences = 0;
    for (const row of grid1) {
      for (const cell of row) {
        if (cell.hasBug !== at(grid2, cell.row, cell.col).hasBug) differences++;
      }
    }
    expect(differences).toBeGreaterThan(0);
  });

  it("calculates adjacency counts correctly", () => {
    const config: DifficultyConfig = {
      rows: 3,
      cols: 3,
      bugCount: 1,
      label: "tiny",
    };
    const grid = createGrid(config, "adjacency-test");

    // Find the bug
    let bugRow = -1;
    let bugCol = -1;
    for (const row of grid) {
      for (const cell of row) {
        if (cell.hasBug) {
          bugRow = cell.row;
          bugCol = cell.col;
        }
      }
    }

    // All neighbors of the bug should have adjacentBugs >= 1
    const neighbors = getNeighbors(grid, bugRow, bugCol);
    for (const n of neighbors) {
      expect(n.adjacentBugs).toBeGreaterThanOrEqual(1);
    }

    // Non-neighbor, non-bug cells should have adjacentBugs === 0
    for (const row of grid) {
      for (const cell of row) {
        if (cell.hasBug) continue;
        if (
          Math.abs(cell.row - bugRow) <= 1 &&
          Math.abs(cell.col - bugCol) <= 1
        )
          continue;
        expect(cell.adjacentBugs).toBe(0);
      }
    }
  });

  it("respects the safe zone when safeRow/safeCol are provided", () => {
    const grid = createGrid(easyConfig, "safe-zone", 4, 4);

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = 4 + dr;
        const c = 4 + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
          expect(at(grid, r, c).hasBug).toBe(false);
        }
      }
    }
  });

  it("still places all bugs even with a safe zone", () => {
    const grid = createGrid(easyConfig, "safe-count", 0, 0);
    let bugCount = 0;
    for (const row of grid) {
      for (const cell of row) {
        if (cell.hasBug) bugCount++;
      }
    }
    expect(bugCount).toBe(easyConfig.bugCount);
  });
});

describe("cloneGrid", () => {
  it("creates a deep copy", () => {
    const grid = createGrid(easyConfig, "clone-test");
    const clone = cloneGrid(grid);

    at(clone, 0, 0).state = "revealed";
    expect(at(grid, 0, 0).state).toBe("hidden");
  });

  it("preserves all cell properties", () => {
    const grid = createGrid(easyConfig, "clone-preserve");
    const clone = cloneGrid(grid);

    for (const row of grid) {
      for (const cell of row) {
        const cloned = at(clone, cell.row, cell.col);
        expect(cloned.hasBug).toBe(cell.hasBug);
        expect(cloned.adjacentBugs).toBe(cell.adjacentBugs);
        expect(cloned.row).toBe(cell.row);
        expect(cloned.col).toBe(cell.col);
      }
    }
  });
});
