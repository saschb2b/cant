import type { Meta, StoryObj } from "@storybook/react-vite";
import { LearnMobileNav } from "../learn-mobile-nav";

const meta: Meta<typeof LearnMobileNav> = {
  title: "Layout/Learn Mobile Nav",
  component: LearnMobileNav,
  tags: ["autodocs"],
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    nextjs: { appDirectory: true, navigation: { pathname: "/learn/generics" } },
    docs: {
      description: {
        component:
          "Horizontally scrollable category pill navigation shown on mobile (below md breakpoint) on learn pages. Auto-scrolls to the active category on route change. Hidden on desktop where LearnSidebar is used instead. Used on every learn/[category] page across all apps.",
      },
    },
  },
  argTypes: {
    sections: {
      description:
        "Grouped sections of category slugs. Categories are flattened into a single scrollable row.",
      control: "object",
    },
    categoryLabels: {
      description: "Map from category slug to human-readable display label.",
      control: "object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LearnMobileNav>;

/** Scrollable pill row with 'Generics' highlighted as the active category. */
export const Default: Story = {
  args: {
    sections: [
      {
        label: "Fundamentals",
        categories: [
          "type-narrowing",
          "generics",
          "utility-types",
          "union-intersection",
        ],
      },
      {
        label: "Advanced",
        categories: [
          "conditional-types",
          "mapped-types",
          "template-literals",
          "type-assertions",
        ],
      },
    ],
    categoryLabels: {
      "type-narrowing": "Type Narrowing",
      generics: "Generics",
      "utility-types": "Utility Types",
      "union-intersection": "Union / Intersection",
      "conditional-types": "Conditional Types",
      "mapped-types": "Mapped Types",
      "template-literals": "Template Literals",
      "type-assertions": "Type Assertions",
    },
  },
};
