"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Trust"
      subtitle="Money, banking & bitcoin"
      currentAppName="Can't Trust"
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
