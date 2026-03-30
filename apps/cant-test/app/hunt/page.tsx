import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { MeshGradient } from "@cant/shared/components";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HuntGame } from "@/components/hunt/hunt-game";

export default function HuntPage() {
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
        maxWidth="lg"
        component="section"
        sx={{ py: { xs: 2, md: 3 }, flex: 1, position: "relative", zIndex: 1 }}
      >
        <Stack spacing={0.5} sx={{ mb: 2, textAlign: "center" }}>
          <Typography variant="h5" component="h1" fontWeight={700}>
            Bug Hunt
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Find the bugs before they ship to production. Reveal safe modules,
            place assertions on suspected bugs.
          </Typography>
        </Stack>
        <HuntGame />
      </Container>
      <SiteFooter />
    </Box>
  );
}
