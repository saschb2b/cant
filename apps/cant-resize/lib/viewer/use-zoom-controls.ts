"use client";

import { useCallback } from "react";
import type { CanvasTransform, Viewport } from "./types";

interface UseZoomControlsOptions {
  canvasTransform: CanvasTransform;
  viewports: Viewport[];
  onTransformChange: (transform: CanvasTransform) => void;
  minScale?: number;
  maxScale?: number;
  canvasSelector?: string;
}

export function useZoomControls(options: UseZoomControlsOptions) {
  const {
    canvasTransform,
    viewports,
    onTransformChange,
    minScale = 0.1,
    maxScale = 2,
    canvasSelector = "[data-canvas-background]",
  } = options;

  const zoomPercentage = Math.round(canvasTransform.scale * 100);

  const zoomIn = useCallback(() => {
    const newScale = Math.min(maxScale, canvasTransform.scale + 0.1);
    onTransformChange({ ...canvasTransform, scale: newScale });
  }, [canvasTransform, maxScale, onTransformChange]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(minScale, canvasTransform.scale - 0.1);
    onTransformChange({ ...canvasTransform, scale: newScale });
  }, [canvasTransform, minScale, onTransformChange]);

  const handleZoomSlider = useCallback(
    (_: Event, value: number | number[]) => {
      const scale = typeof value === "number" ? value : (value[0] ?? 1);
      onTransformChange({ ...canvasTransform, scale });
    },
    [canvasTransform, onTransformChange],
  );

  const fitToContent = useCallback(() => {
    if (viewports.length === 0) return;

    const canvasEl = document.querySelector(canvasSelector)?.parentElement;
    const rect = canvasEl?.getBoundingClientRect();
    const containerWidth = rect?.width ?? 800;
    const containerHeight = rect?.height ?? 600;
    const padding = 60;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    viewports.forEach((v) => {
      minX = Math.min(minX, v.x);
      minY = Math.min(minY, v.y);
      maxX = Math.max(maxX, v.x + v.width);
      maxY = Math.max(maxY, v.y + v.height);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    if (contentWidth === 0 || contentHeight === 0) return;

    const scaleX = (containerWidth - padding * 2) / contentWidth;
    const scaleY = (containerHeight - padding * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY, maxScale);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    onTransformChange({
      x: containerWidth / 2 - centerX * scale,
      y: containerHeight / 2 - centerY * scale,
      scale,
    });
  }, [viewports, canvasSelector, maxScale, onTransformChange]);

  return {
    zoomPercentage,
    zoomIn,
    zoomOut,
    handleZoomSlider,
    fitToContent,
    scale: canvasTransform.scale,
    minScale,
    maxScale,
  };
}
