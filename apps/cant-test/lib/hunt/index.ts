export { DIFFICULTY_CONFIGS, COUNT_COLORS } from "./config";
export { createGrid, createEmptyGrid, getNeighbors, cloneGrid } from "./grid";
export { revealCell, toggleFlag } from "./reveal";
export { calculateScore } from "./scoring";
export type {
  Difficulty,
  DifficultyConfig,
  Cell,
  CellState,
  Grid,
  GameStatus,
  HuntState,
} from "./types";
export type { ScoreResult } from "./scoring";
