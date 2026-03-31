"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: { default: "#FAF6F0", paper: "#FFFFFF" },
        primary: { main: "#C28A1A", contrastText: "#FFFFFF" },
        secondary: { main: "#8B6914", contrastText: "#FFFFFF" },
        error: { main: "#DC2626", contrastText: "#FFFFFF" },
        warning: { main: "#D97706", contrastText: "#FFFFFF" },
        success: { main: "#15803D", contrastText: "#FFFFFF" },
        text: { primary: "#1A1207", secondary: "#5C4A2A" },
        divider: "#E0D5C0",
        action: {
          hover: "rgba(194,138,26,0.06)",
          selected: "rgba(194,138,26,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: { default: "#141008", paper: "#221A0E" },
        primary: { main: "#F7931A", contrastText: "#141008" },
        secondary: { main: "#D4A843", contrastText: "#141008" },
        error: { main: "#EF4444", contrastText: "#FFFFFF" },
        warning: { main: "#F59E0B", contrastText: "#141008" },
        success: { main: "#22C55E", contrastText: "#141008" },
        text: { primary: "#F5F0E6", secondary: "#B8A882" },
        divider: "#3D2E18",
        action: {
          hover: "rgba(247,147,26,0.08)",
          selected: "rgba(247,147,26,0.14)",
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
