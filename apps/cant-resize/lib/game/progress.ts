import { createProgressStore } from "@cant/shared/lib/game";
import { challenges } from "@cant/shared/lib/challenges/cant-resize";

const store = createProgressStore("cant-resize:progress");

export const { recordAnswer, getCompletedIds, resetProgress } = store;

/** Completed/total progress over this app's full challenge pool. */
export function getProgressSummary() {
  return store.getSummary(challenges.map((c) => c.id));
}
