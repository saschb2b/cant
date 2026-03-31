import type { Meta, StoryObj } from "@storybook/react-vite";
import { SmilesCanvas } from "../smiles-canvas";

const meta: Meta<typeof SmilesCanvas> = {
  title: "Content/Smiles Canvas",
  component: SmilesCanvas,
  tags: ["autodocs"],
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

export const Benzene: Story = {
  args: {
    smiles: "c1ccccc1",
    label: "Benzene (aromatic)",
  },
};

export const Ethanol: Story = {
  args: {
    smiles: "CCO",
    label: "Ethanol (CH3CH2OH)",
  },
};

export const Caffeine: Story = {
  args: {
    smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    label: "Caffeine",
  },
};

export const CustomSize: Story = {
  args: {
    smiles: "CC(=O)O",
    label: "Acetic acid (small canvas)",
    width: 200,
    height: 160,
  },
};
