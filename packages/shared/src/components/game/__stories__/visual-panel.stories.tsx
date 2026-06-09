import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { VisualPanel } from "../visual-panel";

function GoodComponent() {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        Sign In
      </Typography>
      <Button variant="contained" fullWidth sx={{ mt: 2 }}>
        Continue
      </Button>
    </Box>
  );
}

function BadComponent() {
  return (
    <Box sx={{ p: 1, textAlign: "left" }}>
      <Typography variant="body2">sign in</Typography>
      <Button size="small" sx={{ mt: 0.5 }}>
        go
      </Button>
    </Box>
  );
}

const meta: Meta<typeof VisualPanel> = {
  title: "Game/Visual Panel",
  component: VisualPanel,
  tags: ["autodocs"],
  args: {
    component: GoodComponent,
    label: "A",
    isSelectable: true,
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VisualPanel>;

export const Selectable: Story = {
  args: {},
};

export const Correct: Story = {
  args: {
    result: "correct",
    isSelected: true,
  },
};

export const Wrong: Story = {
  args: {
    label: "B",
    component: BadComponent,
    result: "wrong",
    isSelected: true,
  },
};
