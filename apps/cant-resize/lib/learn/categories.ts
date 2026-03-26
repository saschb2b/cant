import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Foundations
  "media-queries",
  "container-queries",
  "fluid-typography",
  "viewport-units",
  // Layout Patterns
  "flexbox-patterns",
  "grid-patterns",
  "responsive-spacing",
  "overflow-handling",
  // Component Patterns
  "breakpoint-hooks",
  "responsive-props",
  "conditional-rendering",
  "responsive-images",
  // Framework Patterns
  "mui-responsive",
  "tailwind-responsive",
  // Anti-Patterns & Debugging
  "common-mistakes",
  "testing-responsive",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "media-queries": "Media Queries",
  "container-queries": "Container Queries",
  "fluid-typography": "Fluid Typography",
  "viewport-units": "Viewport Units",
  "flexbox-patterns": "Flexbox Patterns",
  "grid-patterns": "Grid Patterns",
  "responsive-spacing": "Responsive Spacing",
  "overflow-handling": "Overflow Handling",
  "breakpoint-hooks": "Breakpoint Hooks",
  "responsive-props": "Responsive Props",
  "conditional-rendering": "Conditional Rendering",
  "responsive-images": "Responsive Images",
  "mui-responsive": "MUI Responsive",
  "tailwind-responsive": "Tailwind Responsive",
  "common-mistakes": "Common Mistakes",
  "testing-responsive": "Testing Responsive",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Foundations",
    categories: [
      "media-queries",
      "container-queries",
      "fluid-typography",
      "viewport-units",
    ],
  },
  {
    label: "Layout Patterns",
    categories: [
      "flexbox-patterns",
      "grid-patterns",
      "responsive-spacing",
      "overflow-handling",
    ],
  },
  {
    label: "Component Patterns",
    categories: [
      "breakpoint-hooks",
      "responsive-props",
      "conditional-rendering",
      "responsive-images",
    ],
  },
  {
    label: "Framework Patterns",
    categories: ["mui-responsive", "tailwind-responsive"],
  },
  {
    label: "Anti-Patterns & Debugging",
    categories: ["common-mistakes", "testing-responsive"],
  },
];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH: ChallengeCategory[] = [
  "media-queries",
  "flexbox-patterns",
  "grid-patterns",
  "responsive-props",
  "common-mistakes",
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "media-queries":
    "Mobile-first breakpoints, logical ranges with min-width, and why max-width leads to override chains. You'll hit this when layouts break between standard device widths or when you inherit a desktop-first codebase.",
  "container-queries":
    "@container vs @media: when components should own their own responsiveness instead of relying on the viewport. You'll hit this when a reusable component looks wrong after being placed in a narrower sidebar or modal.",
  "fluid-typography":
    "Using clamp() and fluid type scales so text adapts smoothly without hard breakpoints. You'll hit this when headings look too big on mobile or too small on ultrawide monitors.",
  "viewport-units":
    "vw, vh, dvh, svh, and lvh. Understanding the mobile viewport trap and picking the right unit. You'll hit this when a full-screen hero section hides behind the mobile browser toolbar.",
  "flexbox-patterns":
    "flex-wrap, gap, shrink, and grow for layouts that reflow naturally across screen sizes. You'll hit this when items squish into a single row on small screens instead of wrapping naturally.",
  "grid-patterns":
    "auto-fit, auto-fill, and minmax() for responsive grids that need zero media queries. You'll hit this when a card grid should go from one column to three without writing any breakpoint.",
  "responsive-spacing":
    "Consistent spacing systems that scale with the viewport using clamp(), custom properties, and theme tokens. You'll hit this when padding and margins feel too tight on mobile or too loose on desktop.",
  "overflow-handling":
    "Scroll containers, text truncation, responsive tables, and preventing horizontal overflow on mobile. You'll hit this when a table or long URL causes horizontal scrolling on mobile.",
  "breakpoint-hooks":
    "useMediaQuery, custom breakpoint hooks, SSR hydration pitfalls, and when to avoid them entirely. You'll hit this when a component flickers after server-side rendering because useMediaQuery runs too late.",
  "responsive-props":
    "Components that accept breakpoint-aware prop objects like direction={{ xs: 'column', md: 'row' }}. You'll hit this when you want a Stack to be vertical on mobile and horizontal on desktop in one prop.",
  "conditional-rendering":
    "Rendering different components by viewport vs hiding with CSS, including performance and SEO tradeoffs. You'll hit this when you conditionally render with JavaScript but the hidden component still makes a network request.",
  "responsive-images":
    "srcSet, sizes, next/image, art direction with <picture>, and avoiding layout shift. You'll hit this when a 2 MB hero image loads on a phone with a slow connection.",
  "mui-responsive":
    "MUI's sx breakpoint syntax, responsive Grid2, theme.breakpoints, and responsive dialog patterns. You'll hit this when you need an MUI dialog to be fullscreen on mobile but a centered modal on desktop.",
  "tailwind-responsive":
    "Utility-first responsive design with sm:/md:/lg: prefixes, container queries plugin, and custom screens. You'll hit this when Tailwind's sm: prefix doesn't behave the way you expected at 640px.",
  "common-mistakes":
    "Fixed widths, pixel assumptions, forgotten touch targets, ignoring landscape, and other responsive pitfalls. You'll hit this when a button is too small to tap on a phone or a layout collapses in landscape mode.",
  "testing-responsive":
    "Strategies for testing responsiveness: viewport meta, device mode, visual regression, and automated checks. You'll hit this when a layout looks fine in Chrome DevTools but breaks on a real device.",
};
