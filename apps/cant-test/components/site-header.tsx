"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { Bug } from "lucide-react";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Test"
      subtitle="Learn testing patterns"
      currentAppName="Can't Test"
      gimmick={{
        href: "/hunt",
        label: "Bug Hunt",
        icon: <Bug size={18} />,
      }}
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
