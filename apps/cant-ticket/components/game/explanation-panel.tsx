"use client";

import { ExplanationPanel as SharedExplanationPanel } from "@cant/shared/components/game";
import type { ExplanationSlotProps } from "@cant/shared/components/game";

export function ExplanationPanel(props: ExplanationSlotProps) {
  return <SharedExplanationPanel {...props} />;
}
