"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Ticket"
      subtitle="Agile ticket craft"
      currentAppName="Can't Ticket"
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
