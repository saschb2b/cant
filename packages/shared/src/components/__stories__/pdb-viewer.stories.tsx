import type { Meta, StoryObj } from "@storybook/react-vite";
import { PdbViewer } from "../pdb-viewer";

const HELIX_PDB = `ATOM      1  N   ALA A   1       1.000   1.000   1.000  1.00  0.00           N
ATOM      2  CA  ALA A   1       2.000   1.000   1.000  1.00  0.00           C
ATOM      3  C   ALA A   1       3.000   1.000   1.000  1.00  0.00           C
ATOM      4  O   ALA A   1       3.500   2.000   1.000  1.00  0.00           O
ATOM      5  N   ALA A   2       3.500   0.000   1.500  1.00  0.00           N
ATOM      6  CA  ALA A   2       4.500   0.000   2.000  1.00  0.00           C
ATOM      7  C   ALA A   2       5.500   0.500   2.500  1.00  0.00           C
ATOM      8  O   ALA A   2       6.000   1.500   2.500  1.00  0.00           O
END`;

const meta: Meta<typeof PdbViewer> = {
  title: "Visual Renderers/PDB Viewer",
  component: PdbViewer,
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
type Story = StoryObj<typeof PdbViewer>;

export const InlinePdb: Story = {
  args: {
    pdbData: HELIX_PDB,
    styles: [
      {
        selector: {},
        style: { stick: { radius: 0.15 }, sphere: { scale: 0.3 } },
      },
    ],
    label: "Short peptide (inline PDB)",
  },
};

export const CartoonStyle: Story = {
  args: {
    pdbData: HELIX_PDB,
    styles: [{ selector: {}, style: { cartoon: { color: "spectrum" } } }],
    label: "Cartoon rendering",
  },
};

export const WithSublabel: Story = {
  args: {
    pdbData: HELIX_PDB,
    styles: [
      {
        selector: {},
        style: { stick: { radius: 0.15 }, sphere: { scale: 0.3 } },
      },
    ],
    label: "Peptide structure",
    sublabel: "Ball and stick model",
  },
};
