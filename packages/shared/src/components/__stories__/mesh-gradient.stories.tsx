import type { Meta, StoryObj } from "@storybook/react-vite";
import { MeshGradient } from "../mesh-gradient";

const meta: Meta<typeof MeshGradient> = {
  title: "Layout/Mesh Gradient",
  component: MeshGradient,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Fixed-position decorative backdrop shared across pages. Layers several soft radial gradients tinted with the theme palette channels (primary, success, warning, error), so it adapts to light and dark mode automatically. It is pointer-events: none and sits at zIndex 0, so it renders behind page content without intercepting clicks. Takes no props.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MeshGradient>;

/** The backdrop with sample content layered on top, as a page would use it. */
export const Default: Story = {
  render: () => (
    <div style={{ position: "relative", minHeight: 360, overflow: "hidden" }}>
      <MeshGradient />
      <div style={{ position: "relative", zIndex: 1, padding: 32 }}>
        <h2 style={{ margin: 0 }}>Page content sits above the gradient</h2>
        <p style={{ maxWidth: 420, opacity: 0.8 }}>
          The mesh gradient is a fixed backdrop. Toggle the Storybook theme to
          see it re-tint from the palette in light and dark mode.
        </p>
      </div>
    </div>
  ),
};
