import NextLink from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Globe } from "lucide-react";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

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
              I learn by comparing. Put two approaches next to each other and
              the difference clicks instantly. I built the Can&apos;t series to
              turn that into a game: real patterns, real decisions, and a clear
              explanation every time. Every challenge comes from a real decision
              I&apos;ve faced or seen others struggle with. No trivia, no
              gotchas.
            </Typography>
          </Box>

          {/* Author + links */}
          <Stack
            alignItems={{ xs: "center", md: "flex-end" }}
            spacing={0.75}
            sx={{ flexShrink: 0 }}
          >
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ whiteSpace: "nowrap" }}
            >
              Sascha Becker
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <NextLink
                href="https://github.com/saschb2b"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in new tab)"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                    transition: "color 0.2s",
                  }}
                >
                  <GitHubIcon size={13} />
                  <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>
                    saschb2b
                  </Typography>
                </Stack>
              </NextLink>
              <NextLink
                href="https://saschb2b.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Personal website (opens in new tab)"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                    transition: "color 0.2s",
                  }}
                >
                  <Globe size={13} />
                  <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>
                    saschb2b.com
                  </Typography>
                </Stack>
              </NextLink>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
