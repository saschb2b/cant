"use client";
import { LearnSidebar as SharedLearnSidebar } from "@cant/shared/components";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/game/categories";

export function LearnSidebar() {
  return (
    <SharedLearnSidebar
      sections={CATEGORY_SECTIONS}
      categoryLabels={CATEGORY_LABELS}
    />
  );
}
