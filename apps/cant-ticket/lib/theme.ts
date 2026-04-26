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
          main: "#4F46E5",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#3730A3",
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
          main: "#16A34A",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#0F172A",
          secondary: "#475569",
        },
        divider: "#E2E8F0",
        action: {
          hover: "rgba(79,70,229,0.06)",
          selected: "rgba(79,70,229,0.10)",
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
          main: "#818CF8",
          contrastText: "#0F172A",
        },
        secondary: {
          main: "#A5B4FC",
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
          hover: "rgba(129,140,248,0.08)",
          selected: "rgba(129,140,248,0.14)",
        },
      },
    },
  },
  typography: {
    fontFamily: "var(--font-geist), sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
        },
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
