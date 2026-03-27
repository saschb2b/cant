"use client";
import { SearchPalette as SharedSearchPalette } from "@cant/shared/components";
import { searchItems } from "@/lib/search-items";
import { CATEGORY_SECTIONS } from "@/lib/learn/categories";

const config = {
  placeholder: "Search pages, categories, patterns...",
  noResultsHint: 'Try a design topic like "spacing" or "hierarchy"',
  challengeGroupLabel: "Patterns",
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
