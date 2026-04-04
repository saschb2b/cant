import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_SECTIONS,
} from "@/lib/learn/categories";
import { challenges } from "@cant/shared/lib/challenges/cant-orchestrate";
import { buildSearchItems, type SearchItem } from "@cant/shared/lib";

export type { SearchItem };

const pages: SearchItem[] = [
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
];

export const searchItems: SearchItem[] = buildSearchItems({
  pages,
  challenges,
  categoryOrder: CATEGORY_ORDER,
  categoryLabels: CATEGORY_LABELS,
  categoryDescriptions: CATEGORY_DESCRIPTIONS,
  categorySections: CATEGORY_SECTIONS,
});
