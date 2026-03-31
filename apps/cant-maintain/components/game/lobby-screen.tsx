"use client";

import { LobbyScreen as SharedLobbyScreen } from "@cant/shared/components/game";
import type { GameType } from "@cant/shared/components/game";
import { CantSeriesGrid } from "@cant/shared/components";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/game/categories";
import {
  decodeSeed,
  generateSeed,
  seedFromKey,
  getTodayKey,
  getWeekKey,
} from "@/lib/game/seeded-random";
import {
  getHistory,
  getEntryBySeed,
  formatRelativeDate,
} from "@/lib/game/history";
import { ActivityGraph } from "./activity-graph";

export type { GameType };

interface LobbyScreenProps {
  onStart: (
    rawSeed: string,
    excludedCategories: Set<string>,
    gameType: GameType,
  ) => void;
  defaultSeed?: string;
  defaultExcluded?: Set<string>;
}

export function LobbyScreen(props: LobbyScreenProps) {
  return (
    <SharedLobbyScreen
      {...props}
      config={{
        categorySections: CATEGORY_SECTIONS,
        categoryLabels: CATEGORY_LABELS,
        gameUtils: {
          decodeSeed,
          generateSeed,
          seedFromKey,
          getTodayKey,
          getWeekKey,
          getHistory,
          getEntryBySeed,
          formatRelativeDate,
        },
      }}
      slots={{ activityGraph: ActivityGraph }}
      crossPromoSlot={
        <CantSeriesGrid currentAppName="Can't Maintain" variant="compact" />
      }
    />
  );
}
