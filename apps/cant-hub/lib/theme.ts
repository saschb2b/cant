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
        divider: "#E2E8F0",
        action: {
          hover: "rgba(71,85,105,0.06)",
          selected: "rgba(71,85,105,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#0B1120",
          paper: "#131C2E",
        },
        primary: {
          main: "#94A3B8",
          contrastText: "#0B1120",
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
          contrastText: "#0B1120",
        },
        text: {
          primary: "#E2E8F0",
          secondary: "#94A3B8",
        },
        divider: "#1E293B",
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
