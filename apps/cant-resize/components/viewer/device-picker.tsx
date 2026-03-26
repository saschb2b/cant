"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Plus, Search, Smartphone, Tablet, Monitor, Check } from "lucide-react";
import { useViewer } from "./viewer-provider";
import {
  DEVICE_PRESETS,
  getDevicesByCategory,
} from "@/lib/viewer/device-presets";
import type { DevicePreset } from "@/lib/viewer/types";

// ── Device silhouette ───────────────────────────────────────────────────────

/** CSS-only device silhouette, proportionally scaled within a fixed box. */
function DeviceSilhouette({
  device,
  selected,
}: {
  device: DevicePreset;
  selected: boolean;
}) {
  const maxDim = 56;
  const aspect = device.width / device.height;
  let w: number, h: number;
  if (aspect > 1) {
    w = maxDim;
    h = maxDim / aspect;
  } else {
    h = maxDim;
    w = maxDim * aspect;
  }

  const borderColor = selected ? "primary.main" : "text.disabled";
  const screenColor = selected
    ? "rgba(var(--mui-palette-primary-mainChannel) / 0.06)"
    : "action.hover";

  if (device.category === "desktop") {
    // Monitor: thin bezel, chin at bottom, stand + base
    const screenW = w;
    const screenH = h * 0.72;
    const chin = 3;
    const radius = Math.min(3, w * 0.04);
    return (
      <Box
        sx={{
          width: maxDim,
          height: maxDim,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {/* Screen + bezel */}
        <Box
          sx={{
            position: "relative",
            border: 1.5,
            borderColor,
            bgcolor: screenColor,
            transition: "border-color 0.15s, background-color 0.15s",
          }}
          style={{
            width: screenW,
            height: screenH + chin,
            borderRadius: `${String(radius)}px ${String(radius)}px ${String(radius * 0.5)}px ${String(radius * 0.5)}px`,
          }}
        >
          {/* Webcam dot */}
          <Box
            sx={{
              position: "absolute",
              bottom: chin / 2,
              left: "50%",
              transform: "translate(-50%, 50%)",
              width: 2,
              height: 2,
              borderRadius: "50%",
              bgcolor: borderColor,
              opacity: 0.4,
            }}
          />
        </Box>
        {/* Stand neck */}
        <Box
          sx={{
            width: w * 0.08,
            height: 4,
            bgcolor: borderColor,
            opacity: 0.6,
          }}
        />
        {/* Stand base */}
        <Box
          sx={{
            width: w * 0.35,
            height: 1.5,
            bgcolor: borderColor,
            opacity: 0.6,
          }}
          style={{
            borderRadius: "0 0 2px 2px",
          }}
        />
      </Box>
    );
  }

  if (device.category === "tablet") {
    // Tablet: slightly rounded corners, thin uniform bezel, front camera dot
    const radius = Math.max(3, Math.min(6, w * 0.08));
    return (
      <Box
        sx={{
          width: maxDim,
          height: maxDim,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            border: 1.5,
            borderColor,
            bgcolor: screenColor,
            transition: "border-color 0.15s, background-color 0.15s",
            position: "relative",
          }}
          style={{
            width: w,
            height: h,
            borderRadius: radius,
            padding: 2,
          }}
        >
          {/* Inner screen area */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: `${String(Math.max(1, radius - 2))}px`,
              bgcolor: selected
                ? "rgba(var(--mui-palette-primary-mainChannel) / 0.03)"
                : "background.paper",
              transition: "background-color 0.15s",
            }}
          />
          {/* Front camera */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: 1,
              transform: "translateY(-50%)",
              width: 1.5,
              height: 1.5,
              borderRadius: "50%",
              bgcolor: borderColor,
              opacity: 0.35,
            }}
          />
        </Box>
      </Box>
    );
  }

  // Phone: more rounded corners (like real iPhones/Androids), dynamic island/notch
  const radius = Math.max(4, Math.min(8, w * 0.15));
  const isIphone = device.name.toLowerCase().includes("iphone");

  return (
    <Box
      sx={{
        width: maxDim,
        height: maxDim,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          border: 1.5,
          borderColor,
          bgcolor: screenColor,
          transition: "border-color 0.15s, background-color 0.15s",
          position: "relative",
          overflow: "hidden",
        }}
        style={{ width: w, height: h, borderRadius: radius }}
      >
        {/* Dynamic Island (modern phones) or notch */}
        {isIphone && !device.name.includes("SE") ? (
          // Dynamic Island pill
          <Box
            sx={{
              position: "absolute",
              top: "4%",
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: borderColor,
              opacity: 0.45,
              transition: "background-color 0.15s",
            }}
            style={{
              width: w * 0.28,
              height: Math.max(2.5, h * 0.025),
              borderRadius: 99,
            }}
          />
        ) : (
          // Small camera dot (Android / iPhone SE)
          <Box
            sx={{
              position: "absolute",
              top: "4%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 2,
              height: 2,
              borderRadius: "50%",
              bgcolor: borderColor,
              opacity: 0.4,
            }}
          />
        )}
        {/* Home indicator line (bottom) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "3%",
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: borderColor,
            opacity: 0.3,
          }}
          style={{
            width: w * 0.35,
            height: Math.max(1.5, h * 0.015),
            borderRadius: 99,
          }}
        />
      </Box>
    </Box>
  );
}

// ── Device card ─────────────────────────────────────────────────────────────

function DeviceCard({
  device,
  selected,
  onToggle,
}: {
  device: DevicePreset;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <Box
      onClick={() => onToggle(device.id)}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 1.5,
        pt: 2,
        borderRadius: 2,
        border: 2,
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.15s ease",
        borderColor: selected ? "primary.main" : "divider",
        bgcolor: selected
          ? "rgba(var(--mui-palette-primary-mainChannel) / 0.06)"
          : "transparent",
        "&:hover": {
          borderColor: selected ? "primary.main" : "text.secondary",
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      {/* Selection badge */}
      {selected && (
        <Box
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={11} strokeWidth={3} />
        </Box>
      )}

      <DeviceSilhouette device={device} selected={selected} />

      <Box sx={{ textAlign: "center", minWidth: 0, width: "100%" }}>
        <Typography
          variant="caption"
          fontWeight={600}
          noWrap
          display="block"
          sx={{ fontSize: "0.7rem", lineHeight: 1.3 }}
        >
          {device.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ fontSize: "0.6rem" }}
        >
          {device.width}&times;{device.height}
        </Typography>
      </Box>
    </Box>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

interface DevicePickerProps {
  renderTrigger?: (open: () => void) => React.ReactNode;
}

export function DevicePicker({ renderTrigger }: DevicePickerProps = {}) {
  const { addViewport, addCustomViewport } = useViewer();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set<string>());
  const [activeFilter, setActiveFilter] = useState<
    "all" | "phone" | "tablet" | "desktop"
  >("all");
  const [showCustom, setShowCustom] = useState(false);
  const [customWidth, setCustomWidth] = useState("1280");
  const [customHeight, setCustomHeight] = useState("720");
  const [customName, setCustomName] = useState("");

  const phones = getDevicesByCategory("phone");
  const tablets = getDevicesByCategory("tablet");
  const desktops = getDevicesByCategory("desktop");

  const filteredDevices = useMemo(() => {
    let devices: DevicePreset[];
    if (activeFilter === "all") {
      devices = DEVICE_PRESETS;
    } else {
      devices =
        activeFilter === "phone"
          ? phones
          : activeFilter === "tablet"
            ? tablets
            : desktops;
    }

    if (!search.trim()) return devices;

    const q = search.toLowerCase();
    return devices.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        `${String(d.width)}x${String(d.height)}`.includes(q) ||
        `${String(d.width)} x ${String(d.height)}`.includes(q),
    );
  }, [activeFilter, search, phones, tablets, desktops]);

  const groupedDisplay = useMemo(() => {
    if (activeFilter !== "all") {
      return [{ label: null, devices: filteredDevices }];
    }

    const groups: { label: string | null; devices: DevicePreset[] }[] = [];
    const phoneFiltered = filteredDevices.filter((d) => d.category === "phone");
    const tabletFiltered = filteredDevices.filter(
      (d) => d.category === "tablet",
    );
    const desktopFiltered = filteredDevices.filter(
      (d) => d.category === "desktop",
    );

    if (phoneFiltered.length > 0)
      groups.push({ label: "Phones", devices: phoneFiltered });
    if (tabletFiltered.length > 0)
      groups.push({ label: "Tablets", devices: tabletFiltered });
    if (desktopFiltered.length > 0)
      groups.push({ label: "Desktop", devices: desktopFiltered });

    return groups;
  }, [activeFilter, filteredDevices]);

  const toggleDevice = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddSelected = () => {
    for (const id of selectedIds) {
      addViewport(id);
    }
    handleClose();
  };

  const handleAddCustom = () => {
    const w = parseInt(customWidth, 10);
    const h = parseInt(customHeight, 10);
    if (w > 0 && h > 0) {
      addCustomViewport(w, h, customName.trim() || undefined);
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSearch("");
      setSelectedIds(new Set());
      setActiveFilter("all");
      setShowCustom(false);
    }, 200);
  };

  return (
    <>
      {renderTrigger ? (
        renderTrigger(() => setOpen(true))
      ) : (
        <Button
          variant="contained"
          size="small"
          startIcon={<Plus size={16} />}
          onClick={() => setOpen(true)}
        >
          Add Device
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 0 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search
                      size={16}
                      color="var(--mui-palette-text-secondary)"
                    />
                  </InputAdornment>
                ),
                sx: { fontSize: "0.875rem" },
              },
            }}
          />

          {/* Filter chips */}
          <Box sx={{ display: "flex", gap: 0.75, mt: 1.5, mb: 1.5 }}>
            {(
              [
                { value: "all", label: "All" },
                {
                  value: "phone",
                  label: "Phones",
                  icon: <Smartphone size={12} />,
                },
                {
                  value: "tablet",
                  label: "Tablets",
                  icon: <Tablet size={12} />,
                },
                {
                  value: "desktop",
                  label: "Desktop",
                  icon: <Monitor size={12} />,
                },
              ] as const
            ).map((chip) => (
              <Chip
                key={chip.value}
                label={chip.label}
                icon={"icon" in chip ? chip.icon : undefined}
                size="small"
                variant={activeFilter === chip.value ? "filled" : "outlined"}
                onClick={() => setActiveFilter(chip.value)}
                sx={{
                  fontWeight: 500,
                  fontSize: "0.7rem",
                  height: 26,
                  borderColor:
                    activeFilter === chip.value ? "primary.main" : "divider",
                  ...(activeFilter === chip.value && {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "& .MuiChip-icon": { color: "primary.contrastText" },
                  }),
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Device grid */}
        <DialogContent sx={{ px: 2, py: 0, flex: 1, overflow: "auto" }}>
          {filteredDevices.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <Typography variant="body2">
                No devices match your search
              </Typography>
            </Box>
          ) : (
            groupedDisplay.map((group, gi) => (
              <Box key={group.label ?? gi}>
                {group.label && (
                  <Typography
                    variant="overline"
                    sx={{
                      display: "block",
                      px: 0.5,
                      pt: gi > 0 ? 2 : 0.5,
                      pb: 1,
                      color: "text.secondary",
                      fontWeight: 700,
                    }}
                  >
                    {group.label}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                  }}
                >
                  {group.devices.map((device) => (
                    <DeviceCard
                      key={device.id}
                      device={device}
                      selected={selectedIds.has(device.id)}
                      onToggle={toggleDevice}
                    />
                  ))}
                </Box>
              </Box>
            ))
          )}

          {/* Custom device (collapsible) */}
          <Box sx={{ mt: 2, mb: 1 }}>
            <Button
              size="small"
              onClick={() => setShowCustom((v) => !v)}
              sx={{
                color: "text.secondary",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                px: 0.5,
              }}
            >
              {showCustom ? "Hide custom size" : "+ Custom size"}
            </Button>
            {showCustom && (
              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                  }}
                >
                  <TextField
                    placeholder="Width"
                    type="number"
                    slotProps={{ htmlInput: { min: 100, max: 5000 } }}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    size="small"
                  />
                  <TextField
                    placeholder="Height"
                    type="number"
                    slotProps={{ htmlInput: { min: 100, max: 5000 } }}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    size="small"
                  />
                </Box>
                <TextField
                  placeholder="Name (optional)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  size="small"
                  fullWidth
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAddCustom}
                  fullWidth
                >
                  Add Custom
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>

        {/* Footer */}
        <DialogActions
          sx={{ px: 2.5, py: 1.5, borderTop: 1, borderColor: "divider" }}
        >
          <Button
            onClick={handleClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleAddSelected}
            disabled={selectedIds.size === 0}
          >
            Add{" "}
            {selectedIds.size > 0
              ? `${String(selectedIds.size)} device${selectedIds.size > 1 ? "s" : ""}`
              : "devices"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
