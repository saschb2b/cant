"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Eye, RotateCcw } from "lucide-react";
import type { ParticipantSnapshot } from "@/lib/poker/events";
import { computeRevealStats } from "@/lib/poker/reveal-stats";
import { RevealSummary } from "./reveal-summary";

export interface RoundControlsProps {
  revealed: boolean;
  participants: ParticipantSnapshot[];
  onReveal: () => void;
  onReset: () => void;
}

export function RoundControls({
  revealed,
  participants,
  onReveal,
  onReset,
}: RoundControlsProps) {
  const voted = participants.filter((p) => p.hasVoted).length;
  const total = participants.length;
  const allVoted = total > 0 && voted === total;
  const stats = revealed ? computeRevealStats(participants) : null;
  const resetLabel =
    stats === null
      ? "New round"
      : stats.verdict === "discuss"
        ? "Discuss & re-vote"
        : stats.verdict === "consensus"
          ? "Lock in & next"
          : "New round";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
        alignItems: { xs: "stretch", sm: "flex-start" },
        gap: 2,
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {stats !== null ? (
          <RevealSummary stats={stats} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {voted} / {total} voted
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexShrink: 0,
          alignSelf: { xs: "stretch", sm: "flex-start" },
        }}
      >
        {!revealed && (
          <Button
            variant="contained"
            startIcon={<Eye size={16} />}
            onClick={onReveal}
            disabled={voted === 0}
          >
            {allVoted ? "Reveal" : "Reveal anyway"}
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<RotateCcw size={16} />}
          onClick={onReset}
        >
          {resetLabel}
        </Button>
      </Box>
    </Box>
  );
}
