import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { OpenSourceBanner } from "@cant/shared/components";
import { ALL_APPS } from "@cant/shared/lib/cant-apps";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HubSeriesGrid } from "@/components/hub-series-grid";
import { ColorBar } from "@/components/color-bar";

const TOTAL_CHALLENGES = 452;

export default function LandingPage() {
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
      <SiteHeader />

      {/* Intro */}
      <Container
        maxWidth="md"
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 2, md: 3 },
          textAlign: "center",
        }}
      >
        {/* Color spectrum bar */}
        <ColorBar colors={ALL_APPS.map((a) => a.colorFrom)} />

        <Typography variant="h2" component="h1" sx={{ mt: 3 }}>
          {"The Can't Series"}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 2,
            mb: 1.5,
            maxWidth: 520,
            mx: "auto",
          }}
        >
          {`${String(ALL_APPS.length)} topics, ${String(TOTAL_CHALLENGES)} challenges. Pick the better pattern from two side-by-side options, then learn why it matters.`}
        </Typography>

        <Typography variant="caption" color="text.disabled">
          free &middot; no signup &middot; open source
        </Typography>
      </Container>

      {/* Series cards */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <HubSeriesGrid />
      </Container>

      {/* Open source CTA */}
      <OpenSourceBanner
        title="Open source"
        description="Built with Next.js, Material UI, and TypeScript. Contributions welcome."
        githubUrl="https://github.com/saschb2b/cant"
      />

      <SiteFooter />
    </Box>
  );
}
