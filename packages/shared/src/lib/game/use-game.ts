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

/**
 * Stable partition that moves already-completed challenges behind the rest.
 * Keeps completed challenges in the pool so difficulty tiers never dry out,
 * while unseen and not-yet-solved ones are picked first.
 */
export function prioritizeUncompleted<T extends BaseChallenge>(
  challenges: T[],
  completedIds: Set<string>,
): T[] {
  if (completedIds.size === 0) return challenges;
  return [
    ...challenges.filter((c) => !completedIds.has(c.id)),
    ...challenges.filter((c) => completedIds.has(c.id)),
  ];
}

function prepareChallenges<T extends BaseChallenge>(
  allChallenges: T[],
  rng: () => number,
  excludedCategories: Set<string>,
  completedIds: Set<string>,
  useAllChallenges = false,
): T[] {
  const pool =
    excludedCategories.size === 0
      ? allChallenges
      : allChallenges.filter((c) => !excludedCategories.has(c.category));

  // Screening mode: shuffle all challenges, randomize correctSide, no difficulty slicing
  if (useAllChallenges) {
    return shuffle(pool, rng).map((c) => ({
      ...c,
      correctSide: (rng() > 0.5 ? "left" : "right") satisfies "left" | "right",
    }));
  }

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
      prioritizeUncompleted(shuffle(cs, rng), completedIds)
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
  completedIds: Set<string>,
  useAllChallenges = false,
): GameState<T> {
  const rng = createRng(hashSeed(rawSeed));
  return {
    challenges: prepareChallenges(
      allChallenges,
      rng,
      excludedCategories,
      completedIds,
      useAllChallenges,
    ),
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answers: {},
    reviewIndex: null,
    isFinished: false,
    startedAt: Date.now(),
    finishedAt: null,
    thinkingTimeSec: 0,
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
  /** Records a challenge answer to local progress. Optional. */
  recordChallengeResult?: (challengeId: string, isCorrect: boolean) => void;
  /**
   * IDs of challenges already answered correctly, used to prioritize the
   * remaining ones in custom games. Optional. Daily and weekly games ignore
   * this so their rounds stay identical for every player.
   */
  getCompletedChallengeIds?: () => Set<string>;
}

/** Core game state hook. Handles scoring, progression, and answers. */
export function useGame<T extends BaseChallenge>(
  challengePool: T[],
  seed: string | null,
  callbacks: UseGameCallbacks,
  excludedCategories = new Set<string>(),
  retryKey = 0,
  gameType: "daily" | "weekly" | "custom" = "custom",
  /** When true, uses all challenges instead of the 10-per-session difficulty cap. */
  useAllChallenges = false,
) {
  const {
    trackEvent,
    recordGame,
    recordActivity,
    submitGameResult,
    encodeSeed,
    recordChallengeResult,
    getCompletedChallengeIds,
  } = callbacks;
  const [state, setState] = useState<GameState<T> | null>(null);
  const challengeShownAt = useRef(0);

  const didFireFinish = useRef(false);
  useEffect(() => {
    didFireFinish.current = false;
    if (seed) {
      // Only custom games are biased by local progress. Daily and weekly
      // seeds must produce the same round for everyone.
      const completedIds =
        gameType === "custom"
          ? (getCompletedChallengeIds?.() ?? new Set<string>())
          : new Set<string>();
      setState(
        createInitialState(
          challengePool,
          seed,
          excludedCategories,
          gameType,
          encodeSeed,
          completedIds,
          useAllChallenges,
        ),
      );
    } else setState(null);
  }, [
    challengePool,
    seed,
    excludedCategories,
    retryKey,
    gameType,
    encodeSeed,
    getCompletedChallengeIds,
    useAllChallenges,
  ]);

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
      if (!currentChallenge || currentAnswer) return;

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

      recordChallengeResult?.(challengeId, isCorrect);

      setState((prev) => {
        if (!prev || prev.answers[challengeId]) return prev;
        const newStreak = isCorrect ? prev.streak + 1 : 0;

        return {
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          thinkingTimeSec: prev.thinkingTimeSec + timeSec,
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
    [currentChallenge, currentAnswer, trackEvent, recordChallengeResult],
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
      durationSec: state.thinkingTimeSec,
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
      durationSec: state.thinkingTimeSec,
    });
  }, [state?.isFinished]);

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
