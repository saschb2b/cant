import type { BaseChallenge } from "./game/types";

export interface SearchItem {
  type: "page" | "category" | "challenge";
  title: string;
  description: string;
  /** Optional secondary line (e.g. category + difficulty for challenges). */
  subtitle?: string;
  /** Per-item icon key (falls back to type-based icon when absent). */
  icon?: string;
  /** Challenge difficulty for color coding. */
  difficulty?: "easy" | "medium" | "hard";
  keywords: string[];
  href: string;
}

/** Extract the first sentence (up to the first period, newline, or 120 chars). */
export function firstSentence(text: string): string {
  const match = /^[^.\n]+[.]/.exec(text);
  if (match) return match[0];
  const line = text.split("\n")[0] ?? text;
  return line.length > 120 ? `${line.slice(0, 117)}...` : line;
}

const BASE_NOISE = new Set([
  "string",
  "number",
  "boolean",
  "void",
  "null",
  "undefined",
  "true",
  "false",
  "interface",
  "type",
  "export",
  "import",
  "from",
  "const",
  "function",
  "return",
  "React",
  "ReactNode",
  "children",
  "Props",
  "props",
  "extends",
  "div",
  "span",
  "button",
]);

/**
 * Pull identifiers out of code snippets so users can search by
 * prop names, type names, CSS properties, and other tokens.
 *
 * Apps can pass extra domain-specific noise words to exclude.
 */
export function extractCodeKeywords(
  left: string,
  right: string,
  extraNoise?: Set<string>,
): string[] {
  const identifierRe = /\b[a-zA-Z][a-zA-Z0-9-]{2,}\b/g;
  const all = `${left} ${right}`;
  const matches = all.match(identifierRe) ?? [];

  const unique = new Set<string>();
  for (const m of matches) {
    if (!BASE_NOISE.has(m) && !extraNoise?.has(m)) unique.add(m);
  }
  return [...unique];
}

interface SearchItemsConfig {
  /** App-specific top-level page items (Play, Learn, Viewer, Changelog, etc.) */
  pages: SearchItem[];
  /** All challenges. */
  challenges: BaseChallenge[];
  /** Category order array. */
  categoryOrder: string[];
  /** Category labels map. */
  categoryLabels: Record<string, string>;
  /** Category descriptions map. */
  categoryDescriptions: Record<string, string>;
  /** Category sections (for section keyword). */
  categorySections: { label: string; categories: string[] }[];
  /** Extra noise words to exclude from code keyword extraction. */
  extraNoise?: Set<string>;
}

/**
 * Build the full search-items array for an app.
 *
 * Combines top-level pages, one entry per category, and one entry per
 * challenge (with code keyword extraction for code-type challenges).
 */
export function buildSearchItems(config: SearchItemsConfig): SearchItem[] {
  const {
    pages,
    challenges,
    categoryOrder,
    categoryLabels,
    categoryDescriptions,
    categorySections,
    extraNoise,
  } = config;

  function sectionFor(category: string): string | undefined {
    return categorySections.find((s) => s.categories.includes(category))?.label;
  }

  return [
    // Top-level pages as-is
    ...pages,

    // One entry per category
    ...categoryOrder.map((category) => ({
      type: "category" as const,
      title: categoryLabels[category] ?? category,
      description: categoryDescriptions[category] ?? "",
      keywords: [category, sectionFor(category), "learn", "pattern"].filter(
        Boolean,
      ) as string[],
      href: `/learn/${category}`,
    })),

    // Individual challenges, searchable by title and code snippets
    ...challenges.map((c) => ({
      type: "challenge" as const,
      title: c.title,
      description: firstSentence(c.explanationCorrect),
      subtitle: `${categoryLabels[c.category] ?? c.category} · ${c.difficulty}`,
      difficulty: c.difficulty,
      keywords:
        c.content.type === "code"
          ? extractCodeKeywords(c.content.left, c.content.right, extraNoise)
          : [],
      href: `/learn/${c.category}#${c.id}`,
    })),
  ];
}
