"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const cardSx = {
  width: "100%",
  minHeight: 200,
  overflow: "hidden",
  bgcolor: "#1a1a2e",
  p: 0,
} as const;

const headerSx = {
  px: 1.5,
  pt: 1,
  fontFamily: "monospace",
  fontSize: 10,
  color: "#888",
  lineHeight: 1.6,
} as const;

const bodySx = {
  px: 1.5,
  fontFamily: "monospace",
  fontSize: 10,
  lineHeight: 1.6,
  color: "#e0e0e0",
  whiteSpace: "pre-wrap",
} as const;

/* ---------- Bad commit message ---------- */

export function CommitCardBadMessage() {
  const subject =
    "fixed stuff and also updated the login page and some tests and dependencies too";

  return (
    <Paper sx={cardSx} elevation={3}>
      <Box sx={headerSx}>
        <Typography
          sx={{ fontFamily: "monospace", fontSize: 10, color: "#ffbd2e" }}
        >
          commit a3f7c2d1e8b9
        </Typography>
        <Typography
          sx={{ fontFamily: "monospace", fontSize: 10, color: "#888" }}
        >
          Author: dev@company.com
        </Typography>
        <Typography
          sx={{ fontFamily: "monospace", fontSize: 10, color: "#888" }}
        >
          Date: Mon Mar 10 14:23:01 2025
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#333", my: 0.5 }} />

      {/* Subject area with ruler */}
      <Box sx={{ px: 1.5, position: "relative" }}>
        {/* 72-char ruler line */}
        <Box
          sx={{
            position: "absolute",
            left: `calc(12px + 72ch)`,
            top: 0,
            bottom: 0,
            width: 1,
            bgcolor: "rgba(255, 87, 87, 0.4)",
          }}
        />
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255, 87, 87, 0.5)",
            position: "absolute",
            right: 8,
            top: -1,
          }}
        >
          72
        </Typography>

        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            lineHeight: 1.6,
            color: "#ff5f56",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {"    "}
          {subject}
        </Typography>
      </Box>

      <Box sx={{ px: 1.5, mt: 1.5 }} />
    </Paper>
  );
}

/* ---------- Good commit message ---------- */

export function CommitCardGoodMessage() {
  const subject = "fix(auth): resolve null check in middleware";
  const body = `The auth middleware crashed when the session token was
expired but the refresh token was still valid. This
adds a null check before accessing token.claims.`;
  const footer = "Closes #1842";

  return (
    <Paper sx={cardSx} elevation={3}>
      <Box sx={headerSx}>
        <Typography
          sx={{ fontFamily: "monospace", fontSize: 10, color: "#27c93f" }}
        >
          commit a3f7c2d1e8b9
        </Typography>
        <Typography
          sx={{ fontFamily: "monospace", fontSize: 10, color: "#888" }}
        >
          Author: dev@company.com
        </Typography>
        <Typography
          sx={{ fontFamily: "monospace", fontSize: 10, color: "#888" }}
        >
          Date: Mon Mar 10 14:23:01 2025
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#333", my: 0.5 }} />

      {/* Subject area with ruler */}
      <Box sx={{ px: 1.5, position: "relative" }}>
        {/* 50-char ruler line */}
        <Box
          sx={{
            position: "absolute",
            left: `calc(12px + 50ch)`,
            top: 0,
            bottom: 0,
            width: 1,
            bgcolor: "rgba(39, 201, 63, 0.35)",
          }}
        />
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(39, 201, 63, 0.5)",
            position: "absolute",
            right: 8,
            top: -1,
          }}
        >
          50
        </Typography>

        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            lineHeight: 1.6,
            color: "#e0e0e0",
          }}
        >
          {"    "}
          {subject}
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ ...bodySx, mt: 1, color: "#aaa" }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            lineHeight: 1.6,
            color: "#aaa",
          }}
        >
          {body}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#333", my: 0.5 }} />

      {/* Footer */}
      <Box sx={{ px: 1.5 }}>
        <Typography
          sx={{ fontFamily: "monospace", fontSize: 10, color: "#7eb8da" }}
        >
          {footer}
        </Typography>
      </Box>
    </Paper>
  );
}

/* ---------- Unstructured changelog ---------- */

export function ChangelogUnstructured() {
  const items = [
    "Fixed login bug",
    "Added dark mode",
    "Updated deps",
    "Removed old API endpoint",
    "Fixed typo in docs",
    "Added export feature",
  ];

  return (
    <Paper sx={cardSx} elevation={3}>
      <Box sx={{ px: 1.5, pt: 1.5 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "#888",
            mb: 1,
          }}
        >
          CHANGELOG
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#333" }} />

      <Box sx={{ px: 1.5, pt: 1 }}>
        {items.map((item) => (
          <Typography
            key={item}
            sx={{
              fontFamily: "monospace",
              fontSize: 10,
              lineHeight: 1.8,
              color: "#777",
            }}
          >
            {"- "}
            {item}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
}

/* ---------- Structured changelog ---------- */

export function ChangelogStructured() {
  return (
    <Paper sx={cardSx} elevation={3}>
      <Box sx={{ px: 1.5, pt: 1.5 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 11,
            fontWeight: 700,
            color: "#e0e0e0",
          }}
        >
          ## [1.2.0] - 2025-03-15
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#333", my: 0.5 }} />

      {/* Added */}
      <Box sx={{ px: 1.5, pt: 0.5 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            fontWeight: 700,
            color: "#27c93f",
            mb: 0.25,
          }}
        >
          ### Added
        </Typography>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            lineHeight: 1.7,
            color: "#ccc",
          }}
        >
          - Dark mode support
        </Typography>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            lineHeight: 1.7,
            color: "#ccc",
          }}
        >
          - Export feature
        </Typography>
      </Box>

      {/* Fixed */}
      <Box sx={{ px: 1.5, pt: 0.75 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            fontWeight: 700,
            color: "#ffbd2e",
            mb: 0.25,
          }}
        >
          ### Fixed
        </Typography>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            lineHeight: 1.7,
            color: "#ccc",
          }}
        >
          - Login redirect bug
        </Typography>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            lineHeight: 1.7,
            color: "#ccc",
          }}
        >
          - Docs typo
        </Typography>
      </Box>

      {/* Removed */}
      <Box sx={{ px: 1.5, pt: 0.75 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            fontWeight: 700,
            color: "#ff5f56",
            mb: 0.25,
          }}
        >
          ### Removed
        </Typography>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: 10,
            lineHeight: 1.7,
            color: "#ccc",
          }}
        >
          - Deprecated API endpoint
        </Typography>
      </Box>
    </Paper>
  );
}
