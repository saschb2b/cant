import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_SECTIONS,
} from "@/lib/game/categories";
import { challenges } from "@cant/shared/lib/challenges/cant-branch";
import { buildSearchItems, type SearchItem } from "@cant/shared/lib";

export type { SearchItem };

const pages: SearchItem[] = [
  {
    type: "page",
    title: "Play",
    description: "Start a quiz game and test your git workflow skills",
    icon: "play",
    keywords: ["game", "quiz", "daily", "weekly", "challenge"],
    href: "/play",
  },
  {
    type: "page",
    title: "Learn",
    description: "Browse all categories and study git best practices",
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
