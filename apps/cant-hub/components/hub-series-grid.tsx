import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ExternalLink } from "lucide-react";
import { ALL_APPS } from "@cant/shared/lib/cant-apps";
import type { CantApp } from "@cant/shared/lib/cant-apps";

interface SeriesMeta {
  challenges: number;
  categories: number;
  tool?: { label: string; href: string };
}

const SERIES_META: Record<string, SeriesMeta> = {
  "Can't Maintain": {
    challenges: 117,
    categories: 18,
  },
  "Can't Resize": {
    challenges: 90,
    categories: 16,
    tool: { label: "Viewer", href: "/canvas" },
  },
  "Can't Type": {
    challenges: 81,
    categories: 16,
    tool: { label: "Sandbox", href: "/playground" },
  },
  "Can't Orchestrate": {
    challenges: 70,
    categories: 16,
    tool: { label: "Explorer", href: "/explorer" },
  },
  "Can't SEO": {
    challenges: 66,
    categories: 8,
    tool: { label: "Inspector", href: "/inspector" },
  },
  "Can't UX": {
    challenges: 28,
    categories: 7,
  },
  "Can't Explode": {
    challenges: 59,
    categories: 16,
  },
};

function AppIcon({ app, size = 48 }: { app: CantApp; size?: number }) {
  const id = `hub-icon-${app.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
  const meta = SERIES_META[app.name];

  return (
    <NextLink
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit", display: "flex" }}
    >
      <Box
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          background: `linear-gradient(135deg, ${app.colorFrom}18, ${app.colorTo}10)`,
          border: 1,
          borderColor: `${app.colorFrom}30`,
          transition: "all 0.25s ease",
          "&:hover": {
            borderColor: app.colorFrom,
            transform: "translateY(-3px)",
            boxShadow: `0 8px 32px ${app.colorFrom}20`,
            background: `linear-gradient(135deg, ${app.colorFrom}24, ${app.colorTo}16)`,
          },
        }}
      >
        {/* Top: icon + name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AppIcon app={app} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ lineHeight: 1.2 }}
              >
                {app.name}
              </Typography>
              <Box sx={{ ml: "auto", color: "text.disabled", display: "flex" }}>
                <ExternalLink size={14} />
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, lineHeight: 1.5 }}
            >
              {app.desc}
            </Typography>
          </Box>
        </Box>

        {/* Stats row */}
        {meta && (
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, sm: 3 },
              flexWrap: "wrap",
              mt: "auto",
            }}
          >
            <Stat
              value={meta.challenges}
              label="challenges"
              color={app.colorFrom}
            />
            <Stat
              value={meta.categories}
              label="categories"
              color={app.colorFrom}
            />
            {meta.tool && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
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
                  {meta.tool.label}
                </Typography>
              </Box>
            )}
          </Box>
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

export function HubSeriesGrid() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, 1fr)",
        },
        gap: 2.5,
      }}
    >
      {ALL_APPS.map((app) => (
        <SeriesCard key={app.name} app={app} />
      ))}
    </Box>
  );
}
