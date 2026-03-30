export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  rows: number;
  cols: number;
  bugCount: number;
  label: string;
}

export type CellState = "hidden" | "revealed" | "flagged";

export interface Cell {
  row: number;
  col: number;
  hasBug: boolean;
  adjacentBugs: number;
  state: CellState;
}

export type Grid = Cell[][];

export type GameStatus = "idle" | "playing" | "won" | "lost";

export interface HuntState {
  grid: Grid;
  difficulty: Difficulty;
  config: DifficultyConfig;
  status: GameStatus;
  flagsPlaced: number;
  cellsRevealed: number;
  safeCellCount: number;
  startedAt: number | null;
  finishedAt: number | null;
}
