"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { Plus, Smartphone, Tablet, Monitor } from "lucide-react";
import { useViewer } from "./viewer-provider";
import { useCanvas } from "@/lib/viewer/use-canvas";
import { ViewportFrame } from "./viewport-frame";
import { DevicePicker } from "./device-picker";
import { getDeviceById } from "@/lib/viewer/device-presets";
import type { GuideLine } from "@/lib/viewer/use-snap";

// ── Grid drag-to-reorder state ──────────────────────────────────────────────

interface GridDragState {
  /** Index of the viewport being dragged. */
  fromIndex: number;
  /** Current insertion target index. */
  overIndex: number;
  /** Cursor offset from the top-left of the dragged element. */
  offset: { x: number; y: number };
  /** Current cursor position (fixed). */
  cursor: { x: number; y: number };
  /** Size of the dragged element for the ghost. */
  size: { width: number; height: number };
}

// ── Grid mode component ─────────────────────────────────────────────────────

function useGridScale(viewports: { width: number; height: number }[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || viewports.length === 0) return;

    const compute = () => {
      const containerW = el.clientWidth - 48; // px padding
      const containerH = el.clientHeight - 88; // pt padding + bottom buffer
      if (containerW <= 0 || containerH <= 0) return;

      const gap = 24; // gap: 3 = 24px
      const headerH = 40;

      // Try fitting all viewports in a row first
      const totalNativeWidth = viewports.reduce((sum, v) => sum + v.width, 0);
      const totalGaps = (viewports.length - 1) * gap;
      const maxNativeHeight = Math.max(...viewports.map((v) => v.height));

      // Scale to fit width
      const scaleW = (containerW - totalGaps) / totalNativeWidth;
      // Scale to fit height (tallest viewport + header)
      const scaleH = (containerH - headerH) / maxNativeHeight;

      // Use the smaller, clamped between reasonable bounds
      const optimal = Math.min(scaleW, scaleH);
      setScale(Math.max(0.15, Math.min(0.6, optimal)));
    };

    compute();

    const observer = new ResizeObserver(compute);
    observer.observe(el);
    return () => observer.disconnect();
  }, [viewports]);

  return { containerRef, scale };
}

function GridCanvas() {
  const { state, dispatch, selectViewport } = useViewer();
  const [drag, setDrag] = useState<GridDragState | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { containerRef: gridContainerRef, scale: gridScale } = useGridScale(
    state.viewports,
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, index: number) => {
      // Only left button
      if (e.button !== 0) return;

      // Don't start drag when clicking interactive elements (buttons, icons)
      const target = e.target as HTMLElement;
      if (target.closest("button, [role='button'], a")) return;

      const el = itemRefs.current[index];
      if (!el) return;

      const rect = el.getBoundingClientRect();
      el.setPointerCapture(e.pointerId);

      setDrag({
        fromIndex: index,
        overIndex: index,
        offset: { x: e.clientX - rect.left, y: e.clientY - rect.top },
        cursor: { x: e.clientX, y: e.clientY },
        size: { width: rect.width, height: rect.height },
      });
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag) return;

      // Find which item the cursor is over
      let newOverIndex = drag.overIndex;
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el || i === drag.fromIndex) continue;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        if (
          e.clientX > rect.left &&
          e.clientX < rect.right &&
          e.clientY > rect.top &&
          e.clientY < rect.bottom
        ) {
          // Decide before/after based on cursor relative to center
          if (e.clientX < centerX || e.clientY < centerY) {
            newOverIndex = i;
          } else {
            newOverIndex = i + 1;
          }
        }
      }

      // Clamp
      newOverIndex = Math.max(
        0,
        Math.min(newOverIndex, state.viewports.length),
      );

      setDrag((prev) =>
        prev
          ? {
              ...prev,
              cursor: { x: e.clientX, y: e.clientY },
              overIndex: newOverIndex,
            }
          : null,
      );
    },
    [drag, state.viewports.length],
  );

  const handlePointerUp = useCallback(() => {
    if (!drag) return;

    if (drag.fromIndex !== drag.overIndex) {
      // Adjust target index: if moving forward, account for removal
      const toIndex =
        drag.overIndex > drag.fromIndex ? drag.overIndex - 1 : drag.overIndex;
      dispatch({
        type: "REORDER_VIEWPORTS",
        fromIndex: drag.fromIndex,
        toIndex,
      });
    }

    setDrag(null);
  }, [drag, dispatch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && drag) {
        setDrag(null);
      }
    },
    [drag],
  );

  // Calculate the visual position each item should shift to
  const getItemTransform = (index: number): string => {
    if (!drag || index === drag.fromIndex) return "none";

    // Items between fromIndex and overIndex need to shift
    const { fromIndex, overIndex } = drag;

    if (fromIndex < overIndex) {
      // Dragging forward: items between (from, over) shift left
      if (index > fromIndex && index < overIndex) {
        return `translateX(-${String(drag.size.width + 24)}px)`;
      }
    } else {
      // Dragging backward: items between [over, from) shift right
      if (index >= overIndex && index < fromIndex) {
        return `translateX(${String(drag.size.width + 24)}px)`;
      }
    }

    return "none";
  };

  return (
    <Box
      ref={gridContainerRef}
      sx={{
        height: "100%",
        overflow: "auto",
        pr: 3,
        pl: 8,
        pb: 3,
        pt: 8,
        bgcolor: "action.hover",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) selectViewport(null);
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {state.viewports.map((viewport, index) => {
          const isDragged = drag?.fromIndex === index;

          return (
            <Box
              key={viewport.id}
              ref={(el: HTMLDivElement | null) => {
                itemRefs.current[index] = el;
              }}
              onPointerDown={
                isDragged ? undefined : (e) => handlePointerDown(e, index)
              }
              sx={{
                cursor: drag ? "grabbing" : "grab",
                transition: drag && !isDragged ? "transform 0.2s ease" : "none",
              }}
              style={{
                transform: getItemTransform(index),
                // Keep the element in flow for sizing but make it invisible
                ...(isDragged ? { visibility: "hidden" as const } : {}),
              }}
            >
              <ViewportFrame
                viewport={viewport}
                isGridMode
                gridScale={gridScale}
              />
            </Box>
          );
        })}

        {/* Drag ghost: visual-only device card following the cursor.
            The actual ViewportFrame stays mounted (hidden) so no iframe reload. */}
        {drag &&
          state.viewports[drag.fromIndex] &&
          (() => {
            const vp = state.viewports[drag.fromIndex];
            if (!vp) return null;
            const device = getDeviceById(vp.deviceId);
            const name = vp.customName ?? device?.name ?? "Custom";
            const category = device?.category ?? "custom";
            const DeviceIcon =
              category === "phone"
                ? Smartphone
                : category === "tablet"
                  ? Tablet
                  : Monitor;

            return (
              <Box
                sx={{
                  position: "fixed",
                  zIndex: 9999,
                  pointerEvents: "none",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(var(--mui-palette-primary-mainChannel) / 0.3)",
                }}
                style={{
                  left: drag.cursor.x - drag.offset.x,
                  top: drag.cursor.y - drag.offset.y,
                  width: drag.size.width,
                  height: drag.size.height,
                  transform: "scale(1.05) rotate(-1deg)",
                }}
              >
                {/* Frosted glass background */}
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor:
                      "rgba(var(--mui-palette-background-paperChannel) / 0.85)",
                    backdropFilter: "blur(20px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                  }}
                >
                  {/* Device icon */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor:
                        "rgba(var(--mui-palette-primary-mainChannel) / 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                    }}
                  >
                    <DeviceIcon size={24} />
                  </Box>

                  {/* Device name */}
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.primary"
                    textAlign="center"
                    noWrap
                    sx={{ maxWidth: "80%", px: 1 }}
                  >
                    {name}
                  </Typography>

                  {/* Dimensions */}
                  <Typography
                    variant="caption"
                    fontFamily="var(--font-geist-mono), monospace"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {vp.width} &times; {vp.height}
                  </Typography>
                </Box>
              </Box>
            );
          })()}
        {state.viewports.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 400,
              color: "text.secondary",
              gap: 2,
            }}
          >
            <Box sx={{ mb: 1 }}>
              <Image src="/icon.svg" alt="" width={48} height={48} />
            </Box>
            <Typography variant="h6">No devices added</Typography>
            <Typography variant="body2" color="text.secondary">
              Add a device to start previewing your site across screen sizes
            </Typography>
            <DevicePicker
              renderTrigger={(open) => (
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={open}
                  sx={{ mt: 1 }}
                >
                  Add Device
                </Button>
              )}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Main canvas export ──────────────────────────────────────────────────────

interface CanvasProps {
  gridSnap?: boolean;
  showBreakpoints?: boolean;
  showRulers?: boolean;
}

export function Canvas({
  gridSnap = false,
  showBreakpoints = false,
  showRulers = false,
}: CanvasProps) {
  const { state, selectViewport, setCanvasTransform } = useViewer();
  const [guides, setGuides] = useState<GuideLine[]>([]);

  const {
    containerRef,
    contentRef,
    transform,
    isPanning,
    isSpacePressed,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvas({
    transform: state.canvasTransform,
    onTransformChange: setCanvasTransform,
  });

  if (state.layoutMode === "grid") {
    return <GridCanvas />;
  }

  return (
    <Box
      ref={containerRef}
      sx={[
        {
          height: "100%",
          overflow: "hidden",
          position: "relative",
        },
        isSpacePressed && { cursor: "grab" },
        isPanning && { cursor: "grabbing" },
      ]}
      style={{
        backgroundColor: "var(--mui-palette-action-hover)",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, var(--mui-palette-divider) 1px, transparent 0)",
        backgroundSize: `${String(20 * transform.scale)}px ${String(20 * transform.scale)}px`,
        backgroundPosition: `${String(transform.x)}px ${String(transform.y)}px`,
      }}
      onClick={(e) => {
        // Deselect when clicking the canvas background (not a viewport)
        if (
          e.target === e.currentTarget ||
          (e.target as HTMLElement).dataset.canvasBackground !== undefined
        ) {
          selectViewport(null);
        }
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Transformed canvas content */}
      <Box
        ref={contentRef}
        data-canvas-background
        sx={{
          position: "absolute",
          transformOrigin: "top left",
          willChange: "transform",
        }}
        style={{
          transform: `translate(${String(transform.x)}px, ${String(transform.y)}px) scale(${String(transform.scale)})`,
          width: "10000px",
          height: "10000px",
        }}
      >
        {state.viewports.map((viewport) => (
          <ViewportFrame
            key={viewport.id}
            viewport={viewport}
            gridSnap={gridSnap}
            showBreakpoints={showBreakpoints}
            showRulers={showRulers}
            onGuidesChange={setGuides}
          />
        ))}
      </Box>

      {/* Alignment guide lines */}
      {guides.map((guide, i) => {
        if (guide.axis === "v") {
          const screenX = transform.x + guide.position * transform.scale;
          const screenFrom = transform.y + guide.from * transform.scale;
          const screenTo = transform.y + guide.to * transform.scale;
          return (
            <Box
              key={`g${String(i)}`}
              sx={{
                position: "absolute",
                width: 0,
                borderLeft: "1px solid",
                borderColor: "primary.main",
                opacity: 0.6,
                pointerEvents: "none",
                zIndex: 50,
              }}
              style={{
                left: screenX,
                top: screenFrom,
                height: screenTo - screenFrom,
              }}
            />
          );
        }
        // Horizontal guide
        const screenY = transform.y + guide.position * transform.scale;
        const screenFrom = transform.x + guide.from * transform.scale;
        const screenTo = transform.x + guide.to * transform.scale;
        return (
          <Box
            key={`g${String(i)}`}
            sx={{
              position: "absolute",
              height: 0,
              borderTop: "1px solid",
              borderColor: "primary.main",
              opacity: 0.6,
              pointerEvents: "none",
              zIndex: 50,
            }}
            style={{
              top: screenY,
              left: screenFrom,
              width: screenTo - screenFrom,
            }}
          />
        );
      })}

      {/* Empty state */}
      {state.viewports.length === 0 && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            gap: 2,
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Image src="/icon.svg" alt="" width={48} height={48} />
          </Box>
          <Typography variant="h6">No devices added</Typography>
          <Typography variant="body2" color="text.secondary">
            Add a device to start previewing your site across screen sizes
          </Typography>
          <DevicePicker
            renderTrigger={(open) => (
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={open}
                sx={{ mt: 1 }}
              >
                Add Device
              </Button>
            )}
          />
        </Box>
      )}
    </Box>
  );
}
