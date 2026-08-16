import { createAppCategories } from "@cant/shared/lib/app-categories";

export const {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_SECTIONS,
  LEARNING_PATH,
  CATEGORY_DESCRIPTIONS,
} = createAppCategories("cant-orchestrate");

export type { CategorySection } from "@cant/shared/lib/app-catalog";
