import NextLink from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { ExternalLink } from "lucide-react";

export interface CantSeriesApp {
  name: string;
  desc: string;
  href: string;
}

export interface LandingCantSeriesProps {
  currentApp: {
    name: string;
    desc: string;
  };
  otherApps: CantSeriesApp[];
}

export function LandingCantSeries({
  currentApp,
  otherApps,
}: LandingCantSeriesProps) {
  return (
    <Container
      maxWidth="md"
      sx={{ py: { xs: 5, md: 6 }, position: "relative", zIndex: 1 }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{ textAlign: "center", mb: 2.5, fontSize: "0.8rem" }}
      >
        {"Part of the Can't series"}
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
      >
        {/* Current app (highlighted) */}
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
            {currentApp.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            {currentApp.desc} You are here.
          </Typography>
        </Paper>

        {/* Other apps */}
        {otherApps.map((site) => (
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
  );
}
