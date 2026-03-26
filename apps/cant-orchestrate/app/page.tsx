import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { ArrowRight, Gamepad2, BookOpen, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroAnimation } from "@/components/hero-animation";
import { challenges } from "@/lib/learn/challenges";
import { CATEGORY_ORDER } from "@/lib/learn/categories";

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
      <Box
        sx={{
          bgcolor: "rgba(var(--mui-palette-background-defaultChannel) / 0.7)",
          backdropFilter: "blur(40px)",
          borderTop: 1,
          borderBottom: 1,
          borderColor: "divider",
          py: { xs: 5, md: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h5"
            component="h2"
            fontWeight={600}
            sx={{ textAlign: "center", mb: 1 }}
          >
            Two paths to mastery
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mb: 4 }}
          >
            A pattern quiz and a reference library.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            {[
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
            ].map((feature) => (
              <NextLink
                key={feature.title}
                href={feature.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  flex: 1,
                  display: "flex",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 2.5,
                    border: 1,
                    borderColor: "divider",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "text.secondary",
                      transform: "translateY(-2px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: "action.selected",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.primary",
                      mb: 1.5,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.5 }}
                  >
                    {feature.desc}
                  </Typography>
                </Paper>
              </NextLink>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Can't series */}
      <Container
        maxWidth="md"
        sx={{ py: { xs: 5, md: 6 }, position: "relative", zIndex: 1 }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ textAlign: "center", mb: 2.5, display: "block" }}
        >
          {"Part of the Can't series"}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              maxWidth: { sm: 280 },
              p: 2.5,
              border: 1,
              borderColor: "primary.main",
              bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.04)",
            }}
          >
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
              {"Can't Orchestrate"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1.5 }}
            >
              Container orchestration patterns. You are here.
            </Typography>
          </Paper>
          {[
            {
              name: "Can't Maintain",
              desc: "React component API design.",
              href: "https://cant-maintain.saschb2b.com",
            },
            {
              name: "Can't Resize",
              desc: "Responsive design patterns.",
              href: "https://cant-resize.saschb2b.com",
            },
            {
              name: "Can't Type",
              desc: "TypeScript patterns.",
              href: "https://cant-type.saschb2b.com",
            },
          ].map((site) => (
            <NextLink
              key={site.name}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "inherit",
                flex: 1,
                display: "flex",
                maxWidth: 280,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2.5,
                  border: 1,
                  borderColor: "divider",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "text.secondary",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.75}
                  sx={{ mb: 0.5 }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {site.name}
                  </Typography>
                  <ExternalLink
                    size={12}
                    color="var(--mui-palette-text-disabled)"
                  />
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.5 }}
                >
                  {site.desc} Same format, different topic.
                </Typography>
              </Paper>
            </NextLink>
          ))}
        </Stack>
      </Container>

      {/* Open source CTA */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 5, md: 7 }, position: "relative", zIndex: 1 }}
      >
        <Paper
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            px: { xs: 3, md: 5 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            spacing={{ xs: 2, md: 4 }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" component="p" fontWeight={600}>
                Open source
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7, mt: 0.5 }}
              >
                Built with Next.js, Material UI, and TypeScript. Contributions
                welcome.
              </Typography>
            </Box>
            <NextLink
              href="https://github.com/saschb2b/cant"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", flexShrink: 0 }}
            >
              <Button
                variant="outlined"
                size="medium"
                startIcon={<ExternalLink size={16} />}
                sx={{
                  px: 3,
                  borderColor: "divider",
                  color: "text.primary",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "text.secondary",
                    bgcolor: "action.hover",
                  },
                }}
              >
                View on GitHub
              </Button>
            </NextLink>
          </Stack>
        </Paper>
      </Container>

      <SiteFooter />
    </Box>
  );
}
