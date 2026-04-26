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
}

export function ParticipantList({
  participants,
  revealed,
  selfId,
}: ParticipantListProps) {
  return (
    <Stack spacing={1}>
      {participants.map((p) => {
        const isSelf = p.id === selfId;
        const showValue = revealed && p.vote !== null;
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
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {p.name}
                {isSelf ? " (you)" : ""}
              </Typography>
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
