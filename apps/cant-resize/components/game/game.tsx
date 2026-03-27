"use client";

import { Game as SharedGame } from "@cant/shared/components/game/game";
import type { ContentMapEntry } from "@cant/shared/components/game/game";
import { GameHeader } from "@cant/shared/components/game/game-header";
import { useGame } from "@/lib/game/use-game";
import { generateSeed } from "@/lib/game/seeded-random";
import { CATEGORY_LABELS } from "@/lib/learn/categories";
import { CodePanel } from "./code-panel";
import { ExplanationPanel } from "./explanation-panel";
import { ResultsScreen } from "./results-screen";
import { LobbyScreen } from "./lobby-screen";
import type { Challenge } from "@/lib/game/types";

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
      promptText="Pick the better responsive pattern"
      categoryLabels={CATEGORY_LABELS}
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
