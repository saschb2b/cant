"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Game"
      subtitle="Learn game dev patterns"
      currentAppName="Can't Game"
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
