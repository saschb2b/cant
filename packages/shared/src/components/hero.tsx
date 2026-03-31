import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { HeroCta } from "./hero-cta";

interface HeroProps {
  /** Two-line title. First line is plain, second line is accented. */
  titleLine1: string;
  titleLine2: string;
  subtitle: ReactNode;
  caption: string;
  /** Optional gimmick tool passed to HeroCta. */
  gimmick?: { href: string; label: string };
  /** Right-side visual (animation, code preview, etc.). */
  visual: ReactNode;
  /** Optional gradient overlay (children rendered inside the gradient box). */
  gradientOverlay?: ReactNode;
}

const DEFAULT_GRADIENT = [
  "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(var(--mui-palette-primary-mainChannel) / 0.04) 0%, transparent 100%)",
  "radial-gradient(ellipse 60% 50% at 85% 75%, rgba(var(--mui-palette-primary-mainChannel) / 0.03) 0%, transparent 100%)",
].join(", ");

export function Hero({
  titleLine1,
  titleLine2,
  subtitle,
  caption,
  gimmick,
  visual,
  gradientOverlay,
}: HeroProps) {
  return (
    <>
      {/* Mesh gradient background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: DEFAULT_GRADIENT,
        }}
      >
        {gradientOverlay}
      </Box>

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
              fontWeight="bold"
              sx={{ mb: 2.5 }}
            >
              {titleLine1}
              <br />
              <Box component="span" sx={{ color: "primary.main" }}>
                {titleLine2}
              </Box>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: 420,
                mx: { xs: "auto", md: 0 },
              }}
            >
              {subtitle}
            </Typography>

            <HeroCta gimmick={gimmick} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 2,
                display: "block",
                textAlign: { xs: "center", md: "left" },
                opacity: 0.7,
              }}
            >
              {caption}
            </Typography>
          </Box>

          {/* Right: visual */}
          <Box sx={{ flex: 1, minWidth: 0, maxWidth: 540, width: "100%" }}>
            {visual}
          </Box>
        </Stack>
      </Container>
    </>
  );
}
