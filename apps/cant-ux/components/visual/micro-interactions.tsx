"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

/* ---------- No button feedback vs button with states ---------- */

export function MicroNoButtonFeedback() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Submit Form
      </Typography>
      <Stack spacing={1.5}>
        <Box
          sx={{
            height: 28,
            bgcolor: "action.hover",
            borderRadius: 1,
            width: "100%",
          }}
        />
        <Box
          sx={{
            px: 2.5,
            py: 0.75,
            bgcolor: "primary.main",
            borderRadius: 1,
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
            Submit
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 10, color: "text.disabled" }}>
          User clicks... nothing happens visually.
        </Typography>
      </Stack>
    </Paper>
  );
}

export function MicroButtonWithFeedback() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Submit Form
      </Typography>
      <Stack spacing={1.5}>
        <Box
          sx={{
            height: 28,
            bgcolor: "action.hover",
            borderRadius: 1,
            width: "100%",
          }}
        />
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              px: 2.5,
              py: 0.75,
              bgcolor: "success.main",
              borderRadius: 1,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              alignSelf: "flex-start",
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
              {"\u2713"} Submitted
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 10, color: "text.disabled" }}>
            Sent!
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 10, color: "text.disabled" }}>
          Button shows pressed, loading, then success.
        </Typography>
      </Stack>
    </Paper>
  );
}

/* ---------- Instant toggle vs animated toggle ---------- */

function ToggleTrack({ on, animated }: { on: boolean; animated: boolean }) {
  return (
    <Box
      sx={{
        width: 36,
        height: 20,
        borderRadius: 10,
        bgcolor: on ? "primary.main" : "action.disabledBackground",
        position: "relative",
        cursor: "pointer",
        transition: animated ? "background-color 0.2s ease" : "none",
      }}
    >
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          bgcolor: "#fff",
          position: "absolute",
          top: 2,
          left: on ? 18 : 2,
          transition: animated ? "left 0.2s ease" : "none",
          boxShadow: 1,
        }}
      />
    </Box>
  );
}

function useToggleLoop(intervalMs = 2000) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((prev) => !prev), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return on;
}

export function MicroInstantToggle() {
  const on = useToggleLoop();
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Settings
      </Typography>
      <Stack spacing={1.5}>
        {["Email notifications", "Push notifications", "Weekly digest"].map(
          (label, i) => (
            <Stack
              key={label}
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 12 }}>{label}</Typography>
              <ToggleTrack on={i === 0 ? on : i === 2} animated={false} />
            </Stack>
          ),
        )}
      </Stack>
    </Paper>
  );
}

export function MicroAnimatedToggle() {
  const on = useToggleLoop();
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Settings
      </Typography>
      <Stack spacing={1.5}>
        {["Email notifications", "Push notifications", "Weekly digest"].map(
          (label, i) => (
            <Stack
              key={label}
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 12 }}>{label}</Typography>
              <ToggleTrack on={i === 0 ? on : i === 2} animated />
            </Stack>
          ),
        )}
      </Stack>
    </Paper>
  );
}

/* ---------- Abrupt content vs staggered entrance ---------- */

const listItems = [
  "Design system audit",
  "Component library update",
  "Accessibility review",
  "Performance testing",
];

export function MicroAbruptEntrance() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Tasks
      </Typography>
      <Stack spacing={0.75}>
        {listItems.map((item) => (
          <Stack
            key={item}
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                border: "1.5px solid",
                borderColor: "divider",
                borderRadius: 0.5,
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: 12 }}>{item}</Typography>
          </Stack>
        ))}
      </Stack>
      <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 1.5 }}>
        All items appear at once, no animation.
      </Typography>
    </Paper>
  );
}

export function MicroStaggeredEntrance() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Tasks
      </Typography>
      <Stack spacing={0.75}>
        {listItems.map((item, i) => (
          <Stack
            key={item}
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              opacity: 1 - i * 0.15,
              transform: `translateY(${String(i * 1)}px)`,
            }}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                border: "1.5px solid",
                borderColor: "divider",
                borderRadius: 0.5,
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: 12 }}>{item}</Typography>
          </Stack>
        ))}
      </Stack>
      <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 1.5 }}>
        Items stagger in with subtle fade and slide.
      </Typography>
    </Paper>
  );
}

/* ---------- Indeterminate spinner vs step progress ---------- */

export function MicroIndeterminateProgress() {
  return (
    <Paper
      sx={{
        p: 2,
        minHeight: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
        <CircularProgress size={28} />
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Uploading...
        </Typography>
      </Stack>
    </Paper>
  );
}

export function MicroStepProgress() {
  return (
    <Paper sx={{ p: 2, minHeight: 140 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Uploading files
      </Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1.5 }}>
        3 of 5 files uploaded
      </Typography>
      <LinearProgress
        variant="determinate"
        value={60}
        sx={{ height: 6, borderRadius: 3, mb: 1 }}
      />
      <Stack spacing={0.5}>
        {[
          { name: "report.pdf", done: true },
          { name: "data.csv", done: true },
          { name: "summary.docx", done: true },
          { name: "chart.png", active: true },
          { name: "notes.txt", done: false },
        ].map((file) => (
          <Stack
            key={file.name}
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "center" }}
          >
            <Typography
              sx={{
                fontSize: 10,
                color: file.done
                  ? "success.main"
                  : "active" in file
                    ? "primary.main"
                    : "text.disabled",
                fontWeight: 500,
                width: 12,
              }}
            >
              {file.done ? "\u2713" : "active" in file ? "\u2022" : "\u2013"}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: file.done
                  ? "text.secondary"
                  : "active" in file
                    ? "text.primary"
                    : "text.disabled",
              }}
            >
              {file.name}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
