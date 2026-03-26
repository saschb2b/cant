import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { ArrowRight, Gamepad2, BookOpen } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroAnimation } from "@/components/hero-animation";
import { challenges } from "@/lib/learn/challenges";
import { CATEGORY_ORDER } from "@/lib/learn/categories";
import { LandingFeatures } from "@cant/shared/components/landing-features";
import { LandingCantSeries } from "@cant/shared/components/landing-cant-series";
import { LandingOpenSource } from "@cant/shared/components/landing-open-source";

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
            "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(var(--mui-palette-primary-mainChannel) / 0.08) 0%, transparent 100%)",
            "radial-gradient(ellipse 60% 50% at 85% 75%, rgba(var(--mui-palette-primary-mainChannel) / 0.05) 0%, transparent 100%)",
            "radial-gradient(circle at 50% 50%, rgba(var(--mui-palette-error-mainChannel) / 0.02) 0%, transparent 70%)",
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
          alignItems: "center",
          pt: { xs: 6, md: 10 },
          pb: { xs: 6, md: 10 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 5, md: 6 }}
          sx={{ width: "100%" }}
        >
          {/* Left: copy + CTAs */}
          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
              maxWidth: 480,
              flexShrink: 0,
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
              Ship containers,
              <br />
              <Box component="span" sx={{ color: "primary.main" }}>
                not mistakes.
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
              }}
            >
              Test your DevOps instincts with quick-fire challenges, and study{" "}
              {String(challenges.length)} patterns across{" "}
              {String(CATEGORY_ORDER.length)} categories side by side.
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
            >
              <NextLink href="/play" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight size={18} />}
                  sx={{ px: { xs: 3, md: 5 } }}
                >
                  Start Playing
                </Button>
              </NextLink>
              <NextLink href="/learn" style={{ textDecoration: "none" }}>
                <Button variant="text" size="large">
                  Browse Patterns
                </Button>
              </NextLink>
            </Stack>
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
              free &middot; no signup &middot; takes 3 min
            </Typography>
          </Box>

          {/* Right: animated cluster visual */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: 520,
              width: "100%",
              ml: { md: "auto" },
            }}
            aria-hidden
          >
            <HeroAnimation />
          </Box>
        </Stack>
      </Container>

      {/* Features */}
      <LandingFeatures
        title="Two paths to mastery"
        subtitle="A pattern quiz and a reference library."
        cards={[
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better orchestration pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: `${String(challenges.length)} patterns across ${String(CATEGORY_ORDER.length)} categories. Each shows the fragile approach, the resilient one, and why it matters.`,
            href: "/learn",
          },
        ]}
      />

      {/* Can't series */}
      <LandingCantSeries currentAppName="Can't Orchestrate" />

      {/* Open source CTA */}
      <LandingOpenSource
        title="Open source"
        description="Built with Next.js, Material UI, and TypeScript. Contributions welcome."
        githubUrl="https://github.com/saschb2b/cant"
      />

      <SiteFooter />
    </Box>
  );
}
