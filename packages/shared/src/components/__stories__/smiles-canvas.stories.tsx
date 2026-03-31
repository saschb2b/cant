import type { Meta, StoryObj } from "@storybook/react-vite";
import { SmilesCanvas } from "../smiles-canvas";

const meta: Meta<typeof SmilesCanvas> = {
  title: "Visual Renderers/Smiles Canvas",
  component: SmilesCanvas,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders a 2D chemical structure from a SMILES notation string using the `smiles-drawer` library. Supports dark/light theme switching via a CSS class observer. Used by cant-explode for structural formula, functional group, and molecular stability challenges. Requires `smiles-drawer` as a peer dependency (dynamically imported).",
      },
    },
  },
  argTypes: {
    smiles: {
      description:
        "SMILES notation string. See [OpenSMILES](http://opensmiles.org/) for syntax.",
      control: "text",
    },
    label: {
      description: "Caption shown below the rendered structure.",
      control: "text",
    },
    width: {
      description: "Canvas width in CSS pixels.",
      control: { type: "number", min: 100, max: 600, step: 10 },
      table: { defaultValue: { summary: "300" } },
    },
    height: {
      description: "Canvas height in CSS pixels.",
      control: { type: "number", min: 100, max: 600, step: 10 },
      table: { defaultValue: { summary: "250" } },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SmilesCanvas>;

/** Aromatic benzene ring with delocalized electrons. */
export const Benzene: Story = {
  args: {
    smiles: "c1ccccc1",
    label: "Benzene (aromatic)",
  },
};

/** Simple alcohol: ethanol. */
export const Ethanol: Story = {
  args: {
    smiles: "CCO",
    label: "Ethanol (CH3CH2OH)",
  },
};

/** Complex molecule with multiple rings and heteroatoms. */
export const Caffeine: Story = {
  args: {
    smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    label: "Caffeine",
  },
};

/** Canvas scaled down to 200x160 pixels. */
export const CustomSize: Story = {
  args: {
    smiles: "CC(=O)O",
    label: "Acetic acid (small canvas)",
    width: 200,
    height: 160,
  },
};
