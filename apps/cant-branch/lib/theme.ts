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
          default: "#FBF5F0",
          paper: "#FFFFFF",
        },
        primary: {
          main: "#C2410C",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#F0E6DA",
          contrastText: "#2D1B08",
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
          main: "#0369A1",
          light: "#0284C7",
          dark: "#075985",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#1C1410",
          secondary: "#6B5744",
        },
        divider: "#E0D5C8",
      },
    },
    dark: {
      palette: {
        background: {
          default: "#1C1410",
          paper: "#2A1F17",
        },
        primary: {
          main: "#F97316",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#332618",
          contrastText: "#F0E6DA",
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
          main: "#38BDF8",
          light: "#7DD3FC",
          dark: "#0284C7",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#F0E6DA",
          secondary: "#B8A48E",
        },
        divider: "#3D3025",
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
            "radial-gradient(ellipse at 50% 0%, #F5E8DA 0%, #FBF5F0 60%)",
        },
        ".dark body, body.dark": {
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, #261C14 0%, #1C1410 60%)",
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
