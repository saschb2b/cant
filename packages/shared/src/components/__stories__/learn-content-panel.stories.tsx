import type { Meta, StoryObj } from "@storybook/react-vite";
import { LearnContentPanel } from "../learn-content-panel";

const MOCK_CODE_HTML =
  '<pre style="background:transparent;padding:16px"><code><span style="color:#7c3aed">const</span> <span style="color:#0ea5e9">greeting</span> = <span style="color:#22c55e">"hello"</span>;</code></pre>';

const meta: Meta<typeof LearnContentPanel> = {
  title: "Content/Learn Content Panel",
  component: LearnContentPanel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders the content area of a learn-page challenge card. Supports four content types: syntax-highlighted code (HTML from Shiki), responsive images, visual components (placeholder, apps mount their own registry), and molecule cards with name, formula, and properties. Used on every learn/[category] page.",
      },
    },
  },
  argTypes: {
    entry: {
      description:
        "Content map entry for this challenge. Contains type-specific data (code HTML, image paths, component IDs, or molecule info).",
      control: "object",
    },
    side: {
      description:
        'Which side to render: "good" (preferred approach) or "bad" (approach to avoid).',
      control: "radio",
      options: ["good", "bad"],
    },
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
type Story = StoryObj<typeof LearnContentPanel>;

/** Syntax-highlighted code snippet rendered for the "good" (preferred) side. */
export const CodeGood: Story = {
  args: {
    entry: {
      type: "code",
      goodHtml: MOCK_CODE_HTML,
      badHtml:
        '<pre style="background:transparent;padding:16px"><code>var x = 1;</code></pre>',
    },
    side: "good",
  },
};

/** Syntax-highlighted code snippet rendered for the "bad" (avoid) side. */
export const CodeBad: Story = {
  args: {
    ...CodeGood.args,
    side: "bad",
  },
};

/** Visual challenge type showing a placeholder with the component ID. */
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

/** Renders nothing when entry is undefined (graceful fallback). */
export const NoEntry: Story = {
  args: {
    entry: undefined,
    side: "good",
  },
};
