import type { Meta, StoryObj } from "@storybook/react-vite";
import { CantSeriesGrid } from "../cant-series-grid";

const meta: Meta<typeof CantSeriesGrid> = {
  title: "Layout/Cant Series Grid",
  component: CantSeriesGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof CantSeriesGrid>;

export const Full: Story = {
  args: {
    currentAppName: "Can't Maintain",
    variant: "full",
  },
};

export const Compact: Story = {
  args: {
    currentAppName: "Can't Resize",
    variant: "compact",
  },
};
