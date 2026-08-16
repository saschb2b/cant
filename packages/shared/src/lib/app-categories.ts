import { APP_CATALOG, type AppSlug, type CategorySection } from "./app-catalog";

/** The union of category slugs an app declares in the catalog. */
export type CategorySlug<S extends AppSlug> =
  (typeof APP_CATALOG)[S]["categories"][number]["slug"];

/**
 * Derive an app's category exports from the shared catalog, which is the
 * single source of truth for slugs, labels, descriptions, grouping, and the
 * recommended learning path.
 *
 * ```ts
 * // lib/learn/categories.ts
 * export const {
 *   CATEGORY_ORDER,
 *   CATEGORY_LABELS,
 *   CATEGORY_SECTIONS,
 *   LEARNING_PATH,
 *   CATEGORY_DESCRIPTIONS,
 * } = createAppCategories("cant-resize");
 * ```
 *
 * The record types stay keyed by the app's own slug union, so exhaustiveness
 * checks over categories keep working at each call site.
 */
export function createAppCategories<S extends AppSlug>(slug: S) {
  const entry = APP_CATALOG[slug];
  type Category = CategorySlug<S>;

  return {
    /** Canonical display order of challenge categories. */
    CATEGORY_ORDER: entry.categories.map((c) => c.slug) as Category[],

    /** Human-readable labels for each challenge category. */
    CATEGORY_LABELS: Object.fromEntries(
      entry.categories.map((c) => [c.slug, c.label]),
    ) as Record<Category, string>,

    /** Logical grouping of categories for sidebar navigation. */
    CATEGORY_SECTIONS: entry.sections.map((s) => ({
      label: s.label,
      categories: [...s.categories],
    })) as CategorySection<Category>[],

    /** Recommended category order for newcomers starting from scratch. */
    LEARNING_PATH: [...entry.learningPath] as Category[],

    /** Short description for each category, shown on the learn overview. */
    CATEGORY_DESCRIPTIONS: Object.fromEntries(
      entry.categories.map((c) => [c.slug, c.description]),
    ) as Record<Category, string>,
  };
}
