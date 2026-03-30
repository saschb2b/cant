"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { RotateCcw, ArrowLeft } from "lucide-react";
import type { HuntState } from "@/lib/hunt/types";
import type { ScoreResult } from "@/lib/hunt/scoring";

interface GameOverOverlayProps {
  state: HuntState;
  score: ScoreResult | null;
  onRestart: () => void;
  onReset: () => void;
}

export function GameOverOverlay({
  state,
  score,
  onRestart,
  onReset,
}: GameOverOverlayProps) {
  const isWin = state.status === "won";

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 4,
        px: 2,
      }}
    >
      <Typography
        variant="h5"
        fontWeight={800}
        sx={{
          color: isWin ? "success.main" : "error.main",
          mb: 1,
        }}
      >
        {isWin ? "Full Coverage!" : "Production Crash!"}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {isWin
          ? "You found all the bugs before they shipped."
          : "A bug slipped through to production."}
      </Typography>

      {isWin && score && (
        <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {score.score.toLocaleString()}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {formatTime(score.timeSeconds)} · {score.difficultyMultiplier}x
            multiplier
          </Typography>
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: 1,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Typography variant="body2" fontWeight={700}>
              {score.rating}
            </Typography>
          </Box>
        </Stack>
      )}

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          startIcon={<RotateCcw size={16} />}
          onClick={onRestart}
        >
          Play again
        </Button>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          onClick={onReset}
        >
          Change difficulty
        </Button>
      </Stack>
    </Box>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
