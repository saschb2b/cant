"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { TestTubes } from "lucide-react";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Explode"
      subtitle="Learn chemistry"
      currentAppName="Can't Explode"
      gimmick={{
        href: "/lab",
        label: "Lab",
        icon: <TestTubes size={18} />,
      }}
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
