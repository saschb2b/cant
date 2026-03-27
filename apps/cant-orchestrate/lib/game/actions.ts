"use server";

import { createGameActions } from "@cant/shared/lib/game";
import { getRank } from "./share";
import { hasResult, addResult, getRecentResults } from "./recent-results-store";
import type { RecentResult } from "./recent-results-store";

const actions = createGameActions(getRank, {
  hasResult,
  addResult,
  getRecentResults,
});

// Server actions must be async per Next.js convention.
// eslint-disable-next-line @typescript-eslint/require-await
export async function submitGameResult(data: {
  sessionId: string;
  score: number;
  total: number;
  bestStreak: number;
  durationSec: number;
}): Promise<void> {
  actions.submitGameResult(data);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function fetchRecentResults(): Promise<RecentResult[]> {
  return actions.fetchRecentResults();
}
