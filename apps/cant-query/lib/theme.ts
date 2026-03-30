"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#F1F5F9",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#475569",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#7C3AED",
          contrastText: "#FFFFFF",
        },
        error: {
          main: "#DC2626",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#D97706",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#15803D",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
        },
        divider: "#CBD5E1",
        action: {
          hover: "rgba(71,85,105,0.06)",
          selected: "rgba(71,85,105,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#0F172A",
          paper: "#1E293B",
        },
        primary: {
          main: "#94A3B8",
          contrastText: "#0F172A",
        },
        secondary: {
          main: "#A78BFA",
          contrastText: "#0F172A",
        },
        error: {
          main: "#EF4444",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#F59E0B",
          contrastText: "#0F172A",
        },
        success: {
          main: "#22C55E",
          contrastText: "#0F172A",
        },
        text: {
          primary: "#F1F5F9",
          secondary: "#94A3B8",
        },
        divider: "#334155",
        action: {
          hover: "rgba(148,163,184,0.08)",
          selected: "rgba(148,163,184,0.14)",
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
        body: {
          minHeight: "100vh",
        },
        /* Shiki dual-theme toggle */
        ".shiki-dark": { display: "none" },
        ".dark .shiki-light": { display: "none" },
        ".dark .shiki-dark": { display: "block" },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
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
