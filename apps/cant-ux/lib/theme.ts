"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#FAFAF5",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#D97706",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#D4A843",
          contrastText: "#FFFFFF",
        },
        error: {
          main: "#DC2626",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#EA580C",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#16A34A",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#292524",
          secondary: "#78716C",
        },
        divider: "#E7E5E4",
        action: {
          hover: "rgba(217,119,6,0.06)",
          selected: "rgba(217,119,6,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#1C1412",
          paper: "#292018",
        },
        primary: {
          main: "#F59E0B",
          contrastText: "#1C1917",
        },
        secondary: {
          main: "#E9C46A",
          contrastText: "#1A2A30",
        },
        error: {
          main: "#EF4444",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#F97316",
          contrastText: "#1C1917",
        },
        success: {
          main: "#22C55E",
          contrastText: "#1C1917",
        },
        text: {
          primary: "#F5F5F4",
          secondary: "#A8A29E",
        },
        divider: "#3D3226",
        action: {
          hover: "rgba(245,158,11,0.08)",
          selected: "rgba(245,158,11,0.14)",
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
