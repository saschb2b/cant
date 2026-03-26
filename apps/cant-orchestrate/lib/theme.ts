"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#F0F4F8",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#326CE5",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#EDF2F7",
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
        divider: "#D8E2EC",
        action: {
          hover: "rgba(50,108,229,0.06)",
          selected: "rgba(50,108,229,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#0F1219",
          paper: "#181D27",
        },
        primary: {
          main: "#6BA3FF",
          contrastText: "#0F1219",
        },
        secondary: {
          main: "#1E2535",
          contrastText: "#E1E8F0",
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
          primary: "#E1E8F0",
          secondary: "#8A9BBB",
        },
        divider: "#262F3F",
        action: {
          hover: "rgba(107,163,255,0.08)",
          selected: "rgba(107,163,255,0.14)",
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
