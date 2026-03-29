import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshGradient } from "@cant/shared/components";
import { PlaygroundEditor } from "@/components/playground/playground-editor";

export const metadata: Metadata = {
  title: "Sandbox",
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
      <MeshGradient />
      <SiteHeader />

      <Container
        maxWidth="lg"
        component="section"
        sx={{ py: 4, flex: 1, position: "relative", zIndex: 1 }}
      >
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Type Sandbox
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
