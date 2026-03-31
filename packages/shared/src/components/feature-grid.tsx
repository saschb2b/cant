import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import type { ReactNode } from "react";

export interface FeatureCard {
  icon: ReactNode;
  title: string;
  desc: string;
  href: string;
}

export interface FeatureGridProps {
  title: string;
  subtitle: string;
  cards: FeatureCard[];
}

export function FeatureGrid({ title, subtitle, cards }: FeatureGridProps) {
  return (
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
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 4 }}
        >
          {subtitle}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          {cards.map((feature) => (
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
  );
}
