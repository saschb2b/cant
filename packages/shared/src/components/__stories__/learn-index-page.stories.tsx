import type { Meta, StoryObj } from "@storybook/react-vite";
import { LearnIndexPage } from "../learn-index-page";

const MOCK_CODE_GOOD =
  '<pre style="background:transparent;padding:12px;margin:0"><code><span style="color:#7c3aed">interface</span> Props {\n  <span style="color:#e879f9">onClick</span>: () =&gt; void;\n}</code></pre>';
const MOCK_CODE_BAD =
  '<pre style="background:transparent;padding:12px;margin:0"><code><span style="color:#7c3aed">interface</span> Props {\n  <span style="color:#e879f9">click</span>: () =&gt; void;\n}</code></pre>';

const MOCK_SECTIONS = [
  {
    category: "callback-naming",
    label: "Callback Naming",
    description:
      "How to name event handlers, callbacks, and side-effect props so they read naturally.",
    count: 12,
    preview: { goodHtml: MOCK_CODE_GOOD, badHtml: MOCK_CODE_BAD },
  },
  {
    category: "boolean-naming",
    label: "Boolean Naming",
    description:
      "Prefix conventions for boolean props: is*, has*, should*, and when each one fits.",
    count: 8,
    preview: { goodHtml: MOCK_CODE_GOOD, badHtml: MOCK_CODE_BAD },
  },
  {
    category: "prop-specificity",
    label: "Prop Specificity",
    description:
      "When to use specific props vs generic catch-all objects.",
    count: 10,
    preview: { goodHtml: MOCK_CODE_GOOD, badHtml: MOCK_CODE_BAD },
  },
  {
    category: "composition",
    label: "Composition Patterns",
    description: "Children, render props, and compound components.",
    count: 6,
    preview: null,
  },
];

const LEARNING_PATH = [
  { category: "callback-naming", label: "Callback Naming" },
  { category: "boolean-naming", label: "Boolean Naming" },
  { category: "prop-specificity", label: "Prop Specificity" },
];

const meta: Meta<typeof LearnIndexPage> = {
  title: "Content/Learn Index Page",
  component: LearnIndexPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LearnIndexPage>;

export const Default: Story = {
  args: {
    title: "Learn Component APIs",
    subtitle:
      "Every pattern shows the convention, a side-by-side example, and why it matters.",
    totalChallenges: 84,
    totalCategories: 15,
    sections: MOCK_SECTIONS,
  },
};

export const WithLearningPath: Story = {
  args: {
    ...Default.args,
    learningPath: LEARNING_PATH,
    learningPathDescription:
      "New to component API design? Follow these three categories in order.",
  },
};
