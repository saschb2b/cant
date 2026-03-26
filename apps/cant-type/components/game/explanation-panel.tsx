"use client";

import { ExplanationPanel as SharedExplanationPanel } from "@cant/shared/components/game/explanation-panel";
import type { ChallengeCategory } from "@/lib/game/types";
import { CATEGORY_LABELS } from "@/lib/learn/categories";

interface ExplanationPanelProps {
  isCorrect: boolean;
  explanationText: string;
  sourceUrl: string;
  sourceLabel: string;
  category: ChallengeCategory;
  challengeId: string;
}

export function ExplanationPanel(props: ExplanationPanelProps) {
  return (
    <SharedExplanationPanel
      {...props}
      categoryLabel={CATEGORY_LABELS[props.category]}
    />
  );
}
