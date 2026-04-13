import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

/* ---------- Mixed icon styles vs consistent icon set ---------- */

function MiniIcon({
  d,
  size = 16,
  strokeWidth,
  filled,
}: {
  d: string;
  size?: number;
  strokeWidth?: number;
  filled?: boolean;
}) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      sx={{
        width: size,
        height: size,
        fill: filled ? "currentColor" : "none",
        stroke: filled ? "none" : "currentColor",
        strokeWidth: strokeWidth ?? 2,
        flexShrink: 0,
      }}
    >
      <path d={d} />
    </Box>
  );
}

const iconsMixed = [
  {
    label: "Home",
    d: "M3 12l9-9 9 9M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
    filled: false,
    strokeWidth: 1.5,
  },
  {
    label: "Search",
    d: "M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z",
    filled: true,
    strokeWidth: 0,
  },
  {
    label: "Settings",
    d: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    filled: false,
    strokeWidth: 1,
  },
  {
    label: "User",
    d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    filled: true,
    strokeWidth: 0,
  },
];

const iconsConsistent = [
  { label: "Home", d: "M3 12l9-9 9 9M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" },
  { label: "Search", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  {
    label: "Settings",
    d: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  },
  {
    label: "User",
    d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  },
];

export function IconMixedStyles() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Navigation
      </Typography>
      <Stack direction="row" spacing={2}>
        {iconsMixed.map((icon) => (
          <Stack
            key={icon.label}
            spacing={0.5}
            sx={{ alignItems: "center", color: "text.secondary" }}
          >
            <MiniIcon
              d={icon.d}
              filled={icon.filled}
              strokeWidth={icon.strokeWidth}
            />
            <Typography sx={{ fontSize: 9 }}>{icon.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

export function IconConsistentStyles() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Navigation
      </Typography>
      <Stack direction="row" spacing={2}>
        {iconsConsistent.map((icon) => (
          <Stack
            key={icon.label}
            spacing={0.5}
            sx={{ alignItems: "center", color: "text.secondary" }}
          >
            <MiniIcon d={icon.d} strokeWidth={1.5} />
            <Typography sx={{ fontSize: 9 }}>{icon.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

/* ---------- Generic hero image vs meaningful illustration ---------- */

export function IconGenericHero() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      {/* Simulated generic stock photo (abstract gradient) */}
      <Box
        sx={{
          height: 70,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
          [Generic stock photo]
        </Typography>
      </Box>
      <Box sx={{ p: 1.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.5 }}>
          Boost your workflow
        </Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          Our platform helps teams collaborate and ship faster.
        </Typography>
      </Box>
    </Paper>
  );
}

export function IconMeaningfulHero() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      {/* Simulated product illustration */}
      <Box
        sx={{
          height: 70,
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          px: 2,
        }}
      >
        {/* Mini dashboard illustration */}
        <Box
          sx={{
            width: 50,
            height: 40,
            border: "1.5px solid",
            borderColor: "primary.main",
            borderRadius: 1,
            p: 0.5,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: 4,
              bgcolor: "primary.main",
              borderRadius: 0.5,
              mb: 0.5,
              opacity: 0.7,
            }}
          />
          <Box
            sx={{
              width: "60%",
              height: 4,
              bgcolor: "primary.main",
              borderRadius: 0.5,
              opacity: 0.4,
            }}
          />
        </Box>
        <Box
          component="svg"
          viewBox="0 0 24 24"
          sx={{
            width: 20,
            height: 20,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.5,
            color: "primary.main",
          }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </Box>
        <Box
          sx={{
            width: 50,
            height: 40,
            border: "1.5px solid",
            borderColor: "success.main",
            borderRadius: 1,
            p: 0.5,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: 4,
              bgcolor: "success.main",
              borderRadius: 0.5,
              mb: 0.5,
              opacity: 0.7,
            }}
          />
          <Box
            sx={{
              width: "80%",
              height: 4,
              bgcolor: "success.main",
              borderRadius: 0.5,
              opacity: 0.4,
            }}
          />
        </Box>
      </Box>
      <Box sx={{ p: 1.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.5 }}>
          Boost your workflow
        </Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          Our platform helps teams collaborate and ship faster.
        </Typography>
      </Box>
    </Paper>
  );
}

/* ---------- Ambiguous icons vs universally recognized icons ---------- */

const ambiguousIcons = [
  { label: "Settings", d: "M4 4h16v16H4zM8 8h8v8H8z" },
  { label: "Alerts", d: "M12 2L2 22h20L12 2zM12 9v5" },
  {
    label: "Profile",
    d: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6a3 3 0 110 6 3 3 0 010-6z",
  },
  { label: "Help", d: "M4 4l16 16M4 20L20 4" },
];

const recognizedIcons = [
  {
    label: "Settings",
    d: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  },
  {
    label: "Alerts",
    d: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  },
  {
    label: "Profile",
    d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  },
  {
    label: "Help",
    d: "M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01",
  },
];

export function IconAmbiguous() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Quick Actions
      </Typography>
      <Stack direction="row" spacing={2}>
        {ambiguousIcons.map((icon) => (
          <Box
            key={icon.label}
            sx={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              cursor: "pointer",
              color: "text.secondary",
            }}
          >
            <MiniIcon d={icon.d} size={16} strokeWidth={1.5} />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export function IconRecognized() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Quick Actions
      </Typography>
      <Stack direction="row" spacing={2}>
        {recognizedIcons.map((icon) => (
          <Box
            key={icon.label}
            sx={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              cursor: "pointer",
              color: "text.secondary",
            }}
          >
            <MiniIcon d={icon.d} size={16} strokeWidth={1.5} />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

/* ---------- Poor image quality vs proper images ---------- */

export function IconPoorImageQuality() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Team
      </Typography>
      <Stack direction="row" spacing={1}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "action.hover",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              imageRendering: "pixelated",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* Simulated pixelated/stretched avatar */}
            <Box
              sx={{
                width: 40,
                height: 28,
                bgcolor: "action.disabledBackground",
                borderRadius: 0.5,
              }}
            />
          </Box>
        ))}
      </Stack>
      <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 1 }}>
        Stretched, pixelated, wrong aspect ratio.
      </Typography>
    </Paper>
  );
}

export function IconProperImageQuality() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Team
      </Typography>
      <Stack direction="row" spacing={1}>
        {["#6366f1", "#ec4899", "#14b8a6"].map((color) => (
          <Box
            key={color}
            sx={{
              width: 48,
              height: 48,
              bgcolor: color,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
              {color === "#6366f1" ? "AK" : color === "#ec4899" ? "JL" : "MR"}
            </Typography>
          </Box>
        ))}
      </Stack>
      <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 1 }}>
        Consistent size, proper aspect ratio, sharp.
      </Typography>
    </Paper>
  );
}
