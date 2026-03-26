"use client";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Dices, Hash, X } from "lucide-react";

interface SeedInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  onSubmit?: () => void;
  /** Hint text shown above the input. */
  hint?: string;
}

/**
 * Seed input field with shuffle/generate button.
 * Used in the game lobby to enter or generate a seed code.
 */
export function SeedInput({
  value,
  onChange,
  onGenerate,
  onSubmit,
  hint = "Seed: play the same game as a friend",
}: SeedInputProps) {
  const hasSeed = value.trim().length > 0;

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
        sx={{
          mb: 0.75,
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        <Hash size={13} color="var(--mui-palette-text-secondary)" />
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {hint}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
      >
        <TextField
          placeholder="e.g. A3X9K2"
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit?.();
          }}
          slotProps={{
            htmlInput: {
              maxLength: 20,
              style: {
                fontFamily: "var(--font-geist-mono), monospace",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              },
            },
            input: {
              endAdornment: hasSeed ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onChange("")}
                    edge="end"
                    sx={{ color: "text.disabled", p: 0.5 }}
                  >
                    <X size={14} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
          sx={{ maxWidth: 200 }}
        />
        <Tooltip title="Random seed" arrow>
          <IconButton
            size="small"
            onClick={onGenerate}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <Dices size={18} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
