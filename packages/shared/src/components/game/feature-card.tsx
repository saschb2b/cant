import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

/**
 * Feature card used on landing pages to highlight app capabilities.
 * Renders an icon, title, and description in a bordered card.
 */
export function FeatureCard({
  icon,
  title,
  description,
  href,
}: FeatureCardProps) {
  return (
    <Paper
      component="a"
      href={href}
      elevation={0}
      sx={{
        flex: 1,
        p: 3,
        border: 1,
        borderColor: "divider",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.2s ease, transform 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          bgcolor: "action.selected",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.75 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.7 }}
      >
        {description}
      </Typography>
    </Paper>
  );
}
