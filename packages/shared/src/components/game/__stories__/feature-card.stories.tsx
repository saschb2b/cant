import type { Meta, StoryObj } from "@storybook/react-vite";
import { Gamepad2, GraduationCap, FlaskConical } from "lucide-react";
import Stack from "@mui/material/Stack";
import { FeatureCard } from "../feature-card";

const meta: Meta<typeof FeatureCard> = {
  title: "Game/Feature Card",
  component: FeatureCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Default: Story = {
  args: {
    icon: <Gamepad2 size={22} />,
    title: "Play",
    description:
      "Pick the better TypeScript pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
    href: "/play",
  },
};

export const ThreeCards: Story = {
  render: () => (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
      <FeatureCard
        icon={<Gamepad2 size={22} />}
        title="Play"
        description="Pick the better pattern in 10 side-by-side code challenges."
        href="/play"
      />
      <FeatureCard
        icon={<GraduationCap size={22} />}
        title="Learn"
        description="107 patterns across 16 categories with explanations."
        href="/learn"
      />
      <FeatureCard
        icon={<FlaskConical size={22} />}
        title="Sandbox"
        description="Write TypeScript types and see them fully expanded."
        href="/playground"
      />
    </Stack>
  ),
};
