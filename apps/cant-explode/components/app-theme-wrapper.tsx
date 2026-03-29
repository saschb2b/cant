"use client";

import type { ReactNode } from "react";
import { AppThemeProvider } from "@cant/shared/lib/app-theme-context";
import { appThemeConfig } from "@/lib/app-theme-config";
import checkmarkAnimation from "./game/checkmark-animation.json";

const appTheme = {
  ...appThemeConfig,
  slots: { ...appThemeConfig.slots, checkmarkAnimation },
};

export function AppThemeWrapper({ children }: { children: ReactNode }) {
  return <AppThemeProvider value={appTheme}>{children}</AppThemeProvider>;
}
