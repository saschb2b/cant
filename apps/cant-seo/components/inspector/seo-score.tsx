"use client";

import { useState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import { CheckCircle2, XCircle, Copy, Check } from "lucide-react";
import type { InspectResponse } from "./types";

interface SeoScoreProps {
  data: InspectResponse;
}

interface CheckItem {
  label: string;
  present: boolean;
  learnHref: string;
  hint: string;
  /** Code snippet to fix the issue (shown for missing items). */
  snippet?: string;
}

export function SeoScore({ data }: SeoScoreProps) {
  const [expandedSnippet, setExpandedSnippet] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const checks: CheckItem[] = [
    {
      label: "title",
      present: data.title !== null,
      learnHref: "/learn/meta-tags",
      hint: "Add a <title> or use the Next.js metadata API.",
      snippet: `export const metadata: Metadata = {
  title: "My Page Title",
};`,
    },
    {
      label: "description",
      present: data.description !== null,
      learnHref: "/learn/meta-tags",
      hint: "Add a meta description for search result snippets.",
      snippet: `export const metadata: Metadata = {
  description: "A concise summary of the page content.",
};`,
    },
    {
      label: "og:title",
      present: data.og.title !== null,
      learnHref: "/learn/open-graph",
      hint: "Set og:title so shared links show a proper title.",
      snippet: `export const metadata: Metadata = {
  openGraph: {
    title: "My Page Title",
  },
};`,
    },
    {
      label: "og:description",
      present: data.og.description !== null,
      learnHref: "/learn/open-graph",
      hint: "Set og:description for link preview text.",
      snippet: `export const metadata: Metadata = {
  openGraph: {
    description: "A summary shown in link previews.",
  },
};`,
    },
    {
      label: "og:image",
      present: data.og.image !== null,
      learnHref: "/learn/open-graph",
      hint: "Add an og:image (1200x630) for rich link previews.",
      snippet: `export const metadata: Metadata = {
  openGraph: {
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
    }],
  },
};`,
    },
    {
      label: "og:type",
      present: data.og.type !== null,
      learnHref: "/learn/open-graph",
      hint: 'Set og:type (e.g. "website" or "article").',
      snippet: `export const metadata: Metadata = {
  openGraph: {
    type: "website",
  },
};`,
    },
    {
      label: "twitter:card",
      present: data.twitter.card !== null,
      learnHref: "/learn/twitter-cards",
      hint: "Set twitter:card to control image size on Twitter/X.",
      snippet: `export const metadata: Metadata = {
  twitter: {
    card: "summary_large_image",
  },
};`,
    },
    {
      label: "twitter:image",
      present: data.twitter.image !== null,
      learnHref: "/learn/twitter-cards",
      hint: "Add a twitter:image for Twitter/X link previews.",
      snippet: `export const metadata: Metadata = {
  twitter: {
    images: ["/twitter-image.png"],
  },
};`,
    },
    {
      label: "canonical",
      present: data.canonical !== null,
      learnHref: "/learn/canonical-urls",
      hint: "Add a canonical URL to avoid duplicate content.",
      snippet: `export const metadata: Metadata = {
  alternates: {
    canonical: "https://example.com/page",
  },
};`,
    },
    {
      label: "robots",
      present: data.robots !== null,
      learnHref: "/learn/sitemaps-robots",
      hint: "Add a robots meta tag to control indexing.",
      snippet: `export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};`,
    },
    {
      label: "favicon",
      present: data.favicon !== null,
      learnHref: "/learn/image-optimization",
      hint: "Add a favicon for browser tabs and bookmarks.",
      snippet: `// Create app/icon.tsx or add to public/
export const metadata: Metadata = {
  icons: { icon: "/icon.svg" },
};`,
    },
    {
      label: "structured data",
      present: data.jsonLd.length > 0,
      learnHref: "/learn/structured-data",
      hint: "Add JSON-LD for rich results in Google.",
      snippet: `<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "My Site",
      url: "https://example.com",
    }),
  }}
/>`,
    },
  ];

  const missing = checks.filter((c) => !c.present);
  const passing = checks.filter((c) => c.present);
  const found = passing.length;
  const total = checks.length;

  const handleCopy = async (snippet: string, label: string) => {
    await navigator.clipboard.writeText(snippet);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSnippet = (label: string) => {
    setExpandedSnippet((prev) => (prev === label ? null : label));
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          SEO Checklist
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: found === total ? "success.main" : "warning.main",
          }}
        >
          {found}/{total} elements found
        </Typography>
      </Box>

      {/* Missing items first */}
      {missing.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            fontWeight={600}
            color="error.main"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ mb: 1, display: "block" }}
          >
            Missing ({missing.length})
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 1,
            }}
          >
            {missing.map((check) => (
              <Box key={check.label}>
                <Tooltip title={check.hint} arrow placement="top">
                  <Chip
                    icon={<XCircle size={18} />}
                    label={check.label}
                    variant="outlined"
                    color="error"
                    clickable
                    onClick={() => toggleSnippet(check.label)}
                    sx={{
                      justifyContent: "flex-start",
                      fontFamily: "monospace",
                      fontSize: 12,
                      width: "100%",
                    }}
                  />
                </Tooltip>
                <Collapse in={expandedSnippet === check.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 0.5,
                      bgcolor: "action.hover",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 1.5,
                        py: 0.5,
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      <NextLink
                        href={check.learnHref}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Learn more
                        </Typography>
                      </NextLink>
                      <IconButton
                        size="small"
                        onClick={() =>
                          void handleCopy(check.snippet ?? "", check.label)
                        }
                      >
                        {copiedId === check.label ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </IconButton>
                    </Box>
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        px: 1.5,
                        py: 1,
                        fontSize: 11,
                        lineHeight: 1.5,
                        fontFamily:
                          "var(--font-geist-mono), 'Geist Mono', monospace",
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      <code>{check.snippet}</code>
                    </Box>
                  </Paper>
                </Collapse>
              </Box>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Click a red item to see the fix.
          </Typography>
        </Box>
      )}

      {/* Passing items */}
      {passing.length > 0 && (
        <Box>
          {missing.length > 0 && (
            <Typography
              variant="caption"
              fontWeight={600}
              color="success.main"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{ mb: 1, display: "block" }}
            >
              Found ({passing.length})
            </Typography>
          )}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 1,
            }}
          >
            {passing.map((check) => (
              <Chip
                key={check.label}
                icon={<CheckCircle2 size={18} />}
                label={check.label}
                variant="outlined"
                color="success"
                sx={{
                  justifyContent: "flex-start",
                  fontFamily: "monospace",
                  fontSize: 12,
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
