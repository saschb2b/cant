"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  AppThemeProvider,
  createAppTheme,
} from "@cant/shared/lib/app-theme-context";
import checkmarkAnimation from "./game/checkmark-animation.json";

const SPARKLE_BURSTS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * 360;
  const rad = (angle * Math.PI) / 180;
  const dist = 30 + (i % 3) * 10;
  return {
    id: i,
    x: Math.cos(rad) * dist,
    y: Math.sin(rad) * dist,
    delay: i * 0.04,
    size: i % 2 === 0 ? 4 : 3,
  };
});

function SparklesBurst() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        bottom: 32,
        right: 32,
        width: 0,
        height: 0,
        "@keyframes sparkleBurst": {
          "0%": { opacity: 1, transform: "scale(0) translate(0, 0)" },
          "60%": { opacity: 1 },
          "100%": {
            opacity: 0,
            transform: "scale(1) translate(var(--tx), var(--ty))",
          },
        },
      }}
    >
      {SPARKLE_BURSTS.map((s) => (
        <Box
          key={s.id}
          sx={{
            position: "absolute",
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            bgcolor: "success.main",
            "--tx": `${String(s.x)}px`,
            "--ty": `${String(s.y)}px`,
            opacity: 0,
            animation: `sparkleBurst 0.6s ${String(s.delay)}s ease-out forwards`,
          }}
        />
      ))}
    </Box>
  );
}

const shimmerBetterLabel = (
  <Typography
    variant="caption"
    fontWeight={500}
    color="success.main"
    sx={{
      "@keyframes shimmer": {
        "0%": { opacity: 0.7 },
        "50%": { opacity: 1 },
        "100%": { opacity: 0.7 },
      },
      animation: "shimmer 2s ease-in-out infinite",
    }}
  >
    &#x2728; Better
  </Typography>
);

const appTheme = createAppTheme({
  labels: { betterLabel: shimmerBetterLabel },
  styling: {
    headerBackground: "secondary.main",
    codeBackground: "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
  },
  slots: {
    checkmarkAnimation,
    overlaySlot: <SparklesBurst />,
  },
});

export function AppThemeWrapper({ children }: { children: ReactNode }) {
  return <AppThemeProvider value={appTheme}>{children}</AppThemeProvider>;
}
