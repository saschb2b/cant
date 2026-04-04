import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_SECTIONS,
} from "@/lib/learn/categories";
import { challenges } from "@cant/shared/lib/challenges/cant-test";
import { buildSearchItems, type SearchItem } from "@cant/shared/lib";

export type { SearchItem };

const pages: SearchItem[] = [
  {
    type: "page",
    title: "Learn",
    description: "Browse all categories and study testing patterns",
    icon: "learn",
    keywords: ["learn", "study", "patterns", "overview", "categories"],
    href: "/learn",
  },
  {
    type: "page",
    title: "Bug Hunt",
    description:
      "Minesweeper-inspired game where you find bugs before they ship to production",
    icon: "hunt",
    keywords: ["bug", "hunt", "minesweeper", "game", "find", "assert", "flag"],
    href: "/hunt",
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
