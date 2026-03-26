import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SeedInput } from "../seed-input";

const meta: Meta<typeof SeedInput> = {
  title: "Game/Seed Input",
  component: SeedInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SeedInput>;

export const Empty: Story = {
  args: {
    value: "",
    onChange: fn(),
    onGenerate: fn(),
    onSubmit: fn(),
  },
};

export const WithSeed: Story = {
  args: {
    value: "A3X9K2",
    onChange: fn(),
    onGenerate: fn(),
    onSubmit: fn(),
  },
};
