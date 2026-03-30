import type { Difficulty, DifficultyConfig } from "./types";

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { rows: 8, cols: 8, bugCount: 10, label: "Greenfield Project" },
  medium: { rows: 12, cols: 12, bugCount: 25, label: "Legacy Codebase" },
  hard: { rows: 16, cols: 16, bugCount: 50, label: "Production Hotfix" },
};

/** Color for the adjacent bug count number (Minesweeper-style). */
export const COUNT_COLORS: Record<number, string> = {
  1: "#3B82F6",
  2: "#22C55E",
  3: "#EF4444",
  4: "#7C3AED",
  5: "#D97706",
  6: "#06B6D4",
  7: "#1F2937",
  8: "#6B7280",
};
