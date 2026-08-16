import type { GameState } from "./types";
import { CATEGORY_LABELS } from "@/lib/learn/categories";
import {
  encodeResults,
  getMissedCategoryLabels as _getMissedCategoryLabels,
} from "@cant/shared/lib/game";
export { encodeResults, decodeResults } from "@cant/shared/lib/game";
export type { SharedResults } from "@cant/shared/lib/game";

/** Rank thresholds based on percentage score. Emoji is part of the title. */
export function getRank(percentage: number): string {
  if (percentage === 100) return "\u{1FA84} Archmage";
  if (percentage >= 90) return "\u{1F9D9} Type Wizard";
  if (percentage >= 70) return "\u{2728} Spellcaster";
  if (percentage >= 50) return "\u{1F52E} Apprentice";
  return "\u{1F4D6} Novice";
}

/** Build the full share URL for a game session. */
export function getShareUrl(state: GameState): string {
  return `https://cant-type.saschb2b.com/play/results?r=${encodeResults(state)}&seed=${state.seed}`;
}

/** Get human-readable missed category names from game state. */
export function getMissedCategoryLabels(state: GameState): string[] {
  return _getMissedCategoryLabels(state, CATEGORY_LABELS);
}
