import type { Meta, StoryObj } from "@storybook/react-vite";
import { LearnContentPanel } from "../learn-content-panel";

const MOCK_CODE_HTML =
  '<pre style="background:transparent;padding:16px"><code><span style="color:#7c3aed">const</span> <span style="color:#0ea5e9">greeting</span> = <span style="color:#22c55e">"hello"</span>;</code></pre>';

const meta: Meta<typeof LearnContentPanel> = {
  title: "Content/Learn Content Panel",
  component: LearnContentPanel,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LearnContentPanel>;

export const CodeGood: Story = {
  args: {
    entry: {
      type: "code",
      goodHtml: MOCK_CODE_HTML,
      badHtml: '<pre style="background:transparent;padding:16px"><code>var x = 1;</code></pre>',
    },
    side: "good",
  },
};

export const CodeBad: Story = {
  args: {
    ...CodeGood.args,
    side: "bad",
  },
};

export const Visual: Story = {
  args: {
    entry: {
      type: "visual",
      goodComponentId: "LoginFormSpaced",
      badComponentId: "LoginFormCramped",
    },
    side: "good",
  },
};

export const NoEntry: Story = {
  args: {
    entry: undefined,
    side: "good",
  },
};
