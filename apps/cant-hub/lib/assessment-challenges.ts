import "server-only";
import type { BaseChallenge } from "@cant/shared/lib/game";
import { type AppSlug, APP_CATALOG } from "@cant/shared/lib/app-catalog";
import type { AssessmentCategory } from "./assessments";

/**
 * Dynamically import challenges for an app slug.
 * Each app's challenges barrel is at @cant/shared/lib/challenges/{app}.
 */
async function loadAppChallenges(appSlug: string): Promise<BaseChallenge[]> {
  const importMap: Record<
    string,
    () => Promise<{ challenges: BaseChallenge[] }>
  > = {
    "cant-maintain": () => import("@cant/shared/lib/challenges/cant-maintain"),
    "cant-resize": () => import("@cant/shared/lib/challenges/cant-resize"),
    "cant-type": () => import("@cant/shared/lib/challenges/cant-type"),
    "cant-orchestrate": () =>
      import("@cant/shared/lib/challenges/cant-orchestrate"),
    "cant-seo": () => import("@cant/shared/lib/challenges/cant-seo"),
    "cant-ux": () => import("@cant/shared/lib/challenges/cant-ux"),
    "cant-explode": () => import("@cant/shared/lib/challenges/cant-explode"),
    "cant-branch": () => import("@cant/shared/lib/challenges/cant-branch"),
    "cant-query": () => import("@cant/shared/lib/challenges/cant-query"),
    "cant-test": () => import("@cant/shared/lib/challenges/cant-test"),
    "cant-game": () => import("@cant/shared/lib/challenges/cant-game"),
    "cant-ticket": () => import("@cant/shared/lib/challenges/cant-ticket"),
  };

  const loader = importMap[appSlug];
  if (!loader) return [];
  const mod = await loader();
  return mod.challenges;
}

/**
 * Seeded pseudo-random shuffle (Fisher-Yates).
 */
function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  for (let i = result.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) | 0;
    const j = (hash >>> 0) % (i + 1);
    const temp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = temp;
  }
  return result;
}

/**
 * Load all challenges for an assessment's selected categories,
 * filtered and shuffled with the given seed.
 */
export async function getAssessmentChallenges(
  categories: AssessmentCategory[],
  seed: string,
  totalLimit?: number | null,
): Promise<BaseChallenge[]> {
  // Group categories by app to avoid loading the same app twice
  const byApp = new Map<string, AssessmentCategory[]>();
  for (const cat of categories) {
    const existing = byApp.get(cat.appSlug);
    if (existing) {
      existing.push(cat);
    } else {
      byApp.set(cat.appSlug, [cat]);
    }
  }

  const allChallenges: BaseChallenge[] = [];

  for (const [appSlug, cats] of byApp) {
    const appChallenges = await loadAppChallenges(appSlug);
    const selectedSlugs = new Set(cats.map((c) => c.categorySlug));

    // Filter to selected categories
    let filtered = appChallenges.filter((c) => selectedSlugs.has(c.category));

    // Apply per-category question count limits if set
    for (const cat of cats) {
      if (cat.questionCount != null) {
        const catChallenges = filtered.filter(
          (c) => c.category === cat.categorySlug,
        );
        if (catChallenges.length > cat.questionCount) {
          const shuffled = seededShuffle(
            catChallenges,
            `${seed}-${cat.categorySlug}`,
          );
          const keep = new Set(
            shuffled.slice(0, cat.questionCount).map((c) => c.id),
          );
          filtered = filtered.filter(
            (c) => c.category !== cat.categorySlug || keep.has(c.id),
          );
        }
      }
    }

    allChallenges.push(...filtered);
  }

  const shuffled = seededShuffle(allChallenges, seed);
  if (totalLimit != null && totalLimit > 0 && totalLimit < shuffled.length) {
    return shuffled.slice(0, totalLimit);
  }
  return shuffled;
}

/**
 * Count total questions for an assessment's categories.
 */
export function countAssessmentQuestions(
  categories: AssessmentCategory[],
): number {
  let total = 0;
  for (const cat of categories) {
    if (cat.questionCount != null) {
      total += cat.questionCount;
    } else {
      const entry = APP_CATALOG[cat.appSlug as AppSlug];
      const meta = entry.categories.find((c) => c.slug === cat.categorySlug);
      total += meta?.questionCount ?? 0;
    }
  }
  return total;
}
