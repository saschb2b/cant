"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#FAFAF9",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#A16207",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#713F12",
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
          primary: "#1C1917",
          secondary: "#57534E",
        },
        divider: "#E7E5E4",
        action: {
          hover: "rgba(161,98,7,0.06)",
          selected: "rgba(161,98,7,0.10)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#1C1917",
          paper: "#292524",
        },
        primary: {
          main: "#FACC15",
          contrastText: "#1C1917",
        },
        secondary: {
          main: "#FDE047",
          contrastText: "#1C1917",
        },
        error: {
          main: "#EF4444",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#F59E0B",
          contrastText: "#1C1917",
        },
        success: {
          main: "#22C55E",
          contrastText: "#1C1917",
        },
        text: {
          primary: "#FAFAF9",
          secondary: "#A8A29E",
        },
        divider: "#44403C",
        action: {
          hover: "rgba(250,204,21,0.08)",
          selected: "rgba(250,204,21,0.14)",
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
