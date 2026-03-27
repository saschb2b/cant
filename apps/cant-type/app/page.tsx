import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  ArrowRight,
  Gamepad2,
  BookOpen,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { LandingFeatures } from "@cant/shared/components/landing-features";
import { CantSeriesGrid } from "@cant/shared/components/cant-series-grid";
import { LandingOpenSource } from "@cant/shared/components/landing-open-source";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { challenges } from "@/lib/learn/challenges";
import { CATEGORY_ORDER } from "@/lib/learn/categories";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { codeBlockStyles } from "@cant/shared/lib/code-styles";
import { SparkleField } from "@/components/sparkle-field";

const HERO_SPELL = `type DeepReadonly<T> = {
  readonly [K in keyof T]:
    T[K] extends object
      ? DeepReadonly<T[K]>
      : T[K];
};`;

const HERO_REVEAL = `type DeepReadonly<Settings> = {
  readonly theme: {
    readonly mode: "light" | "dark";
    readonly accent: string;
  };
  readonly notifications: {
    readonly email: boolean;
    readonly push: boolean;
  };
};`;

export default async function LandingPage() {
  const highlighter = await getHighlighter();
  const spellHtml = highlightDual(highlighter, HERO_SPELL);
  const revealHtml = highlightDual(highlighter, HERO_REVEAL);
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
      >
        <SparkleField />
      </Box>

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
              Type magic,
              <br />
              <Box component="span" sx={{ color: "primary.main" }}>
                demystified.
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
              Test your TypeScript instincts with quick-fire challenges, and
              study {String(challenges.length)} patterns across{" "}
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
              free &middot; no signup &middot; takes 3 min &middot;{" "}
              <NextLink
                href="/playground"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                or try the sandbox
              </NextLink>
            </Typography>
          </Box>

          {/* Right: type transformation visual */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: 480,
              width: "100%",
              ml: { md: "auto" },
            }}
          >
            <Stack spacing={0} aria-hidden>
              {/* Spell: the type incantation */}
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor:
                      "rgba(var(--mui-palette-primary-mainChannel) / 0.06)",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    fontFamily="var(--font-geist-mono), monospace"
                    color="primary.main"
                  >
                    The spell
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor:
                      "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
                    ...codeBlockStyles,
                    "& pre": {
                      ...codeBlockStyles["& pre"],
                      fontSize: "0.7rem",
                      lineHeight: 1.6,
                      p: 1.5,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: spellHtml }}
                />
              </Paper>

              {/* Sparkle divider */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 1.5,
                  color: "primary.main",
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor:
                      "rgba(var(--mui-palette-primary-mainChannel) / 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles size={16} />
                </Box>
              </Box>

              {/* Reveal: the expanded result */}
              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor:
                    "rgba(var(--mui-palette-success-mainChannel) / 0.4)",
                  overflow: "hidden",
                  boxShadow:
                    "0 0 0 1px rgba(var(--mui-palette-success-mainChannel) / 0.1), 0 4px 24px rgba(var(--mui-palette-success-mainChannel) / 0.06)",
                }}
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderBottom: 1,
                    borderColor:
                      "rgba(var(--mui-palette-success-mainChannel) / 0.3)",
                    bgcolor:
                      "rgba(var(--mui-palette-success-mainChannel) / 0.06)",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    fontFamily="var(--font-geist-mono), monospace"
                    color="success.main"
                  >
                    Revealed
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor:
                      "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
                    ...codeBlockStyles,
                    "& pre": {
                      ...codeBlockStyles["& pre"],
                      fontSize: "0.7rem",
                      lineHeight: 1.6,
                      p: 1.5,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: revealHtml }}
                />
              </Paper>
            </Stack>
          </Box>
        </Stack>
      </Container>

      {/* Features */}
      <LandingFeatures
        title="Three paths to mastery"
        subtitle="A pattern quiz, a spell book, and a type sandbox."
        cards={[
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better TypeScript pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: `${String(challenges.length)} patterns across ${String(CATEGORY_ORDER.length)} categories. Each shows the fragile approach, the resilient one, and why it matters.`,
            href: "/learn",
          },
          {
            icon: <FlaskConical size={20} />,
            title: "Sandbox",
            desc: "Write TypeScript types and see them fully expanded. Explore utility types, mapped types, conditionals, and more.",
            href: "/playground",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't Type" />

      {/* Open source CTA */}
      <LandingOpenSource
        title="Open source"
        description="Built with Next.js, Material UI, and TypeScript. Contributions welcome."
        githubUrl="https://github.com/saschb2b/cant-type"
      />

      <SiteFooter />
    </Box>
  );
}
