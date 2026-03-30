"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const TEST_LINES = [
  {
    suite: "unit",
    name: "validates email format",
    status: "pass",
    color: "#22C55E",
  },
  {
    suite: "unit",
    name: "rejects empty input",
    status: "pass",
    color: "#22C55E",
  },
  {
    suite: "integration",
    name: "creates user in db",
    status: "pass",
    color: "#22C55E",
  },
  {
    suite: "component",
    name: "renders login form",
    status: "fail",
    color: "#EF4444",
  },
  {
    suite: "async",
    name: "retries on timeout",
    status: "pass",
    color: "#22C55E",
  },
];

function TestLine({
  suite,
  name,
  status,
  color,
  active,
}: {
  suite: string;
  name: string;
  status: string;
  color: string;
  active: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        bgcolor: active ? "action.selected" : "transparent",
        transition: "all 0.4s ease",
        opacity: active ? 1 : 0.5,
      }}
    >
      <Typography
        sx={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.7rem",
          fontWeight: 700,
          color,
          minWidth: 20,
        }}
      >
        {status === "pass" ? "✓" : "✗"}
      </Typography>
      <Typography
        sx={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.6rem",
          color: "text.secondary",
          opacity: 0.6,
          minWidth: 36,
        }}
      >
        {suite}
      </Typography>
      <Typography
        sx={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.65rem",
          color: "text.secondary",
          flex: 1,
        }}
      >
        {name}
      </Typography>
      <Box
        sx={{
          px: 0.75,
          py: 0.25,
          borderRadius: 0.5,
          bgcolor: active ? `${color}20` : "transparent",
          transition: "all 0.4s ease",
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.6rem",
            fontWeight: 600,
            color: active ? color : "text.secondary",
          }}
        >
          {status}
        </Typography>
      </Box>
    </Box>
  );
}

export function HeroAnimation() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TEST_LINES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 3 },
      }}
    >
      {/* Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "70%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(var(--mui-palette-primary-mainChannel) / 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Terminal window */}
      <Box
        sx={{
          maxWidth: 340,
          mx: "auto",
          borderRadius: 1.5,
          overflow: "hidden",
          bgcolor: "background.paper",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        {/* Title bar */}
        <Box
          sx={{
            height: 28,
            bgcolor: "action.hover",
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            px: 1,
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "error.main",
              opacity: 0.7,
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "warning.main",
              opacity: 0.7,
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "success.main",
              opacity: 0.7,
            }}
          />
          <Typography
            sx={{
              ml: 1,
              fontSize: "0.65rem",
              color: "text.secondary",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            test-results.log
          </Typography>
        </Box>

        {/* Test lines */}
        <Box sx={{ py: 0.5 }}>
          {TEST_LINES.map((line, i) => (
            <TestLine
              key={line.suite + line.name}
              {...line}
              active={i === activeIndex}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
