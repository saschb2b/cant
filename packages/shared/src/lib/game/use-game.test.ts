import { describe, it, expect, vi } from "vitest";
import { getRoundIds, pickSeedForProgress } from "./use-game";
import type { BaseChallenge, Difficulty } from "./types";

function challenge(id: string, difficulty: Difficulty): BaseChallenge {
  return {
    id,
    category: "cat",
    difficulty,
    title: id,
    prompt: "",
    content: { type: "code", left: "a", right: "b" },
    correctSide: "left",
    explanationCorrect: "",
    explanationWrong: "",
    sourceUrl: "",
    sourceLabel: "",
  };
}

// 6 challenges per tier so a 3/4/3 round leaves room for different picks.
const pool: BaseChallenge[] = ["easy", "medium", "hard"].flatMap((d) =>
  Array.from({ length: 6 }, (_, i) =>
    challenge(`${d}-${String(i)}`, d as Difficulty),
  ),
);

/** Deterministic seed generator cycling through the given values. */
function seedStub(seeds: string[]) {
  let i = 0;
  return vi.fn(() => seeds[i++ % seeds.length] ?? "FALLBACK");
}

describe("getRoundIds", () => {
  it("produces the same round for the same seed", () => {
    expect(getRoundIds(pool, "ABC123", new Set())).toEqual(
      getRoundIds(pool, "ABC123", new Set()),
    );
  });

  it("picks 3 easy, 4 medium, and 3 hard challenges", () => {
    const round = getRoundIds(pool, "ABC123", new Set());
    expect(round.filter((id) => id.startsWith("easy")).length).toBe(3);
    expect(round.filter((id) => id.startsWith("medium")).length).toBe(4);
    expect(round.filter((id) => id.startsWith("hard")).length).toBe(3);
  });

  it("respects excluded categories", () => {
    expect(getRoundIds(pool, "ABC123", new Set(["cat"]))).toEqual([]);
  });
});

describe("pickSeedForProgress", () => {
  it("returns the first candidate without simulating when nothing is completed", () => {
    const generateSeed = seedStub(["S1", "S2"]);
    const seed = pickSeedForProgress(pool, new Set(), new Set(), generateSeed);
    expect(seed).toBe("S1");
    expect(generateSeed).toHaveBeenCalledTimes(1);
  });

  it("keeps a fully unsolved first candidate without rotating further", () => {
    const generateSeed = seedStub(["S1", "S2"]);
    const seed = pickSeedForProgress(
      pool,
      new Set(),
      new Set(["not-in-any-round"]),
      generateSeed,
    );
    expect(seed).toBe("S1");
    expect(generateSeed).toHaveBeenCalledTimes(1);
  });

  it("rotates to a candidate whose round has more unsolved challenges", () => {
    // Find two seeds that produce different rounds, then mark the first
    // seed's round as fully completed.
    const first = "SEED-A";
    const firstRound = getRoundIds(pool, first, new Set());
    const second = Array.from(
      { length: 50 },
      (_, i) => `SEED-B${String(i)}`,
    ).find((s) =>
      getRoundIds(pool, s, new Set()).some((id) => !firstRound.includes(id)),
    );
    expect(second).toBeDefined();

    const generateSeed = seedStub([first, second ?? ""]);
    const seed = pickSeedForProgress(
      pool,
      new Set(),
      new Set(firstRound),
      generateSeed,
    );
    expect(seed).toBe(second);
  });

  it("stops after maxAttempts and keeps the best candidate", () => {
    const allIds = new Set(pool.map((c) => c.id));
    const generateSeed = seedStub(["S1", "S2", "S3", "S4", "S5", "S6"]);
    const seed = pickSeedForProgress(pool, new Set(), allIds, generateSeed, 4);
    expect(seed).toBe("S1");
    expect(generateSeed).toHaveBeenCalledTimes(4);
  });
});
