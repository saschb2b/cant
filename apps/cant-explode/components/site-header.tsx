"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Explode"
      subtitle="Learn chemistry"
      currentAppName="Can't Explode"
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
