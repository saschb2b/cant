"use client";
import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { FlaskConical } from "lucide-react";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Type"
      subtitle="Learn TypeScript patterns"
      currentAppName="Can't Type"
      gimmick={{
        href: "/playground",
        label: "Sandbox",
        icon: <FlaskConical size={18} />,
      }}
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
