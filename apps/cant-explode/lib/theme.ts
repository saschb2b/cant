"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: { default: "#F5F5F0", paper: "#FFFFFF" },
        primary: { main: "#1B5E20", contrastText: "#FFFFFF" },
        secondary: { main: "#E65100", contrastText: "#FFFFFF" },
        error: { main: "#C62828", contrastText: "#FFFFFF" },
        warning: { main: "#E65100", contrastText: "#FFFFFF" },
        success: { main: "#1B5E20", contrastText: "#FFFFFF" },
        text: { primary: "#1A2A1E", secondary: "#4E6B52" },
        divider: "#C8D8CA",
        action: {
          hover: "rgba(27,94,32,0.06)",
          selected: "rgba(27,94,32,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: { default: "#0D1B0F", paper: "#162218" },
        primary: { main: "#4CAF50", contrastText: "#FFFFFF" },
        secondary: { main: "#FF9800", contrastText: "#000000" },
        error: { main: "#EF5350", contrastText: "#FFFFFF" },
        warning: { main: "#FF9800", contrastText: "#000000" },
        success: { main: "#4CAF50", contrastText: "#FFFFFF" },
        text: { primary: "#E0EDE2", secondary: "#8FAF93" },
        divider: "#2E4A32",
        action: {
          hover: "rgba(76,175,80,0.08)",
          selected: "rgba(76,175,80,0.14)",
        },
      },
    },
  },
  typography: {
    fontFamily: "var(--font-geist), sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
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
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
