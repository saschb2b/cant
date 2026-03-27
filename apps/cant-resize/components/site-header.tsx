"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { Eye } from "lucide-react";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Resize"
      subtitle="Learn responsive design"
      currentAppName="Can't Resize"
      gimmick={{ href: "/canvas", label: "Viewer", icon: <Eye size={18} /> }}
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
