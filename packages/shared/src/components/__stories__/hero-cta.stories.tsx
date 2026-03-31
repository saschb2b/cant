import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeroCta } from "../hero-cta";

const meta: Meta<typeof HeroCta> = {
  title: "Layout/Hero CTA",
  component: HeroCta,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Call-to-action button row rendered inside the Hero component. Displays buttons in a fixed order: Play (contained), optional gimmick tool (outlined), and Learn (text). Used on every app landing page.",
      },
    },
  },
  argTypes: {
    gimmick: {
      description:
        "Optional app-specific tool action (e.g. Viewer, Sandbox). When provided, an outlined button is inserted between Play and Learn.",
      control: "object",
    },
  },
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

/** Play and Learn buttons only, without a gimmick tool. */
export const Default: Story = {
  args: {},
};

/** Play, Sandbox (gimmick), and Learn buttons in a row. */
export const WithGimmick: Story = {
  args: {
    gimmick: { href: "/playground", label: "Sandbox" },
  },
};
