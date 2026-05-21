import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MeshGradient } from "@cant/shared/components";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CreateForm } from "@/components/retro/create-form";

export const metadata: Metadata = {
  title: "Sprint Retro",
  description:
    "Ephemeral retros for your team. Pick a template, share the link, capture action items. No accounts, no data stored.",
};

export default function RetroLandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <MeshGradient />
      <SiteHeader />

      <Container
        maxWidth="sm"
        component="section"
        sx={{ py: { xs: 4, sm: 6 }, flex: 1, position: "relative", zIndex: 1 }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              Sprint Retro
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pick a template, gather notes, ship action items. Notes stay
              hidden until the host reveals them. Nothing is stored.
            </Typography>
          </Box>
          <CreateForm />
        </Stack>
      </Container>

      <SiteFooter />
    </Box>
  );
}
