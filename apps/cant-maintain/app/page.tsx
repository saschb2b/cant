import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { ArrowRight, Check, X, Gamepad2, BookOpen, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshGradient } from "@/components/mesh-gradient";
import { LiveRibbon } from "@/components/live-ribbon";
import { LandingFeatures } from "@cant/shared/components/landing-features";
import { LandingCantSeries } from "@cant/shared/components/landing-cant-series";
import { LandingOpenSource } from "@cant/shared/components/landing-open-source";
import { getHighlighter, highlightDual } from "@cant/shared/lib/shiki";
import { codeBlockStyles } from "@cant/shared/lib/code-styles";

const BAD_CODE = `interface UserCardProps {
  data: User;
  active: boolean;
  click: () => void;
}`;

const GOOD_CODE = `interface UserCardProps {
  user: User;
  isActive: boolean;
  onClick: () => void;
}`;

export default async function LandingPage() {
  const highlighter = await getHighlighter();
  const badCodeHtml = highlightDual(highlighter, BAD_CODE);
  const goodCodeHtml = highlightDual(highlighter, GOOD_CODE);
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
      <LiveRibbon />

      {/* Hero */}
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 3, md: 6 },
          pb: { xs: 3, md: 8 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={{ xs: 3, md: 8 }}
        >
          {/* Left — title, subtitle, CTA */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              sx={{
                lineHeight: 1.15,
                mb: { xs: 1, md: 2 },
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              One component.
              <br />
              <Box component="span" sx={{ color: "error.main" }}>
                Two APIs.
              </Box>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                mb: { xs: 2, md: 4 },
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Can you tell which props your future self will thank you for?
              Train your eye in under 5 minutes.
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
                  sx={{
                    px: { xs: 3, md: 5 },
                    py: { xs: 1, md: 1.5 },
                    fontSize: { xs: "0.9rem", md: "1.05rem" },
                  }}
                >
                  Start Playing
                </Button>
              </NextLink>
              <NextLink href="/learn" style={{ textDecoration: "none" }}>
                <Button
                  variant="text"
                  size="large"
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: { xs: 1, md: 1.5 },
                    fontSize: { xs: "0.9rem", md: "1.05rem" },
                  }}
                >
                  Browse Patterns
                </Button>
              </NextLink>
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{
                mt: 1.5,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              10 challenges &middot; no signup &middot; takes 3 min
            </Typography>
          </Box>

          {/* Right — code preview */}
          <Box sx={{ flex: 1, minWidth: 0, maxWidth: 520, width: "100%" }}>
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
                  px: 2,
                  py: 1,
                  bgcolor: "secondary.main",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{ letterSpacing: "0.05em" }}
                >
                  WHICH IS BETTER?
                </Typography>
              </Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", sm: "block" } }}
                  />
                }
              >
                {/* Bad code */}
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                    sx={{ px: 2, pt: { xs: 1, sm: 1.5 } }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor:
                          "rgba(var(--mui-palette-error-mainChannel) / 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "error.main",
                      }}
                    >
                      <X size={11} strokeWidth={3} />
                    </Box>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      fontFamily="var(--font-geist-mono), monospace"
                      color="error.main"
                    >
                      Worse
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      ...codeBlockStyles,
                      "& pre": {
                        ...codeBlockStyles["& pre"],
                        p: { xs: 1.5, sm: 2 },
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        lineHeight: { xs: 1.5, sm: 1.7 },
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: badCodeHtml }}
                  />
                </Box>

                {/* Divider on mobile */}
                <Divider sx={{ display: { sm: "none" } }} />

                {/* Good code */}
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                    sx={{ px: 2, pt: { xs: 1, sm: 1.5 } }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor:
                          "rgba(var(--mui-palette-success-mainChannel) / 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "success.main",
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </Box>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      fontFamily="var(--font-geist-mono), monospace"
                      color="success.main"
                    >
                      Better
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      ...codeBlockStyles,
                      "& pre": {
                        ...codeBlockStyles["& pre"],
                        p: { xs: 1.5, sm: 2 },
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        lineHeight: { xs: 1.5, sm: 1.7 },
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: goodCodeHtml }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Container>

      {/* What you'll learn */}
      <LandingFeatures
        title="Train your eye for code that lasts"
        subtitle="Real conventions from React, MUI, and production codebases."
        cards={[
          {
            icon: <Zap size={20} />,
            title: "Play",
            desc: "Pick the better component API in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: "Callback naming, boolean props, prop specificity, and more. Each pattern shows both sides and why it matters.",
            href: "/learn",
          },
          {
            icon: <Gamepad2 size={20} />,
            title: "Practice",
            desc: "Train with real conventions from React, MUI, and production codebases until clean APIs become second nature.",
            href: "/play",
          },
        ]}
      />

      {/* Can't series */}
      <LandingCantSeries
        currentApp={{
          name: "Can't Maintain",
          desc: "React component API design.",
        }}
        otherApps={[
          {
            name: "Can't Resize",
            href: "https://cant-resize.saschb2b.com",
            desc: "Responsive design patterns.",
          },
        ]}
      />

      {/* Open source */}
      <LandingOpenSource githubUrl="https://github.com/saschb2b/cant-maintain" />

      <SiteFooter />
    </Box>
  );
}
