import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PlaygroundEditor } from "@/components/playground/playground-editor";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Write TypeScript type expressions and see them fully expanded. Explore utility types, mapped types, conditional types, and more.",
};

export default function PlaygroundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Mesh gradient background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: [
            "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(var(--mui-palette-primary-mainChannel) / 0.08) 0%, transparent 100%)",
            "radial-gradient(ellipse 60% 50% at 85% 75%, rgba(var(--mui-palette-primary-mainChannel) / 0.05) 0%, transparent 100%)",
            "radial-gradient(circle at 50% 50%, rgba(var(--mui-palette-error-mainChannel) / 0.02) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      <SiteHeader />

      <Container
        maxWidth="lg"
        component="section"
        sx={{ py: 4, flex: 1, position: "relative", zIndex: 1 }}
      >
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Type Playground
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 520, lineHeight: 1.7 }}
          >
            Write TypeScript types on the left and see them fully expanded on
            the right. Pick a preset or write your own.
          </Typography>
        </Stack>

        <PlaygroundEditor />
      </Container>

      <SiteFooter />
    </Box>
  );
}
