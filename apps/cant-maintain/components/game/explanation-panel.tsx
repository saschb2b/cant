"use client";

import { ExplanationPanel as SharedExplanationPanel } from "@cant/shared/components/game/explanation-panel";
import type { ExplanationSlotProps } from "@cant/shared/components/game/game";
import { CATEGORY_LABELS } from "@/lib/game/categories";

export function ExplanationPanel(props: ExplanationSlotProps) {
  return (
    <SharedExplanationPanel
      {...props}
      categoryLabel={(CATEGORY_LABELS as Record<string, string>)[props.category] ?? props.category}
    />
  );
}
