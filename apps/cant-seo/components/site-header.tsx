"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { ScanSearch } from "lucide-react";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't SEO"
      subtitle="Learn SEO for Next.js"
      currentAppName="Can't SEO"
      gimmick={{
        href: "/inspector",
        label: "Inspector",
        icon: <ScanSearch size={18} />,
      }}
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
