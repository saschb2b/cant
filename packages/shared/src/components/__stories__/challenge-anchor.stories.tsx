import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChallengeAnchor } from "../challenge-anchor";

const meta: Meta<typeof ChallengeAnchor> = {
  title: "Content/Challenge Anchor",
  component: ChallengeAnchor,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A clickable anchor heading for a challenge card on learn pages. Clicking copies the deep-link URL to the clipboard and briefly shows a checkmark confirmation. Used on every learn/[category] page to allow sharing individual challenges.",
      },
    },
  },
  argTypes: {
    id: {
      description:
        "URL-safe identifier used as the hash fragment (e.g. `#use-memo-correctly`).",
      control: "text",
    },
    title: {
      description:
        "Human-readable challenge title displayed as the heading text.",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChallengeAnchor>;

/** Standard-length challenge title with a link icon that appears on hover. */
export const Default: Story = {
  args: {
    id: "use-memo-correctly",
    title: "Use useMemo correctly",
  },
};

/** A longer title to verify text wrapping and icon alignment. */
export const LongTitle: Story = {
  args: {
    id: "avoid-unnecessary-re-renders",
    title: "Avoid unnecessary re-renders in deeply nested component trees",
  },
};
