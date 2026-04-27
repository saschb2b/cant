import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_SECTIONS,
} from "@/lib/learn/categories";
import { challenges } from "@cant/shared/lib/challenges/cant-ticket";
import { buildSearchItems, type SearchItem } from "@cant/shared/lib";

export type { SearchItem };

const pages: SearchItem[] = [
  {
    type: "page",
    title: "Learn",
    description: "Browse all categories and study agile ticket craft",
    icon: "learn",
    keywords: ["learn", "study", "patterns", "overview", "categories"],
    href: "/learn",
  },
  {
    type: "page",
    title: "Planning poker",
    description: "Ephemeral planning poker sessions for your team",
    icon: "page",
    keywords: [
      "poker",
      "planning",
      "estimate",
      "estimation",
      "story points",
      "session",
      "team",
    ],
    href: "/poker",
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
