import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { GameHeader } from "../game-header";

const meta: Meta<typeof GameHeader> = {
  title: "Game/Game Header",
  component: GameHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GameHeader>;

export const EarlyGame: Story = {
  args: {
    score: 2,
    total: 10,
    currentQuestion: 3,
    streak: 2,
    difficulty: "easy",
    questionResults: [
      "correct",
      "correct",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    reviewIndex: null,
    onQuestionClick: fn(),
  },
};

export const MidGame: Story = {
  args: {
    score: 4,
    total: 10,
    currentQuestion: 6,
    streak: 0,
    difficulty: "medium",
    questionResults: [
      "correct",
      "correct",
      "correct",
      "wrong",
      "correct",
      null,
      null,
      null,
      null,
      null,
    ],
    reviewIndex: null,
    onQuestionClick: fn(),
  },
};

export const LateGame: Story = {
  args: {
    score: 7,
    total: 10,
    currentQuestion: 9,
    streak: 4,
    difficulty: "hard",
    questionResults: [
      "correct",
      "correct",
      "correct",
      "wrong",
      "correct",
      "correct",
      "correct",
      "correct",
      null,
      null,
    ],
    reviewIndex: null,
    onQuestionClick: fn(),
  },
};

export const Reviewing: Story = {
  args: {
    score: 5,
    total: 10,
    currentQuestion: 7,
    streak: 0,
    difficulty: "medium",
    questionResults: [
      "correct",
      "wrong",
      "correct",
      "correct",
      "wrong",
      "correct",
      null,
      null,
      null,
      null,
    ],
    reviewIndex: 1,
    onQuestionClick: fn(),
  },
};

export const PerfectRun: Story = {
  args: {
    score: 10,
    total: 10,
    currentQuestion: 10,
    streak: 10,
    difficulty: "hard",
    questionResults: Array(10).fill("correct") as (
      | "correct"
      | "wrong"
      | null
    )[],
    reviewIndex: null,
    onQuestionClick: fn(),
  },
};
