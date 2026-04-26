import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_SECTIONS,
} from "@/lib/learn/categories";
import { challenges } from "@cant/shared/lib/challenges/cant-explode";
import { buildSearchItems, type SearchItem } from "@cant/shared/lib";

export type { SearchItem };

const pages: SearchItem[] = [
  {
    type: "page",
    title: "Chemistry Lab",
    description:
      "Falling-sand chemistry sandbox. Drop elements and watch them react.",
    icon: "learn",
    keywords: [
      "lab",
      "sandbox",
      "simulation",
      "chemistry",
      "elements",
      "reactions",
      "particles",
    ],
    href: "/lab",
  },
  {
    type: "page",
    title: "Learn",
    description: "Browse all categories and study chemistry patterns",
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
