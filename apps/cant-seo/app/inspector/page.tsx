"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { InspectResponse } from "@/components/inspector/types";
import { GooglePreview } from "@/components/inspector/google-preview";
import { LinkedInPreview } from "@/components/inspector/linkedin-preview";
import { TwitterPreview } from "@/components/inspector/twitter-preview";
import { SlackPreview } from "@/components/inspector/slack-preview";
import { TeamsPreview } from "@/components/inspector/teams-preview";
import { DiscordPreview } from "@/components/inspector/discord-preview";
import { WhatsAppPreview } from "@/components/inspector/whatsapp-preview";
import { MetadataTable } from "@/components/inspector/metadata-table";
import { SeoScore } from "@/components/inspector/seo-score";

const PLATFORMS = [
  "Google",
  "LinkedIn",
  "Twitter",
  "Slack",
  "Teams",
  "Discord",
  "WhatsApp",
] as const;

type Platform = (typeof PLATFORMS)[number];

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default function InspectorPage() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<InspectResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hiddenPlatforms, setHiddenPlatforms] = useState(new Set<Platform>());

  const handleSubmit = async () => {
    if (!url.trim()) return;

    let normalizedUrl = url.trim();
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      const result = (await response.json()) as
        | InspectResponse
        | { error: string };

      if (!response.ok) {
        setError((result as { error: string }).error);
      } else {
        setData(result as InspectResponse);
      }
    } catch {
      setError("Failed to inspect URL. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platform: Platform) => {
    setHiddenPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) {
        next.delete(platform);
      } else {
        next.add(platform);
      }
      return next;
    });
  };

  const seoFound = data
    ? [
        data.title,
        data.description,
        data.og.title,
        data.og.description,
        data.og.image,
        data.og.type,
        data.twitter.card,
        data.twitter.image,
        data.canonical,
        data.robots,
        data.favicon,
      ].filter((v) => v !== null).length + (data.jsonLd.length > 0 ? 1 : 0)
    : 0;

  const platformComponents: Record<Platform, React.ReactNode> = data
    ? {
        Google: <GooglePreview data={data} />,
        LinkedIn: <LinkedInPreview data={data} />,
        Twitter: <TwitterPreview data={data} />,
        Slack: <SlackPreview data={data} />,
        Teams: <TeamsPreview data={data} />,
        Discord: <DiscordPreview data={data} />,
        WhatsApp: <WhatsAppPreview data={data} />,
      }
    : ({} as Record<Platform, React.ReactNode>);

  const visiblePlatforms = PLATFORMS.filter((p) => !hiddenPlatforms.has(p));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Mesh gradient background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: [
            "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(var(--mui-palette-primary-mainChannel) / 0.04) 0%, transparent 100%)",
            "radial-gradient(ellipse 60% 50% at 85% 75%, rgba(var(--mui-palette-primary-mainChannel) / 0.03) 0%, transparent 100%)",
          ].join(", "),
        }}
      />

      <SiteHeader />

      <Container
        maxWidth="lg"
        sx={{ flex: 1, py: { xs: 4, md: 5 }, position: "relative", zIndex: 1 }}
      >
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Link Inspector
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 520, lineHeight: 1.7 }}
          >
            Paste any URL and see how it appears across different platforms.
          </Typography>
        </Stack>

        {/* URL input */}
        <Box component="form" action={() => void handleSubmit()} sx={{ mb: 4 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              variant="outlined"
              size="medium"
              slotProps={{
                input: {
                  sx: {
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "0.95rem",
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !url.trim()}
              startIcon={
                loading ? <CircularProgress size={18} /> : <Search size={18} />
              }
              sx={{ px: 4, minWidth: 140, whiteSpace: "nowrap" }}
            >
              {loading ? "Inspecting" : "Inspect"}
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {data && (
          <Stack spacing={4}>
            {/* Sticky summary bar */}
            <Paper
              variant="outlined"
              sx={{
                position: "sticky",
                top: 8,
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                px: 2.5,
                py: 1.5,
                backdropFilter: "blur(12px)",
                bgcolor:
                  "rgba(var(--mui-palette-background-paperChannel) / 0.85)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {data.favicon && (
                  <Box
                    component="img"
                    src={data.favicon}
                    alt=""
                    sx={{ width: 20, height: 20, borderRadius: "4px" }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: { xs: 200, sm: 400 },
                  }}
                >
                  {getDomain(data.finalUrl)}
                </Typography>
              </Box>
              <Chip
                label={`${String(seoFound)}/12 SEO`}
                size="small"
                color={seoFound === 12 ? "success" : "warning"}
                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
              />
            </Paper>

            {/* SEO Score */}
            <SeoScore data={data} />

            {/* Platform filter toggles */}
            <Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {PLATFORMS.map((platform) => (
                  <Chip
                    key={platform}
                    label={platform}
                    size="small"
                    variant={
                      hiddenPlatforms.has(platform) ? "outlined" : "filled"
                    }
                    color={
                      hiddenPlatforms.has(platform) ? "default" : "primary"
                    }
                    onClick={() => togglePlatform(platform)}
                    sx={{
                      fontWeight: 500,
                      opacity: hiddenPlatforms.has(platform) ? 0.5 : 1,
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Preview cards grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 3,
              }}
            >
              {visiblePlatforms.map((platform) => (
                <Box key={platform}>{platformComponents[platform]}</Box>
              ))}
            </Box>

            {/* Raw metadata */}
            <MetadataTable data={data} />
          </Stack>
        )}
      </Container>

      <SiteFooter />
    </Box>
  );
}
