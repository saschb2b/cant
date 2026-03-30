"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Query"
      subtitle="Learn API endpoint patterns"
      currentAppName="Can't Query"
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
