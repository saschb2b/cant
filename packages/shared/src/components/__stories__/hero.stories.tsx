import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Hero } from "../hero";

function MockVisual() {
  return (
    <Box
      sx={{
        p: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Visual slot (code preview, animation, etc.)
      </Typography>
    </Box>
  );
}

const meta: Meta<typeof Hero> = {
  title: "Layout/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    titleLine1: "One component.",
    titleLine2: "Two APIs.",
    subtitle:
      "Can you tell which props your future self will thank you for? Train your eye in under 5 minutes.",
    caption: "10 challenges &middot; no signup &middot; takes 3 min",
    visual: <MockVisual />,
  },
};

export const WithGimmick: Story = {
  args: {
    ...Default.args,
    gimmick: { href: "/playground", label: "Sandbox" },
  },
};

export const LongSubtitle: Story = {
  args: {
    ...Default.args,
    titleLine1: "Type magic,",
    titleLine2: "demystified.",
    subtitle:
      "Test your TypeScript instincts with quick-fire challenges, and study 84 patterns across 12 categories side by side.",
    caption: "free &middot; no signup &middot; takes 3 min",
    gimmick: { href: "/playground", label: "Sandbox" },
  },
};
