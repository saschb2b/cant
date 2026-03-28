import "server-only";
import { createRecentResultsStore } from "@cant/shared/lib/game/recent-results-store";
const store = createRecentResultsStore("cant-explode:recent-results");
export const { hasResult, addResult, getRecentResults } = store;
export type { RecentResult } from "@cant/shared/lib/game";
