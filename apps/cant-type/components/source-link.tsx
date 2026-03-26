"use client";

import Link from "@mui/material/Link";
import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface SourceLinkProps {
  href: string;
  label: string;
  challengeId: string;
  category: string;
}

export function SourceLink({
  href,
  label,
  challengeId,
  category,
}: SourceLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
      onClick={() =>
        trackEvent("source-link-clicked", { challengeId, category, label })
      }
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        mt: 1.5,
        typography: "caption",
        fontFamily: "var(--font-geist-mono), monospace",
        fontWeight: 500,
      }}
    >
      <ExternalLink size={12} />
      {label}
    </Link>
  );
}
