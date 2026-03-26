import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormattedText } from "../formatted-text";

const meta: Meta<typeof FormattedText> = {
  title: "Content/Formatted Text",
  component: FormattedText,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormattedText>;

export const InlineCode: Story = {
  args: {
    text: "Use `const` instead of `let` when the variable is never reassigned.",
  },
};

export const Bold: Story = {
  args: {
    text: "This is **important** and should be highlighted.",
  },
};

export const Paragraphs: Story = {
  args: {
    text: "First paragraph explains the concept.\n\nSecond paragraph provides an example with `code` and **emphasis**.\n\nThird paragraph wraps up.",
  },
};

export const LineBreaks: Story = {
  args: {
    text: "Line one\nLine two\nLine three",
  },
};

export const Mixed: Story = {
  args: {
    text: "The `useMemo` hook should be used for **expensive computations** only.\n\nAvoid wrapping every value in `useMemo`. The overhead of memoization itself can be worse than recalculating simple values.\n\nRule of thumb: **measure first**, optimize second.",
  },
};
