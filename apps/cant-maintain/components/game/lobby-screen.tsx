"use client";

import { LobbyScreen as SharedLobbyScreen } from "@cant/shared/components/game/lobby-screen";
import type { GameType } from "@cant/shared/components/game/lobby-screen";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ExternalLink } from "lucide-react";
import { CATEGORY_SECTIONS, CATEGORY_LABELS } from "@/lib/game/categories";
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

export type { GameType };

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
      config={{
        categorySections: CATEGORY_SECTIONS,
        categoryLabels: CATEGORY_LABELS,
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
      }}
      slots={{ activityGraph: ActivityGraph }}
      crossPromoSlot={
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
          <Box
            component="a"
            href="https://cant-resize.saschb2b.com/play"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              maxWidth: { sm: 360 },
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
                  {"Can't Resize"}
                </Typography>
                <Box
                  sx={{
                    ml: "auto",
                    color: "text.disabled",
                    display: "flex",
                  }}
                >
                  <ExternalLink size={12} />
                </Box>
              </Stack>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.5 }}
                >
                  Think you know responsive design? Same game, same format,
                  different topic.
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{ mt: 1, display: "block", fontSize: "0.65rem" }}
                >
                  Media queries, flexbox, grid, MUI patterns
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      }
    />
  );
}
