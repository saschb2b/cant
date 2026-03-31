import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoleculeViewer } from "../molecule-viewer";

const WATER_XYZ = `3
Water
O   0.000   0.000   0.000
H   0.757   0.586   0.000
H  -0.757   0.586   0.000`;

const METHANE_XYZ = `5
Methane
C   0.000   0.000   0.000
H   0.629   0.629   0.629
H  -0.629  -0.629   0.629
H  -0.629   0.629  -0.629
H   0.629  -0.629  -0.629`;

const meta: Meta<typeof MoleculeViewer> = {
  title: "Visual Renderers/Molecule Viewer",
  component: MoleculeViewer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders a 3D molecule from XYZ coordinate data using `3dmol`. The viewer auto-rotates to show the structure from multiple angles. Supports custom per-element coloring via `atomStyles`. Used by cant-explode for molecular geometry and electrostatic map challenges. Requires `3dmol` as a peer dependency (dynamically imported).",
      },
    },
  },
  argTypes: {
    xyzData: {
      description:
        "XYZ-format string with atom coordinates. First line is atom count, second is a comment, then one line per atom: `element x y z`.",
      control: "text",
    },
    label: {
      description: "Label shown overlaid at the bottom of the viewer.",
      control: "text",
    },
    atomStyles: {
      description:
        'Per-element color overrides as `{ element: { color: "#hex" } }`. When omitted, default stick+sphere styling is used.',
      control: "object",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, height: 300, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MoleculeViewer>;

/** Water molecule showing the bent 104.5 degree geometry. */
export const Water: Story = {
  args: {
    xyzData: WATER_XYZ,
    label: "Water (H2O)",
  },
};

/** Methane in tetrahedral geometry. */
export const Methane: Story = {
  args: {
    xyzData: METHANE_XYZ,
    label: "Methane (CH4)",
  },
};

/** Water with custom atom colors: red oxygen, blue hydrogens. */
export const CustomAtomStyles: Story = {
  args: {
    xyzData: WATER_XYZ,
    label: "Water with custom colors",
    atomStyles: {
      O: { color: "#ff4444" },
      H: { color: "#4488ff" },
    },
  },
};
