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
  title: "Content/Molecule Viewer",
  component: MoleculeViewer,
  tags: ["autodocs"],
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

export const Water: Story = {
  args: {
    xyzData: WATER_XYZ,
    label: "Water (H2O)",
  },
};

export const Methane: Story = {
  args: {
    xyzData: METHANE_XYZ,
    label: "Methane (CH4)",
  },
};

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
