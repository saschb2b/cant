"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Hourglass, TimerReset } from "lucide-react";

export interface TimerDisplayProps {
  endsAt: number;
  label?: string;
  onClear?: () => void;
}

function format(ms: number): string {
  if (ms <= 0) return "0:00";
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m)}:${s.toString().padStart(2, "0")}`;
}

export function TimerDisplay({ endsAt, label, onClear }: TimerDisplayProps) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => {
      clearInterval(id);
    };
  }, []);

  const remaining = endsAt - now;
  const expired = remaining <= 0;
  const warn = !expired && remaining < 30_000;

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        px: 1.25,
        py: 0.75,
        borderRadius: 1.5,
        bgcolor: expired
          ? "rgba(var(--mui-palette-error-mainChannel) / 0.08)"
          : warn
            ? "rgba(var(--mui-palette-warning-mainChannel) / 0.08)"
            : "rgba(var(--mui-palette-primary-mainChannel) / 0.06)",
        color: expired ? "error.main" : warn ? "warning.main" : "primary.main",
        border: 1,
        borderColor: expired
          ? "error.light"
          : warn
            ? "warning.light"
            : "rgba(var(--mui-palette-primary-mainChannel) / 0.2)",
      }}
    >
      <Hourglass size={14} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {label && (
          <Typography
            variant="caption"
            color="text.disabled"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{
              display: "block",
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            {label}
          </Typography>
        )}
        <Typography
          variant="body2"
          fontWeight={700}
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ lineHeight: 1.2 }}
        >
          {expired ? "Time's up" : format(remaining)}
        </Typography>
      </Box>
      {onClear && (
        <Box
          component="button"
          onClick={onClear}
          aria-label="Clear timer"
          title="Clear timer"
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            p: 0.25,
            opacity: 0.7,
            "&:hover": { opacity: 1 },
          }}
        >
          <TimerReset size={14} />
        </Box>
      )}
    </Stack>
  );
}
