import {
  APP_CATALOG,
  type CategorySection,
} from "@cant/shared/lib/app-catalog";
import type { ChallengeCategory } from "./types";

const entry = APP_CATALOG["cant-seo"];

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER = entry.categories.map((c) => c.slug);

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS = Object.fromEntries(
  entry.categories.map((c) => [c.slug, c.label]),
) as Record<ChallengeCategory, string>;

/** Logical grouping of categories for sidebar navigation. */
export const CATEGORY_SECTIONS = entry.sections.map((s) => ({
  label: s.label,
  categories: [...s.categories],
})) as CategorySection<ChallengeCategory>[];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH = [...entry.learningPath] as ChallengeCategory[];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS = Object.fromEntries(
  entry.categories.map((c) => [c.slug, c.description]),
) as Record<ChallengeCategory, string>;

export type { CategorySection };
