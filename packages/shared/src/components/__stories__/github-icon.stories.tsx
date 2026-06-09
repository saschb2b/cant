import type { Meta, StoryObj } from "@storybook/react-vite";
import { GithubIcon } from "../github-icon";

const meta: Meta<typeof GithubIcon> = {
  title: "Foundation/Github Icon",
  component: GithubIcon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The GitHub logo as an inline SVG. Filled with currentColor, so it inherits the text color of its container, which is how the site footer and open-source banner tint it to match their links. Only the size is configurable.",
      },
    },
  },
  args: {
    size: 18,
  },
  argTypes: {
    size: {
      description: "Rendered width and height in pixels.",
      control: { type: "number", min: 12, max: 96, step: 2 },
      table: { defaultValue: { summary: "18" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GithubIcon>;

/** Default 18px icon, the size used inline next to footer links. */
export const Default: Story = {};

/** The sizes used around the apps: inline (18), button (24), and feature (40). */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {[18, 24, 40].map((size) => (
        <GithubIcon key={size} size={size} />
      ))}
    </div>
  ),
};

/** Because the fill is currentColor, the icon takes on its container's color. */
export const InheritsColor: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ color: "#6e5494" }}>
        <GithubIcon size={32} />
      </span>
      <span style={{ color: "#2da44e" }}>
        <GithubIcon size={32} />
      </span>
      <span style={{ color: "#cf222e" }}>
        <GithubIcon size={32} />
      </span>
    </div>
  ),
};
