import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Heart, ExternalLink, Compass } from "lucide-react";
import { HUB_URL } from "../lib/cant-apps";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

interface SiteFooterProps {
  navLinks: NavLink[];
}

const linkSx = {
  color: "text.secondary",
  textDecoration: "none",
  typography: "caption",
  "&:hover": { color: "text.primary" },
} as const;

export function SiteFooter({ navLinks }: SiteFooterProps) {
  return (
    <Box
      component="footer"
      sx={{ mt: "auto", position: "relative", zIndex: 1 }}
    >
      <Box sx={{ borderTop: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={{ xs: 1.5, sm: 1 }}
            sx={{ py: 2 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              Made with
              <Box
                component="span"
                sx={{ color: "error.main", display: "inline-flex" }}
              >
                <Heart size={12} fill="currentColor" />
              </Box>
              by{" "}
              <Box
                component="a"
                href="https://saschb2b.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": { color: "text.primary" },
                }}
              >
                Sascha
              </Box>
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                component="a"
                href={HUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  ...linkSx,
                }}
              >
                <Compass size={10} />
                {"Can't Hub"}
              </Box>
              {navLinks.map((link) =>
                link.external ? (
                  <Box
                    key={link.href}
                    component="a"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      ...linkSx,
                    }}
                  >
                    {link.label}
                    <ExternalLink size={10} />
                  </Box>
                ) : (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    style={{ textDecoration: "none" }}
                  >
                    <Box sx={linkSx}>{link.label}</Box>
                  </NextLink>
                ),
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
