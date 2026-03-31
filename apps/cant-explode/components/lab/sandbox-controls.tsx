"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const cycleBrush = () => {
    onBrushSizeChange(brushSize >= 5 ? 1 : brushSize + 1);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        gap: 0.25,
        bgcolor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
        borderRadius: 20,
        px: 0.5,
        py: 0.25,
      }}
    >
      <Tooltip title={paused ? "Play" : "Pause"}>
        <IconButton
          onClick={onTogglePause}
          sx={{ color: "grey.300", width: 40, height: 40 }}
          aria-label={paused ? "Play" : "Pause"}
        >
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Clear canvas">
        <IconButton
          onClick={() => setConfirmOpen(true)}
          sx={{ color: "grey.300", width: 40, height: 40 }}
          aria-label="Clear canvas"
        >
          <Trash2 size={18} />
        </IconButton>
      </Tooltip>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Clear the entire canvas?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              setConfirmOpen(false);
              onReset();
            }}
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>

      <Tooltip title={eraserActive ? "Switch to element" : "Eraser"}>
        <IconButton
          onClick={onToggleEraser}
          sx={{
            color: eraserActive ? "primary.main" : "grey.300",
            bgcolor: eraserActive ? "rgba(255,255,255,0.15)" : "transparent",
            width: 40,
            height: 40,
          }}
          aria-label={eraserActive ? "Switch to element" : "Eraser"}
        >
          <Eraser size={18} />
        </IconButton>
      </Tooltip>

      <Tooltip title={`Brush: ${String(brushSize)}px`}>
        <IconButton
          onClick={cycleBrush}
          sx={{ color: "grey.300", width: 40, height: 40 }}
          aria-label={`Brush size ${String(brushSize)}`}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              lineHeight: 1,
              color: "inherit",
              fontFamily: "monospace",
            }}
          >
            {brushSize}px
          </Typography>
        </IconButton>
      </Tooltip>

      {children}
    </Box>
  );
}
