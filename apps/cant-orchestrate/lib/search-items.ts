import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_SECTIONS,
} from "@/lib/learn/categories";
import { challenges } from "@/lib/learn/challenges";
import type { ChallengeCategory } from "@/lib/learn/types";

export interface SearchItem {
  type: "page" | "category" | "challenge";
  title: string;
  description: string;
  /** Optional secondary line (e.g. category + difficulty for challenges). */
  subtitle?: string;
  /** Per-item icon key (falls back to type-based icon when absent). */
  icon?: "learn";
  /** Challenge difficulty for color coding. */
  difficulty?: "easy" | "medium" | "hard";
  keywords: string[];
  href: string;
}

/** Section label for a given category (used as a keyword). */
function sectionFor(category: ChallengeCategory): string | undefined {
  return CATEGORY_SECTIONS.find((s) => s.categories.includes(category))?.label;
}

export const searchItems: SearchItem[] = [
  // Top-level pages
  {
    type: "page",
    title: "Dockerfile Explorer",
    description:
      "Paste a Dockerfile and see stages, layers, and best-practice checks",
    keywords: [
      "explorer",
      "dockerfile",
      "parse",
      "layers",
      "stages",
      "lint",
      "best practices",
      "multi-stage",
    ],
    href: "/explorer",
  },
  {
    type: "page",
    title: "Learn",
    description:
      "Browse all categories and study container orchestration patterns",
    icon: "learn",
    keywords: ["learn", "study", "patterns", "overview", "categories"],
    href: "/learn",
  },
  // One entry per category
  ...CATEGORY_ORDER.map((category) => ({
    type: "category" as const,
    title: CATEGORY_LABELS[category],
    description: CATEGORY_DESCRIPTIONS[category],
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
    subtitle: `${CATEGORY_LABELS[c.category]} · ${c.difficulty}`,
    difficulty: c.difficulty,
    keywords: extractCodeKeywords(c.goodCode, c.badCode),
    href: `/learn/${c.category}#${c.id}`,
  })),
];

/** Extract the first sentence (up to the first period, newline, or 120 chars). */
function firstSentence(text: string): string {
  const match = /^[^.\n]+[.]/.exec(text);
  if (match) return match[0];
  const line = text.split("\n")[0] ?? text;
  return line.length > 120 ? `${line.slice(0, 117)}...` : line;
}

/**
 * Pull identifiers out of code snippets so users can search by
 * directive names, Kubernetes kinds, Docker instructions, and other tokens.
 */
function extractCodeKeywords(goodCode: string, badCode: string): string[] {
  const identifierRe = /\b[a-zA-Z][a-zA-Z0-9-]{2,}\b/g;
  const all = `${goodCode} ${badCode}`;
  const matches = all.match(identifierRe) ?? [];

  const noise = new Set([
    "string",
    "number",
    "true",
    "false",
    "null",
    "name",
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "from",
    "run",
    "set",
    "get",
    "use",
    "echo",
    "env",
  ]);

  const unique = new Set<string>();
  for (const m of matches) {
    if (!noise.has(m)) unique.add(m);
  }
  return [...unique];
}
