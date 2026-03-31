import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { OpenSourceBanner } from "@cant/shared/components";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { StorySection } from "@/components/story-section";

import { HubSeriesGrid } from "@/components/hub-series-grid";

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

      <Box component="main">
        {/* 1. Bold, centered headline */}
        <Hero />

        {/* 2. The story behind it (full-bleed band) */}
        <StorySection />

        {/* 3. The series (full-bleed band) */}
        <Box
          id="series"
          sx={{
            position: "relative",
            borderTop: 1,
            borderBottom: 1,
            borderColor: "divider",
            py: { xs: 8, md: 14 },
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(49,120,198,0.10) 0%, rgba(124,58,237,0.08) 50%, rgba(219,39,119,0.10) 100%)",
              pointerEvents: "none",
            },
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                mb: { xs: 5, md: 8 },
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                Sharpen the instincts that matter.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mt: 2,
                  maxWidth: 480,
                  lineHeight: 1.7,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                From React components to Git workflows, TypeScript to UX design.
                Real decisions, built from experience.
              </Typography>
            </Box>
            <HubSeriesGrid />
          </Container>
        </Box>

        {/* 5. Open source */}
        <Box sx={{ py: { xs: 2, md: 4 } }}>
          <OpenSourceBanner
            title="Open source, always"
            description="Every challenge, every line of code. Contributions, new challenges, and feedback are always welcome."
            githubUrl="https://github.com/saschb2b/cant"
          />
        </Box>
      </Box>

      <SiteFooter />
    </Box>
  );
}
