import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { ExternalLink } from "lucide-react";
import { ALL_APPS } from "../lib/cant-apps";
import type { CantApp } from "../lib/cant-apps";

export interface CantSeriesGridProps {
  /** Name of the current app, e.g. "Can't Resize". Must match an entry in ALL_APPS. */
  currentAppName: string;
  /**
   * "full" (default): landing page section with header, current-app card, and tags bar.
   * "compact": smaller grid without header or current-app card. For lobby/play pages.
   */
  variant?: "full" | "compact";
  /** Override the link target path appended to each app's href. Defaults to "/" for full, "/play" for compact. */
  linkPath?: string;
}

function slugify(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function AppIcon({ app, size = 44 }: { app: CantApp; size?: number }) {
  const id = `icon-${slugify(app.name)}`;
  const rx = size * (37 / 180);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, borderRadius: rx }}
    >
      <defs>
        <linearGradient
          id={id}
          x1="0"
          y1="0"
          x2="180"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={app.colorFrom} />
          <stop offset="100%" stopColor={app.colorTo} />
        </linearGradient>
      </defs>
      <rect width="180" height="180" rx="37" fill={`url(#${id})`} />
      <g dangerouslySetInnerHTML={{ __html: app.iconSvgContent }} />
    </svg>
  );
}

export function CantSeriesGrid({
  currentAppName,
  variant = "full",
  linkPath,
}: CantSeriesGridProps) {
  const isCompact = variant === "compact";
  const currentApp = ALL_APPS.find((a) => a.name === currentAppName);
  const otherApps = ALL_APPS.filter((a) => a.name !== currentAppName);
  const resolvedPath = linkPath ?? (isCompact ? "/play" : "");

  if (otherApps.length === 0) return null;

  const iconSize = isCompact ? 32 : 44;

  const grid = (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isCompact
          ? { xs: "1fr", sm: "repeat(2, 1fr)" }
          : {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: `repeat(${String(Math.min(otherApps.length + (currentApp ? 1 : 0), 3))}, 1fr)`,
            },
        gap: isCompact ? 1.5 : 2,
        ...(!isCompact && { maxWidth: 960, mx: "auto" }),
      }}
    >
      {/* Current app (highlighted) - full variant only */}
      {!isCompact && currentApp && (
        <Paper
          elevation={0}
          sx={{
            p: 0,
            border: 1,
            borderColor: "primary.main",
            bgcolor:
              "rgba(var(--mui-palette-primary-mainChannel) / 0.04)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, p: 2.5, flex: 1 }}>
            <AppIcon app={currentApp} size={iconSize} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                }}
              >
                <Typography variant="body2" fontWeight={700}>
                  {currentApp.name}
                </Typography>
                <Chip
                  label="You are here"
                  size="small"
                  color="primary"
                  sx={{
                    height: 18,
                    fontSize: "0.6rem",
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                {currentApp.desc}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              px: 2.5,
              py: 1,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="caption"
              color="text.disabled"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{ fontSize: "0.65rem" }}
            >
              {currentApp.tags}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Other apps */}
      {otherApps.map((app) => (
        <NextLink
          key={app.name}
          href={`${app.href}${resolvedPath}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 0,
              border: 1,
              borderColor: "divider",
              overflow: "hidden",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                borderColor: app.colorFrom,
                transform: "translateY(-2px)",
                boxShadow: `0 4px 20px ${app.colorFrom}18`,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: isCompact ? 1.5 : 2,
                p: isCompact ? 2 : 2.5,
                flex: 1,
              }}
            >
              <AppIcon app={app} size={iconSize} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant={isCompact ? "caption" : "body2"}
                    fontWeight={700}
                    sx={isCompact ? { fontSize: "0.75rem" } : undefined}
                  >
                    {app.name}
                  </Typography>
                  <Box
                    sx={{
                      ml: isCompact ? "auto" : 0,
                      color: "text.disabled",
                      display: "flex",
                    }}
                  >
                    <ExternalLink size={12} />
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    lineHeight: isCompact ? 1.4 : 1.5,
                    ...(isCompact && {
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }),
                  }}
                >
                  {isCompact ? app.playPitch : app.desc}
                </Typography>
              </Box>
            </Box>
            {/* Tags bar - full variant only */}
            {!isCompact && (
              <Box
                sx={{
                  px: 2.5,
                  py: 1,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.disabled"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{ fontSize: "0.65rem" }}
                >
                  {app.tags}
                </Typography>
              </Box>
            )}
          </Paper>
        </NextLink>
      ))}
    </Box>
  );

  if (isCompact) {
    return (
      <Box sx={{ pb: { xs: 3, md: 6 } }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{
            fontSize: "0.63rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            mb: 1.5,
            display: "block",
          }}
        >
          More topics
        </Typography>
        {grid}
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 5, md: 8 }, position: "relative", zIndex: 1 }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ fontSize: "0.8rem", mb: 1 }}
        >
          {"Part of the Can't series"}
        </Typography>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ maxWidth: 480, mx: "auto" }}
        >
          Same game, different topics
        </Typography>
      </Box>
      {grid}
    </Container>
  );
}
