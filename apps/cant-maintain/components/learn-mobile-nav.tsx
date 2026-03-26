"use client";
import { LearnMobileNav as SharedLearnMobileNav } from "@cant/shared/components/learn-mobile-nav";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/game/categories";

export function LearnMobileNav() {
  return (
    <SharedLearnMobileNav
      sections={CATEGORY_SECTIONS}
      categoryLabels={CATEGORY_LABELS}
    />
  );
}
