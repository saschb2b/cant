import type { Meta, StoryObj } from "@storybook/react-vite";
import { OpenSourceBanner } from "../open-source-banner";

const meta: Meta<typeof OpenSourceBanner> = {
  title: "Layout/Open Source Banner",
  component: OpenSourceBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Promotional banner displayed on landing pages encouraging users to contribute on GitHub. Shows a title, description, action icons (Star, Contribute, Add challenges, Sponsor), and a "View on GitHub" button. The action icons are hidden on mobile.',
      },
    },
  },
  argTypes: {
    title: {
      description: "Banner heading text.",
      control: "text",
      table: { defaultValue: { summary: '"Open source & community-driven"' } },
    },
    description: {
      description: "Supporting text below the heading.",
      control: "text",
      table: {
        defaultValue: {
          summary:
            '"New challenges, categories, and improvements are all welcome."',
        },
      },
    },
    githubUrl: {
      description: "Full URL to the GitHub repository, used by the CTA button.",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof OpenSourceBanner>;

/** Banner with default title and description. */
export const Default: Story = {
  args: {
    githubUrl: "https://github.com/saschb2b/cant",
  },
};

/** Banner with custom title and description copy. */
export const CustomCopy: Story = {
  args: {
    title: "Built in the open",
    description:
      "Every challenge, every fix, every improvement is open source. Jump in.",
    githubUrl: "https://github.com/saschb2b/cant",
  },
};
