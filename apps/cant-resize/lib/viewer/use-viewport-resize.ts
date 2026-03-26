"use client";

import { useCallback, useRef, useState } from "react";

interface UseViewportResizeOptions {
  viewportId: string;
  width: number;
  height: number;
  canvasScale: number;
  minSize?: number;
  onSelect: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
}

export function useViewportResize(options: UseViewportResizeOptions) {
  const {
    viewportId,
    width,
    height,
    canvasScale,
    minSize = 200,
    onSelect,
    onResize,
  } = options;

  const [isResizing, setIsResizing] = useState(false);
  const [localSize, setLocalSize] = useState({ width, height });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const resizeDirection = useRef("se");

  // Sync local size with viewport when not actively resizing
  if (
    !isResizing &&
    (localSize.width !== width || localSize.height !== height)
  ) {
    setLocalSize({ width, height });
  }

  const displayWidth = isResizing ? localSize.width : width;
  const displayHeight = isResizing ? localSize.height : height;

  const handleResizeStart = useCallback(
    (e: React.PointerEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      onSelect(viewportId);
      resizeDirection.current = direction;
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: localSize.width,
        height: localSize.height,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [viewportId, localSize, onSelect],
  );

  const handleResizeMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isResizing) return;

      const deltaX = (e.clientX - resizeStart.current.x) / canvasScale;
      const deltaY = (e.clientY - resizeStart.current.y) / canvasScale;
      const dir = resizeDirection.current;

      let newWidth = resizeStart.current.width;
      let newHeight = resizeStart.current.height;

      if (dir.includes("e")) newWidth += deltaX;
      if (dir.includes("w")) newWidth -= deltaX;
      if (dir.includes("s")) newHeight += deltaY;
      if (dir.includes("n")) newHeight -= deltaY;

      setLocalSize({
        width: Math.max(minSize, newWidth),
        height: Math.max(minSize, newHeight),
      });
    },
    [isResizing, canvasScale, minSize],
  );

  const handleResizeEnd = useCallback(() => {
    if (isResizing) {
      onResize(viewportId, localSize.width, localSize.height);
    }
    setIsResizing(false);
  }, [isResizing, viewportId, localSize, onResize]);

  return {
    isResizing,
    displayWidth,
    displayHeight,
    localSize,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
  };
}
