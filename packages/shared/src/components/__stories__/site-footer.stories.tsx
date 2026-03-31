import type { Meta, StoryObj } from "@storybook/react-vite";
import { SiteFooter } from "../site-footer";

const meta: Meta<typeof SiteFooter> = {
  title: "Layout/Site Footer",
  component: SiteFooter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Shared site footer rendered at the bottom of every page across all apps. Displays the author credit, a link to the Hub, and app-specific navigation links passed as props. Each app wraps this component with its own link configuration.",
      },
    },
  },
  argTypes: {
    navLinks: {
      description:
        "Array of navigation links to display. Each link has an `href`, `label`, and optional `external` flag that opens the link in a new tab.",
      control: "object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SiteFooter>;

/** Footer with internal and external navigation links, including a GitHub link. */
export const Default: Story = {
  args: {
    navLinks: [
      { href: "/play", label: "Play" },
      { href: "/learn", label: "Learn" },
      {
        href: "https://github.com/saschb2b/cant-resize",
        label: "GitHub",
        external: true,
      },
    ],
  },
};
