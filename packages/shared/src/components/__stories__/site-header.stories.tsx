import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eye } from "lucide-react";
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

export const WithGimmick: Story = {
  args: {
    title: "Can't Resize",
    subtitle: "Learn responsive design",
    gimmick: {
      href: "/canvas",
      label: "Viewer",
      icon: <Eye size={18} />,
    },
    renderSearchPalette: () => null,
  },
};

export const WithoutGimmick: Story = {
  args: {
    title: "Can't Maintain",
    subtitle: "Can you spot the better API?",
    renderSearchPalette: () => null,
  },
};
