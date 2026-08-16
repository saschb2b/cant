"use client";
import { LearnMobileNav as SharedLearnMobileNav } from "@cant/shared/components";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/learn/categories";

export function LearnMobileNav() {
  return (
    <SharedLearnMobileNav
      sections={CATEGORY_SECTIONS}
      categoryLabels={CATEGORY_LABELS}
    />
  );
}
