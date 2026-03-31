"use client";

import { memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Bug, Flag } from "lucide-react";
import type { Cell, GameStatus } from "@/lib/hunt/types";
import { COUNT_COLORS } from "@/lib/hunt/config";

interface HuntCellProps {
  cell: Cell;
  gameStatus: GameStatus;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}

export const HuntCell = memo(function HuntCell({
  cell,
  gameStatus,
  onReveal,
  onFlag,
}: HuntCellProps) {
  const isGameOver = gameStatus === "won" || gameStatus === "lost";

  const handleClick = () => {
    if (isGameOver) return;
    onReveal(cell.row, cell.col);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isGameOver) return;
    onFlag(cell.row, cell.col);
  };

  // Staggered delay for flood-fill cascade effect
  const stagger = (cell.row + cell.col) * 20;
  const animDelay = `${String(Math.min(stagger, 300))}ms`;

  if (cell.state === "revealed") {
    const isBug = cell.hasBug;
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 0.5,
          bgcolor: isBug ? "error.main" : "action.hover",
          animation: isBug
            ? "hunt-bug-reveal 0.5s cubic-bezier(0.2, 0, 0, 1.4) both"
            : "hunt-flip-in 0.35s cubic-bezier(0.2, 0, 0, 1.2) both",
          animationDelay: animDelay,
          "@keyframes hunt-flip-in": {
            "0%": {
              transform: "scale(0.5) rotateX(90deg)",
              opacity: 0,
            },
            "60%": {
              transform: "scale(1.08) rotateX(-5deg)",
              opacity: 1,
            },
            "100%": {
              transform: "scale(1) rotateX(0deg)",
            },
          },
          "@keyframes hunt-bug-reveal": {
            "0%": { transform: "scale(0.3)", opacity: 0 },
            "40%": { transform: "scale(1.3)", opacity: 1 },
            "60%": { transform: "scale(0.9) rotate(-5deg)" },
            "80%": { transform: "scale(1.05) rotate(3deg)" },
            "100%": { transform: "scale(1) rotate(0deg)" },
          },
        }}
      >
        {isBug ? (
          <Bug size={14} color="#FFFFFF" />
        ) : (
          cell.adjacentBugs > 0 && (
            <Typography
              sx={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                fontWeight: 700,
                color: COUNT_COLORS[cell.adjacentBugs] ?? "text.primary",
                lineHeight: 1,
              }}
            >
              {cell.adjacentBugs}
            </Typography>
          )
        )}
      </Box>
    );
  }

  if (cell.state === "flagged") {
    return (
      <Box
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "primary.main",
          borderRadius: 0.5,
          cursor: isGameOver ? "default" : "pointer",
          animation: "hunt-flag-pop 0.3s cubic-bezier(0.2, 0, 0, 1.5) both",
          "@keyframes hunt-flag-pop": {
            "0%": { transform: "scale(0.6) rotate(-15deg)", opacity: 0.5 },
            "70%": { transform: "scale(1.15) rotate(3deg)", opacity: 1 },
            "100%": { transform: "scale(1) rotate(0deg)", opacity: 0.85 },
          },
        }}
      >
        <Flag size={12} color="#FFFFFF" />
      </Box>
    );
  }

  // Hidden cell
  return (
    <Box
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
        borderRadius: 0.5,
        cursor: isGameOver ? "default" : "pointer",
        transition: "transform 0.15s ease, background-color 0.15s ease",
        "&:hover": isGameOver
          ? {}
          : {
              bgcolor: "action.selected",
              transform: "scale(1.06)",
            },
        "&:active": isGameOver
          ? {}
          : {
              transform: "scale(0.92)",
            },
      }}
    />
  );
});
