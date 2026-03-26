"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import type { CanvasTransform } from "./types";

interface UseCanvasOptions {
  transform: CanvasTransform;
  onTransformChange: (transform: CanvasTransform) => void;
  minScale?: number;
  maxScale?: number;
}

export function useCanvas(options: UseCanvasOptions) {
  const {
    transform,
    onTransformChange,
    minScale = 0.1,
    maxScale = 2,
  } = options;

  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  const transformRef = useRef(transform);
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  const onChangeRef = useRef(onTransformChange);
  useEffect(() => {
    onChangeRef.current = onTransformChange;
  }, [onTransformChange]);

  const limitsRef = useRef({ minScale, maxScale });
  useEffect(() => {
    limitsRef.current = { minScale, maxScale };
  }, [minScale, maxScale]);

  // Apply transform directly to DOM, bypassing React render cycle.
  // Batches with requestAnimationFrame so multiple events in one frame
  // only cause one DOM write.
  const applyTransform = useCallback((t: CanvasTransform) => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const content = contentRef.current;
      const container = containerRef.current;
      if (content) {
        content.style.transform = `translate(${String(t.x)}px, ${String(t.y)}px) scale(${String(t.scale)})`;
      }
      if (container) {
        const gridSize = 20 * t.scale;
        container.style.backgroundSize = `${String(gridSize)}px ${String(gridSize)}px`;
        container.style.backgroundPosition = `${String(t.x)}px ${String(t.y)}px`;
      }
      // Sync React state (for persisting to localStorage and overlay controls)
      onChangeRef.current(t);
    });
  }, []);

  // Stable wheel handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const t = transformRef.current;
      const { minScale: min, maxScale: max } = limitsRef.current;

      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = Math.pow(0.995, e.deltaY);
        const newScale = Math.min(max, Math.max(min, t.scale * zoomFactor));

        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const scaleFactor = newScale / t.scale;

          const newT = {
            x: mouseX - (mouseX - t.x) * scaleFactor,
            y: mouseY - (mouseY - t.y) * scaleFactor,
            scale: newScale,
          };
          transformRef.current = newT;
          applyTransform(newT);
        }
      } else {
        const newT = {
          ...t,
          x: t.x - e.deltaX,
          y: t.y - e.deltaY,
        };
        transformRef.current = newT;
        applyTransform(newT);
      }
    },
    [applyTransform],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
        e.preventDefault();
        setIsPanning(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [isSpacePressed],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      const t = transformRef.current;
      const newT = {
        ...t,
        x: t.x + deltaX,
        y: t.y + deltaY,
      };
      transformRef.current = newT;
      applyTransform(newT);
    },
    [isPanning, applyTransform],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Space key for pan mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Attach wheel listener once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return {
    containerRef,
    contentRef,
    transform,
    isPanning,
    isSpacePressed,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
