"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import type { Difficulty } from "@/lib/hunt/types";
import { DIFFICULTY_CONFIGS } from "@/lib/hunt/config";

interface DifficultyPickerProps {
  onSelect: (difficulty: Difficulty) => void;
}

const CARDS: { difficulty: Difficulty; subtitle: string }[] = [
  { difficulty: "easy", subtitle: "8 x 8 grid, 10 bugs" },
  { difficulty: "medium", subtitle: "12 x 12 grid, 25 bugs" },
  { difficulty: "hard", subtitle: "16 x 16 grid, 50 bugs" },
];

export function DifficultyPicker({ onSelect }: DifficultyPickerProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="center"
      sx={{ maxWidth: 600, mx: "auto" }}
    >
      {CARDS.map(({ difficulty, subtitle }) => (
        <Box
          key={difficulty}
          onClick={() => onSelect(difficulty)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(difficulty);
            }
          }}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "primary.main",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 0.5, textTransform: "capitalize" }}
          >
            {difficulty}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ display: "block", mb: 1 }}
          >
            {DIFFICULTY_CONFIGS[difficulty].label}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.7rem",
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
