import type { Meta, StoryObj } from "@storybook/react-vite";
import { LearnMobileNav } from "../learn-mobile-nav";

const meta: Meta<typeof LearnMobileNav> = {
  title: "Layout/LearnMobileNav",
  component: LearnMobileNav,
  tags: ["autodocs"],
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    nextjs: { appDirectory: true, navigation: { pathname: "/learn/generics" } },
  },
};

export default meta;
type Story = StoryObj<typeof LearnMobileNav>;

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
