import type { Meta, StoryObj } from "@storybook/react-vite";
import { SourceLink } from "../source-link";

const meta: Meta<typeof SourceLink> = {
  title: "Content/Source Link",
  component: SourceLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SourceLink>;

export const Default: Story = {
  args: {
    href: "https://react.dev/reference/react/useMemo",
    label: "React docs: useMemo",
    challengeId: "use-memo-deps",
    category: "hooks",
  },
};

export const MDN: Story = {
  args: {
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS/container-queries",
    label: "MDN: Container queries",
    challengeId: "container-queries-intro",
    category: "container-queries",
  },
};
