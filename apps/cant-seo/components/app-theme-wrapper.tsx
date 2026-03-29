"use client";

import type { ReactNode } from "react";
import {
  AppThemeProvider,
  createAppTheme,
} from "@cant/shared/lib/app-theme-context";
import checkmarkAnimation from "./game/checkmark-animation.json";

const appTheme = createAppTheme({
  slots: { checkmarkAnimation },
});

export function AppThemeWrapper({ children }: { children: ReactNode }) {
  return <AppThemeProvider value={appTheme}>{children}</AppThemeProvider>;
}
