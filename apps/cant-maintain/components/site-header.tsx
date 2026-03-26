"use client";
import { SiteHeader as SharedSiteHeader } from "@cant/shared/components/site-header";
import { SearchPalette } from "@/components/search-palette";
import { GraduationCap } from "lucide-react";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Maintain"
      subtitle="Can you spot the better API?"
      navItems={[
        { type: "text", href: "/learn", label: "Learn", icon: <GraduationCap size={18} /> },
        { type: "cta", href: "/play", label: "Play" },
      ]}
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
