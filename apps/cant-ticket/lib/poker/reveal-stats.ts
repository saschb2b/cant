import { DECK, type Vote } from "./deck";
import type { ParticipantSnapshot } from "./events";

export type Verdict = "consensus" | "close" | "discuss" | "empty";

export interface RevealStats {
  verdict: Verdict;
  median: number | null;
  average: number | null;
  min: number | null;
  max: number | null;
  numericVoteCount: number;
  unsureCount: number;
  coffeeCount: number;
  abstainCount: number;
  highVoterIds: string[];
  lowVoterIds: string[];
  distribution: { value: Vote; count: number }[];
}

const NUMERIC_DECK: readonly number[] = DECK.filter((v) => {
  if (v === "?" || v === "coffee") return false;
  return Number.isFinite(Number(v));
}).map((v) => Number(v));

function deckIndexOf(n: number): number {
  return NUMERIC_DECK.indexOf(n);
}

function parseNumeric(vote: Vote | null): number | null {
  if (vote === null || vote === "?" || vote === "coffee") return null;
  const n = Number(vote);
  return Number.isFinite(n) ? n : null;
}

export function computeRevealStats(
  participants: ParticipantSnapshot[],
): RevealStats {
  const voters = participants.filter((p) => !p.isSpectator);
  const numericVoters: { id: string; value: number }[] = [];
  let unsureCount = 0;
  let coffeeCount = 0;
  let abstainCount = 0;

  for (const p of voters) {
    if (p.vote === "?") {
      unsureCount += 1;
    } else if (p.vote === "coffee") {
      coffeeCount += 1;
    } else if (p.vote === null) {
      abstainCount += 1;
    } else {
      const n = parseNumeric(p.vote);
      if (n !== null) numericVoters.push({ id: p.id, value: n });
    }
  }

  const counts = new Map<Vote, number>();
  for (const p of voters) {
    if (p.vote === null) continue;
    counts.set(p.vote, (counts.get(p.vote) ?? 0) + 1);
  }
  const distribution = DECK.filter((v) => counts.has(v)).map((v) => ({
    value: v,
    count: counts.get(v) ?? 0,
  }));

  if (numericVoters.length === 0) {
    return {
      verdict: unsureCount > 0 ? "discuss" : "empty",
      median: null,
      average: null,
      min: null,
      max: null,
      numericVoteCount: 0,
      unsureCount,
      coffeeCount,
      abstainCount,
      highVoterIds: [],
      lowVoterIds: [],
      distribution,
    };
  }

  const sorted = [...numericVoters].sort((a, b) => a.value - b.value);
  const min = sorted[0]?.value ?? 0;
  const max = sorted[sorted.length - 1]?.value ?? 0;
  const sum = numericVoters.reduce((acc, v) => acc + v.value, 0);
  const average = sum / numericVoters.length;

  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 1
      ? (sorted[mid]?.value ?? 0)
      : ((sorted[mid - 1]?.value ?? 0) + (sorted[mid]?.value ?? 0)) / 2;

  const stepSpread =
    min === max ? 0 : Math.abs(deckIndexOf(max) - deckIndexOf(min));

  let verdict: Verdict;
  if (unsureCount > 0) {
    verdict = "discuss";
  } else if (stepSpread === 0) {
    verdict = "consensus";
  } else if (stepSpread === 1) {
    verdict = "close";
  } else {
    verdict = "discuss";
  }

  const highVoterIds =
    verdict === "discuss" && min !== max
      ? numericVoters.filter((v) => v.value === max).map((v) => v.id)
      : [];
  const lowVoterIds =
    verdict === "discuss" && min !== max
      ? numericVoters.filter((v) => v.value === min).map((v) => v.id)
      : [];

  return {
    verdict,
    median,
    average,
    min,
    max,
    numericVoteCount: numericVoters.length,
    unsureCount,
    coffeeCount,
    abstainCount,
    highVoterIds,
    lowVoterIds,
    distribution,
  };
}
