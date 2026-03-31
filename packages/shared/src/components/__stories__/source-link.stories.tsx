import type { Meta, StoryObj } from "@storybook/react-vite";
import { SourceLink } from "../source-link";

const meta: Meta<typeof SourceLink> = {
  title: "Content/Source Link",
  component: SourceLink,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An external link to an authoritative source (React docs, MDN, TypeScript handbook, etc.) shown below a challenge explanation. Fires an analytics event on click. Used on learn/[category] pages across all apps.",
      },
    },
  },
  argTypes: {
    href: {
      description: "Full URL of the external source page.",
      control: "text",
    },
    label: {
      description: "Visible link text, typically formatted as 'Source: Title'.",
      control: "text",
    },
    challengeId: {
      description: "ID of the parent challenge, sent with the analytics event.",
      control: "text",
    },
    category: {
      description:
        "Category slug of the parent challenge, sent with the analytics event.",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SourceLink>;

/** Link to the React documentation site. */
export const Default: Story = {
  args: {
    href: "https://react.dev/reference/react/useMemo",
    label: "React docs: useMemo",
    challengeId: "use-memo-deps",
    category: "hooks",
  },
};

/** Link to the Mozilla Developer Network (MDN). */
export const MDN: Story = {
  args: {
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS/container-queries",
    label: "MDN: Container queries",
    challengeId: "container-queries-intro",
    category: "container-queries",
  },
};
