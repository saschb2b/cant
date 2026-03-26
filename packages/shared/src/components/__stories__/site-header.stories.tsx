import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { GraduationCap, Gamepad2 } from "lucide-react";
import { SiteHeader } from "../site-header";

const meta: Meta<typeof SiteHeader> = {
  title: "Layout/Site Header",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Default: Story = {
  args: {
    title: "Can't Resize",
    subtitle: "Learn responsive design",
    navItems: [
      {
        type: "text" as const,
        href: "/play",
        label: "Play",
        icon: <Gamepad2 size={18} />,
      },
      {
        type: "text" as const,
        href: "/learn",
        label: "Learn",
        icon: <GraduationCap size={18} />,
      },
      {
        type: "cta" as const,
        href: "/canvas",
        label: "Open Viewer",
      },
    ],
    renderSearchPalette: () => null,
  },
};
