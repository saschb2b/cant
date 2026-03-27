"use client";

import { Gamepad2 } from "lucide-react";
import { SearchPalette as SharedSearchPalette } from "@cant/shared/components";
import { searchItems } from "@/lib/search-items";
import { CATEGORY_SECTIONS } from "@/lib/game/categories";

const config = {
  placeholder: "Search pages, categories, challenges...",
  noResultsHint:
    'Try a prop name, category, or pattern like "onClick" or "boolean"',
  challengeGroupLabel: "Challenges",
  pageIcons: { play: Gamepad2 },
};

interface SearchPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPalette({ open, onClose }: SearchPaletteProps) {
  return (
    <SharedSearchPalette
      open={open}
      onClose={onClose}
      items={searchItems}
      sections={CATEGORY_SECTIONS}
      config={config}
    />
  );
}
