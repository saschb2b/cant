import type { Meta, StoryObj } from "@storybook/react-vite";
import { LearnSidebar } from "../learn-sidebar";

const meta: Meta<typeof LearnSidebar> = {
  title: "Layout/Learn Sidebar",
  component: LearnSidebar,
  tags: ["autodocs"],
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/learn/generics" } },
    docs: {
      description: {
        component:
          "Sticky sidebar navigation shown on desktop (md+) for learn pages. Displays category links grouped by section with an active-state indicator on the current route. Hidden on mobile where LearnMobileNav is used instead. Used on every learn/[category] page across all apps.",
      },
    },
  },
  argTypes: {
    sections: {
      description:
        "Grouped sections of category slugs. Each section has a label and an array of category keys.",
      control: "object",
    },
    categoryLabels: {
      description: "Map from category slug to human-readable display label.",
      control: "object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LearnSidebar>;

/** Sidebar with two section groups and 'Generics' highlighted as the active category. */
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
