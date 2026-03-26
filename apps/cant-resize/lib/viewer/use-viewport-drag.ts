"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { computeSnap, type GuideLine } from "./use-snap";
import type { Viewport } from "./types";

interface UseViewportDragOptions {
  viewportId: string;
  viewportX: number;
  viewportY: number;
  viewportWidth: number;
  viewportHeight: number;
  canvasScale: number;
  isGridMode: boolean;
  allViewports: Viewport[];
  gridSnap: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onGuidesChange: (guides: GuideLine[]) => void;
}

export function useViewportDrag(options: UseViewportDragOptions) {
  const { viewportId, viewportX, viewportY, isGridMode, onSelect } = options;

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, viewportX: 0, viewportY: 0 });

  // Keep refs for values read during drag to avoid recreating handlers
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (isGridMode) return;
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);
      onSelect(viewportId);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        viewportX,
        viewportY,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isGridMode, viewportId, viewportX, viewportY, onSelect],
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;

      const opts = optionsRef.current;
      const deltaX = (e.clientX - dragStart.current.x) / opts.canvasScale;
      const deltaY = (e.clientY - dragStart.current.y) / opts.canvasScale;

      const rawX = dragStart.current.viewportX + deltaX;
      const rawY = dragStart.current.viewportY + deltaY;

      const snap = computeSnap(
        opts.viewportId,
        rawX,
        rawY,
        opts.viewportWidth,
        opts.viewportHeight,
        opts.allViewports,
        opts.canvasScale,
        opts.gridSnap,
      );

      opts.onMove(opts.viewportId, snap.x, snap.y);
      opts.onGuidesChange(snap.guides);
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    optionsRef.current.onGuidesChange([]);
  }, []);

  return {
    isDragging,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
