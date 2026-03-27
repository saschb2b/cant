import "server-only";
import { createRecentResultsStore } from "@cant/shared/lib/game";
const store = createRecentResultsStore("cant-seo:recent-results");
export const { hasResult, addResult, getRecentResults } = store;
export type { RecentResult } from "@cant/shared/lib/game";
