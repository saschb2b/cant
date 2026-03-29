"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["primary"];
  }
  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#FDF5F9",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#BE185D",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#F5E0EC",
          contrastText: "#2D0A1B",
        },
        error: {
          main: "#B91C1C",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#B45309",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#15803D",
          contrastText: "#FFFFFF",
        },
        accent: {
          main: "#7C3AED",
          light: "#8B5CF6",
          dark: "#6D28D9",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#1C0F16",
          secondary: "#6B4458",
        },
        divider: "#E8D0DC",
      },
    },
    dark: {
      palette: {
        background: {
          default: "#1C0F16",
          paper: "#2A1722",
        },
        primary: {
          main: "#F472B6",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#33181E",
          contrastText: "#F5E0EC",
        },
        error: {
          main: "#EF4444",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#D97706",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#22C55E",
          contrastText: "#FFFFFF",
        },
        accent: {
          main: "#A78BFA",
          light: "#C4B5FD",
          dark: "#8B5CF6",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#F5E0EC",
          secondary: "#B88EA0",
        },
        divider: "#3D2530",
        action: {
          hover: "rgba(255,255,255,0.10)",
          selected: "rgba(255,255,255,0.20)",
          focus: "rgba(255,255,255,0.24)",
        },
      },
    },
  },
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": {
          transition:
            "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, fill 0.3s ease, stroke 0.3s ease",
        },
        body: {
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          transition:
            "background-color 0.3s ease, background-image 0.3s ease, color 0.3s ease",
        },
        ".light body, body.light": {
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, #F5DAE8 0%, #FDF5F9 60%)",
        },
        ".dark body, body.dark": {
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, #26141C 0%, #1C0F16 60%)",
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
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-geist-mono), monospace",
          fontWeight: 500,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 4,
        },
      },
    },
  },
});

export default theme;
