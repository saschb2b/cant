import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ContentCardProps {
  /** Icon shown in the header bar. */
  icon: ReactNode;
  /** Title shown next to the icon. */
  title: string;
  /** Card body content. */
  children: ReactNode;
  /** Background color for the header bar. Defaults to "action.selected". */
  headerBgcolor?: string;
  /** Optional element rendered at the right end of the header. */
  headerRight?: ReactNode;
  /** Click handler for the entire card. */
  onClick?: () => void;
}

/**
 * Card with a colored header bar (icon + title) and flexible body content.
 * Used for daily/weekly challenge cards, history lists, and more.
 */
export function ContentCard({
  icon,
  title,
  children,
  headerBgcolor = "action.selected",
  headerRight,
  onClick,
}: ContentCardProps) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        flex: 1,
        border: 1,
        borderColor: "divider",
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
        sx={{
          px: 2,
          py: 1,
          bgcolor: headerBgcolor,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ fontSize: "0.72rem" }}
        >
          {title}
        </Typography>
        {headerRight && <Box sx={{ ml: "auto" }}>{headerRight}</Box>}
      </Stack>

      <Box sx={{ p: 2 }}>{children}</Box>
    </Paper>
  );
}
