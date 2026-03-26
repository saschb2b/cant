"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { ExternalLink } from "lucide-react";
import { LobbyScreen as SharedLobbyScreen } from "@cant/shared/components/game/lobby-screen";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/learn/categories";
import {
  decodeSeed,
  generateSeed,
  seedFromKey,
  getTodayKey,
  getWeekKey,
} from "@/lib/game/seeded-random";
import {
  getHistory,
  getEntryBySeed,
  formatRelativeDate,
} from "@/lib/game/history";
import { ActivityGraph } from "./activity-graph";

export type GameType = "daily" | "weekly" | "custom";

const config = {
  categorySections: CATEGORY_SECTIONS,
  categoryLabels: CATEGORY_LABELS as Record<string, string>,
  headerBackground: "secondary.main",
  gameUtils: {
    decodeSeed,
    generateSeed,
    seedFromKey,
    getTodayKey,
    getWeekKey,
    getHistory,
    getEntryBySeed,
    formatRelativeDate,
  },
};

const crossPromoSlot = (
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
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
      {[
        {
          name: "Can't Maintain",
          href: "https://cant-maintain.saschb2b.com/play",
          desc: "Think you can spot clean React component APIs? Same game, same format, different topic.",
          tags: "Props, composition, TypeScript patterns",
        },
        {
          name: "Can't Type",
          href: "https://cant-type.saschb2b.com/play",
          desc: "Think you can spot better TypeScript patterns? Same game, same format, different topic.",
          tags: "Generics, narrowing, utility types",
        },
      ].map((site) => (
        <Box
          key={site.name}
          component="a"
          href={site.href}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            flex: 1,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              overflow: "hidden",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "text.secondary",
                transform: "translateY(-1px)",
              },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{
                px: 2,
                py: 1,
                bgcolor: "secondary.main",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{ fontSize: "0.72rem" }}
              >
                {site.name}
              </Typography>
              <Box sx={{ ml: "auto", color: "text.disabled", display: "flex" }}>
                <ExternalLink size={12} />
              </Box>
            </Stack>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                {site.desc}
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ mt: 1, display: "block", fontSize: "0.65rem" }}
              >
                {site.tags}
              </Typography>
            </Box>
          </Paper>
        </Box>
      ))}
    </Stack>
  </Box>
);

interface LobbyScreenProps {
  onStart: (
    rawSeed: string,
    excludedCategories: Set<string>,
    gameType: GameType,
  ) => void;
  defaultSeed?: string;
  defaultExcluded?: Set<string>;
}

export function LobbyScreen(props: LobbyScreenProps) {
  return (
    <SharedLobbyScreen
      {...props}
      config={config}
      slots={{ activityGraph: ActivityGraph }}
      crossPromoSlot={crossPromoSlot}
    />
  );
}
