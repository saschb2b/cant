import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeroCta } from "../hero-cta";

const meta: Meta<typeof HeroCta> = {
  title: "Layout/Hero CTA",
  component: HeroCta,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeroCta>;

export const Default: Story = {
  args: {},
};

export const WithGimmick: Story = {
  args: {
    gimmick: { href: "/playground", label: "Sandbox" },
  },
};
