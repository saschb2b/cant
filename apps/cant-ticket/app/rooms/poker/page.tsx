import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MeshGradient } from "@cant/shared/components";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CreateForm } from "@/components/poker/create-form";

export const metadata: Metadata = {
  title: "Planning Poker",
  description:
    "A dead-simple, ephemeral planning poker tool. Create a session, share the link, estimate together, leave. No accounts, no data stored.",
};

export default function PokerLandingPage() {
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
              Planning Poker
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Estimate tickets with your team. No signup, no persistence.
              Sessions vanish when everyone leaves or the server restarts.
            </Typography>
          </Box>
          <CreateForm />
        </Stack>
      </Container>

      <SiteFooter />
    </Box>
  );
}
