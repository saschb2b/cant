"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { ViewerProvider } from "@/components/viewer/viewer-provider";
import { Canvas } from "@/components/viewer/canvas";
import { CanvasOverlay } from "@/components/viewer/canvas-overlay";

export default function ResponsiveViewerPage() {
  const [gridSnap, setGridSnap] = useState(false);
  const [showBreakpoints, setShowBreakpoints] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Prevent browser zoom (Ctrl+scroll / pinch) on the entire canvas page.
  // Without this, Ctrl+scroll on a selected viewport's iframe triggers
  // page-level zoom instead of canvas zoom.
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const preventBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", preventBrowserZoom, { passive: false });
    return () => el.removeEventListener("wheel", preventBrowserZoom);
  }, []);

  return (
    <ViewerProvider>
      <Box
        ref={pageRef}
        sx={{
          position: "relative",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Canvas
          gridSnap={gridSnap}
          showBreakpoints={showBreakpoints}
          showRulers={showRulers}
        />
        <CanvasOverlay
          gridSnap={gridSnap}
          onToggleGridSnap={() => setGridSnap((v) => !v)}
          showBreakpoints={showBreakpoints}
          onToggleBreakpoints={() => setShowBreakpoints((v) => !v)}
          showRulers={showRulers}
          onToggleRulers={() => setShowRulers((v) => !v)}
        />
      </Box>
    </ViewerProvider>
  );
}
