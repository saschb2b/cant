"use client";

import { useRef, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";

interface SandboxCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  gridWidth: number;
  gridHeight: number;
  onDraw: (gridX: number, gridY: number) => void;
  onCellSizeChange: (cellSize: number) => void;
}

export function SandboxCanvas({
  canvasRef,
  gridWidth,
  gridHeight,
  onDraw,
  onCellSizeChange,
}: SandboxCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const cellSizeRef = useRef(3);

  const toGridCoords = useCallback(
    (clientX: number, clientY: number): { gx: number; gy: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      // Map from display coordinates to grid coordinates directly
      const gx = Math.floor(((clientX - rect.left) / rect.width) * gridWidth);
      const gy = Math.floor(((clientY - rect.top) / rect.height) * gridHeight);
      if (gx < 0 || gx >= gridWidth || gy < 0 || gy >= gridHeight) return null;
      return { gx, gy };
    },
    [canvasRef, gridWidth, gridHeight],
  );

  const drawLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number) => {
      // Bresenham line to fill gaps during fast drags
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;
      let cx = x0;
      let cy = y0;
      for (;;) {
        onDraw(cx, cy);
        if (cx === x1 && cy === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          cx += sx;
        }
        if (e2 < dx) {
          err += dx;
          cy += sy;
        }
      }
    },
    [onDraw],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      drawingRef.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const pos = toGridCoords(e.clientX, e.clientY);
      if (pos) {
        onDraw(pos.gx, pos.gy);
        lastPosRef.current = { x: pos.gx, y: pos.gy };
      }
    },
    [toGridCoords, onDraw],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drawingRef.current) return;
      const pos = toGridCoords(e.clientX, e.clientY);
      if (!pos) return;
      const last = lastPosRef.current;
      if (last) {
        drawLine(last.x, last.y, pos.gx, pos.gy);
      } else {
        onDraw(pos.gx, pos.gy);
      }
      lastPosRef.current = { x: pos.gx, y: pos.gy };
    },
    [toGridCoords, onDraw, drawLine],
  );

  const handlePointerUp = useCallback(() => {
    drawingRef.current = false;
    lastPosRef.current = null;
  }, []);

  // Resize canvas to fit container
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const cs = Math.max(1, Math.floor(Math.min(width / gridWidth, height / gridHeight)));
      cellSizeRef.current = cs;
      canvas.width = gridWidth * cs;
      canvas.height = gridHeight * cs;
      onCellSizeChange(cs);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [canvasRef, gridWidth, gridHeight, onCellSizeChange]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        aspectRatio: { xs: "4 / 3", sm: `${String(gridWidth)} / ${String(gridHeight)}` },
        maxHeight: { xs: "55vh", md: "70vh" },
        position: "relative",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        cursor: "crosshair",
        touchAction: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </Box>
  );
}
