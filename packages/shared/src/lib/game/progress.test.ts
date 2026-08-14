import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createProgressStore } from "./progress";

const KEY = "test:progress";

function installBrowserGlobals() {
  const backing = new Map<string, string>();
  const localStorageMock = {
    getItem: (key: string) => backing.get(key) ?? null,
    setItem: (key: string, value: string) => {
      backing.set(key, value);
    },
    removeItem: (key: string) => {
      backing.delete(key);
    },
  };
  vi.stubGlobal("window", { localStorage: localStorageMock });
  vi.stubGlobal("localStorage", localStorageMock);
}

describe("createProgressStore", () => {
  beforeEach(() => {
    installBrowserGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("starts with no completed challenges", () => {
    const store = createProgressStore(KEY);
    expect(store.getCompletedIds().size).toBe(0);
    expect(store.getSummary(["a", "b"])).toEqual({ completed: 0, total: 2 });
  });

  it("marks a challenge completed once answered correctly", () => {
    const store = createProgressStore(KEY);
    store.recordAnswer("a", true);
    store.recordAnswer("b", false);
    expect(store.getCompletedIds()).toEqual(new Set(["a"]));
    expect(store.getSummary(["a", "b", "c"])).toEqual({
      completed: 1,
      total: 3,
    });
  });

  it("keeps a challenge completed even after a later wrong answer", () => {
    const store = createProgressStore(KEY);
    store.recordAnswer("a", true);
    store.recordAnswer("a", false);
    expect(store.getCompletedIds()).toEqual(new Set(["a"]));
  });

  it("accumulates correct and wrong counts per challenge", () => {
    const store = createProgressStore(KEY);
    store.recordAnswer("a", false);
    store.recordAnswer("a", false);
    store.recordAnswer("a", true);
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}") as {
      entries: Record<string, { correct: number; wrong: number }>;
    };
    expect(raw.entries.a).toMatchObject({ correct: 1, wrong: 2 });
  });

  it("ignores completed ids that are not in the given pool", () => {
    const store = createProgressStore(KEY);
    store.recordAnswer("removed-challenge", true);
    expect(store.getSummary(["a", "b"])).toEqual({ completed: 0, total: 2 });
  });

  it("resets progress manually", () => {
    const store = createProgressStore(KEY);
    store.recordAnswer("a", true);
    store.resetProgress();
    expect(store.getCompletedIds().size).toBe(0);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("discards progress from a previous month automatically", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-15T12:00:00Z"));
    const store = createProgressStore(KEY);
    store.recordAnswer("a", true);
    expect(store.getCompletedIds()).toEqual(new Set(["a"]));

    vi.setSystemTime(new Date("2026-08-01T12:00:00Z"));
    expect(store.getCompletedIds().size).toBe(0);
    expect(store.getSummary(["a"])).toEqual({ completed: 0, total: 1 });
  });

  it("keeps progress within the same month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-01T12:00:00Z"));
    const store = createProgressStore(KEY);
    store.recordAnswer("a", true);

    vi.setSystemTime(new Date("2026-08-31T12:00:00Z"));
    expect(store.getCompletedIds()).toEqual(new Set(["a"]));
  });

  it("recovers from corrupted stored data", () => {
    localStorage.setItem(KEY, "not json");
    const store = createProgressStore(KEY);
    expect(store.getCompletedIds().size).toBe(0);
    store.recordAnswer("a", true);
    expect(store.getCompletedIds()).toEqual(new Set(["a"]));
  });
});
