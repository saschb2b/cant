"use client";

import type { RefObject } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const paperSx = {
  width: "100%",
  minHeight: 200,
  overflow: "hidden",
  p: 1.5,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1,
} as const;

interface CanvasSimulationProps {
  /** Monospace label shown above the canvas. */
  label: string;
  /** Ref to the canvas element managed by the consuming component. */
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** Canvas width in pixels. Defaults to 320. */
  width?: number;
  /** Canvas height in pixels. Defaults to 240. */
  height?: number;
}

export function CanvasSimulation({
  label,
  canvasRef,
  width = 320,
  height = 240,
}: CanvasSimulationProps) {
  return (
    <Paper sx={paperSx}>
      <Typography
        sx={{ fontSize: 11, fontFamily: "monospace", color: "text.secondary" }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        <canvas ref={canvasRef} width={width} height={height} />
      </Box>
    </Paper>
  );
}

/**
 * Returns whether the current MUI theme is in dark mode.
 * Convenience hook to replace the repeated `useTheme` + mode check pattern.
 */
export function useIsDarkMode(): boolean {
  const theme = useTheme();
  return theme.palette.mode === "dark";
}
