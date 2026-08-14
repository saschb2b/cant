import { createProgressStore } from "@cant/shared/lib/game";
import { challenges } from "@cant/shared/lib/challenges/cant-game";

const store = createProgressStore("cant-game:progress");

export const { recordAnswer, getCompletedIds, resetProgress } = store;

/** Completed/total progress over this app's full challenge pool. */
export function getProgressSummary() {
  return store.getSummary(challenges.map((c) => c.id));
}
