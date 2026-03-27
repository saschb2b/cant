import type { GameState } from "./types";
import { CATEGORY_LABELS } from "../learn/categories";
import {
  encodeResults as _encodeResults,
  decodeResults as _decodeResults,
  getMissedCategoryLabels as _getMissedCategoryLabels,
} from "@cant/shared/lib/game";

export interface Rank {
  title: string;
  emoji: string;
}

/** Rank thresholds based on percentage score. */
export function getRank(percentage: number): Rank {
  if (percentage === 100) return { title: "Archmage", emoji: "\u{1FA84}" };
  if (percentage >= 90) return { title: "Type Wizard", emoji: "\u{1F9D9}" };
  if (percentage >= 70) return { title: "Spellcaster", emoji: "\u{2728}" };
  if (percentage >= 50) return { title: "Apprentice", emoji: "\u{1F52E}" };
  return { title: "Novice", emoji: "\u{1F4D6}" };
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
  return `https://cant-type.saschb2b.com/play/results?r=${encodeResults(state)}&seed=${state.seed}`;
}

/** Get human-readable missed category names from game state. */
export function getMissedCategoryLabels(state: GameState): string[] {
  return _getMissedCategoryLabels(state, CATEGORY_LABELS);
}
