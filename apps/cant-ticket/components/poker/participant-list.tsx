"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Coffee } from "lucide-react";
import type { ParticipantSnapshot } from "@/lib/poker/events";

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

  return (
    <Stack spacing={1}>
      {participants.map((p) => {
        const isSelf = p.id === selfId;
        const showValue = revealed && p.vote !== null;
        const isHigh = revealed && highSet.has(p.id);
        const isLow = revealed && lowSet.has(p.id);
        return (
          <Paper
            key={p.id}
            variant="outlined"
            sx={{
              px: 2,
              py: 1.25,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              bgcolor: isSelf ? "action.hover" : "background.paper",
              borderColor: isHigh || isLow ? "warning.main" : "divider",
              borderWidth: isHigh || isLow ? 1.5 : 1,
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2" fontWeight={600} noWrap>
                {p.name}
                {isSelf ? " (you)" : ""}
              </Typography>
              {isHigh && (
                <Chip
                  label="high"
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700 }}
                />
              )}
              {isLow && (
                <Chip
                  label="low"
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700 }}
                />
              )}
            </Box>
            {showValue ? (
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
          </Paper>
        );
      })}
    </Stack>
  );
}
