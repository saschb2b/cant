import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChallengeAnchor } from "../challenge-anchor";

const meta: Meta<typeof ChallengeAnchor> = {
  title: "Content/Challenge Anchor",
  component: ChallengeAnchor,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChallengeAnchor>;

export const Default: Story = {
  args: {
    id: "use-memo-correctly",
    title: "Use useMemo correctly",
  },
};

export const LongTitle: Story = {
  args: {
    id: "avoid-unnecessary-re-renders",
    title: "Avoid unnecessary re-renders in deeply nested component trees",
  },
};
