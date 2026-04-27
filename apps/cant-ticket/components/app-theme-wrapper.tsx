"use client";

import type { ReactNode } from "react";
import {
  AppThemeProvider,
  createAppTheme,
} from "@cant/shared/lib/app-theme-context";

const appTheme = createAppTheme({
  labels: {
    betterLabel: "Cleaner",
    worseLabel: "Messier",
    badLabel: "Avoid",
    goodLabel: "Prefer",
  },
});

export function AppThemeWrapper({ children }: { children: ReactNode }) {
  return <AppThemeProvider value={appTheme}>{children}</AppThemeProvider>;
}
