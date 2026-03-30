"use client";

import Box from "@mui/material/Box";
import type { Grid, GameStatus } from "@/lib/hunt/types";
import { HuntCell } from "./hunt-cell";

interface HuntGridProps {
  grid: Grid;
  gameStatus: GameStatus;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}

export function HuntGrid({
  grid,
  gameStatus,
  onReveal,
  onFlag,
}: HuntGridProps) {
  const firstRow = grid[0];
  const cols = firstRow ? firstRow.length : 0;
  const rows = grid.length;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${String(cols)}, 1fr)`,
        gap: "2px",
        p: 1,
        bgcolor: "divider",
        borderRadius: 1.5,
        width: "100%",
        maxWidth: {
          xs: "100%",
          sm: cols <= 8 ? 520 : cols <= 12 ? 640 : 720,
          md: cols <= 8 ? 560 : cols <= 12 ? 680 : 780,
        },
        maxHeight: "calc(100vh - 280px)",
        mx: "auto",
        aspectRatio: `${String(cols)} / ${String(rows)}`,
        "& > *": {
          minHeight: 0,
          minWidth: 0,
        },
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {grid.flatMap((row) =>
        row.map((cell) => (
          <HuntCell
            key={`${String(cell.row)}-${String(cell.col)}`}
            cell={cell}
            gameStatus={gameStatus}
            onReveal={onReveal}
            onFlag={onFlag}
          />
        )),
      )}
    </Box>
  );
}
