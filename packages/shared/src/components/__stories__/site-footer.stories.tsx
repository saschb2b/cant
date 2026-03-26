import type { Meta, StoryObj } from "@storybook/react-vite";
import { SiteFooter } from "../site-footer";

const meta: Meta<typeof SiteFooter> = {
  title: "Layout/Site Footer",
  component: SiteFooter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SiteFooter>;

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
