import type { Meta, StoryObj } from "@storybook/react-vite";
import { OpenSourceBanner } from "../open-source-banner";

const meta: Meta<typeof OpenSourceBanner> = {
  title: "Layout/Open Source Banner",
  component: OpenSourceBanner,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof OpenSourceBanner>;

export const Default: Story = {
  args: {
    githubUrl: "https://github.com/saschb2b/cant",
  },
};

export const CustomCopy: Story = {
  args: {
    title: "Built in the open",
    description:
      "Every challenge, every fix, every improvement is open source. Jump in.",
    githubUrl: "https://github.com/saschb2b/cant",
  },
};
