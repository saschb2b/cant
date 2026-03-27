import "server-only";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface RecentResult {
  id: string;
  sessionId: string;
  playerName: string;
  score: number;
  total: number;
  bestStreak: number;
  durationSec: number;
  rank: string;
  timestamp: number;
}

/** Create a recent-results store bound to a specific global key. */
export function createRecentResultsStore(symbolKey: string) {
  const globalKey = Symbol.for(symbolKey);
  const g = globalThis as unknown as Record<symbol, RecentResult[]>;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const results: RecentResult[] = (g[globalKey] ??= []);

  function prune(): void {
    const cutoff = Date.now() - DAY_MS;
    while (
      results.length > 0 &&
      (results[results.length - 1]?.timestamp ?? 0) < cutoff
    ) {
      results.pop();
    }
  }

  function hasResult(sessionId: string): boolean {
    return results.some((r) => r.sessionId === sessionId);
  }

  function addResult(data: Omit<RecentResult, "id" | "timestamp">): void {
    results.unshift({
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    });
    prune();
  }

  function getRecentResults(): RecentResult[] {
    prune();
    return [...results];
  }

  return { hasResult, addResult, getRecentResults };
}
