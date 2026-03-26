import type { Meta, StoryObj } from "@storybook/react-vite";
import { LearnSidebar } from "../learn-sidebar";

const meta: Meta<typeof LearnSidebar> = {
  title: "Layout/Learn Sidebar",
  component: LearnSidebar,
  tags: ["autodocs"],
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/learn/generics" } },
  },
};

export default meta;
type Story = StoryObj<typeof LearnSidebar>;

export const Default: Story = {
  args: {
    sections: [
      {
        label: "Fundamentals",
        categories: ["type-narrowing", "generics", "utility-types"],
      },
      {
        label: "Advanced",
        categories: ["conditional-types", "mapped-types", "template-literals"],
      },
    ],
    categoryLabels: {
      "type-narrowing": "Type Narrowing",
      generics: "Generics",
      "utility-types": "Utility Types",
      "conditional-types": "Conditional Types",
      "mapped-types": "Mapped Types",
      "template-literals": "Template Literals",
    },
  },
};
