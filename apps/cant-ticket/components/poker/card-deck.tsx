"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Coffee } from "lucide-react";
import { DECK, DECK_GUIDE, type Vote } from "@/lib/poker/deck";

export interface CardDeckProps {
  selected: Vote | null;
  disabled?: boolean;
  onPick: (vote: Vote) => void;
}

// The "coffee" card is icon-only and a bare "?" or number is opaque to a
// screen reader, so give every card the meaning from the deck guide (e.g.
// "5: Medium", "Coffee: Break").
const CARD_LABEL: Record<Vote, string> = Object.fromEntries(
  DECK_GUIDE.map((row) => [row.value, row.label]),
) as Record<Vote, string>;

function cardAriaLabel(value: Vote): string {
  const meaning = CARD_LABEL[value];
  const name = value === "coffee" ? "Coffee" : value;
  return meaning ? `${name}: ${meaning}` : name;
}

export function CardDeck({ selected, disabled, onPick }: CardDeckProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(5, 1fr)", sm: "repeat(10, 1fr)" },
        gap: { xs: 1, sm: 1.25 },
      }}
    >
      {DECK.map((value) => {
        const isSelected = selected === value;
        return (
          <Button
            key={value}
            variant={isSelected ? "contained" : "outlined"}
            color={isSelected ? "primary" : "inherit"}
            disabled={disabled}
            aria-label={cardAriaLabel(value)}
            aria-pressed={isSelected}
            onClick={() => {
              onPick(value);
            }}
            sx={{
              minWidth: 0,
              aspectRatio: "2 / 3",
              fontSize: { xs: "1rem", sm: "1.5rem" },
              fontWeight: 700,
              borderColor: "divider",
              transition: "transform 120ms ease-out, box-shadow 120ms ease-out",
              "&:hover:not(:disabled)": {
                transform: "translateY(-2px)",
                boxShadow: 2,
              },
            }}
          >
            {value === "coffee" ? <Coffee size={20} /> : value}
          </Button>
        );
      })}
    </Box>
  );
}
