import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExplanationPanel } from "../explanation-panel";

const meta: Meta<typeof ExplanationPanel> = {
  title: "Game/Explanation Panel",
  component: ExplanationPanel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Reveal panel shown during gameplay after a player answers. Displays the explanation, a source link, an 'All {category} patterns' learn link, and optionally a 'Suggest a fix' link that opens a prefilled GitHub issue. Rendered as the `explanation` slot of the shared Game component.",
      },
    },
  },
  argTypes: {
    isCorrect: {
      description:
        "Whether the player's answer was correct. Drives success vs error styling.",
      control: "boolean",
    },
    explanationText: {
      description:
        "Markdown-ish text explaining the right answer. Backticks become inline code, **bold** becomes bold.",
      control: "text",
    },
    sources: {
      description:
        "Authoritative references backing the explanation, each with a `url` and a `label`. Rendered as one external link per entry, in order.",
      control: "object",
    },
    category: {
      description: "Category slug, sent with analytics events.",
      control: "text",
    },
    categoryLabel: {
      description: "Human-readable category label shown in the learn link.",
      control: "text",
    },
    challengeId: {
      description: "ID of the parent challenge, sent with analytics events.",
      control: "text",
    },
    title: {
      description:
        "Challenge title used in the prefilled 'Suggest a fix' issue body. Required for the Suggest-a-fix link to appear.",
      control: "text",
    },
    githubUrl: {
      description:
        "Repo URL. When provided alongside title, renders a 'Suggest a fix' link that opens a prefilled GitHub issue.",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ExplanationPanel>;

/** Success styling shown after a correct answer. */
export const Correct: Story = {
  args: {
    isCorrect: true,
    explanationText:
      "Using `const` for values that are never reassigned makes the code more **predictable** and easier to reason about.\n\nThis is a well-established convention in modern JavaScript and TypeScript codebases.",
    sources: [
      {
        url: "https://react.dev/reference/react/useMemo",
        label: "React docs: useMemo",
      },
    ],
    category: "hooks",
    categoryLabel: "Hooks",
    challengeId: "use-memo-deps",
  },
};

/** Error styling shown after a wrong answer. */
export const Wrong: Story = {
  args: {
    isCorrect: false,
    explanationText:
      "The `any` type defeats the purpose of TypeScript. Use `unknown` when the type is truly not known, and narrow it with type guards.\n\nThis prevents **runtime errors** that TypeScript was designed to catch.",
    sources: [
      {
        url: "https://www.typescriptlang.org/docs/handbook/2/types.html",
        label: "TypeScript Handbook",
      },
    ],
    category: "type-assertions",
    categoryLabel: "Type Assertions",
    challengeId: "avoid-any",
  },
};

/** With a 'Suggest a fix' link that opens a prefilled GitHub issue. */
export const WithSuggestFix: Story = {
  args: {
    isCorrect: false,
    explanationText:
      "The `any` type defeats the purpose of TypeScript. Use `unknown` when the type is truly not known, and narrow it with type guards.",
    sources: [
      {
        url: "https://www.typescriptlang.org/docs/handbook/2/types.html",
        label: "TypeScript Handbook",
      },
    ],
    category: "type-assertions",
    categoryLabel: "Type Assertions",
    challengeId: "avoid-any",
    title: "Avoiding the any type",
    githubUrl: "https://github.com/saschb2b/cant",
  },
};

/** Two references for one challenge, e.g. a React doc plus the matching Next.js doc. */
export const MultipleSources: Story = {
  args: {
    isCorrect: true,
    explanationText:
      "Prefer `ReactNode` for ordinary static slots. They also compose across React Server and Client Component boundaries, where function props cannot be passed.",
    sources: [
      {
        url: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
        label: "React Docs: Passing JSX as children",
      },
      {
        url: "https://nextjs.org/docs/app/getting-started/server-and-client-components#passing-server-components-to-client-components-as-props",
        label: "Next.js Docs: Passing Server Components as props",
      },
    ],
    category: "render-props",
    categoryLabel: "Render Props",
    challengeId: "rp-003",
  },
};
