import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Star, GitPullRequest, Code2, Heart } from "lucide-react";

export interface OpenSourceBannerProps {
  title?: string;
  description?: string;
  githubUrl: string;
}

const ACTION_ICONS = [
  {
    icon: <Star size={18} />,
    label: "Star",
    color: "#D4A017",
    bg: "rgba(212,160,23,0.10)",
  },
  {
    icon: <GitPullRequest size={18} />,
    label: "Contribute",
    color: "success.main",
    bg: "rgba(var(--mui-palette-success-mainChannel) / 0.10)",
  },
  {
    icon: <Code2 size={18} />,
    label: "Add challenges",
    color: "#4A7FB5",
    bg: "rgba(74,127,181,0.10)",
  },
  {
    icon: <Heart size={18} />,
    label: "Sponsor",
    color: "error.main",
    bg: "rgba(var(--mui-palette-error-mainChannel) / 0.10)",
  },
];

export function OpenSourceBanner({
  title = "Open source & community-driven",
  description = "New challenges, categories, and improvements are all welcome.",
  githubUrl,
}: OpenSourceBannerProps) {
  return (
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
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={{ xs: 3, md: 5 }}
        >
          {/* Left: title + description */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" component="p" fontWeight={600}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7, mt: 0.5 }}
            >
              {description}
            </Typography>
          </Box>

          {/* Middle: action icons */}
          <Stack
            direction="row"
            spacing={4}
            sx={{
              flexShrink: 0,
              display: { xs: "none", sm: "flex" },
            }}
          >
            {ACTION_ICONS.map((item) => (
              <Stack key={item.label} alignItems="center" spacing={0.75}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: item.bg,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {item.label}
                </Typography>
              </Stack>
            ))}
          </Stack>

          {/* Right: CTA button */}
          <NextLink
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", flexShrink: 0 }}
          >
            <Button
              variant="outlined"
              size="medium"
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
  );
}
