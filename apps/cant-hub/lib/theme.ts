"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#FAFAF8",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#475569",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#D4A843",
          contrastText: "#FFFFFF",
        },
        error: {
          main: "#D95B3F",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#E8923A",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#3D8B72",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#1E293B",
          secondary: "#64748B",
        },
        divider: "#E8E4DD",
        action: {
          hover: "rgba(71,85,105,0.06)",
          selected: "rgba(71,85,105,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#111118",
          paper: "#1A1A24",
        },
        primary: {
          main: "#94A3B8",
          contrastText: "#111118",
        },
        secondary: {
          main: "#E9C46A",
          contrastText: "#1E293B",
        },
        error: {
          main: "#E76F51",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#F4A261",
          contrastText: "#1E293B",
        },
        success: {
          main: "#5CB89A",
          contrastText: "#111118",
        },
        text: {
          primary: "#E8E4DD",
          secondary: "#9A9A9A",
        },
        divider: "#2A2A34",
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
