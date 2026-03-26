"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components/site-header";
import { GraduationCap, Gamepad2 } from "lucide-react";
import { SearchPalette } from "@/components/search-palette";

const NAV_ITEMS = [
  {
    type: "text" as const,
    href: "/play",
    label: "Play",
    icon: <Gamepad2 size={18} />,
  },
  {
    type: "text" as const,
    href: "/learn",
    label: "Learn",
    icon: <GraduationCap size={18} />,
  },
  { type: "cta" as const, href: "/inspector", label: "Open Inspector" },
];

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't SEO"
      subtitle="Learn SEO for Next.js"
      navItems={NAV_ITEMS}
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
