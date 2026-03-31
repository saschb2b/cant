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
  parameters: {
    docs: {
      description: {
        component:
          "Renders a 3D protein structure from PDB data using `3dmol`. Supports both inline PDB strings and fetching from RCSB by PDB ID (e.g. `1BNA`). Multiple visual styles can be applied in order (stick, sphere, cartoon, etc.). The viewer auto-rotates and includes a loading spinner for remote fetches. Used by cant-explode for protein structure challenges. Requires `3dmol` as a peer dependency (dynamically imported).",
      },
    },
  },
  argTypes: {
    pdbData: {
      description: "Inline PDB-format string. Mutually exclusive with `pdbId`.",
      control: "text",
    },
    pdbId: {
      description:
        'RCSB PDB ID to fetch remotely (e.g. `"1BNA"`). Mutually exclusive with `pdbData`.',
      control: "text",
    },
    styles: {
      description:
        "Array of `{ selector, style }` objects applied in order. See [3Dmol.js docs](https://3dmol.csb.pitt.edu/) for available styles (stick, sphere, cartoon, etc.).",
      control: "object",
    },
    label: {
      description: "Label shown overlaid at the bottom of the viewer.",
      control: "text",
    },
    sublabel: {
      description: "Optional secondary label below the main label.",
      control: "text",
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
type Story = StoryObj<typeof PdbViewer>;

/** Inline PDB data rendered as ball-and-stick. */
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

/** Same structure rendered as a cartoon ribbon. */
export const CartoonStyle: Story = {
  args: {
    pdbData: HELIX_PDB,
    styles: [{ selector: {}, style: { cartoon: { color: "spectrum" } } }],
    label: "Cartoon rendering",
  },
};

/** Using the sublabel prop for additional context. */
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
