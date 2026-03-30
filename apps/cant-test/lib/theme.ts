"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#F5F7F6",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#059669",
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
          primary: "#111827",
          secondary: "#4B5563",
        },
        divider: "#D5DDD9",
        action: {
          hover: "rgba(5,150,105,0.06)",
          selected: "rgba(5,150,105,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#0F1A17",
          paper: "#1A2B26",
        },
        primary: {
          main: "#34D399",
          contrastText: "#022C22",
        },
        secondary: {
          main: "#A78BFA",
          contrastText: "#022C22",
        },
        error: {
          main: "#EF4444",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#F59E0B",
          contrastText: "#022C22",
        },
        success: {
          main: "#22C55E",
          contrastText: "#022C22",
        },
        text: {
          primary: "#F1F5F3",
          secondary: "#94B8A8",
        },
        divider: "#263D35",
        action: {
          hover: "rgba(52,211,153,0.08)",
          selected: "rgba(52,211,153,0.14)",
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
