import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_SECTIONS,
} from "@/lib/game/categories";
import { challenges } from "@cant/shared/lib/challenges/cant-maintain";
import { buildSearchItems, type SearchItem } from "@cant/shared/lib";

export type { SearchItem };

const pages: SearchItem[] = [
  {
    type: "page",
    title: "Play",
    description: "Start a quiz game and test your prop naming skills",
    icon: "play",
    keywords: ["game", "quiz", "daily", "weekly", "challenge"],
    href: "/play",
  },
  {
    type: "page",
    title: "Learn",
    description: "Browse all categories and study React component API patterns",
    icon: "learn",
    keywords: ["learn", "study", "patterns", "overview", "categories"],
    href: "/learn",
  },
  {
    type: "page",
    title: "Changelog",
    description: "See what changed in each version",
    icon: "changelog",
    keywords: ["changelog", "updates", "releases", "version", "history"],
    href: "/changelog",
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
