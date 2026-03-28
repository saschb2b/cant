import type { Meta, StoryObj } from "@storybook/react-vite";
import { Gamepad2, BookOpen, FlaskConical } from "lucide-react";
import { FeatureGrid } from "../feature-grid";

const meta: Meta<typeof FeatureGrid> = {
  title: "Layout/Feature Grid",
  component: FeatureGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof FeatureGrid>;

export const ThreeCards: Story = {
  args: {
    title: "Three paths to mastery",
    subtitle: "A pattern quiz, a spell book, and a type sandbox.",
    cards: [
      {
        icon: <Gamepad2 size={20} />,
        title: "Play",
        desc: "Pick the better pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
        href: "/play",
      },
      {
        icon: <BookOpen size={20} />,
        title: "Learn",
        desc: "84 patterns across 12 categories. Each shows the fragile approach, the resilient one, and why it matters.",
        href: "/learn",
      },
      {
        icon: <FlaskConical size={20} />,
        title: "Sandbox",
        desc: "Write TypeScript types and see them fully expanded. Explore utility types, mapped types, conditionals, and more.",
        href: "/playground",
      },
    ],
  },
};

export const TwoCards: Story = {
  args: {
    title: "Two ways to level up",
    subtitle: "A pattern quiz and a reference library.",
    cards: [
      {
        icon: <Gamepad2 size={20} />,
        title: "Play",
        desc: "Pick the better orchestration pattern in 10 side-by-side code challenges.",
        href: "/play",
      },
      {
        icon: <BookOpen size={20} />,
        title: "Learn",
        desc: "64 patterns across 8 categories.",
        href: "/learn",
      },
    ],
  },
};
