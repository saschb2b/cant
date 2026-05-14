"use client";

import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { ExternalLink, Pencil } from "lucide-react";
import { useTrackEvent } from "../lib/analytics-context";
import { buildChallengeIssueUrl } from "../lib/github-issue";

interface SourceLinkProps {
  href: string;
  label: string;
  challengeId: string;
  category: string;
  /** When provided, renders an inline "Suggest a fix" link next to the source link. */
  githubUrl?: string;
  /** Required alongside githubUrl. Used in the prefilled issue body. */
  challengeTitle?: string;
  /** Optional human-readable category label, used in the prefilled issue body. */
  categoryLabel?: string;
}

export function SourceLink({
  href,
  label,
  challengeId,
  category,
  githubUrl,
  challengeTitle,
  categoryLabel,
}: SourceLinkProps) {
  const trackEvent = useTrackEvent();

  const issueUrl =
    githubUrl && challengeTitle
      ? buildChallengeIssueUrl(githubUrl, {
          id: challengeId,
          title: challengeTitle,
          category,
          categoryLabel,
        })
      : null;

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      sx={{ mt: 1.5, rowGap: 0.5 }}
    >
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
          typography: "caption",
          fontFamily: "var(--font-geist-mono), monospace",
          fontWeight: 500,
        }}
      >
        <ExternalLink size={12} />
        {label}
      </Link>
      {issueUrl && (
        <Link
          href={issueUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          onClick={() =>
            trackEvent("contribute-clicked", {
              location: "learn-page",
              challengeId,
              category,
            })
          }
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            typography: "caption",
            fontFamily: "var(--font-geist-mono), monospace",
            fontWeight: 500,
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
        >
          <Pencil size={12} />
          Suggest a fix
        </Link>
      )}
    </Stack>
  );
}
