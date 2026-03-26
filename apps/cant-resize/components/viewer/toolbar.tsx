"use client";

import { useState, useCallback } from "react";
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
import Divider from "@mui/material/Divider";
import {
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
} from "lucide-react";
import { useViewer } from "./viewer-provider";
import { DevicePicker } from "./device-picker";
import { useZoomControls } from "@/lib/viewer/use-zoom-controls";
import type { LayoutMode } from "@/lib/viewer/types";

export function Toolbar() {
  const { state, setUrl, setLayoutMode, setCanvasTransform, setSyncSettings } =
    useViewer();
  const [urlInput, setUrlInput] = useState(state.url);
  const [syncAnchorEl, setSyncAnchorEl] = useState<HTMLElement | null>(null);

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
    if (state.url) {
      window.open(state.url, "_blank");
    }
  }, [state.url]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      {/* URL Input */}
      <Box
        component="form"
        onSubmit={handleUrlSubmit}
        sx={{ flex: 1, display: "flex", gap: 1, maxWidth: 560 }}
      >
        <TextField
          type="url"
          placeholder="Enter URL to preview..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          size="small"
          fullWidth
          slotProps={{ input: { sx: { fontSize: "0.875rem" } } }}
        />
        <Button type="submit" variant="outlined" size="small">
          Go
        </Button>
        <Tooltip title="Open in new tab">
          <IconButton size="small" onClick={openInNewTab}>
            <ExternalLink size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Device Picker */}
      <DevicePicker />

      {/* Layout Toggle - only show when devices exist */}
      {state.viewports.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <ToggleButtonGroup
            value={state.layoutMode}
            exclusive
            onChange={(_, val: LayoutMode | null) => val && setLayoutMode(val)}
            size="small"
          >
            <ToggleButton value="freeform" sx={{ px: 1 }}>
              <Tooltip title="Freeform canvas">
                <Box sx={{ display: "flex" }}>
                  <Move size={16} />
                </Box>
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="grid" sx={{ px: 1 }}>
              <Tooltip title="Grid layout">
                <Box sx={{ display: "flex" }}>
                  <LayoutGrid size={16} />
                </Box>
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </>
      )}

      {/* Zoom Controls - only in freeform mode with devices */}
      {state.layoutMode === "freeform" && state.viewports.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Zoom out">
              <IconButton size="small" onClick={zoomOut}>
                <ZoomOut size={16} />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: 140,
              }}
            >
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
                sx={{ width: 40, textAlign: "right" }}
              >
                {zoomPercentage}%
              </Typography>
            </Box>

            <Tooltip title="Zoom in">
              <IconButton size="small" onClick={zoomIn}>
                <ZoomIn size={16} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Fit to content">
              <IconButton size="small" onClick={fitToContent}>
                <Maximize size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}

      {/* Sync & Refresh - only show when devices exist */}
      {state.viewports.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <Button
            variant="text"
            size="small"
            startIcon={<Link2 size={16} />}
            onClick={(e) => setSyncAnchorEl(e.currentTarget)}
            sx={{ color: "text.secondary" }}
          >
            Sync
          </Button>
        </>
      )}
      <Popover
        open={Boolean(syncAnchorEl)}
        anchorEl={syncAnchorEl}
        onClose={() => setSyncAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, width: 240 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Sync Events
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={state.syncSettings.scroll}
                  onChange={(e) =>
                    setSyncSettings({ scroll: e.target.checked })
                  }
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ArrowUpDown size={14} />
                  <Typography variant="body2">Scroll</Typography>
                </Box>
              }
              labelPlacement="start"
              sx={{ mx: 0, justifyContent: "space-between" }}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={state.syncSettings.mouse}
                  onChange={(e) => setSyncSettings({ mouse: e.target.checked })}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MousePointer2 size={14} />
                  <Typography variant="body2">Mouse</Typography>
                </Box>
              }
              labelPlacement="start"
              sx={{ mx: 0, justifyContent: "space-between" }}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={state.syncSettings.click}
                  onChange={(e) => setSyncSettings({ click: e.target.checked })}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Hand size={14} />
                  <Typography variant="body2">Click</Typography>
                </Box>
              }
              labelPlacement="start"
              sx={{ mx: 0, justifyContent: "space-between" }}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={state.syncSettings.hover}
                  onChange={(e) => setSyncSettings({ hover: e.target.checked })}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MousePointer2 size={14} />
                  <Typography variant="body2">Hover</Typography>
                </Box>
              }
              labelPlacement="start"
              sx={{ mx: 0, justifyContent: "space-between" }}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={state.syncSettings.navigation}
                  onChange={(e) =>
                    setSyncSettings({ navigation: e.target.checked })
                  }
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Navigation size={14} />
                  <Typography variant="body2">Navigation</Typography>
                </Box>
              }
              labelPlacement="start"
              sx={{ mx: 0, justifyContent: "space-between" }}
            />
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

      {state.viewports.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Refresh all viewports">
            <IconButton size="small" onClick={handleRefresh}>
              <RefreshCw size={16} />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
}
