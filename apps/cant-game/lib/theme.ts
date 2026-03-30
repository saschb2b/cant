"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: { default: "#F7F5F5", paper: "#FFFFFF" },
        primary: { main: "#DC2626", contrastText: "#FFFFFF" },
        secondary: { main: "#9333EA", contrastText: "#FFFFFF" },
        error: { main: "#DC2626", contrastText: "#FFFFFF" },
        warning: { main: "#D97706", contrastText: "#FFFFFF" },
        success: { main: "#15803D", contrastText: "#FFFFFF" },
        text: { primary: "#111827", secondary: "#4B5563" },
        divider: "#DDD5D5",
        action: {
          hover: "rgba(220,38,38,0.06)",
          selected: "rgba(220,38,38,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: { default: "#1A0F0F", paper: "#2B1A1A" },
        primary: { main: "#F87171", contrastText: "#1A0F0F" },
        secondary: { main: "#A78BFA", contrastText: "#1A0F0F" },
        error: { main: "#EF4444", contrastText: "#FFFFFF" },
        warning: { main: "#F59E0B", contrastText: "#1A0F0F" },
        success: { main: "#22C55E", contrastText: "#1A0F0F" },
        text: { primary: "#F5F1F1", secondary: "#B8A8A8" },
        divider: "#3D2626",
        action: {
          hover: "rgba(248,113,113,0.08)",
          selected: "rgba(248,113,113,0.14)",
        },
      },
    },
  },
  typography: { fontFamily: "var(--font-geist), sans-serif" },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { minHeight: "100vh" },
        ".shiki-dark": { display: "none" },
        ".dark .shiki-light": { display: "none" },
        ".dark .shiki-dark": { display: "block" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

export default theme;
