import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Visual Design
  "typography",
  "spacing",
  "color",
  "hierarchy",
  // Interaction Design
  "layout",
  "forms",
  "feedback",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  typography: "Typography",
  spacing: "Spacing",
  color: "Color",
  hierarchy: "Hierarchy",
  layout: "Layout",
  forms: "Forms",
  feedback: "Feedback",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Visual Design",
    categories: ["typography", "spacing", "color", "hierarchy"],
  },
  {
    label: "Interaction Design",
    categories: ["layout", "forms", "feedback"],
  },
];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH: ChallengeCategory[] = [
  "hierarchy",
  "spacing",
  "typography",
  "forms",
  "color",
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  typography:
    "Font sizing, line height, line length, and type scales that make text comfortable to read. You'll hit this when body text feels hard to scan or headings blend into the surrounding content.",
  spacing:
    "Consistent spacing systems, proximity grouping, and whitespace as a design tool. You'll hit this when a layout feels cluttered even though every individual element looks fine on its own.",
  color:
    "Contrast ratios, limited palettes, and accessible color choices that work for all users. You'll hit this when text becomes hard to read on colored backgrounds or when a UI feels visually noisy.",
  hierarchy:
    "Visual weight, button priority, and emphasis patterns that guide the user's eye. You'll hit this when a page feels flat and users cannot tell what to do first or which action matters most.",
  layout:
    "Content width constraints, form layouts, card grids, and text alignment for readability. You'll hit this when a page stretches edge to edge on a wide monitor and becomes difficult to scan.",
  forms:
    "Input labels, error messages, touch targets, and field organization that reduce user friction. You'll hit this when users abandon a form because they cannot tell what went wrong or where to tap.",
  feedback:
    "Loading states, empty states, error screens, and confirmation dialogs that keep users informed. You'll hit this when users stare at a blank screen during data loading or accidentally delete something with no warning.",
};
