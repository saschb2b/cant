import { describe, it, expect } from "vitest";
import { revealCell, toggleFlag } from "./reveal";
import { createGrid } from "./grid";
import { DIFFICULTY_CONFIGS } from "./config";
import type { HuntState, DifficultyConfig, Cell } from "./types";

const easyConfig = DIFFICULTY_CONFIGS.easy;

/** Create a game state ready for play. */
function makeState(seed: string, config?: DifficultyConfig): HuntState {
  const cfg = config ?? easyConfig;
  const grid = createGrid(cfg, seed);
  return {
    grid,
    difficulty: "easy",
    config: cfg,
    status: "playing",
    flagsPlaced: 0,
    cellsRevealed: 0,
    safeCellCount: cfg.rows * cfg.cols - cfg.bugCount,
    startedAt: Date.now(),
    finishedAt: null,
  };
}

/** Find the first cell matching a predicate. */
function findCell(
  state: HuntState,
  pred: (cell: { hasBug: boolean; adjacentBugs: number }) => boolean,
): [number, number] {
  for (const row of state.grid) {
    for (const cell of row) {
      if (pred(cell)) return [cell.row, cell.col];
    }
  }
  throw new Error("No matching cell found");
}

/** Safely get a cell from a state's grid. */
function cellAt(state: HuntState, pos: [number, number]): Cell {
  const row = state.grid[pos[0]];
  if (!row) throw new Error("Row out of bounds");
  const cell = row[pos[1]];
  if (!cell) throw new Error("Col out of bounds");
  return cell;
}

describe("revealCell", () => {
  it("revealing a bug sets status to lost", () => {
    const state = makeState("reveal-bug");
    const bugPos = findCell(state, (c) => c.hasBug);
    const result = revealCell(state, bugPos[0], bugPos[1]);
    expect(result.status).toBe("lost");
    expect(result.finishedAt).not.toBeNull();
  });

  it("reveals all bugs on game over", () => {
    const state = makeState("reveal-all-bugs");
    const bugPos = findCell(state, (c) => c.hasBug);
    const result = revealCell(state, bugPos[0], bugPos[1]);

    let revealedBugs = 0;
    for (const row of result.grid) {
      for (const cell of row) {
        if (cell.hasBug && cell.state === "revealed") revealedBugs++;
      }
    }
    expect(revealedBugs).toBe(easyConfig.bugCount);
  });

  it("revealing a safe cell with adjacentBugs > 0 reveals only that cell", () => {
    const state = makeState("reveal-safe");
    const safePos = findCell(state, (c) => !c.hasBug && c.adjacentBugs > 0);

    const result = revealCell(state, safePos[0], safePos[1]);
    expect(cellAt(result, safePos).state).toBe("revealed");
    expect(result.cellsRevealed).toBe(1);
    expect(result.status).toBe("playing");
  });

  it("revealing a 0-count cell triggers flood fill", () => {
    const state = makeState("flood-fill");
    let zeroPos: [number, number] | null = null;
    for (const row of state.grid) {
      for (const cell of row) {
        if (!cell.hasBug && cell.adjacentBugs === 0) {
          zeroPos = [cell.row, cell.col];
          break;
        }
      }
      if (zeroPos) break;
    }

    if (zeroPos) {
      const result = revealCell(state, zeroPos[0], zeroPos[1]);
      expect(result.cellsRevealed).toBeGreaterThan(1);
    }
  });

  it("does not modify the original state", () => {
    const state = makeState("immutable");
    const safePos = findCell(state, (c) => !c.hasBug);
    revealCell(state, safePos[0], safePos[1]);

    expect(cellAt(state, safePos).state).toBe("hidden");
    expect(state.cellsRevealed).toBe(0);
  });

  it("is a no-op on an already revealed cell", () => {
    const state = makeState("already-revealed");
    const safePos = findCell(state, (c) => !c.hasBug && c.adjacentBugs > 0);
    const after1 = revealCell(state, safePos[0], safePos[1]);
    const after2 = revealCell(after1, safePos[0], safePos[1]);
    expect(after2.cellsRevealed).toBe(after1.cellsRevealed);
  });

  it("is a no-op on a flagged cell", () => {
    const state = makeState("flagged-cell");
    const safePos = findCell(state, (c) => !c.hasBug);
    const flagged = toggleFlag(state, safePos[0], safePos[1]);
    const result = revealCell(flagged, safePos[0], safePos[1]);
    expect(cellAt(result, safePos).state).toBe("flagged");
  });

  it("is a no-op when game is already lost", () => {
    const state = makeState("game-over");
    const bugPos = findCell(state, (c) => c.hasBug);
    const lost = revealCell(state, bugPos[0], bugPos[1]);
    const safePos = findCell(state, (c) => !c.hasBug);
    const result = revealCell(lost, safePos[0], safePos[1]);
    expect(result.status).toBe("lost");
  });

  it("detects a win when all safe cells are revealed", () => {
    const tinyConfig: DifficultyConfig = {
      rows: 3,
      cols: 3,
      bugCount: 1,
      label: "tiny",
    };
    let state = makeState("win-detect", tinyConfig);
    state = { ...state, safeCellCount: 8 };

    for (const row of state.grid) {
      for (const cell of row) {
        if (!cell.hasBug) {
          state = revealCell(state, cell.row, cell.col);
        }
      }
    }
    expect(state.status).toBe("won");
    expect(state.finishedAt).not.toBeNull();
  });
});

describe("toggleFlag", () => {
  it("flags a hidden cell", () => {
    const state = makeState("flag-cell");
    const pos = findCell(state, (c) => !c.hasBug);
    const result = toggleFlag(state, pos[0], pos[1]);
    expect(cellAt(result, pos).state).toBe("flagged");
    expect(result.flagsPlaced).toBe(1);
  });

  it("unflags a flagged cell", () => {
    const state = makeState("unflag-cell");
    const pos = findCell(state, (c) => !c.hasBug);
    const flagged = toggleFlag(state, pos[0], pos[1]);
    const unflagged = toggleFlag(flagged, pos[0], pos[1]);
    expect(cellAt(unflagged, pos).state).toBe("hidden");
    expect(unflagged.flagsPlaced).toBe(0);
  });

  it("is a no-op on a revealed cell", () => {
    const state = makeState("flag-revealed");
    const safePos = findCell(state, (c) => !c.hasBug && c.adjacentBugs > 0);
    const revealed = revealCell(state, safePos[0], safePos[1]);
    const result = toggleFlag(revealed, safePos[0], safePos[1]);
    expect(cellAt(result, safePos).state).toBe("revealed");
  });

  it("does not modify the original state", () => {
    const state = makeState("flag-immutable");
    const pos = findCell(state, (c) => !c.hasBug);
    toggleFlag(state, pos[0], pos[1]);
    expect(cellAt(state, pos).state).toBe("hidden");
    expect(state.flagsPlaced).toBe(0);
  });
});
