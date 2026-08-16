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
import { recordAnswer } from "./progress";
import type { Challenge } from "@/lib/learn/types";

/** Core game state hook. Handles scoring, progression, and answers. */
export function useGame(
  challengePool: Challenge[],
  seed: string | null,
  excludedCategories = new Set<string>(),
  retryKey = 0,
  gameType: "daily" | "weekly" | "custom" = "custom",
) {
  const callbacks = useMemo<UseGameCallbacks>(
    () => ({
      trackEvent,
      recordGame,
      recordActivity,
      submitGameResult,
      encodeSeed,
      recordChallengeResult: recordAnswer,
    }),
    [],
  );

  return useGameShared(
    challengePool,
    seed,
    callbacks,
    excludedCategories,
    retryKey,
    gameType,
  );
}
