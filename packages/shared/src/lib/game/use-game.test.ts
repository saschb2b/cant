import { describe, it, expect } from "vitest";
import { prioritizeUncompleted } from "./use-game";
import type { BaseChallenge } from "./types";

function challenge(id: string): BaseChallenge {
  return {
    id,
    category: "cat",
    difficulty: "easy",
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

describe("prioritizeUncompleted", () => {
  const pool = ["a", "b", "c", "d"].map(challenge);

  it("returns the input untouched when nothing is completed", () => {
    expect(prioritizeUncompleted(pool, new Set())).toBe(pool);
  });

  it("moves completed challenges behind uncompleted ones, keeping order", () => {
    const result = prioritizeUncompleted(pool, new Set(["a", "c"]));
    expect(result.map((c) => c.id)).toEqual(["b", "d", "a", "c"]);
  });

  it("keeps completed challenges in the pool when everything is completed", () => {
    const result = prioritizeUncompleted(pool, new Set(["a", "b", "c", "d"]));
    expect(result.map((c) => c.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("ignores completed ids that are not in the pool", () => {
    const result = prioritizeUncompleted(pool, new Set(["x"]));
    expect(result.map((c) => c.id)).toEqual(["a", "b", "c", "d"]);
  });
});
