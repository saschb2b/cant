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
import type { Challenge } from "./types";

/** Core game state hook. Handles scoring, progression, and answers. */
export function useGame(
  challengePool: Challenge[],
  seed: string | null,
  excludedCategories: Set<string> = new Set<string>(),
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
