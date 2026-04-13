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
  "navigation",
  "accessibility",
  "micro-interactions",
  "modals-overlays",
  // Content
  "content-copy",
  "data-display",
  "lists-cards",
  // Visual Design
  "icons-imagery",
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
  navigation: "Navigation",
  accessibility: "Accessibility",
  "micro-interactions": "Micro-interactions",
  "content-copy": "Content & Copy",
  "data-display": "Data Display",
  "modals-overlays": "Modals & Overlays",
  "lists-cards": "Lists & Cards",
  "icons-imagery": "Icons & Imagery",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Visual Design",
    categories: [
      "typography",
      "spacing",
      "color",
      "hierarchy",
      "icons-imagery",
    ],
  },
  {
    label: "Interaction Design",
    categories: [
      "layout",
      "forms",
      "feedback",
      "navigation",
      "accessibility",
      "micro-interactions",
      "modals-overlays",
    ],
  },
  {
    label: "Content",
    categories: ["content-copy", "data-display", "lists-cards"],
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
  navigation:
    "Menu structure, labeling, breadcrumbs, and mobile navigation patterns that help users find their way. You'll hit this when users cannot figure out where to go next or lose track of where they are in your site.",
  accessibility:
    "Focus indicators, icon labels, status communication, and link distinction patterns that make interfaces usable for everyone. You'll hit this when keyboard users cannot navigate your UI or color-blind users miss critical information.",
  "micro-interactions":
    "Button states, toggle animations, staggered entrances, and progress indicators that make interfaces feel responsive and alive. You'll hit this when users are unsure if their click registered or how long an operation will take.",
  "content-copy":
    "Error messages, scannable content, link text, and onboarding copy that communicate clearly. You'll hit this when users are confused by jargon, miss important links, or cannot figure out what went wrong.",
  "data-display":
    "Number alignment, text overflow, data density, and empty states in tables and data views. You'll hit this when users struggle to compare values, cannot see truncated content, or stare at a blank table with no guidance.",
  "modals-overlays":
    "Confirmation dialogs, dismissibility, form complexity in overlays, and interruption timing. You'll hit this when users feel trapped in a dialog, overwhelmed by popups, or forced to fill out a giant form in a tiny modal.",
  "lists-cards":
    "Card height consistency, clickable affordance, information density, and list grouping patterns. You'll hit this when card grids look messy, users do not realize cards are clickable, or a settings page is an endless flat list.",
  "icons-imagery":
    "Icon consistency, meaningful imagery, icon ambiguity, and image quality patterns. You'll hit this when icons look mismatched, hero images say nothing about the product, or stretched images undermine your credibility.",
};
