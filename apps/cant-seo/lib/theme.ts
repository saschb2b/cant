"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#F8FAFC",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#2563EB",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#F59E0B",
          contrastText: "#FFFFFF",
        },
        error: {
          main: "#EF4444",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#F59E0B",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#10B981",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
        },
        divider: "#E2E8F0",
        action: {
          hover: "rgba(37,99,235,0.06)",
          selected: "rgba(37,99,235,0.10)",
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
          main: "#60A5FA",
          contrastText: "#0F172A",
        },
        secondary: {
          main: "#FBBF24",
          contrastText: "#1E293B",
        },
        error: {
          main: "#F87171",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#FBBF24",
          contrastText: "#1E293B",
        },
        success: {
          main: "#34D399",
          contrastText: "#0F172A",
        },
        text: {
          primary: "#F1F5F9",
          secondary: "#94A3B8",
        },
        divider: "#334155",
        action: {
          hover: "rgba(96,165,250,0.08)",
          selected: "rgba(96,165,250,0.14)",
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
