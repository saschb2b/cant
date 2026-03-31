import { createHistoryStore, formatRelativeDate } from "@cant/shared/lib/game";
const store = createHistoryStore("cant-orchestrate:history");
export const { getHistory, getEntryBySeed, recordGame } = store;
export { formatRelativeDate };
export type { HistoryEntry } from "@cant/shared/lib/game";
