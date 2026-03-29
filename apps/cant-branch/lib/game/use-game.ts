"use client";

import { useMemo } from "react";
import {
  useGame as useGameShared,
  type UseGameCallbacks,
} from "@cant/shared/lib/game";
import { trackEvent } from "../analytics";
import { recordGame } from "./history";
import { recordActivity } from "./activity";
import { submitGameResult } from "./actions";
import { encodeSeed } from "./seeded-random";
import type { Challenge, GameState } from "./types";

/** Core game state hook. Handles scoring, progression, and answers. */
export function useGame(
  challengePool: Challenge[],
  seed: string | null,
  excludedCategories = new Set<string>(),
  retryKey = 0,
  gameType: "daily" | "weekly" | "custom" = "custom",
) {
  const callbacks: UseGameCallbacks = useMemo(
    () => ({
      trackEvent: trackEvent as UseGameCallbacks["trackEvent"],
      recordGame,
      recordActivity,
      submitGameResult,
      encodeSeed,
    }),
    [],
  );

  const result = useGameShared(
    challengePool,
    seed,
    callbacks,
    excludedCategories,
    retryKey,
    gameType,
  );

  // The shared hook types state/challenges as BaseChallenge, but we know they
  // are the app-specific Challenge type that was passed in.
  return result as typeof result & {
    state: GameState | null;
    currentChallenge: Challenge | null;
    displayChallenge: Challenge | null;
  };
}
