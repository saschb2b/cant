import type { GameState } from "./types";

/** Decoded results from a shared URL param. */
export interface SharedResults {
  score: number;
  total: number;
  streak: number;
  seconds: number;
  results: boolean[];
  seed?: string;
}

/**
 * Encode game results into a compact URL-safe string.
 * Format: `score-total-streak-seconds-dotsBinary-seed`
 */
export function encodeResults(state: GameState): string {
  const score = Object.values(state.answers).filter(
    (a) => a.result === "correct",
  ).length;
  const total = state.challenges.length;
  const elapsed = Math.round(
    ((state.finishedAt ?? state.startedAt) - state.startedAt) / 1000,
  );
  const dots = state.challenges
    .map((c) => (state.answers[c.id]?.result === "correct" ? "1" : "0"))
    .join("");

  const raw = `${String(score)}-${String(total)}-${String(state.bestStreak)}-${String(elapsed)}-${dots}-${state.seed}`;
  return btoa(raw);
}

/**
 * Decode a shared results string back into structured data.
 * Returns null if the format is invalid.
 */
export function decodeResults(param: string): SharedResults | null {
  let raw: string;
  try {
    raw = atob(param);
  } catch {
    return null;
  }
  const parts = raw.split("-");
  if (parts.length !== 5 && parts.length !== 6) return null;

  const [scoreStr, totalStr, streakStr, secondsStr, dotsStr, seedStr] = parts;
  const score = Number(scoreStr);
  const total = Number(totalStr);
  const streak = Number(streakStr);
  const seconds = Number(secondsStr);

  if ([score, total, streak, seconds].some((n) => !Number.isFinite(n) || n < 0))
    return null;
  if (dotsStr?.length !== total) return null;
  if (!/^[01]+$/.test(dotsStr)) return null;

  const results = Array.from(dotsStr, (c) => c === "1");
  return { score, total, streak, seconds, results, seed: seedStr };
}

/** Get human-readable missed category names from game state. */
export function getMissedCategoryLabels(
  state: GameState,
  categoryLabels: Record<string, string>,
): string[] {
  const missed = state.challenges
    .filter((c) => state.answers[c.id]?.result === "wrong")
    .map((c) => c.category);
  return [...new Set(missed)].map(
    (cat) => categoryLabels[cat]?.toLowerCase() ?? cat,
  );
}
