import type { HuntState } from "./types";

export interface ScoreResult {
  score: number;
  timeSeconds: number;
  timeBonus: number;
  difficultyMultiplier: number;
  rating: string;
}

const DIFFICULTY_MULTIPLIER = {
  easy: 1,
  medium: 2,
  hard: 3,
} as const;

/** Calculate the final score for a won game. */
export function calculateScore(state: HuntState): ScoreResult {
  const multiplier = DIFFICULTY_MULTIPLIER[state.difficulty];
  const timeSeconds =
    state.startedAt && state.finishedAt
      ? Math.round((state.finishedAt - state.startedAt) / 1000)
      : 0;

  // Base score: 100 points per bug found (all bugs if won)
  const baseScore = state.config.bugCount * 100;

  // Time bonus: starts at 500, decreases by 1 per second, min 0
  const timeBonus = Math.max(0, 500 - timeSeconds);

  const score = (baseScore + timeBonus) * multiplier;

  return {
    score,
    timeSeconds,
    timeBonus,
    difficultyMultiplier: multiplier,
    rating: getRating(score, state.difficulty),
  };
}

function getRating(score: number, difficulty: string): string {
  if (difficulty === "hard") {
    if (score >= 4000) return "Principal Test Architect";
    if (score >= 3000) return "Senior SDET";
    return "Staff QA";
  }
  if (difficulty === "medium") {
    if (score >= 2500) return "Senior SDET";
    if (score >= 1500) return "QA Engineer";
    return "Test Apprentice";
  }
  if (score >= 1200) return "QA Engineer";
  if (score >= 800) return "Test Apprentice";
  return "Junior QA";
}
