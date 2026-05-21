"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Coffee, Eye } from "lucide-react";
import type { ParticipantSnapshot } from "@/lib/poker/events";
import {
  ParticipantAvatar,
  type AvatarState,
} from "@/components/rooms/participant-avatar";

function avatarStateFor(
  participant: ParticipantSnapshot,
  revealed: boolean,
  isOutlier: boolean,
): AvatarState {
  if (participant.isSpectator) return "spectator";
  if (revealed) {
    if (isOutlier) return "outlier";
    if (participant.vote === "coffee") return "coffee";
    if (participant.vote === "?") return "unsure";
    return "settled";
  }
  return participant.hasVoted ? "voted" : "thinking";
}

export interface ParticipantListProps {
  participants: ParticipantSnapshot[];
  revealed: boolean;
  selfId: string;
  highVoterIds?: string[];
  lowVoterIds?: string[];
}

export function ParticipantList({
  participants,
  revealed,
  selfId,
  highVoterIds = [],
  lowVoterIds = [],
}: ParticipantListProps) {
  const highSet = new Set(highVoterIds);
  const lowSet = new Set(lowVoterIds);
  const sorted = [...participants].sort((a, b) => {
    if (a.isSpectator !== b.isSpectator) return a.isSpectator ? 1 : -1;
    return 0;
  });

  return (
    <Stack divider={<Divider flexItem />}>
      {sorted.map((p) => {
        const isSelf = p.id === selfId;
        const showValue = revealed && p.vote !== null && !p.isSpectator;
        const isHigh = revealed && highSet.has(p.id);
        const isLow = revealed && lowSet.has(p.id);
        const isFlagged = isHigh || isLow;
        return (
          <Box
            key={p.id}
            sx={{
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1, sm: 1.25 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              bgcolor: isSelf ? "action.hover" : "transparent",
              boxShadow: isFlagged
                ? (theme) => `inset 3px 0 0 ${theme.palette.warning.main}`
                : "none",
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 1.75 },
                flex: 1,
              }}
            >
              <ParticipantAvatar
                seed={p.id}
                size={56}
                title={p.name}
                state={avatarStateFor(p, revealed, isFlagged)}
              />
              <Typography variant="body1" fontWeight={600} noWrap>
                {p.name}
                {isSelf ? " (you)" : ""}
              </Typography>
              {isHigh && (
                <Chip
                  label="high"
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }}
                />
              )}
              {isLow && (
                <Chip
                  label="low"
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }}
                />
              )}
            </Box>
            {p.isSpectator ? (
              <Chip
                icon={<Eye size={12} />}
                label="spectator"
                size="small"
                variant="outlined"
                sx={{ color: "text.secondary" }}
              />
            ) : showValue ? (
              <Chip
                label={
                  p.vote === "coffee" ? (
                    <Coffee size={14} style={{ verticalAlign: "middle" }} />
                  ) : (
                    p.vote
                  )
                }
                color="primary"
                size="small"
                sx={{ fontWeight: 700, minWidth: 44 }}
              />
            ) : p.hasVoted ? (
              <Chip
                label="voted"
                size="small"
                color="success"
                variant="outlined"
              />
            ) : (
              <Chip
                label="thinking"
                size="small"
                variant="outlined"
                sx={{ color: "text.secondary" }}
              />
            )}
          </Box>
        );
      })}
    </Stack>
  );
}
