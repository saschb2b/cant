"use client";
import { SiteHeader as SharedSiteHeader } from "@cant/shared/components/site-header";
import { Layers } from "lucide-react";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Orchestrate"
      subtitle="Learn orchestration patterns"
      gimmick={{
        href: "/explorer",
        label: "Explorer",
        icon: <Layers size={18} />,
      }}
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
