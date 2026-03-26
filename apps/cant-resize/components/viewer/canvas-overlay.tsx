"use client";

import { useState, useCallback, useEffect, useSyncExternalStore } from "react";
import NextLink from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useColorScheme } from "@mui/material/styles";
import {
  Search,
  GraduationCap,
  LayoutGrid,
  Move,
  ZoomIn,
  ZoomOut,
  Maximize,
  RefreshCw,
  ExternalLink,
  Link2,
  MousePointer2,
  Hand,
  Navigation,
  ArrowUpDown,
  AlignHorizontalSpaceAround,
  LayoutDashboard,
} from "lucide-react";
import { useViewer } from "./viewer-provider";
import { DevicePicker } from "./device-picker";
import { CanvasLeftRail } from "./canvas-left-rail";
import { arrangeHorizontal, arrangeGrid } from "@/lib/viewer/use-snap";
import { useZoomControls } from "@/lib/viewer/use-zoom-controls";
import { SearchPalette } from "@/components/search-palette";
import { trackEvent } from "@/lib/analytics";
import type { LayoutMode } from "@/lib/viewer/types";

/** Shared styles for floating widget pills. */
const pillSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 1.5,
  py: 0.75,
  borderRadius: 2,
  bgcolor: "background.paper",
  border: 1,
  borderColor: "divider",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  pointerEvents: "auto" as const,
} as const;

// ── Theme toggle (compact) ──────────────────────────────────────────────────

function ThemeIcon({ isDark, size = 16 }: { isDark: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ overflow: "visible" }}
    >
      <mask id="canvas-theme-mask">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <circle
          cx={isDark ? 17 : 32}
          cy={isDark ? 7 : 2}
          r="9"
          fill="black"
          style={{ transition: "cx 0.5s ease, cy 0.5s ease" }}
        />
      </mask>
      <circle
        cx="12"
        cy="12"
        r={isDark ? 9 : 5}
        fill="currentColor"
        stroke="none"
        mask="url(#canvas-theme-mask)"
        style={{ transition: "r 0.5s ease" }}
      />
      <g
        style={{
          transformOrigin: "center",
          transition: "transform 0.5s ease, opacity 0.3s ease",
          transform: isDark
            ? "rotate(45deg) scale(0)"
            : "rotate(0deg) scale(1)",
          opacity: isDark ? 0 : 1,
        }}
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

function CompactThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const emptySubscribe = useCallback(() => () => undefined, []);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const resolvedMode = mode === "system" ? systemMode : mode;
  const isDark = resolvedMode === "dark";

  return (
    <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
      <IconButton
        size="small"
        onClick={mounted ? () => setMode(isDark ? "light" : "dark") : undefined}
        sx={{ color: "text.secondary" }}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <Box
          sx={{
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <ThemeIcon isDark={isDark} />
        </Box>
      </IconButton>
    </Tooltip>
  );
}

// ── Main overlay ────────────────────────────────────────────────────────────

interface CanvasOverlayProps {
  gridSnap: boolean;
  onToggleGridSnap: () => void;
  showBreakpoints: boolean;
  onToggleBreakpoints: () => void;
  showRulers: boolean;
  onToggleRulers: () => void;
}

export function CanvasOverlay({
  gridSnap,
  onToggleGridSnap,
  showBreakpoints,
  onToggleBreakpoints,
  showRulers,
  onToggleRulers,
}: CanvasOverlayProps) {
  const {
    state,
    dispatch,
    setUrl,
    setLayoutMode,
    setCanvasTransform,
    setSyncSettings,
  } = useViewer();
  const [urlState, setUrlState] = useState({
    external: state.url,
    local: state.url,
  });
  if (urlState.external !== state.url) {
    setUrlState({ external: state.url, local: state.url });
  }
  const urlInput = urlState.local;
  const setUrlInput = useCallback(
    (value: string) => setUrlState((prev) => ({ ...prev, local: value })),
    [],
  );
  const [syncAnchorEl, setSyncAnchorEl] = useState<HTMLElement | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    zoomPercentage,
    zoomIn,
    zoomOut,
    handleZoomSlider,
    fitToContent,
    scale,
    minScale,
    maxScale,
  } = useZoomControls({
    canvasTransform: state.canvasTransform,
    viewports: state.viewports,
    onTransformChange: setCanvasTransform,
  });

  const handleUrlSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      let url = urlInput.trim();
      if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
        setUrlInput(url);
      }
      setUrl(url);
    },
    [urlInput, setUrl],
  );

  const handleRefresh = useCallback(() => {
    const currentUrl = state.url;
    setUrl("");
    setTimeout(() => setUrl(currentUrl), 50);
  }, [state.url, setUrl]);

  const openInNewTab = useCallback(() => {
    if (state.url) window.open(state.url, "_blank");
  }, [state.url]);

  const openSearch = useCallback((trigger: "hotkey" | "button") => {
    trackEvent("search-opened", { trigger });
    setSearchOpen(true);
  }, []);

  // Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch("hotkey");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openSearch]);

  const hasDevices = state.viewports.length > 0;

  return (
    <>
      {/* Overlay container: fills canvas, passes clicks through */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gridTemplateColumns: "auto 1fr",
          gap: 1.5,
          p: 1.5,
        }}
      >
        {/* ── Top row (spans both columns) ── */}
        <Box
          sx={{
            gridColumn: "1 / -1",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          {/* Top-left: Logo */}
          <NextLink
            href="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              pointerEvents: "auto",
            }}
          >
            <Tooltip title="Back to home">
              <Box sx={pillSx}>
                <Image
                  src="/icon.svg"
                  alt="Can't Resize"
                  width={20}
                  height={20}
                  priority
                />
              </Box>
            </Tooltip>
          </NextLink>

          {/* Top-center: URL bar */}
          <Box
            component="form"
            onSubmit={handleUrlSubmit}
            sx={{
              ...pillSx,
              maxWidth: 560,
              justifySelf: "center",
              width: "100%",
            }}
          >
            <TextField
              type="url"
              placeholder="Enter URL to preview..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              size="small"
              fullWidth
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: { fontSize: "0.85rem" },
                },
              }}
            />
            <Button
              type="submit"
              variant="outlined"
              size="small"
              sx={{ minWidth: "auto", px: 1.5, flexShrink: 0 }}
            >
              Go
            </Button>
            <Tooltip title="Open in new tab">
              <IconButton size="small" onClick={openInNewTab}>
                <ExternalLink size={14} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Top-right: Nav actions */}
          <Box sx={pillSx}>
            <Tooltip title="Search (Ctrl+K)">
              <IconButton
                size="small"
                onClick={() => openSearch("button")}
                sx={{ color: "text.secondary" }}
                aria-label="Search"
              >
                <Search size={16} />
              </IconButton>
            </Tooltip>
            <NextLink
              href="/learn"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Tooltip title="Learn patterns">
                <IconButton
                  component="span"
                  size="small"
                  sx={{ color: "text.secondary" }}
                  aria-label="Learn"
                >
                  <GraduationCap size={16} />
                </IconButton>
              </Tooltip>
            </NextLink>
            <CompactThemeToggle />
          </Box>
        </Box>

        {/* ── Left rail (middle row, first column) ── */}
        <Box sx={{ alignSelf: "center" }}>
          <CanvasLeftRail
            showBreakpoints={showBreakpoints}
            onToggleBreakpoints={onToggleBreakpoints}
            showRulers={showRulers}
            onToggleRulers={onToggleRulers}
            gridSnap={gridSnap}
            onToggleGridSnap={onToggleGridSnap}
          />
        </Box>

        {/* Spacer for middle row, second column */}
        <Box />

        {/* ── Bottom row (spans both columns) ── */}
        <Box
          sx={{
            gridColumn: "1 / -1",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {/* Bottom-left: Viewer tools */}
          <Box sx={{ ...pillSx, gap: 0.5 }}>
            <DevicePicker />

            {hasDevices && (
              <>
                <ToggleButtonGroup
                  value={state.layoutMode}
                  exclusive
                  onChange={(_, val: LayoutMode | null) =>
                    val && setLayoutMode(val)
                  }
                  size="small"
                >
                  <ToggleButton value="freeform" sx={{ px: 0.75, py: 0.5 }}>
                    <Tooltip title="Freeform canvas">
                      <Box sx={{ display: "flex" }}>
                        <Move size={14} />
                      </Box>
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="grid" sx={{ px: 0.75, py: 0.5 }}>
                    <Tooltip title="Grid layout">
                      <Box sx={{ display: "flex" }}>
                        <LayoutGrid size={14} />
                      </Box>
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>

                <Button
                  variant="text"
                  size="small"
                  startIcon={<Link2 size={14} />}
                  onClick={(e) => setSyncAnchorEl(e.currentTarget)}
                  sx={{
                    color: "text.secondary",
                    minWidth: "auto",
                    px: 1,
                    fontSize: "0.75rem",
                  }}
                >
                  Sync
                </Button>

                <Tooltip title="Refresh all viewports">
                  <IconButton size="small" onClick={handleRefresh}>
                    <RefreshCw size={14} />
                  </IconButton>
                </Tooltip>

                {state.layoutMode === "freeform" && (
                  <>
                    <Tooltip title="Arrange in a row">
                      <IconButton
                        size="small"
                        onClick={() => {
                          const updates = arrangeHorizontal(state.viewports);
                          for (const u of updates) {
                            if ("id" in u && u.id) {
                              dispatch({
                                type: "UPDATE_VIEWPORT",
                                id: u.id,
                                updates: { x: u.x, y: u.y },
                              });
                            }
                          }
                        }}
                      >
                        <AlignHorizontalSpaceAround size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Auto-arrange grid">
                      <IconButton
                        size="small"
                        onClick={() => {
                          const updates = arrangeGrid(state.viewports);
                          for (const u of updates) {
                            if ("id" in u && u.id) {
                              dispatch({
                                type: "UPDATE_VIEWPORT",
                                id: u.id,
                                updates: { x: u.x, y: u.y },
                              });
                            }
                          }
                        }}
                      >
                        <LayoutDashboard size={14} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </>
            )}
          </Box>

          {/* Bottom-right: Zoom controls */}
          {hasDevices && state.layoutMode === "freeform" && (
            <Box sx={{ ...pillSx, gap: 0.5 }}>
              <Tooltip title="Zoom out">
                <IconButton size="small" onClick={zoomOut}>
                  <ZoomOut size={14} />
                </IconButton>
              </Tooltip>
              <Slider
                value={scale}
                onChange={handleZoomSlider}
                min={minScale}
                max={maxScale}
                step={0.05}
                size="small"
                sx={{ width: 80 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ width: 36, textAlign: "center", fontSize: "0.7rem" }}
              >
                {zoomPercentage}%
              </Typography>
              <Tooltip title="Zoom in">
                <IconButton size="small" onClick={zoomIn}>
                  <ZoomIn size={14} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Fit to content">
                <IconButton size="small" onClick={fitToContent}>
                  <Maximize size={14} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>

      {/* Sync popover (rendered outside overlay for correct stacking) */}
      <Popover
        open={Boolean(syncAnchorEl)}
        anchorEl={syncAnchorEl}
        onClose={() => setSyncAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, width: 240 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Sync Events
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {[
              {
                key: "scroll" as const,
                icon: <ArrowUpDown size={14} />,
                label: "Scroll",
              },
              {
                key: "mouse" as const,
                icon: <MousePointer2 size={14} />,
                label: "Mouse",
              },
              {
                key: "click" as const,
                icon: <Hand size={14} />,
                label: "Click",
              },
              {
                key: "hover" as const,
                icon: <MousePointer2 size={14} />,
                label: "Hover",
              },
              {
                key: "navigation" as const,
                icon: <Navigation size={14} />,
                label: "Navigation",
              },
            ].map((item) => (
              <FormControlLabel
                key={item.key}
                control={
                  <Switch
                    size="small"
                    checked={state.syncSettings[item.key]}
                    onChange={(e) =>
                      setSyncSettings({ [item.key]: e.target.checked })
                    }
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {item.icon}
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                }
                labelPlacement="start"
                sx={{ mx: 0, justifyContent: "space-between" }}
              />
            ))}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Sync only works for same-origin sites (e.g., localhost).
          </Typography>
        </Box>
      </Popover>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
