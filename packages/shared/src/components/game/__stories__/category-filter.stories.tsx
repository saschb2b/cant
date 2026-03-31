import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryFilter } from "../category-filter";

const SECTIONS = [
  {
    label: "Foundations",
    categories: ["type-narrowing", "generics", "utility-types"],
  },
  {
    label: "Type Safety",
    categories: ["type-assertions", "strict-mode"],
  },
  {
    label: "Advanced",
    categories: ["conditional-types", "mapped-types"],
  },
];

const LABELS: Record<string, string> = {
  "type-narrowing": "Type Narrowing",
  generics: "Generics",
  "utility-types": "Utility Types",
  "type-assertions": "Type Assertions",
  "strict-mode": "Strict Mode",
  "conditional-types": "Conditional Types",
  "mapped-types": "Mapped Types",
};

const meta: Meta<typeof CategoryFilter> = {
  title: "Game/Category Filter",
  component: CategoryFilter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CategoryFilter>;

function InteractiveFilter() {
  const [excluded, setExcluded] = useState(new Set<string>());
  const allCategories = SECTIONS.flatMap((s) => s.categories);

  const toggleCategory = (cat: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        const enabledCount = allCategories.length - next.size;
        if (enabledCount <= 1) return prev;
        next.add(cat);
      }
      return next;
    });
  };

  const toggleSection = (categories: string[]) => {
    setExcluded((prev) => {
      const allDisabled = categories.every((c) => prev.has(c));
      const next = new Set(prev);
      if (allDisabled) {
        for (const c of categories) next.delete(c);
      } else {
        for (const c of categories) next.add(c);
      }
      return next;
    });
  };

  return (
    <CategoryFilter
      sections={SECTIONS}
      categoryLabels={LABELS}
      excluded={excluded}
      onToggleCategory={toggleCategory}
      onToggleSection={toggleSection}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveFilter />,
};

export const SomeExcluded: Story = {
  args: {
    sections: SECTIONS,
    categoryLabels: LABELS,
    excluded: new Set(["type-assertions", "strict-mode"]),
    onToggleCategory: () => undefined,
    onToggleSection: () => undefined,
  },
};

export const Disabled: Story = {
  args: {
    sections: SECTIONS,
    categoryLabels: LABELS,
    excluded: new Set(),
    onToggleCategory: () => undefined,
    onToggleSection: () => undefined,
    disabled: true,
  },
};
