import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ImagePanel } from "../image-panel";

const meta: Meta<typeof ImagePanel> = {
  title: "Game/Image Panel",
  component: ImagePanel,
  tags: ["autodocs"],
  args: {
    imageSrc: "https://placehold.co/400x250/1a1a2e/e0e0e0?text=Option+A",
    imageAlt: "Option A layout",
    label: "A",
    isSelectable: true,
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ImagePanel>;

export const Selectable: Story = {
  args: {},
};

export const Correct: Story = {
  args: {
    result: "correct",
    isSelected: true,
  },
};

export const Wrong: Story = {
  args: {
    label: "B",
    imageSrc: "https://placehold.co/400x250/2e1a1a/e0e0e0?text=Option+B",
    imageAlt: "Option B layout",
    result: "wrong",
    isSelected: true,
  },
};
