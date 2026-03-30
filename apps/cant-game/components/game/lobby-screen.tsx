"use client";

import { LobbyScreen as SharedLobbyScreen } from "@cant/shared/components/game";
import { CantSeriesGrid } from "@cant/shared/components";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/learn/categories";
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

export type GameType = "daily" | "weekly" | "custom";

const config = {
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
};

const crossPromoSlot = (
  <CantSeriesGrid currentAppName="Can't Game" variant="compact" />
);

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
      config={config}
      slots={{ activityGraph: ActivityGraph }}
      crossPromoSlot={crossPromoSlot}
    />
  );
}
