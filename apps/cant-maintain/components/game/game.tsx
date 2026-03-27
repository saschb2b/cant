"use client";

import { Game as SharedGame, GameHeader } from "@cant/shared/components/game";
import type { ContentMapEntry } from "@cant/shared/components/game";
import type { Challenge } from "@/lib/game/types";
import { CATEGORY_LABELS } from "@/lib/game/categories";
import { useGame } from "@/lib/game/use-game";
import { generateSeed } from "@/lib/game/seeded-random";
import { CodePanel } from "./code-panel";
import { ExplanationPanel } from "./explanation-panel";
import { ResultsScreen } from "./results-screen";
import { LobbyScreen } from "./lobby-screen";

interface GameProps {
  challenges: Challenge[];
  contentMap: Record<string, ContentMapEntry>;
  defaultSeed?: string;
}

export function Game({ challenges, contentMap, defaultSeed }: GameProps) {
  return (
    <SharedGame
      challenges={challenges}
      contentMap={contentMap}
      defaultSeed={defaultSeed}
      promptText="Pick the better component API"
      categoryLabels={CATEGORY_LABELS as Record<string, string>}
      useGame={useGame}
      generateSeed={generateSeed}
      slots={{
        codePanel: CodePanel,
        lobby: LobbyScreen,
        results: ResultsScreen,
        explanation: ExplanationPanel,
        gameHeader: GameHeader,
      }}
    />
  );
}
