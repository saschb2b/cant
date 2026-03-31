"use client";

import Box from "@mui/material/Box";

/**
 * Bitcoin-inspired hero animation: a stylized "B" with vertical strokes.
 */
export function HeroAnimation() {
  return (
    <Box
      sx={{
        width: 160,
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 160 160"
        width="160"
        height="160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="80" cy="80" r="72" fill="#F7931A" opacity="0.15" />
        <circle cx="80" cy="80" r="56" fill="#F7931A" opacity="0.25" />
        {/* Vertical strokes */}
        <rect x="62" y="32" width="5" height="96" rx="2.5" fill="#F7931A" />
        <rect x="93" y="32" width="5" height="96" rx="2.5" fill="#F7931A" />
        {/* B shape */}
        <path
          d="M70 44h18c10 0 18 7 18 16s-4 12-10 14c8 2 14 8 14 18 0 11-9 20-20 20H70V44z"
          stroke="#F7931A"
          strokeWidth="5"
          fill="none"
          strokeLinejoin="round"
        />
        <line
          x1="70"
          y1="74"
          x2="96"
          y2="74"
          stroke="#F7931A"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </Box>
  );
}
