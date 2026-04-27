"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Eye, RotateCcw } from "lucide-react";
import type { ParticipantSnapshot } from "@/lib/poker/events";
import type { Vote } from "@/lib/poker/deck";

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

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 2,
        justifyContent: "space-between",
      }}
    >
      <Box>
        {revealed ? (
          <RevealSummary participants={participants} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {voted} / {total} voted
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
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
          New round
        </Button>
      </Box>
    </Box>
  );
}

function RevealSummary({
  participants,
}: {
  participants: ParticipantSnapshot[];
}) {
  const numericVotes = participants
    .map((p) => parseNumericVote(p.vote))
    .filter((v): v is number => v !== null);
  if (numericVotes.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No numeric votes
      </Typography>
    );
  }
  const avg = numericVotes.reduce((sum, n) => sum + n, 0) / numericVotes.length;
  const min = Math.min(...numericVotes);
  const max = Math.max(...numericVotes);
  const consensus = min === max;
  return (
    <Typography variant="body2" color="text.secondary">
      {consensus
        ? `Consensus at ${String(min)}`
        : `Avg ${avg.toFixed(1)} - range ${String(min)}-${String(max)}`}
    </Typography>
  );
}

function parseNumericVote(vote: Vote | null): number | null {
  if (vote === null || vote === "?" || vote === "coffee") return null;
  const n = Number(vote);
  return Number.isFinite(n) ? n : null;
}
