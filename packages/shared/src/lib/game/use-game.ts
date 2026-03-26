"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BaseChallenge, Difficulty, GameState } from "./types";
import { createRng, hashSeed } from "./seeded-random";

/** Fisher-Yates shuffle (immutable) using a provided RNG. */
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    // Indices i and j are guaranteed to be in bounds by the loop and Math.floor
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const temp = a[i]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    a[i] = a[j]!;
    a[j] = temp;
  }
  return a;
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

/** How many challenges per difficulty tier in a single session. */
const SESSION_PICKS: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 3,
};

function prepareChallenges<T extends BaseChallenge>(
  allChallenges: T[],
  rng: () => number,
  excludedCategories: Set<string>,
): T[] {
  const pool =
    excludedCategories.size === 0
      ? allChallenges
      : allChallenges.filter((c) => !excludedCategories.has(c.category));
  const byDifficulty = pool.reduce<Record<Difficulty, T[]>>(
    (acc, c) => {
      acc[c.difficulty].push(c);
      return acc;
    },
    { easy: [], medium: [], hard: [] },
  );

  return (Object.entries(byDifficulty) as [Difficulty, T[]][])
    .sort(([a], [b]) => DIFFICULTY_ORDER[a] - DIFFICULTY_ORDER[b])
    .flatMap(([, cs]) =>
      shuffle(cs, rng)
        .slice(0, SESSION_PICKS[cs[0]?.difficulty ?? "medium"])
        .map((c) => ({
          ...c,
          correctSide: (rng() > 0.5 ? "left" : "right") satisfies
            | "left"
            | "right",
        })),
    );
}

function createInitialState<T extends BaseChallenge>(
  allChallenges: T[],
  rawSeed: string,
  excludedCategories: Set<string>,
  gameType: "daily" | "weekly" | "custom",
  encodeSeed: (raw: string, excluded: Set<string>) => string,
): GameState<T> {
  const rng = createRng(hashSeed(rawSeed));
  return {
    challenges: prepareChallenges(allChallenges, rng, excludedCategories),
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answers: {},
    reviewIndex: null,
    isFinished: false,
    startedAt: Date.now(),
    finishedAt: null,
    seed: encodeSeed(rawSeed, excludedCategories),
    gameType,
  };
}

/** Side-effect callbacks injected by each app. */
export interface UseGameCallbacks {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackEvent: (...args: any[]) => void;
  recordGame: (
    seed: string,
    score: number,
    total: number,
    bestStreak: number,
  ) => void;
  recordActivity: () => void;
  submitGameResult: (data: {
    sessionId: string;
    score: number;
    total: number;
    bestStreak: number;
    durationSec: number;
  }) => void | Promise<void>;
  encodeSeed: (rawSeed: string, excludedCategories: Set<string>) => string;
}

/** Core game state hook. Handles scoring, progression, and answers. */
export function useGame<T extends BaseChallenge>(
  challengePool: T[],
  seed: string | null,
  callbacks: UseGameCallbacks,
  excludedCategories = new Set<string>(),
  retryKey = 0,
  gameType: "daily" | "weekly" | "custom" = "custom",
) {
  const {
    trackEvent,
    recordGame,
    recordActivity,
    submitGameResult,
    encodeSeed,
  } = callbacks;
  const [state, setState] = useState<GameState<T> | null>(null);
  const challengeShownAt = useRef(0);

  const didFireFinish = useRef(false);
  useEffect(() => {
    didFireFinish.current = false;
    if (seed)
      setState(
        createInitialState(
          challengePool,
          seed,
          excludedCategories,
          gameType,
          encodeSeed,
        ),
      );
    else setState(null);
  }, [challengePool, seed, excludedCategories, retryKey, gameType, encodeSeed]);

  useEffect(() => {
    challengeShownAt.current = Date.now();
  }, [state?.currentIndex]);

  const currentChallenge = useMemo(
    () => state?.challenges[state.currentIndex] ?? null,
    [state],
  );

  const totalChallenges = state?.challenges.length ?? 0;

  const currentDifficulty: Difficulty | null =
    currentChallenge?.difficulty ?? null;

  const currentAnswer =
    currentChallenge && state
      ? (state.answers[currentChallenge.id] ?? null)
      : null;

  const isReviewing = state?.reviewIndex != null;

  const displayChallenge = useMemo(() => {
    if (state?.reviewIndex != null) {
      return state.challenges[state.reviewIndex] ?? null;
    }
    return currentChallenge;
  }, [state, currentChallenge]);

  const displayAnswer = useMemo(() => {
    if (!displayChallenge || !state) return null;
    return state.answers[displayChallenge.id] ?? null;
  }, [displayChallenge, state]);

  const submitAnswer = useCallback(
    (side: "left" | "right") => {
      if (!currentChallenge) return;

      const challengeId = currentChallenge.id;
      const correctSide = currentChallenge.correctSide;
      const category = currentChallenge.category;
      const difficulty = currentChallenge.difficulty;
      const timeSec = Math.round(
        (Date.now() - challengeShownAt.current) / 1000,
      );

      const isCorrect = side === correctSide;

      trackEvent("challenge-answered", {
        challengeId,
        category,
        difficulty,
        result: isCorrect ? "correct" : "wrong",
        timeSec,
      });

      setState((prev) => {
        if (!prev || prev.answers[challengeId]) return prev;
        const newStreak = isCorrect ? prev.streak + 1 : 0;

        return {
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          answers: {
            ...prev.answers,
            [challengeId]: {
              result: isCorrect ? "correct" : "wrong",
              side,
            },
          },
        };
      });
    },
    [currentChallenge, trackEvent],
  );

  const goToNext = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.challenges.length) {
        return {
          ...prev,
          reviewIndex: null,
          isFinished: true,
          finishedAt: Date.now(),
        };
      }
      return { ...prev, reviewIndex: null, currentIndex: nextIndex };
    });
  }, []);

  useEffect(() => {
    if (!state?.isFinished || !state.finishedAt || didFireFinish.current)
      return;
    didFireFinish.current = true;
    trackEvent("game-finished", {
      score: state.score,
      total: state.challenges.length,
      bestStreak: state.bestStreak,
      durationSec: Math.round((state.finishedAt - state.startedAt) / 1000),
      seed: state.seed,
      gameType: state.gameType,
    });
    recordGame(
      state.seed,
      state.score,
      state.challenges.length,
      state.bestStreak,
    );
    recordActivity();
    void submitGameResult({
      sessionId: `${state.seed}-${String(state.startedAt)}`,
      score: state.score,
      total: state.challenges.length,
      bestStreak: state.bestStreak,
      durationSec: Math.round((state.finishedAt - state.startedAt) / 1000),
    });
  }, [state?.isFinished]); // eslint-disable-line react-hooks/exhaustive-deps

  const restartGame = useCallback(() => {
    if (state) {
      trackEvent("game-restarted", {
        previousScore: state.score,
        previousTotal: state.challenges.length,
      });
    }
  }, [state, trackEvent]);

  const reviewQuestion = useCallback((index: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const challenge = prev.challenges[index];
      if (!challenge || !prev.answers[challenge.id]) return prev;
      return { ...prev, reviewIndex: index };
    });
  }, []);

  const exitReview = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      return { ...prev, reviewIndex: null };
    });
  }, []);

  return {
    state,
    currentChallenge,
    currentAnswer,
    currentDifficulty,
    totalChallenges,
    isReviewing,
    displayChallenge,
    displayAnswer,
    submitAnswer,
    goToNext,
    restartGame,
    reviewQuestion,
    exitReview,
  };
}
