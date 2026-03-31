import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eye } from "lucide-react";
import { SiteHeader } from "../site-header";

const meta: Meta<typeof SiteHeader> = {
  title: "Layout/Site Header",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sticky site header shared by all apps. Includes the app icon and title, an app-switcher popover for cross-app navigation, a color-scheme toggle, a search trigger (Ctrl+K), and navigation links (Learn, optional gimmick tool, Play CTA). Each app wraps this component with its own title, subtitle, and search palette renderer.",
      },
    },
  },
  argTypes: {
    title: {
      description: 'App name shown next to the icon, e.g. "Can\'t Resize".',
      control: "text",
    },
    subtitle: {
      description: "Short tagline displayed below the title on desktop.",
      control: "text",
    },
    currentAppName: {
      description:
        "Name of the current app, used to highlight it in the app-switcher popover.",
      control: "text",
    },
    gimmick: {
      description:
        "Optional app-specific tool link (e.g. Viewer, Sandbox, Inspector) inserted between Learn and Play in the nav.",
      control: "object",
    },
    renderSearchPalette: {
      description:
        "Render prop that receives `{ open, onClose }` and returns the search palette dialog.",
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof SiteHeader>;

/** Header with an app-specific gimmick tool (Viewer) shown between Learn and Play. */
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

/** Header without a gimmick tool, showing only Learn and Play navigation. */
export const WithoutGimmick: Story = {
  args: {
    title: "Can't Maintain",
    subtitle: "Can you spot the better API?",
    renderSearchPalette: () => null,
  },
};
