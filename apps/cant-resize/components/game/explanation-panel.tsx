"use client";

import { ExplanationPanel as SharedExplanationPanel } from "@cant/shared/components/game/explanation-panel";
import type { ExplanationSlotProps } from "@cant/shared/components/game/game";

export function ExplanationPanel(props: ExplanationSlotProps) {
  return <SharedExplanationPanel {...props} />;
}
