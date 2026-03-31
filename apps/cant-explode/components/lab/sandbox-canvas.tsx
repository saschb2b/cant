"use client";

import { useRef, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";

interface SandboxCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onResize: (gridWidth: number, gridHeight: number) => void;
  onDraw: (gridX: number, gridY: number) => void;
  onDrawEnd?: () => void;
}

/** CSS pixels per grid cell. */
const CELL_SIZE = 3;

/** Cap grid dimensions so the simulation stays fast on large screens. */
const MAX_GRID_W = 300;
const MAX_GRID_H = 225;

export function SandboxCanvas({
  canvasRef,
  onResize,
  onDraw,
  onDrawEnd,
}: SandboxCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const gridDimsRef = useRef({ w: 1, h: 1 });

  const toGridCoords = useCallback(
    (clientX: number, clientY: number): { gx: number; gy: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const { w, h } = gridDimsRef.current;
      const gx = Math.floor(((clientX - rect.left) / rect.width) * w);
      const gy = Math.floor(((clientY - rect.top) / rect.height) * h);
      if (gx < 0 || gx >= w || gy < 0 || gy >= h) return null;
      return { gx, gy };
    },
    [canvasRef],
  );

  const drawLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number) => {
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

      // Use coalesced events for smoother strokes (batches rapid moves)
      const events =
        typeof e.nativeEvent.getCoalescedEvents === "function"
          ? e.nativeEvent.getCoalescedEvents()
          : null;

      const points = events && events.length > 0 ? events : [e.nativeEvent];

      for (const pe of points) {
        const pos = toGridCoords(pe.clientX, pe.clientY);
        if (!pos) continue;
        const last = lastPosRef.current;
        if (last) {
          drawLine(last.x, last.y, pos.gx, pos.gy);
        } else {
          onDraw(pos.gx, pos.gy);
        }
        lastPosRef.current = { x: pos.gx, y: pos.gy };
      }
    },
    [toGridCoords, onDraw, drawLine],
  );

  const handlePointerUp = useCallback(() => {
    drawingRef.current = false;
    lastPosRef.current = null;
    onDrawEnd?.();
  }, [onDrawEnd]);

  // Measure container and size the canvas grid to fill it
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      // Use CSS pixels, not physical pixels
      const cssW = entry.contentRect.width;
      const cssH = entry.contentRect.height;
      const gw = Math.min(
        MAX_GRID_W,
        Math.max(1, Math.floor(cssW / CELL_SIZE)),
      );
      const gh = Math.min(
        MAX_GRID_H,
        Math.max(1, Math.floor(cssH / CELL_SIZE)),
      );

      // Only recreate grid if dimensions actually changed
      const prev = gridDimsRef.current;
      if (prev.w === gw && prev.h === gh) return;

      gridDimsRef.current = { w: gw, h: gh };
      // Canvas backing pixels = grid cells (1:1), CSS scales it up
      canvas.width = gw;
      canvas.height = gh;
      onResize(gw, gh);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [canvasRef, onResize]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: "100%",
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
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
        }}
      />
    </Box>
  );
}
