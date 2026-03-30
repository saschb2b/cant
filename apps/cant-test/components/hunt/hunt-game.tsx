"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useHuntGame } from "./use-hunt-game";
import { DifficultyPicker } from "./difficulty-picker";
import { HuntToolbar } from "./hunt-toolbar";
import { HuntGrid } from "./hunt-grid";
import { GameOverOverlay } from "./game-over-overlay";

export function HuntGame() {
  const {
    state,
    elapsed,
    score,
    startGame,
    handleReveal,
    handleFlag,
    reset,
    restart,
  } = useHuntGame();

  // Difficulty selection
  if (!state) {
    return (
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 3 }}
        >
          Left-click to reveal a module. Right-click to place an assertion.
        </Typography>
        <DifficultyPicker onSelect={startGame} />
      </Box>
    );
  }

  const isGameOver = state.status === "won" || state.status === "lost";

  return (
    <Box>
      <HuntToolbar
        state={state}
        elapsed={elapsed}
        onReset={reset}
        onRestart={restart}
      />

      <HuntGrid
        grid={state.grid}
        gameStatus={state.status}
        onReveal={handleReveal}
        onFlag={handleFlag}
      />

      {isGameOver && (
        <GameOverOverlay
          state={state}
          score={score}
          onRestart={restart}
          onReset={reset}
        />
      )}
    </Box>
  );
}
