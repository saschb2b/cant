"use client";

import { SiteHeader as SharedSiteHeader } from "@cant/shared/components";
import { DoorOpen } from "lucide-react";
import { SearchPalette } from "@/components/search-palette";

export function SiteHeader() {
  return (
    <SharedSiteHeader
      title="Can't Ticket"
      subtitle="Agile ticket craft"
      currentAppName="Can't Ticket"
      gimmick={{ href: "/rooms", label: "Rooms", icon: <DoorOpen size={18} /> }}
      renderSearchPalette={({ open, onClose }) => (
        <SearchPalette open={open} onClose={onClose} />
      )}
    />
  );
}
