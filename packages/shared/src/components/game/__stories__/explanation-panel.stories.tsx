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
    sourceUrl: {
      description: "URL of the authoritative source for the challenge.",
      control: "text",
    },
    sourceLabel: {
      description: "Visible label for the source link.",
      control: "text",
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
    sourceUrl: "https://react.dev/reference/react/useMemo",
    sourceLabel: "React docs: useMemo",
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
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/types.html",
    sourceLabel: "TypeScript Handbook",
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
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/types.html",
    sourceLabel: "TypeScript Handbook",
    category: "type-assertions",
    categoryLabel: "Type Assertions",
    challengeId: "avoid-any",
    title: "Avoiding the any type",
    githubUrl: "https://github.com/saschb2b/cant",
  },
};
