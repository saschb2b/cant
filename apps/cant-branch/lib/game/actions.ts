"use server";

import { createGameActions } from "@cant/shared/lib/game";
import { getRank } from "./share";
import {
  addResult,
  getRecentResults,
  hasResult,
  type RecentResult,
} from "./recent-results-store";

const actions = createGameActions(getRank, {
  hasResult,
  addResult,
  getRecentResults,
});

// Next.js server actions must be async functions exported directly from
// a "use server" module, so we wrap the synchronous factory results.

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
