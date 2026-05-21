"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  ParticipantAvatar,
  type AvatarState,
} from "@/components/rooms/participant-avatar";
import type { RetroParticipantSnapshot } from "@/lib/retro/types";

function avatarStateFor(
  participant: RetroParticipantSnapshot,
  revealed: boolean,
): AvatarState {
  if (revealed) return "settled";
  return participant.noteCount > 0 ? "voted" : "thinking";
}

export interface ParticipantListProps {
  participants: RetroParticipantSnapshot[];
  revealed: boolean;
  selfId: string;
}

export function ParticipantList({
  participants,
  revealed,
  selfId,
}: ParticipantListProps) {
  const sorted = [...participants].sort((a, b) => {
    if (a.id === selfId) return -1;
    if (b.id === selfId) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <Stack divider={<Divider flexItem />}>
      {sorted.map((p) => {
        const isSelf = p.id === selfId;
        return (
          <Box
            key={p.id}
            sx={{
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1, sm: 1.25 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 1.75 },
              bgcolor: isSelf ? "action.hover" : "transparent",
            }}
          >
            <ParticipantAvatar
              seed={p.id}
              size={40}
              title={p.name}
              state={avatarStateFor(p, revealed)}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {p.name}
                {isSelf ? " (you)" : ""}
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ fontSize: "0.65rem" }}
              >
                {p.noteCount === 0
                  ? "no notes yet"
                  : `${String(p.noteCount)} ${p.noteCount === 1 ? "note" : "notes"}`}
              </Typography>
            </Box>
            {p.noteCount > 0 && (
              <Chip
                label={p.noteCount}
                size="small"
                color={revealed ? "default" : "success"}
                variant={revealed ? "outlined" : "filled"}
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  minWidth: 28,
                }}
              />
            )}
          </Box>
        );
      })}
    </Stack>
  );
}
