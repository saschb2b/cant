"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Bug, Clock, RotateCcw } from "lucide-react";
import type { HuntState } from "@/lib/hunt/types";

interface HuntToolbarProps {
  state: HuntState;
  elapsed: number;
  onReset: () => void;
  onRestart: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function HuntToolbar({
  state,
  elapsed,
  onReset,
  onRestart,
}: HuntToolbarProps) {
  const remaining = state.config.bugCount - state.flagsPlaced;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={{ xs: 2, sm: 3 }}
      sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
    >
      {/* Bug counter */}
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Bug size={16} />
        <Typography
          sx={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.85rem",
            fontWeight: 700,
          }}
        >
          {remaining}
        </Typography>
      </Stack>

      {/* Timer */}
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Clock size={16} />
        <Typography
          sx={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.85rem",
            fontWeight: 700,
          }}
        >
          {formatTime(elapsed)}
        </Typography>
      </Stack>

      {/* Difficulty badge */}
      <Box
        sx={{
          px: 1.5,
          py: 0.25,
          borderRadius: 1,
          bgcolor: "action.selected",
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.65rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {state.config.label}
        </Typography>
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RotateCcw size={14} />}
          onClick={onRestart}
          sx={{ fontSize: "0.75rem", py: 0.25 }}
        >
          New
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={onReset}
          sx={{ fontSize: "0.75rem", py: 0.25 }}
        >
          Difficulty
        </Button>
      </Stack>
    </Stack>
  );
}
