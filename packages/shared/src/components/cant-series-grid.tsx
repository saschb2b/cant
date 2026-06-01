import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { ExternalLink, Compass } from "lucide-react";
import { ALL_APPS, HUB_URL } from "../lib/cant-apps";
import { AppIcon } from "./app-icon";

export interface CantSeriesGridProps {
  /** Name of the current app, e.g. "Can't Resize". Must match an entry in ALL_APPS. */
  currentAppName: string;
  /**
   * "full" (default): landing page section with header and Hub CTA.
   * "compact": smaller grid for lobby/play pages.
   */
  variant?: "full" | "compact";
  /** Override the link target path appended to each app's href. Defaults to "/" for full, "/play" for compact. */
  linkPath?: string;
}

export function CantSeriesGrid({
  currentAppName,
  variant = "full",
  linkPath,
}: CantSeriesGridProps) {
  const isCompact = variant === "compact";
  const otherApps = ALL_APPS.filter((a) => a.name !== currentAppName);
  const resolvedPath = linkPath ?? (isCompact ? "/play" : "");

  if (otherApps.length === 0) return null;

  const iconSize = isCompact ? 32 : 40;

  const grid = (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isCompact
          ? { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }
          : {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: `repeat(${String(Math.min(otherApps.length, 3))}, 1fr)`,
            },
        gap: isCompact ? 1.5 : 2,
        ...(!isCompact && { maxWidth: 960, mx: "auto" }),
      }}
    >
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
              position: "relative",
              "&:hover": {
                borderColor: app.colorFrom,
                transform: "translateY(-2px)",
                boxShadow: `0 4px 20px ${app.colorFrom}18`,
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: isCompact ? 10 : 12,
                right: isCompact ? 10 : 12,
                color: "text.disabled",
                display: "flex",
              }}
            >
              <ExternalLink size={12} />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: isCompact ? 1.5 : 2,
                p: isCompact ? 2 : 2.5,
                pr: isCompact ? 4 : 5,
                flex: 1,
              }}
            >
              <AppIcon app={app} size={iconSize} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant={isCompact ? "caption" : "body2"}
                  fontWeight={700}
                  sx={{
                    mb: 0.5,
                    ...(isCompact && { fontSize: "0.75rem" }),
                  }}
                >
                  {app.name}
                </Typography>
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
                {isCompact && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontFamily="var(--font-geist-mono), monospace"
                    sx={{
                      fontSize: "0.55rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      mt: 0.75,
                    }}
                  >
                    {app.category}
                  </Typography>
                )}
              </Box>
            </Box>
            {/* Category bar - full variant only */}
            {!isCompact && (
              <Box
                sx={{
                  px: 2.5,
                  py: 0.75,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{
                    fontSize: "0.6rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {app.category}
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
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Box
            component="a"
            href={HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              textDecoration: "none",
              fontSize: "0.7rem",
              fontFamily: "var(--font-geist-mono), monospace",
              "&:hover": { color: "text.primary" },
            }}
          >
            <Compass size={12} />
            {"See all on Can't Hub"}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 5, md: 8 }, position: "relative", zIndex: 1 }}
    >
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {"You\u2019re on "}
          <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
            {currentAppName}
          </Box>
        </Typography>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ maxWidth: 480, mx: "auto", mb: 2 }}
        >
          Explore more from the series
        </Typography>
        <Button
          component="a"
          href={HUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          size="small"
          startIcon={<Compass size={16} />}
          sx={{
            borderRadius: 100,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8rem",
            px: 2.5,
          }}
        >
          {"See all on Can't Hub"}
        </Button>
      </Box>
      {grid}
    </Container>
  );
}
