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
