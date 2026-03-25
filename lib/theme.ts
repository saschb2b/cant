"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#F5F5F5",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#1A1A1A",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#F5F5F5",
          contrastText: "#1A1A1A",
        },
        error: {
          main: "#DC2626",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#F59E0B",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#16A34A",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#0A0A0A",
          secondary: "#737373",
        },
        divider: "#E5E5E5",
        action: {
          hover: "rgba(0,0,0,0.04)",
          selected: "rgba(0,0,0,0.08)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#0A0A0A",
          paper: "#171717",
        },
        primary: {
          main: "#FAFAFA",
          contrastText: "#0A0A0A",
        },
        secondary: {
          main: "#262626",
          contrastText: "#FAFAFA",
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
          main: "#22C55E",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#A3A3A3",
        },
        divider: "#262626",
        action: {
          hover: "rgba(255,255,255,0.06)",
          selected: "rgba(255,255,255,0.12)",
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
