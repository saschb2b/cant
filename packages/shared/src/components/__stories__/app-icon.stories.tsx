import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppIcon } from "../app-icon";
import { ALL_APPS } from "../../lib/cant-apps";

const meta: Meta<typeof AppIcon> = {
  title: "Foundation/App Icon",
  component: AppIcon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders a single app's branded icon: a rounded square filled with the app's diagonal gradient (colorFrom to colorTo) overlaid with its glyph from the app registry (cant-apps.ts). Used in the app switcher, the hub, and cross-promo grids. Reads everything from a CantApp object, so it stays in sync with the registry. The icon SVG content for each app is authored in a 180x180 viewBox and scaled by the size prop.",
      },
    },
  },
  args: {
    app: ALL_APPS[0],
    size: 44,
  },
  argTypes: {
    app: {
      description:
        "The app whose icon to render. Supplies the gradient colors (colorFrom/colorTo) and glyph (iconSvgContent).",
      control: { type: "object" },
    },
    size: {
      description:
        "Rendered width and height in pixels (corner radius scales with it).",
      control: { type: "number", min: 16, max: 180, step: 4 },
      table: { defaultValue: { summary: "44" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppIcon>;

/** A single app icon at the default 44px size. Use the controls to switch apps or resize. */
export const Default: Story = {};

/** The same icon across the sizes used in the UI: list (24), switcher (44), and hub (96). */
export const Sizes: Story = {
  render: () => {
    const app = ALL_APPS[0];
    if (!app) return <span>No apps registered.</span>;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {[24, 44, 96].map((size) => (
          <AppIcon key={size} app={app} size={size} />
        ))}
      </div>
    );
  },
};

/** Every registered app icon, the way the switcher and hub present them. */
export const Catalog: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {ALL_APPS.map((app) => (
        <div
          key={app.name}
          style={{ width: 96, textAlign: "center", fontSize: 12 }}
        >
          <AppIcon app={app} size={56} />
          <div style={{ marginTop: 6, opacity: 0.8 }}>{app.name}</div>
        </div>
      ))}
    </div>
  ),
};
