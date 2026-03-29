import type { GameState } from "./types";
import { CATEGORY_LABELS } from "@/lib/game/categories";
import {
  encodeResults,
  getMissedCategoryLabels as _getMissed,
} from "@cant/shared/lib/game";

export { encodeResults, decodeResults } from "@cant/shared/lib/game";
export type { SharedResults } from "@cant/shared/lib/game";

/** Rank thresholds based on percentage score. */
export function getRank(percentage: number): string {
  if (percentage >= 90) return "Branch Master";
  if (percentage >= 70) return "Merge Ninja";
  if (percentage >= 50) return "Getting There";
  return "Keep Practicing";
}

/** Build the full share URL for a game session. */
export function getShareUrl(state: GameState): string {
  return `https://cant-branch.saschb2b.com/play/results?r=${encodeResults(state)}&seed=${state.seed}`;
}

/** Get human-readable missed category names from game state. */
export function getMissedCategoryLabels(state: GameState): string[] {
  return _getMissed(state, CATEGORY_LABELS);
}
