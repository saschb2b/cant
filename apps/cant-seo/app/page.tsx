import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Search, Gamepad2, BookOpen } from "lucide-react";
import { HeroCta } from "@cant/shared/components/hero-cta";
import { LandingFeatures } from "@cant/shared/components/landing-features";
import { CantSeriesGrid } from "@cant/shared/components/cant-series-grid";
import { LandingOpenSource } from "@cant/shared/components/landing-open-source";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroAnimation } from "@/components/hero-animation";

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
      {/* Mesh gradient background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: [
            "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(var(--mui-palette-primary-mainChannel) / 0.04) 0%, transparent 100%)",
            "radial-gradient(ellipse 60% 50% at 85% 75%, rgba(var(--mui-palette-primary-mainChannel) / 0.03) 0%, transparent 100%)",
          ].join(", "),
        }}
      />

      <SiteHeader />

      {/* Hero */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pt: { xs: 6, md: 10 },
          pb: { xs: 6, md: 10 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={{ xs: 5, md: 8 }}
        >
          {/* Left: title, subtitle, CTA */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              fontWeight={800}
              sx={{
                lineHeight: 1.1,
                mb: 2.5,
                fontSize: { xs: "2.25rem", sm: "3rem", md: "3.5rem" },
                letterSpacing: "-0.02em",
              }}
            >
              One link.
              <br />
              <Box component="span" sx={{ color: "primary.main" }}>
                Every platform.
              </Box>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 420,
                mx: { xs: "auto", md: 0 },
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Paste any URL and see how it appears on LinkedIn, Twitter/X,
              Slack, Teams, and more. Plus 64 SEO challenges and a pattern
              library for Next.js.
            </Typography>

            <HeroCta
              gimmick={{ href: "/inspector", label: "Open Inspector" }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{
                mt: 2,
                display: "block",
                textAlign: { xs: "center", md: "left" },
                opacity: 0.7,
              }}
            >
              free &middot; no signup &middot; instant previews
            </Typography>
          </Box>

          {/* Right: animated preview cards */}
          <Box sx={{ flex: 1, minWidth: 0, maxWidth: 540, width: "100%" }}>
            <HeroAnimation />
          </Box>
        </Stack>
      </Container>

      {/* Features */}
      <LandingFeatures
        title="Three ways to level up"
        subtitle="A link inspector, a pattern quiz, and a reference library."
        cards={[
          {
            icon: <Search size={20} />,
            title: "Inspector",
            desc: "Preview how any URL appears on LinkedIn, Twitter/X, Slack, Teams, Discord, Google, and WhatsApp.",
            href: "/inspector",
          },
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better SEO pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: "64 patterns across 8 categories. Each shows the suboptimal approach, the recommended one, and why it matters.",
            href: "/learn",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't SEO" />

      {/* Open source CTA */}
      <LandingOpenSource
        title="Open source"
        description="Built with Next.js, Material UI, and TypeScript. Contributions welcome."
        githubUrl="https://github.com/saschb2b/cant-seo"
      />

      <SiteFooter />
    </Box>
  );
}
