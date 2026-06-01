import { describe, it, expect } from "vitest";
import { computeRevealStats } from "./reveal-stats";
import type { ParticipantSnapshot } from "./events";
import type { Vote } from "./deck";

let counter = 0;

function voter(
  vote: Vote | null,
  overrides: Partial<ParticipantSnapshot> = {},
) {
  counter += 1;
  return {
    id: overrides.id ?? `p${String(counter)}`,
    name: overrides.name ?? `Voter ${String(counter)}`,
    hasVoted: vote !== null,
    vote,
    isSpectator: false,
    ...overrides,
  } satisfies ParticipantSnapshot;
}

describe("computeRevealStats", () => {
  it("returns an empty verdict when nobody has voted a numeric card", () => {
    const stats = computeRevealStats([voter(null), voter(null)]);
    expect(stats.verdict).toBe("empty");
    expect(stats.median).toBeNull();
    expect(stats.average).toBeNull();
    expect(stats.numericVoteCount).toBe(0);
    expect(stats.abstainCount).toBe(2);
  });

  it("treats a lone unsure vote as discuss, not empty", () => {
    const stats = computeRevealStats([voter("?"), voter(null)]);
    expect(stats.verdict).toBe("discuss");
    expect(stats.unsureCount).toBe(1);
    expect(stats.abstainCount).toBe(1);
    expect(stats.numericVoteCount).toBe(0);
  });

  it("reports consensus when every numeric vote matches", () => {
    const stats = computeRevealStats([voter("5"), voter("5"), voter("5")]);
    expect(stats.verdict).toBe("consensus");
    expect(stats.median).toBe(5);
    expect(stats.average).toBe(5);
    expect(stats.min).toBe(5);
    expect(stats.max).toBe(5);
    expect(stats.highVoterIds).toEqual([]);
    expect(stats.lowVoterIds).toEqual([]);
  });

  it("reports close when votes are one deck step apart", () => {
    // 3 and 5 are adjacent on the deck (0,1,2,3,5,8,...).
    const stats = computeRevealStats([voter("3"), voter("5")]);
    expect(stats.verdict).toBe("close");
    expect(stats.highVoterIds).toEqual([]);
    expect(stats.lowVoterIds).toEqual([]);
  });

  it("reports discuss and flags high/low voters when the spread is wide", () => {
    const stats = computeRevealStats([
      voter("1", { id: "low" }),
      voter("8", { id: "high" }),
      voter("8", { id: "high2" }),
    ]);
    expect(stats.verdict).toBe("discuss");
    expect(stats.min).toBe(1);
    expect(stats.max).toBe(8);
    expect(stats.lowVoterIds).toEqual(["low"]);
    expect(stats.highVoterIds).toEqual(["high", "high2"]);
  });

  it("downgrades to discuss when anyone is unsure, even on a tight numeric spread", () => {
    const stats = computeRevealStats([voter("5"), voter("5"), voter("?")]);
    expect(stats.verdict).toBe("discuss");
    expect(stats.unsureCount).toBe(1);
    // min === max, so no one is singled out as high/low.
    expect(stats.highVoterIds).toEqual([]);
    expect(stats.lowVoterIds).toEqual([]);
  });

  it("computes the median for an odd count", () => {
    const stats = computeRevealStats([voter("2"), voter("3"), voter("8")]);
    expect(stats.median).toBe(3);
  });

  it("averages the two middle values for an even count", () => {
    const stats = computeRevealStats([
      voter("2"),
      voter("3"),
      voter("5"),
      voter("8"),
    ]);
    expect(stats.median).toBe(4); // (3 + 5) / 2
    expect(stats.average).toBe(4.5); // (2 + 3 + 5 + 8) / 4
  });

  it("excludes spectators from every tally", () => {
    const stats = computeRevealStats([
      voter("5"),
      voter("13", { id: "spec", isSpectator: true }),
    ]);
    expect(stats.numericVoteCount).toBe(1);
    expect(stats.verdict).toBe("consensus");
    expect(stats.max).toBe(5);
    expect(stats.distribution).toEqual([{ value: "5", count: 1 }]);
  });

  it("counts unsure and coffee votes without letting them affect the numbers", () => {
    const stats = computeRevealStats([
      voter("5"),
      voter("8"),
      voter("?"),
      voter("coffee"),
    ]);
    expect(stats.unsureCount).toBe(1);
    expect(stats.coffeeCount).toBe(1);
    expect(stats.numericVoteCount).toBe(2);
    expect(stats.average).toBe(6.5);
  });

  it("orders the distribution by deck order and omits abstentions", () => {
    const stats = computeRevealStats([
      voter("8"),
      voter("2"),
      voter("2"),
      voter("coffee"),
      voter(null),
    ]);
    expect(stats.distribution).toEqual([
      { value: "2", count: 2 },
      { value: "8", count: 1 },
      { value: "coffee", count: 1 },
    ]);
  });
});
