import type { Meta, StoryObj } from "@storybook/react-vite";
import { LearnExplanation } from "../learn-explanation";

const challenge = {
  id: "mq-001",
  category: "media-queries",
  title: "Mobile-first vs desktop-first",
  explanationCorrect:
    "Mobile-first starts with the simplest layout and adds complexity as space allows, so each breakpoint only adds what it needs.",
  explanationWrong:
    "Desktop-first forces you to undo styles at every breakpoint, so the smallest screens carry the most overrides.",
  sourceUrl: "https://developer.mozilla.org/en-US/docs/Learn/CSS",
  sourceLabel: "MDN: Mobile-first responsive design",
};

const meta: Meta<typeof LearnExplanation> = {
  title: "Content/Learn Explanation",
  component: LearnExplanation,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The explanation body of a learn challenge: an 'avoid' note and a 'prefer' note, each with a colored accent bar, followed by the source link. Passed as the renderExplanation slot of LearnCategoryPage, so every app renders challenge explanations identically. Composes FormattedText and SourceLink.",
      },
    },
  },
  argTypes: {
    challenge: {
      description:
        "The challenge being explained. The avoid half is skipped when explanationWrong is absent.",
      control: false,
    },
    categoryLabel: {
      description:
        "Display label for the challenge's category, shown on the source link.",
      control: "text",
    },
    githubUrl: {
      description:
        "Repo URL. When set, the source link renders a sibling 'Suggest a fix' action.",
      control: "text",
    },
    wrongLabel: {
      description: "Heading above the explanationWrong text.",
      control: "text",
      table: { defaultValue: { summary: "Why avoid" } },
    },
    correctLabel: {
      description: "Heading above the explanationCorrect text.",
      control: "text",
      table: { defaultValue: { summary: "Why prefer" } },
    },
  },
  args: {
    challenge,
    categoryLabel: "Media Queries",
    githubUrl: "https://github.com/saschb2b/cant",
  },
};

export default meta;
type Story = StoryObj<typeof LearnExplanation>;

/** Default usage: both halves plus a source link with "Suggest a fix". */
export const Default: Story = {
  args: {},
};

/** A challenge with no explanationWrong renders only the "prefer" half. */
export const CorrectOnly: Story = {
  args: {
    challenge: { ...challenge, explanationWrong: undefined },
  },
};

/** Custom headings, as used by Can't Explode for chemistry challenges. */
export const CustomLabels: Story = {
  args: {
    wrongLabel: "Why it's wrong",
    correctLabel: "Why it's correct",
  },
};

/** Without githubUrl the source link drops the "Suggest a fix" action. */
export const WithoutSuggestFix: Story = {
  args: {
    githubUrl: undefined,
  },
};
