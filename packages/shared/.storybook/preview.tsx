import type { Preview } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AnalyticsProvider } from "../src/lib/analytics-context";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#3178C6" },
        secondary: { main: "#EDF2F7", contrastText: "#1E293B" },
        success: { main: "#3D9A5F" },
        error: { main: "#E05252" },
        warning: { main: "#E5A63B" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#6EA8DE" },
        secondary: { main: "#1E2535", contrastText: "#E1E8F0" },
        success: { main: "#5BBB7B" },
        error: { main: "#F07070" },
        warning: { main: "#F0B95A" },
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".shiki-dark": { display: "none" },
        ".dark .shiki-light": { display: "none" },
        ".dark .shiki-dark": { display: "block" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

function noopTrack(_event: string, _data: Record<string, unknown>) {
  console.log("[analytics]", _event, _data);
}

function ThemeDecorator({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme} defaultMode="light">
      <CssBaseline />
      <AnalyticsProvider value={noopTrack}>{children}</AnalyticsProvider>
    </ThemeProvider>
  );
}

const preview: Preview = {
  decorators: [(Story) => <ThemeDecorator><Story /></ThemeDecorator>],
  parameters: {
    options: {
      storySort: {
        order: ["Foundation", "Layout", "Content", "Game"],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
