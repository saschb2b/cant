"use client";
import { FlaskConical } from "lucide-react";
import { SearchPalette as SharedSearchPalette } from "@cant/shared/components";
import { searchItems } from "@/lib/search-items";
import { CATEGORY_SECTIONS } from "@/lib/learn/categories";

const config = {
  placeholder: "Search pages, categories, challenges...",
  noResultsHint:
    'Try a molecule, category, or concept like "benzene" or "acid strength"',
  challengeGroupLabel: "Challenges",
  pageIcons: { learn: FlaskConical },
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
