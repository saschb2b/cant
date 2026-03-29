"use client";

import type { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import {
  AppThemeProvider,
  createAppTheme,
} from "@cant/shared/lib/app-theme-context";
import checkmarkAnimation from "./game/checkmark-animation.json";

const betterLabel = (
  <Typography variant="caption" fontWeight={500} color="success.main">
    Better
  </Typography>
);

const appTheme = createAppTheme({
  labels: { betterLabel },
  styling: {
    headerBackground: "secondary.main",
    codeBackground: "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
  },
  slots: { checkmarkAnimation },
});

export function AppThemeWrapper({ children }: { children: ReactNode }) {
  return <AppThemeProvider value={appTheme}>{children}</AppThemeProvider>;
}
