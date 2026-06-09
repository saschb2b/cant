import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CodePanel } from "../code-panel";

const SAMPLE_HTML =
  '<pre style="background:transparent;padding:16px;margin:0"><code><span style="color:#7c3aed">interface</span> <span style="color:#0ea5e9">ButtonProps</span> {\n  <span style="color:#e879f9">onClick</span>: () =&gt; <span style="color:#7c3aed">void</span>;\n  <span style="color:#e879f9">children</span>: React.ReactNode;\n  <span style="color:#e879f9">disabled</span>?: <span style="color:#7c3aed">boolean</span>;\n}</code></pre>';

const meta: Meta<typeof CodePanel> = {
  title: "Game/Code Panel",
  component: CodePanel,
  tags: ["autodocs"],
  args: {
    highlightedHtml: SAMPLE_HTML,
    label: "A",
    isSelectable: true,
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CodePanel>;

export const Selectable: Story = {
  args: {},
};

export const Correct: Story = {
  args: {
    result: "correct",
    isSelected: true,
  },
};

export const Wrong: Story = {
  args: {
    label: "B",
    result: "wrong",
    isSelected: true,
  },
};

export const NotSelected: Story = {
  args: {
    label: "B",
    result: "correct",
    isSelected: false,
  },
};

export const NotSelectable: Story = {
  args: {
    isSelectable: false,
  },
};
