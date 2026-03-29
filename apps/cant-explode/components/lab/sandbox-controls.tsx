"use client";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { Play, Pause, Trash2, Eraser } from "lucide-react";

interface SandboxControlsProps {
  paused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  eraserActive: boolean;
  onToggleEraser: () => void;
  children?: React.ReactNode;
}

export function SandboxControls({
  paused,
  onTogglePause,
  onReset,
  brushSize,
  onBrushSizeChange,
  eraserActive,
  onToggleEraser,
  children,
}: SandboxControlsProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{ mt: 1, flexWrap: "wrap" }}
    >
      <Tooltip title={paused ? "Play" : "Pause"}>
        <IconButton
          size="small"
          onClick={onTogglePause}
          sx={{ color: "text.secondary" }}
          aria-label={paused ? "Play" : "Pause"}
        >
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Clear canvas">
        <IconButton
          size="small"
          onClick={onReset}
          sx={{ color: "text.secondary" }}
          aria-label="Clear canvas"
        >
          <Trash2 size={16} />
        </IconButton>
      </Tooltip>

      <Tooltip title={eraserActive ? "Switch to element" : "Eraser"}>
        <IconButton
          size="small"
          onClick={onToggleEraser}
          sx={{
            color: eraserActive ? "primary.main" : "text.secondary",
            bgcolor: eraserActive ? "action.selected" : "transparent",
          }}
          aria-label={eraserActive ? "Switch to element" : "Eraser"}
        >
          <Eraser size={16} />
        </IconButton>
      </Tooltip>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          ml: 0.5,
        }}
      >
        <Slider
          value={brushSize}
          min={1}
          max={5}
          step={1}
          onChange={(_, v) => onBrushSizeChange(v as number)}
          sx={{ width: { xs: 50, sm: 70 } }}
          size="small"
          aria-label="Brush size"
        />
      </Box>

      <Box sx={{ ml: "auto" }}>{children}</Box>
    </Stack>
  );
}
