"use client";

import { useState, useEffect, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { AlignJustify, Rows3 } from "lucide-react";

type ViewMode = "full" | "compact";

const STORAGE_KEY = "cant-view-mode";

export function ChallengeListToggle({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("full");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "compact") setMode("compact");
  }, []);

  const handleChange = (_: unknown, value: ViewMode | null) => {
    if (value) {
      setMode(value);
      localStorage.setItem(STORAGE_KEY, value);
    }
  };

  return (
    <Box
      data-view={mode}
      sx={{
        '&[data-view="compact"] .compact-hide': {
          display: "none !important",
        },
        '&[data-view="compact"] .compact-full-width': {
          flex: "1 1 100% !important",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={0.75}
        sx={{ mb: 2 }}
      >
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleChange}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              px: 1.25,
              py: 0.5,
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "none",
              gap: 0.5,
            },
          }}
        >
          <ToggleButton value="full">
            <Rows3 size={14} />
            Full
          </ToggleButton>
          <ToggleButton value="compact">
            <AlignJustify size={14} />
            Compact
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {children}
    </Box>
  );
}
