"use client";

import Box from "@mui/material/Box";
import { Heart } from "lucide-react";
import { countLabel } from "@/lib/retro/format";

export interface VoteChipProps {
  count: number;
  voted: boolean;
  /** Whether clicking does anything (vote phase only). */
  interactive: boolean;
  /** When user has no votes left and isn't currently voted on this target. */
  budgetExhausted?: boolean;
  onToggle?: () => void;
}

export function VoteChip({
  count,
  voted,
  interactive,
  budgetExhausted = false,
  onToggle,
}: VoteChipProps) {
  const showZero = count === 0 && !interactive;
  if (count === 0 && !interactive) return null;
  const disabled = interactive && !voted && budgetExhausted;
  const handleClick = interactive && !disabled ? onToggle : undefined;

  return (
    <Box
      component={interactive ? "button" : "div"}
      onClick={
        handleClick
          ? (e: React.MouseEvent) => {
              e.stopPropagation();
              handleClick();
            }
          : undefined
      }
      onPointerDown={
        interactive
          ? (e: React.PointerEvent) => {
              e.stopPropagation();
            }
          : undefined
      }
      aria-label={
        interactive
          ? voted
            ? "Remove your vote"
            : "Vote for this item"
          : countLabel(count, "vote")
      }
      aria-pressed={interactive ? voted : undefined}
      disabled={disabled}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 0.75,
        py: 0.25,
        minHeight: 24,
        minWidth: 36,
        borderRadius: 1,
        border: 1,
        borderColor: voted
          ? "error.main"
          : interactive
            ? "divider"
            : "transparent",
        bgcolor: voted
          ? "rgba(var(--mui-palette-error-mainChannel) / 0.1)"
          : "background.paper",
        color: voted ? "error.main" : "text.secondary",
        cursor: interactive
          ? disabled
            ? "not-allowed"
            : "pointer"
          : "default",
        opacity: disabled ? 0.45 : 1,
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: "0.75rem",
        fontWeight: 700,
        lineHeight: 1,
        transition: "all 150ms ease",
        "&:hover":
          interactive && !disabled
            ? {
                borderColor: voted ? "error.main" : "text.primary",
                bgcolor: voted
                  ? "rgba(var(--mui-palette-error-mainChannel) / 0.16)"
                  : "action.hover",
              }
            : undefined,
      }}
    >
      <Heart
        size={12}
        fill={voted ? "currentColor" : "none"}
        strokeWidth={voted ? 0 : 2}
      />
      {!showZero && count}
    </Box>
  );
}
