import type { GameState } from "./types";
import { CATEGORY_LABELS } from "../learn/categories";
import {
  encodeResults as _encodeResults,
  decodeResults as _decodeResults,
  getMissedCategoryLabels as _getMissedCategoryLabels,
} from "@cant/shared/lib/game";

/** Rank thresholds based on percentage score. */
export function getRank(percentage: number): string {
  if (percentage === 100) return "Cluster Admin";
  if (percentage >= 90) return "SRE";
  if (percentage >= 70) return "DevOps Engineer";
  if (percentage >= 50) return "Operator";
  return "Intern";
}

/** Decoded results from a shared URL param. */
export type { SharedResults } from "@cant/shared/lib/game";

export function encodeResults(state: GameState): string {
  return _encodeResults(state);
}

export function decodeResults(param: string) {
  return _decodeResults(param);
}

/** Build the full share URL for a game session. */
export function getShareUrl(state: GameState): string {
  return `https://cant-orchestrate.saschb2b.com/play/results?r=${encodeResults(state)}&seed=${state.seed}`;
}

/** Get human-readable missed category names from game state. */
export function getMissedCategoryLabels(state: GameState): string[] {
  return _getMissedCategoryLabels(state, CATEGORY_LABELS);
}
