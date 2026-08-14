"use client";

import {
  Game as SharedGame,
  GameHeader,
  CodePanel,
  ExplanationPanel,
} from "@cant/shared/components/game";
import type { ContentMapEntry } from "@cant/shared/components/game";
import { useGame } from "@/lib/game/use-game";
import { generateSeed } from "@/lib/game/seeded-random";
import { getCompletedIds } from "@/lib/game/progress";
import { CATEGORY_LABELS } from "@/lib/learn/categories";
import { MoleculePanel } from "./molecule-panel";
import { VisualPanelWrapper } from "./visual-panel";
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
      categoryLabels={CATEGORY_LABELS}
      githubUrl="https://github.com/saschb2b/cant"
      useGame={useGame}
      generateSeed={generateSeed}
      getCompletedChallengeIds={getCompletedIds}
      slots={{
        codePanel: CodePanel,
        moleculePanel: MoleculePanel,
        visualPanel: VisualPanelWrapper,
        lobby: LobbyScreen,
        results: ResultsScreen,
        explanation: ExplanationPanel,
        gameHeader: GameHeader,
      }}
    />
  );
}
