"use client";

import { useCallback, useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { X, RotateCcw, Loader2, AlertTriangle, Link2Off } from "lucide-react";
import { useViewer } from "./viewer-provider";
import { getDeviceById } from "@/lib/viewer/device-presets";
import { useViewportDrag } from "@/lib/viewer/use-viewport-drag";
import { useViewportResize } from "@/lib/viewer/use-viewport-resize";
import { useIframeSync } from "@/lib/viewer/use-iframe-sync";
import type { Viewport } from "@/lib/viewer/types";
import type { GuideLine } from "@/lib/viewer/use-snap";

interface ViewportFrameProps {
  viewport: Viewport;
  isGridMode?: boolean;
  gridScale?: number;
  gridSnap?: boolean;
  showBreakpoints?: boolean;
  showRulers?: boolean;
  onGuidesChange?: (guides: GuideLine[]) => void;
}

function noopGuides() {
  /* noop */
}

const BREAKPOINTS = [
  { label: "sm", value: 640, color: "#22c55e" },
  { label: "md", value: 768, color: "#f59e0b" },
  { label: "lg", value: 1024, color: "#3b82f6" },
  { label: "xl", value: 1280, color: "#a855f7" },
];

export function ViewportFrame({
  viewport,
  isGridMode = false,
  gridScale = 0.3,
  gridSnap = false,
  showBreakpoints = false,
  showRulers = false,
  onGuidesChange,
}: ViewportFrameProps) {
  const {
    state,
    removeViewport,
    toggleOrientation,
    selectViewport,
    dispatch,
    broadcastScroll,
    broadcastMouse,
    broadcastClick,
    broadcastHover,
    broadcastNavigation,
  } = useViewer();

  const device = getDeviceById(viewport.deviceId);
  const frameRef = useRef<HTMLDivElement>(null);
  const isSelected = state.selectedViewportId === viewport.id;
  const canvasScale = state.canvasTransform.scale;

  // Header stays a constant 40px on screen regardless of canvas zoom
  const headerScreenHeight = 40;
  const headerCanvasHeight = isGridMode
    ? headerScreenHeight
    : headerScreenHeight / canvasScale;
  const headerInverseScale = isGridMode ? 1 : 1 / canvasScale;

  const { isDragging, handleDragStart, handleDragMove, handleDragEnd } =
    useViewportDrag({
      viewportId: viewport.id,
      viewportX: viewport.x,
      viewportY: viewport.y,
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      canvasScale: state.canvasTransform.scale,
      isGridMode,
      allViewports: state.viewports,
      gridSnap,
      onSelect: selectViewport,
      onMove: (id, x, y) =>
        dispatch({ type: "UPDATE_VIEWPORT", id, updates: { x, y } }),
      onGuidesChange: onGuidesChange ?? noopGuides,
    });

  const {
    isResizing,
    displayWidth,
    displayHeight,
    localSize,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
  } = useViewportResize({
    viewportId: viewport.id,
    width: viewport.width,
    height: viewport.height,
    canvasScale: state.canvasTransform.scale,
    onSelect: selectViewport,
    onResize: (id, width, height) =>
      dispatch({ type: "UPDATE_VIEWPORT", id, updates: { width, height } }),
  });

  const {
    iframeRef,
    isLoading,
    hasError,
    isSyncEnabled,
    handleIframeLoad,
    handleIframeError,
    srcDoc,
  } = useIframeSync({
    viewportId: viewport.id,
    url: state.url,
    scrollPosition: state.scrollPosition,
    broadcastScroll,
    broadcastMouse,
    broadcastClick,
    broadcastHover,
    broadcastNavigation,
  });

  // Mouse position tracking for ruler indicator (in viewport px, not screen px)
  const [mouseX, setMouseX] = useState<number | null>(null);

  const handleContainerMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!showRulers) return;
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      // Convert screen position to viewport pixels
      const relX = e.clientX - rect.left;
      const containerWidth = rect.width;
      const vpX = Math.round((relX / containerWidth) * displayWidth);
      setMouseX(Math.max(0, Math.min(vpX, displayWidth)));
    },
    [showRulers, displayWidth],
  );

  const handleContainerMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  return (
    <Box
      ref={frameRef}
      onClick={() => selectViewport(viewport.id)}
      sx={[
        isDragging && { cursor: "grabbing" },
        isGridMode ? { position: "relative" } : { position: "absolute" },
      ]}
      style={
        isGridMode
          ? {
              width: displayWidth * gridScale,
              height: displayHeight * gridScale + headerScreenHeight,
            }
          : {
              left: viewport.x,
              top: viewport.y,
              width: displayWidth,
              height: displayHeight + headerCanvasHeight,
            }
      }
    >
      {/* Header - floats above the frame, inverse-scaled to stay readable */}
      <Box
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        sx={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            height: headerScreenHeight,
            px: 1.5,
            userSelect: "none",
            transformOrigin: "top left",
            zIndex: 5,
            whiteSpace: "nowrap",
          },
          !isGridMode && { cursor: "grab" },
        ]}
        style={
          isGridMode
            ? {}
            : {
                transform: `scale(${String(headerInverseScale)})`,
              }
        }
      >
        <Typography
          variant="caption"
          fontWeight={600}
          noWrap
          sx={{
            color: "text.primary",
            bgcolor: "background.paper",
            px: 1,
            py: 0.25,
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
            fontSize: "0.7rem",
            maxWidth: 120,
          }}
        >
          {viewport.customName ?? device?.name ?? "Custom"}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: "0.65rem",
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          {Math.round(displayWidth)}&times;{Math.round(displayHeight)}
        </Typography>
        {isSyncEnabled === false && (
          <Tooltip title="Sync unavailable (cross-origin). Use localhost for full sync.">
            <Link2Off size={12} color="#f59e0b" />
          </Tooltip>
        )}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            toggleOrientation(viewport.id);
          }}
          title="Toggle orientation"
          sx={{ width: 22, height: 22, color: "text.secondary" }}
        >
          <RotateCcw size={12} />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            removeViewport(viewport.id);
          }}
          title="Remove device"
          sx={{
            width: 22,
            height: 22,
            color: "text.secondary",
            "&:hover": { color: "error.main" },
          }}
        >
          <X size={12} />
        </IconButton>
      </Box>

      {/* Iframe container */}
      <Box
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "background.paper",
          overflow: "hidden",
          borderRadius: 1,
          boxShadow: isSelected ? 12 : 4,
          border: 1,
          borderColor: isSelected ? "primary.main" : "divider",
          transition: "box-shadow 0.2s, border-color 0.2s",
        }}
        style={{ top: headerCanvasHeight }}
      >
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,0.05)",
              zIndex: 10,
            }}
          >
            <Loader2
              size={24}
              style={{ animation: "spin 1s linear infinite" }}
            />
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </Box>
        )}

        {hasError && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,0.05)",
              zIndex: 10,
              p: 2,
              textAlign: "center",
            }}
          >
            <AlertTriangle size={32} color="#dc2626" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Failed to load this site
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ maxWidth: 240 }}
            >
              The site may block iframe embedding (X-Frame-Options / CSP), the
              URL may be invalid, or the server may be unreachable.
            </Typography>
          </Box>
        )}

        <iframe
          ref={iframeRef}
          data-viewport-iframe
          data-viewport-id={viewport.id}
          srcDoc={srcDoc}
          style={{
            width: isGridMode ? displayWidth : "100%",
            height: isGridMode ? displayHeight : "100%",
            border: "none",
            ...(isGridMode
              ? {
                  transform: `scale(${String(gridScale)})`,
                  transformOrigin: "top left",
                }
              : {}),
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title={device?.name ?? "Viewport"}
        />

        {/* Click-catcher: visible when not selected so clicking anywhere selects the viewport */}
        {!isSelected && (
          <Box
            onClick={() => selectViewport(viewport.id)}
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              cursor: "pointer",
            }}
          />
        )}

        {/* Per-viewport breakpoint markers */}
        {showBreakpoints &&
          BREAKPOINTS.filter((bp) => bp.value < displayWidth).map((bp) => {
            // Position as percentage of viewport width
            const pct = (bp.value / displayWidth) * 100;
            return (
              <Box
                key={bp.label}
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: 0,
                  borderLeft: "1px dashed",
                  borderColor: bp.color,
                  opacity: 0.5,
                  zIndex: 6,
                  pointerEvents: "none",
                }}
                style={{ left: `${String(pct)}%` }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 4,
                    left: 4,
                    fontSize: "0.5rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-geist-mono), monospace",
                    color: bp.color,
                    bgcolor: "rgba(0,0,0,0.6)",
                    px: 0.5,
                    py: 0.125,
                    borderRadius: 0.5,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  {bp.label} {bp.value}
                </Box>
              </Box>
            );
          })}

        {/* Per-viewport pixel ruler (top edge) */}
        {showRulers && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 14,
              bgcolor: "rgba(0,0,0,0.45)",
              zIndex: 6,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <svg
              width="100%"
              height="14"
              style={{ display: "block" }}
              preserveAspectRatio="none"
              viewBox={`0 0 ${String(displayWidth)} 14`}
            >
              {Array.from(
                { length: Math.ceil(displayWidth / 50) + 1 },
                (_, i) => {
                  const px = i * 50;
                  const isMajor = px % 100 === 0;
                  return (
                    <g key={px}>
                      <line
                        x1={px}
                        y1={isMajor ? 4 : 8}
                        x2={px}
                        y2={14}
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth={isMajor ? 1 : 0.5}
                      />
                      {isMajor && (
                        <text
                          x={px + 3}
                          y={8}
                          fill="rgba(255,255,255,0.7)"
                          fontSize="7"
                          fontFamily="var(--font-geist-mono), monospace"
                        >
                          {px}
                        </text>
                      )}
                    </g>
                  );
                },
              )}
              {/* Cursor position indicator */}
              {mouseX !== null && (
                <>
                  <line
                    x1={mouseX}
                    y1={0}
                    x2={mouseX}
                    y2={14}
                    stroke="#f43f5e"
                    strokeWidth={1.5}
                  />
                  <rect
                    x={mouseX + 2}
                    y={0}
                    width={String(mouseX).length * 6 + 6}
                    height={10}
                    rx={2}
                    fill="#f43f5e"
                  />
                  <text
                    x={mouseX + 5}
                    y={7.5}
                    fill="#fff"
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    {mouseX}
                  </text>
                </>
              )}
            </svg>
          </Box>
        )}

        {/* Cursor crosshair line extending down from ruler */}
        {showRulers && mouseX !== null && (
          <Box
            sx={{
              position: "absolute",
              top: 14,
              bottom: 0,
              width: 0,
              borderLeft: "1px solid #f43f5e",
              opacity: 0.4,
              zIndex: 6,
              pointerEvents: "none",
            }}
            style={{ left: `${String((mouseX / displayWidth) * 100)}%` }}
          />
        )}
      </Box>

      {/* Resize handles */}
      {!isGridMode && (
        <>
          {/* Dimension tooltip while resizing */}
          {isResizing && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "rgba(0,0,0,0.8)",
                color: "#fff",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: 600,
                zIndex: 30,
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {Math.round(localSize.width)} × {Math.round(localSize.height)}
            </Box>
          )}

          {/* Edge handles */}
          {(
            [
              {
                dir: "n",
                cursor: "ns-resize",
                top: -4,
                left: 12,
                right: 12,
                height: 8,
              },
              {
                dir: "s",
                cursor: "ns-resize",
                bottom: -4,
                left: 12,
                right: 12,
                height: 8,
              },
              {
                dir: "w",
                cursor: "ew-resize",
                left: -4,
                top: 12,
                bottom: 12,
                width: 8,
              },
              {
                dir: "e",
                cursor: "ew-resize",
                right: -4,
                top: 12,
                bottom: 12,
                width: 8,
              },
            ] as const
          ).map(({ dir, cursor, ...pos }) => (
            <Box
              key={dir}
              onPointerDown={(e) => handleResizeStart(e, dir)}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              onPointerCancel={handleResizeEnd}
              sx={{
                position: "absolute",
                cursor,
                zIndex: 20,
                "&:hover": { bgcolor: "rgba(59,130,246,0.15)" },
                ...pos,
              }}
            />
          ))}

          {/* Corner handles */}
          {(
            [
              { dir: "nw", cursor: "nwse-resize", top: -4, left: -4 },
              { dir: "ne", cursor: "nesw-resize", top: -4, right: -4 },
              { dir: "sw", cursor: "nesw-resize", bottom: -4, left: -4 },
              { dir: "se", cursor: "nwse-resize", bottom: -4, right: -4 },
            ] as const
          ).map(({ dir, cursor, ...pos }) => (
            <Box
              key={dir}
              onPointerDown={(e) => handleResizeStart(e, dir)}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              onPointerCancel={handleResizeEnd}
              sx={{
                position: "absolute",
                width: 8,
                height: 8,
                cursor,
                zIndex: 21,
                borderRadius: "50%",
                bgcolor: "primary.main",
                opacity: isSelected ? 0.7 : 0,
                transition: "opacity 0.15s",
                "&:hover": { opacity: 1 },
                ...pos,
              }}
            />
          ))}
        </>
      )}
    </Box>
  );
}
