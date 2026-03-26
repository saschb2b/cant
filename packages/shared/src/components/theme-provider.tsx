"use client";

import type { Theme } from "@mui/material/styles";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { EmotionRegistry } from "./emotion-registry";

interface ThemeProviderProps {
  theme: Theme;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <EmotionRegistry>
      <MuiThemeProvider theme={theme} defaultMode="system">
        <InitColorSchemeScript attribute="class" />
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </EmotionRegistry>
  );
}
