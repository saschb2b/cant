"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
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

export default function InspectorPage() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<InspectResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
              sx={{
                px: 4,
                minWidth: 140,
                whiteSpace: "nowrap",
              }}
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
            {/* SEO Score */}
            <SeoScore data={data} />

            {/* Preview cards grid */}
            <Typography variant="h5" fontWeight={600}>
              Platform Previews
            </Typography>

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
              <GooglePreview data={data} />
              <LinkedInPreview data={data} />
              <TwitterPreview data={data} />
              <SlackPreview data={data} />
              <TeamsPreview data={data} />
              <DiscordPreview data={data} />
              <WhatsAppPreview data={data} />
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
