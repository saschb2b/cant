export interface ChallengeProgress {
  correct: number;
  wrong: number;
  lastAnsweredAt: number;
}

interface ProgressData {
  /** Month stamp ("YYYY-MM"). Progress from a previous month is discarded. */
  month: string;
  entries: Record<string, ChallengeProgress>;
}

export interface ProgressSummary {
  completed: number;
  total: number;
}

function currentMonth(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${String(now.getFullYear())}-${month}`;
}

/** Create challenge progress helpers bound to a specific storage key. */
export function createProgressStore(storageKey: string) {
  function emptyData(): ProgressData {
    return { month: currentMonth(), entries: {} };
  }

  function readAll(): ProgressData {
    if (typeof window === "undefined") return emptyData();
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return emptyData();
      const data = JSON.parse(raw) as ProgressData;
      // Automatic monthly reset
      if (data.month !== currentMonth()) return emptyData();
      return data;
    } catch {
      return emptyData();
    }
  }

  function writeAll(data: ProgressData) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // Storage full or unavailable
    }
  }

  function recordAnswer(challengeId: string, isCorrect: boolean) {
    if (typeof window === "undefined") return;
    const data = readAll();
    const entry = data.entries[challengeId] ?? {
      correct: 0,
      wrong: 0,
      lastAnsweredAt: 0,
    };
    if (isCorrect) {
      entry.correct += 1;
    } else {
      entry.wrong += 1;
    }
    entry.lastAnsweredAt = Date.now();
    data.entries[challengeId] = entry;
    writeAll(data);
  }

  /** IDs of challenges answered correctly at least once this month. */
  function getCompletedIds(): Set<string> {
    const data = readAll();
    return new Set(
      Object.entries(data.entries)
        .filter(([, entry]) => entry.correct > 0)
        .map(([id]) => id),
    );
  }

  /** Completed count over the given challenge pool. */
  function getSummary(challengeIds: string[]): ProgressSummary {
    const completed = getCompletedIds();
    return {
      completed: challengeIds.filter((id) => completed.has(id)).length,
      total: challengeIds.length,
    };
  }

  function resetProgress() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Storage unavailable
    }
  }

  return { recordAnswer, getCompletedIds, getSummary, resetProgress };
}
