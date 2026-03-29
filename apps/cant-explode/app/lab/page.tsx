import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Sandbox } from "@/components/lab/sandbox";

export default function LabPage() {
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
        sx={{
          py: { xs: 2, md: 4 },
          flex: 1,
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mb: { xs: 1.5, md: 3 } }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
          >
            Chemistry Lab
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              maxWidth: 480,
              display: { xs: "none", sm: "block" },
            }}
          >
            Drop elements onto the canvas and watch them react. Select an
            element, then click or drag to place particles.
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <Sandbox />
        </Box>
      </Container>

      <SiteFooter />
    </Box>
  );
}
