import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExplanationPanel } from "../explanation-panel";

const meta: Meta<typeof ExplanationPanel> = {
  title: "Game/ExplanationPanel",
  component: ExplanationPanel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ExplanationPanel>;

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
