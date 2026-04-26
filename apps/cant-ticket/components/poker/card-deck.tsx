"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Coffee } from "lucide-react";
import { DECK, type Vote } from "@/lib/poker/deck";

export interface CardDeckProps {
  selected: Vote | null;
  disabled?: boolean;
  onPick: (vote: Vote) => void;
}

export function CardDeck({ selected, disabled, onPick }: CardDeckProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(5, 1fr)", sm: "repeat(10, 1fr)" },
        gap: 1,
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
            onClick={() => {
              onPick(value);
            }}
            sx={{
              minWidth: 0,
              aspectRatio: "2 / 3",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              fontWeight: 700,
              borderColor: "divider",
            }}
          >
            {value === "coffee" ? <Coffee size={18} /> : value}
          </Button>
        );
      })}
    </Box>
  );
}
