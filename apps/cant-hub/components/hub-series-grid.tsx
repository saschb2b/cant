import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { ExternalLink } from "lucide-react";
import { ALL_APPS } from "@cant/shared/lib/cant-apps";
import type { CantApp } from "@cant/shared/lib/cant-apps";
import {
  appNameToSlug,
  getAppChallengeCount,
  getAppCategoryCount,
} from "@cant/shared/lib/app-catalog";

/** Per-app tools that are hub-specific (not part of the shared catalog). */
const APP_TOOLS: Record<string, { label: string; href: string }> = {
  "Can't Resize": { label: "Viewer", href: "/canvas" },
  "Can't Type": { label: "Sandbox", href: "/playground" },
  "Can't Orchestrate": { label: "Explorer", href: "/explorer" },
  "Can't SEO": { label: "Inspector", href: "/inspector" },
  "Can't Explode": { label: "Lab", href: "/lab" },
  "Can't Test": { label: "Bug Hunt", href: "/hunt" },
  "Can't Ticket": { label: "Rooms", href: "/rooms" },
};

function AppIcon({ app, size = 56 }: { app: CantApp; size?: number }) {
  const id = `hub-icon-${app.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
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

function SeriesCard({ app }: { app: CantApp }) {
  const slug = appNameToSlug(app.name);
  const challenges = slug ? getAppChallengeCount(slug) : undefined;
  const categories = slug ? getAppCategoryCount(slug) : undefined;
  const tool = APP_TOOLS[app.name];

  return (
    <NextLink
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${app.name} (opens in new tab)`}
      style={{ textDecoration: "none", color: "inherit", display: "flex" }}
    >
      <Box
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          p: { xs: 3, sm: 4, md: 5 },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          background: `linear-gradient(135deg, ${app.colorFrom}22, ${app.colorTo}12)`,
          border: 1,
          borderColor: `${app.colorFrom}35`,
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: app.colorFrom,
            transform: "translateY(-4px)",
            boxShadow: `0 12px 40px ${app.colorFrom}30`,
            background: `linear-gradient(135deg, ${app.colorFrom}35, ${app.colorTo}22)`,
          },
        }}
      >
        {/* Icon + name */}
        <Stack direction="row" spacing={2} alignItems="center">
          <AppIcon app={app} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="h6"
                component="h3"
                fontWeight={700}
                sx={{ lineHeight: 1.2 }}
              >
                {app.name}
              </Typography>
              <Box
                sx={{
                  ml: "auto",
                  pl: 1,
                  color: "text.disabled",
                  display: "flex",
                  flexShrink: 0,
                }}
              >
                <ExternalLink size={14} />
              </Box>
            </Stack>
            <Typography
              variant="caption"
              color="text.disabled"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{
                display: "inline-block",
                mt: 0.5,
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {app.category}
            </Typography>
          </Box>
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7, flex: 1 }}
        >
          {app.desc}
        </Typography>

        {/* Stats row */}
        {challenges != null && (
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: "auto", flexWrap: "nowrap", alignItems: "baseline" }}
          >
            <Stat value={challenges} label="challenges" color={app.colorFrom} />
            <Stat
              value={categories ?? 0}
              label="categories"
              color={app.colorFrom}
            />
            {tool && (
              <Stack direction="row" spacing={0.5} alignItems="baseline">
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: app.colorFrom,
                    opacity: 0.6,
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{ fontSize: "0.7rem" }}
                >
                  {tool.label}
                </Typography>
              </Stack>
            )}
          </Stack>
        )}
      </Box>
    </NextLink>
  );
}

function Stat({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ color, fontSize: "0.95rem" }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{ fontSize: "0.7rem" }}
      >
        {label}
      </Typography>
    </Box>
  );
}

const CATEGORY_ORDER = [
  "Development",
  "Design",
  "Process",
  "Science",
  "Finance",
];

function groupByCategory(apps: CantApp[]) {
  const groups: { category: string; apps: CantApp[] }[] = [];
  for (const cat of CATEGORY_ORDER) {
    const matching = apps.filter((a) => a.category === cat);
    if (matching.length > 0) groups.push({ category: cat, apps: matching });
  }
  return groups;
}

export function HubSeriesGrid() {
  const groups = groupByCategory([...ALL_APPS]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 7 } }}
    >
      {groups.map((group) => (
        <Box key={group.category}>
          <Typography
            variant="caption"
            color="text.disabled"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.65rem",
              mb: 2,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {group.category}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: `repeat(${String(Math.min(group.apps.length, 2))}, 1fr)`,
                lg: `repeat(${String(Math.min(group.apps.length, 3))}, 1fr)`,
              },
              maxWidth:
                group.apps.length === 1
                  ? { sm: "50%", lg: "33.33%" }
                  : undefined,
              gap: { xs: 2.5, md: 3 },
            }}
          >
            {group.apps.map((app) => (
              <SeriesCard key={app.name} app={app} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
