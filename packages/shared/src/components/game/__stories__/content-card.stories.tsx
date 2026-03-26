import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sun, Calendar, History } from "lucide-react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Check } from "lucide-react";
import { ContentCard } from "../content-card";

const meta: Meta<typeof ContentCard> = {
  title: "Game/Content Card",
  component: ContentCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContentCard>;

export const DailyChallenge: Story = {
  args: {
    icon: <Sun size={14} />,
    title: "Daily",
    children: (
      <Box>
        <Typography variant="body2" color="text.secondary">
          Resets every day
        </Typography>
        <Typography
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight={600}
          sx={{ fontSize: "0.75rem", mt: 1.5, color: "text.secondary" }}
        >
          ASL65F
        </Typography>
      </Box>
    ),
    onClick: () => console.log("play daily"),
  },
};

export const WithCompletionBadge: Story = {
  args: {
    icon: <Calendar size={14} />,
    title: "Weekly",
    headerRight: (
      <Box sx={{ color: "success.main", display: "flex" }}>
        <Check size={16} />
      </Box>
    ),
    children: (
      <Typography
        fontFamily="var(--font-geist-mono), monospace"
        fontWeight={700}
        sx={{ fontSize: "1.1rem", color: "success.main" }}
      >
        8/10
      </Typography>
    ),
  },
};

export const HistoryList: Story = {
  args: {
    icon: <History size={14} />,
    title: "Previous games",
    children: (
      <Stack spacing={1}>
        {["A3X9K2", "BN7FGH", "CQ2PRL"].map((seed) => (
          <Stack
            key={seed}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              fontFamily="var(--font-geist-mono), monospace"
              variant="caption"
            >
              {seed}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              2h ago
            </Typography>
          </Stack>
        ))}
      </Stack>
    ),
  },
};
