import { describe, it, expect } from "vitest";
import { calculateScore } from "./scoring";
import { DIFFICULTY_CONFIGS } from "./config";
import type { HuntState } from "./types";
import { createEmptyGrid } from "./grid";

function makeWonState(
  difficulty: "easy" | "medium" | "hard",
  durationMs: number,
): HuntState {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const now = Date.now();
  return {
    grid: createEmptyGrid(config.rows, config.cols),
    difficulty,
    config,
    status: "won",
    flagsPlaced: config.bugCount,
    cellsRevealed: config.rows * config.cols - config.bugCount,
    safeCellCount: config.rows * config.cols - config.bugCount,
    startedAt: now - durationMs,
    finishedAt: now,
  };
}

describe("calculateScore", () => {
  it("applies the correct difficulty multiplier", () => {
    const easy = calculateScore(makeWonState("easy", 60_000));
    const medium = calculateScore(makeWonState("medium", 60_000));
    const hard = calculateScore(makeWonState("hard", 60_000));

    expect(easy.difficultyMultiplier).toBe(1);
    expect(medium.difficultyMultiplier).toBe(2);
    expect(hard.difficultyMultiplier).toBe(3);
  });

  it("gives a higher time bonus for faster completion", () => {
    const fast = calculateScore(makeWonState("easy", 10_000));
    const slow = calculateScore(makeWonState("easy", 300_000));

    expect(fast.timeBonus).toBeGreaterThan(slow.timeBonus);
    expect(fast.score).toBeGreaterThan(slow.score);
  });

  it("time bonus floors at 0", () => {
    const verySlow = calculateScore(makeWonState("easy", 600_000));
    expect(verySlow.timeBonus).toBe(0);
  });

  it("harder difficulties produce higher scores at the same speed", () => {
    const easy = calculateScore(makeWonState("easy", 30_000));
    const hard = calculateScore(makeWonState("hard", 30_000));

    expect(hard.score).toBeGreaterThan(easy.score);
  });

  it("returns a non-empty rating string", () => {
    const result = calculateScore(makeWonState("easy", 60_000));
    expect(result.rating.length).toBeGreaterThan(0);
  });

  it("calculates time in seconds correctly", () => {
    const result = calculateScore(makeWonState("easy", 45_000));
    expect(result.timeSeconds).toBe(45);
  });
});
