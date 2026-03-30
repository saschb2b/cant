import type { HuntState } from "./types";
import { cloneGrid, getNeighbors } from "./grid";

/** Reveal a cell. Returns a new state (immutable). */
export function revealCell(
  state: HuntState,
  row: number,
  col: number,
): HuntState {
  if (state.status !== "playing" && state.status !== "idle") return state;

  const gridRow = state.grid[row];
  if (!gridRow) return state;
  const cell = gridRow[col];
  if (cell?.state !== "hidden") return state;

  const grid = cloneGrid(state.grid);
  const targetRow = grid[row];
  if (!targetRow) return state;
  const target = targetRow[col];
  if (!target) return state;

  // Hit a bug: game over
  if (target.hasBug) {
    for (const r of grid) {
      for (const c of r) {
        if (c.hasBug) c.state = "revealed";
      }
    }
    return {
      ...state,
      grid,
      status: "lost",
      finishedAt: Date.now(),
    };
  }

  // Reveal the cell
  target.state = "revealed";
  let revealed = state.cellsRevealed + 1;

  // Flood fill if adjacentBugs is 0
  if (target.adjacentBugs === 0) {
    const queue: [number, number][] = [[row, col]];
    while (queue.length > 0) {
      const pair = queue.shift();
      if (!pair) break;
      const [r, c] = pair;
      for (const neighbor of getNeighbors(grid, r, c)) {
        if (neighbor.state !== "hidden") continue;
        if (neighbor.hasBug) continue;
        neighbor.state = "revealed";
        revealed++;
        if (neighbor.adjacentBugs === 0) {
          queue.push([neighbor.row, neighbor.col]);
        }
      }
    }
  }

  // Check win
  const won = revealed === state.safeCellCount;

  return {
    ...state,
    grid,
    status: won ? "won" : "playing",
    cellsRevealed: revealed,
    finishedAt: won ? Date.now() : state.finishedAt,
  };
}

/** Toggle a flag on a hidden cell. Returns a new state (immutable). */
export function toggleFlag(
  state: HuntState,
  row: number,
  col: number,
): HuntState {
  if (state.status !== "playing" && state.status !== "idle") return state;

  const gridRow = state.grid[row];
  if (!gridRow) return state;
  const cell = gridRow[col];
  if (cell?.state === "revealed" || !cell) return state;

  const grid = cloneGrid(state.grid);
  const targetRow = grid[row];
  if (!targetRow) return state;
  const target = targetRow[col];
  if (!target) return state;

  if (target.state === "hidden") {
    target.state = "flagged";
    return { ...state, grid, flagsPlaced: state.flagsPlaced + 1 };
  } else {
    target.state = "hidden";
    return { ...state, grid, flagsPlaced: state.flagsPlaced - 1 };
  }
}
