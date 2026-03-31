import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormattedText } from "../formatted-text";

const meta: Meta<typeof FormattedText> = {
  title: "Content/Formatted Text",
  component: FormattedText,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders a plain-text string with lightweight inline markdown support: backtick-delimited `code`, double-asterisk **bold**, paragraph breaks (double newline), and line breaks (single newline). Used in challenge explanations across all apps.",
      },
    },
  },
  argTypes: {
    text: {
      description:
        "Text with optional inline markdown: `code`, **bold**, and paragraph breaks via double newlines.",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormattedText>;

/** Single line with backtick-delimited inline code spans. */
export const InlineCode: Story = {
  args: {
    text: "Use `const` instead of `let` when the variable is never reassigned.",
  },
};

/** Single line with double-asterisk bold emphasis. */
export const Bold: Story = {
  args: {
    text: "This is **important** and should be highlighted.",
  },
};

/** Multiple paragraphs separated by double newlines, each with mixed formatting. */
export const Paragraphs: Story = {
  args: {
    text: "First paragraph explains the concept.\n\nSecond paragraph provides an example with `code` and **emphasis**.\n\nThird paragraph wraps up.",
  },
};

/** Lines separated by single newlines rendered as `<br>` elements within one paragraph. */
export const LineBreaks: Story = {
  args: {
    text: "Line one\nLine two\nLine three",
  },
};

/** Combination of paragraphs, inline code, and bold text in a realistic explanation. */
export const Mixed: Story = {
  args: {
    text: "The `useMemo` hook should be used for **expensive computations** only.\n\nAvoid wrapping every value in `useMemo`. The overhead of memoization itself can be worse than recalculating simple values.\n\nRule of thumb: **measure first**, optimize second.",
  },
};
