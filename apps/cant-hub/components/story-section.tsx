import NextLink from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Github, Globe } from "lucide-react";

export function StorySection() {
  return (
    <Box
      sx={{
        position: "relative",
        borderTop: 1,
        borderBottom: 1,
        borderColor: "divider",
        py: { xs: 8, md: 12 },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(61,139,114,0.08) 50%, rgba(49,120,198,0.12) 100%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{ position: "relative" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 6 }}
          alignItems="center"
        >
          {/* Portrait */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: 120, md: 160 },
              height: { xs: 120, md: 160 },
              borderRadius: "50%",
              overflow: "hidden",
              border: 3,
              borderColor: "divider",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <Image
              src="/sascha.webp"
              alt="Sascha Becker"
              width={160}
              height={160}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </Box>

          {/* Text */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="overline"
              color="text.disabled"
              sx={{ letterSpacing: "0.1em" }}
            >
              The idea
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              fontWeight={700}
              sx={{
                mt: 1.5,
                fontSize: { xs: "1.5rem", md: "2rem" },
                lineHeight: 1.3,
              }}
            >
              I never learned much from reading docs.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 2.5, lineHeight: 1.9 }}
            >
              {
                "I learn by comparing. Put two approaches next to each other and the difference clicks instantly. I built the Can't series to turn that into a game: real patterns, real decisions, and a clear explanation every time."
              }
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 2, lineHeight: 1.9 }}
            >
              {
                "Every challenge comes from a real decision I've faced or seen others struggle with. No trivia, no gotchas."
              }
            </Typography>

            {/* Author name + links */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                mt: 3,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Sascha Becker
              </Typography>
              <NextLink
                href="https://github.com/saschb2b"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in new tab)"
                style={{ textDecoration: "none", color: "inherit", display: "flex" }}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{ color: "text.secondary", "&:hover": { color: "text.primary" }, transition: "color 0.2s" }}
                >
                  <Github size={15} />
                  <Typography variant="caption">saschb2b</Typography>
                </Stack>
              </NextLink>
              <NextLink
                href="https://saschb2b.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Personal website (opens in new tab)"
                style={{ textDecoration: "none", color: "inherit", display: "flex" }}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{ color: "text.secondary", "&:hover": { color: "text.primary" }, transition: "color 0.2s" }}
                >
                  <Globe size={15} />
                  <Typography variant="caption">saschb2b.com</Typography>
                </Stack>
              </NextLink>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
