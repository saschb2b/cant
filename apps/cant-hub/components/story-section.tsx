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
        py: { xs: 5, md: 7 },
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
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 5 }}
          alignItems="center"
        >
          {/* Avatar */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: 72, md: 80 },
              height: { xs: 72, md: 80 },
              borderRadius: "50%",
              overflow: "hidden",
              border: 2,
              borderColor: "divider",
            }}
          >
            <Image
              src="/sascha.webp"
              alt="Sascha Becker"
              width={80}
              height={80}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </Box>

          {/* Quote */}
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ lineHeight: 1.6, maxWidth: { md: 600 } }}
            >
              I never learned much from reading docs.
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1.5,
                fontStyle: "italic",
                lineHeight: 1.8,
                maxWidth: { md: 600 },
                "&::before": { content: '"\\201C"' },
                "&::after": { content: '"\\201D"' },
              }}
            >
              I learn by comparing. Put two approaches next to each other and the difference clicks instantly. I built the Can't series to turn that into a game: real patterns, real decisions, and a clear explanation every time. Every challenge comes from a real decision I've faced or seen others struggle with. No trivia, no gotchas.
            </Typography>
          </Box>

          {/* Author + links */}
          <Stack
            alignItems={{ xs: "center", md: "flex-end" }}
            spacing={0.75}
            sx={{ flexShrink: 0 }}
          >
            <Typography variant="body2" fontWeight={700} sx={{ whiteSpace: "nowrap" }}>
              Sascha Becker
            </Typography>
            <Stack direction="row" spacing={1.5}>
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
                  <Github size={13} />
                  <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>saschb2b</Typography>
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
                  <Globe size={13} />
                  <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>saschb2b.com</Typography>
                </Stack>
              </NextLink>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
