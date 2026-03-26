"use client";

import { Game as SharedGame } from "@cant/shared/components/game/game";
import type { Challenge } from "@/lib/game/types";
import { CATEGORY_LABELS } from "@/lib/game/categories";
import { useGame } from "@/lib/game/use-game";
import { generateSeed } from "@/lib/game/seeded-random";
import { GameHeader } from "@cant/shared/components/game/game-header";
import { CodePanel } from "./code-panel";
import { ExplanationPanel } from "./explanation-panel";
import { ResultsScreen } from "./results-screen";
import { LobbyScreen } from "./lobby-screen";

interface GameProps {
  challenges: Challenge[];
  highlightMap: Record<string, { goodHtml: string; badHtml: string }>;
  defaultSeed?: string;
}

export function Game({ challenges, highlightMap, defaultSeed }: GameProps) {
  return (
    <SharedGame
      challenges={challenges}
      highlightMap={highlightMap}
      defaultSeed={defaultSeed}
      promptText="Pick the better component API"
      categoryLabels={CATEGORY_LABELS as Record<string, string>}
      useGame={useGame}
      generateSeed={generateSeed}
      CodePanelComponent={CodePanel}
      LobbyComponent={LobbyScreen}
      ResultsComponent={ResultsScreen}
      ExplanationComponent={ExplanationPanel}
      GameHeaderComponent={GameHeader}
    />
  );
}
