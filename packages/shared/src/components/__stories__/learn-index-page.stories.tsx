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
    description: "When to use specific props vs generic catch-all objects.",
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
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full learn index page rendered at /learn in every app. Displays a title, subtitle, total counts, an optional learning-path section, and a list of category cards with code/visual/molecule preview snippets. Each category card links to its learn/[category] detail page.",
      },
    },
  },
  argTypes: {
    title: {
      description: 'Page heading, e.g. "Learn Responsive Design".',
      control: "text",
    },
    subtitle: {
      description: "Introductory text displayed below the title.",
      control: "text",
    },
    totalChallenges: {
      description:
        "Total number of challenges across all categories, shown in the intro text.",
      control: "number",
    },
    totalCategories: {
      description: "Total number of categories, shown in the intro text.",
      control: "number",
    },
    sections: {
      description:
        "Array of category sections with label, description, count, and optional preview content (code HTML, visual, or molecule).",
      control: "object",
    },
    learningPath: {
      description:
        'Optional ordered list of categories for the "Start here" section. Each item has a category slug and label.',
      control: "object",
    },
    learningPathDescription: {
      description: "Short description shown above the learning path chips.",
      control: "text",
    },
    badLabel: {
      description: 'Label for the "avoid" panel header in previews.',
      control: "text",
      table: { defaultValue: { summary: '"Avoid"' } },
    },
    goodLabel: {
      description: 'Label for the "prefer" panel header in previews.',
      control: "text",
      table: { defaultValue: { summary: '"Prefer"' } },
    },
    renderPreview: {
      description:
        "Custom preview renderer for non-code content types. Receives a category slug and returns a ReactNode.",
      control: false,
    },
    visualRegistry: {
      description:
        "Component registry mapping componentId strings to React components for visual previews.",
      control: false,
    },
  },
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

/** Index page with four category sections, some with code previews. */
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

/** Index page with an ordered learning path section above the category list. */
export const WithLearningPath: Story = {
  args: {
    ...Default.args,
    learningPath: LEARNING_PATH,
    learningPathDescription:
      "New to component API design? Follow these three categories in order.",
  },
};
