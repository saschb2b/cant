import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ResultsScreen } from "../results-screen";

const now = Date.now();

function makeChallenges(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `c${String(i + 1)}`,
    title: `Challenge ${String(i + 1)}`,
    category: i % 2 === 0 ? "naming" : "patterns",
    explanationCorrect:
      "This approach is better because it follows established conventions and improves readability.",
    explanationWrong:
      "This approach is problematic because it makes the code harder to maintain.",
    sourceUrl: "https://react.dev",
    sourceLabel: "React Docs",
  }));
}

function makeAnswers(challenges: { id: string }[], correctCount: number) {
  const answers: Record<
    string,
    { result: "correct" | "wrong"; side: "left" | "right" }
  > = {};
  challenges.forEach((c, i) => {
    answers[c.id] = {
      result: i < correctCount ? "correct" : "wrong",
      side: i % 2 === 0 ? "left" : "right",
    };
  });
  return answers;
}

const challenges = makeChallenges(10);

const config = {
  shareSubject: "component patterns",
  getShareUrl: () => "https://example.com/play?r=ABC123",
  encodeResults: () => "ABC123",
  getMissedCategoryLabels: () => ["Patterns"],
  githubUrl: "https://github.com/saschb2b/cant",
  categoryLabels: {
    naming: "Naming",
    patterns: "Patterns",
  } as Record<string, string>,
};

const meta: Meta<typeof ResultsScreen> = {
  title: "Game/Results Screen",
  component: ResultsScreen,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onRetry: fn(),
    onNewGame: fn(),
    config,
  },
};

export default meta;
type Story = StoryObj<typeof ResultsScreen>;

export const PerfectScore: Story = {
  args: {
    state: {
      challenges,
      answers: makeAnswers(challenges, 10),
      bestStreak: 10,
      thinkingTimeSec: 96,
      startedAt: now - 180_000,
      finishedAt: now,
      seed: "PERFECT",
    },
  },
};

export const HighScore: Story = {
  args: {
    state: {
      challenges,
      answers: makeAnswers(challenges, 8),
      bestStreak: 5,
      thinkingTimeSec: 152,
      startedAt: now - 240_000,
      finishedAt: now,
      seed: "A3X9K2",
    },
  },
};

export const MidScore: Story = {
  args: {
    state: {
      challenges,
      answers: makeAnswers(challenges, 5),
      bestStreak: 3,
      thinkingTimeSec: 205,
      startedAt: now - 300_000,
      finishedAt: now,
      seed: "BN7FGH",
    },
  },
};

export const LowScore: Story = {
  args: {
    state: {
      challenges,
      answers: makeAnswers(challenges, 2),
      bestStreak: 1,
      thinkingTimeSec: 268,
      startedAt: now - 360_000,
      finishedAt: now,
      seed: "ZX1CVB",
    },
  },
};
