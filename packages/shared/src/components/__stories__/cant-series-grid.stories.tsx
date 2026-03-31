import type { Meta, StoryObj } from "@storybook/react-vite";
import { CantSeriesGrid } from "../cant-series-grid";

const meta: Meta<typeof CantSeriesGrid> = {
  title: "Layout/Cant Series Grid",
  component: CantSeriesGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Cross-promotion grid that links to other apps in the series, excluding the current one. The "full" variant is used on landing pages with a header and Hub CTA. The "compact" variant is used on play lobby pages with a smaller layout. Reads app data from the shared app registry.',
      },
    },
  },
  argTypes: {
    currentAppName: {
      description:
        "Name of the current app (must match an entry in ALL_APPS). This app is excluded from the grid.",
      control: "text",
    },
    variant: {
      description:
        '"full" renders a landing-page section with header and Hub button. "compact" renders a smaller grid for lobby pages.',
      control: "radio",
      options: ["full", "compact"],
      table: { defaultValue: { summary: '"full"' } },
    },
    linkPath: {
      description:
        'Override the path appended to each app href. Defaults to "/" for full, "/play" for compact.',
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CantSeriesGrid>;

/** Landing page variant with section header, Hub CTA, and larger cards. */
export const Full: Story = {
  args: {
    currentAppName: "Can't Maintain",
    variant: "full",
  },
};

/** Compact play-lobby variant with smaller cards and a "More topics" header. */
export const Compact: Story = {
  args: {
    currentAppName: "Can't Resize",
    variant: "compact",
  },
};
