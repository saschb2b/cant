"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#F5F3FF",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#7C3AED",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#F3F0FF",
          contrastText: "#1E293B",
        },
        error: {
          main: "#E05252",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#E5A63B",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#3D9A5F",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#1E293B",
          secondary: "#64748B",
        },
        divider: "#E2D8F0",
        action: {
          hover: "rgba(124,58,237,0.06)",
          selected: "rgba(124,58,237,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#110D1B",
          paper: "#1A1525",
        },
        primary: {
          main: "#A78BFA",
          contrastText: "#110D1B",
        },
        secondary: {
          main: "#251E35",
          contrastText: "#E8E1F0",
        },
        error: {
          main: "#F07070",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#F0B95A",
          contrastText: "#1E293B",
        },
        success: {
          main: "#5BBB7B",
          contrastText: "#0F1219",
        },
        text: {
          primary: "#E8E1F0",
          secondary: "#9B8ABB",
        },
        divider: "#2E2640",
        action: {
          hover: "rgba(167,139,250,0.08)",
          selected: "rgba(167,139,250,0.14)",
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
