"use client";

import Box from "@mui/material/Box";
import { Heart } from "lucide-react";
import { countLabel } from "@/lib/retro/format";

export interface VoteChipProps {
  count: number;
  voted: boolean;
  /** Whether clicking does anything (vote phase only). */
  interactive: boolean;
  /**
   * Whether to display the numeric tally. Hidden while voting is open so the
   * running count cannot bias votes; shown once results are revealed.
   */
  showCount: boolean;
  /**
   * Whether the current participant's own vote tints the chip red. On during
   * voting (so they can track their picks), off in results so a shared screen
   * never exposes who voted for what.
   */
  showVoted: boolean;
  /**
   * Top vote-getter on the board (results only). Drawn in primary so the most
   * voted cards stand out without leaving the board.
   */
  highlight?: boolean;
  /** When user has no votes left and isn't currently voted on this target. */
  budgetExhausted?: boolean;
  onToggle?: () => void;
}

export function VoteChip({
  count,
  voted,
  interactive,
  showCount,
  showVoted,
  highlight = false,
  budgetExhausted = false,
  onToggle,
}: VoteChipProps) {
  // "personal" = the viewer's own pick (red, voting). "highlight" = a board
  // leader (primary, results). They never co-occur, but personal wins if so.
  const personal = showVoted && voted;
  const accent = personal ? "error" : highlight ? "primary" : null;
  const filled = accent !== null;
  // A static chip with no tally and no accent has nothing to say.
  if (!interactive && !showCount && !filled) return null;
  // In results, items that drew no votes get no chip at all.
  if (!interactive && showCount && count === 0 && !filled) return null;
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
        borderColor: accent
          ? `${accent}.main`
          : interactive
            ? "divider"
            : "transparent",
        bgcolor: accent
          ? `rgba(var(--mui-palette-${accent}-mainChannel) / 0.1)`
          : "background.paper",
        color: accent ? `${accent}.main` : "text.secondary",
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
                borderColor: accent ? `${accent}.main` : "text.primary",
                bgcolor: accent
                  ? `rgba(var(--mui-palette-${accent}-mainChannel) / 0.16)`
                  : "action.hover",
              }
            : undefined,
      }}
    >
      <Heart
        size={12}
        fill={filled ? "currentColor" : "none"}
        strokeWidth={filled ? 0 : 2}
      />
      {showCount && count}
    </Box>
  );
}
