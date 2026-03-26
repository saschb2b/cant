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
          main: "#247A6F",
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
          main: "#247A6F",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#1A2A30",
          secondary: "#5A6E72",
        },
        divider: "#D8E0E2",
        action: {
          hover: "rgba(36,122,111,0.06)",
          selected: "rgba(36,122,111,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#0F1C20",
          paper: "#162329",
        },
        primary: {
          main: "#3DC2B2",
          contrastText: "#0F1C20",
        },
        secondary: {
          main: "#E9C46A",
          contrastText: "#1A2A30",
        },
        error: {
          main: "#E76F51",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#F4A261",
          contrastText: "#1A2A30",
        },
        success: {
          main: "#3DC2B2",
          contrastText: "#0F1C20",
        },
        text: {
          primary: "#E8F0F2",
          secondary: "#8BA4A9",
        },
        divider: "#1E3338",
        action: {
          hover: "rgba(61,194,178,0.08)",
          selected: "rgba(61,194,178,0.14)",
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
