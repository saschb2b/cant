"use client";
import { SiteHeader as SharedSiteHeader } from "@cant/shared/components/site-header";
import { GraduationCap } from "lucide-react";
import { SearchPalette } from "@/components/search-palette";

const NAV_ITEMS = [
  {
    type: "text" as const,
    href: "/learn",
    label: "Learn",
    icon: <GraduationCap size={18} />,
  },
  { type: "cta" as const, href: "/play", label: "Play" },
];

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Orchestrate"
      subtitle="Learn orchestration patterns"
      navItems={NAV_ITEMS}
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
