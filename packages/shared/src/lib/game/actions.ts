import { generateAnonymousName } from "./anonymous-names";
import type { RecentResult } from "./recent-results-store";

interface ResultStore {
  hasResult: (sessionId: string) => boolean;
  addResult: (data: Omit<RecentResult, "id" | "timestamp">) => void;
  getRecentResults: () => RecentResult[];
}

/**
 * Create server action functions for submitting and fetching game results.
 *
 * Each app passes its own `getRank` function and result store instance.
 * The returned functions should be re-exported with `"use server"` in the
 * app's own actions file.
 */
export function createGameActions(
  getRank: (percentage: number) => string,
  store: ResultStore,
) {
  function submitGameResult(data: {
    sessionId: string;
    score: number;
    total: number;
    bestStreak: number;
    durationSec: number;
  }): void {
    const { sessionId, score, total, bestStreak, durationSec } = data;

    if (
      !Number.isInteger(score) ||
      !Number.isInteger(total) ||
      !Number.isInteger(bestStreak) ||
      !Number.isInteger(durationSec)
    )
      return;
    if (total <= 0 || score < 0 || score > total) return;
    if (bestStreak < 0 || durationSec < 0) return;
    if (!sessionId) return;

    if (store.hasResult(sessionId)) return;

    const percentage = Math.round((score / total) * 100);

    store.addResult({
      sessionId,
      playerName: generateAnonymousName(),
      score,
      total,
      bestStreak,
      durationSec,
      rank: getRank(percentage),
    });
  }

  function fetchRecentResults(): RecentResult[] {
    return store.getRecentResults();
  }

  return { submitGameResult, fetchRecentResults };
}
