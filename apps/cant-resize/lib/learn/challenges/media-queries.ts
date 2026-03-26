import type { Challenge } from "../types";

export const mediaQueryChallenges: Challenge[] = [
  {
    id: "mq-001",
    category: "media-queries",
    difficulty: "easy",
    title: "Mobile-first vs desktop-first",
    badCode: `/* Desktop-first: override down */
.container {
  display: flex;
  gap: 2rem;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 1rem;
  }
}`,
    goodCode: `/* Mobile-first: enhance up */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
    gap: 2rem;
  }
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "Mobile-first (`min-width`) starts with the simplest layout and progressively adds complexity. This avoids override chains and ensures the base styles work on the smallest screens without any media query matching.",
    explanationWrong:
      "Desktop-first (`max-width`) forces you to undo styles for smaller screens. Every new breakpoint adds overrides, making the CSS harder to maintain and debug. Mobile-first is the industry standard for good reason.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries#mobile_first_responsive_design",
    sourceLabel: "MDN: Mobile-first responsive design",
  },
  {
    id: "mq-002",
    category: "media-queries",
    difficulty: "easy",
    title: "Content-based breakpoints",
    badCode: `/* Breakpoints based on device widths */
@media (min-width: 375px) { /* iPhone */ }
@media (min-width: 768px) { /* iPad */ }
@media (min-width: 1024px) { /* laptop */ }
@media (min-width: 1440px) { /* desktop */ }`,
    goodCode: `/* Breakpoints based on content needs */
@media (min-width: 32rem) { /* ~512px: cards need 2 columns */ }
@media (min-width: 48rem) { /* ~768px: sidebar can appear */ }
@media (min-width: 64rem) { /* ~1024px: full layout */ }`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "Breakpoints should be where *your content* needs them, not where specific devices happen to be. Using `rem` values also respects the user's font size preference, so if they increase their base font size, breakpoints shift to accommodate. Device-specific values become wrong with every new device release.",
    explanationWrong:
      "Device-based breakpoints (375px for iPhone, 768px for iPad) are arbitrary and fragile. New devices don't fit neatly into these buckets. Is a Galaxy Fold (280px folded) a phone? Is a 1024px iPad in landscape a laptop? Breakpoints should respond to your layout's needs.",
    sourceUrl:
      "https://www.freecodecamp.org/news/the-100-correct-way-to-do-css-breakpoints-88d6a5ba1862/",
    sourceLabel: "The correct way to do CSS breakpoints",
  },
  {
    id: "mq-003",
    category: "media-queries",
    difficulty: "medium",
    title: "Overlapping breakpoints",
    badCode: `@media (max-width: 768px) {
  .sidebar { display: none; }
}

@media (min-width: 768px) {
  .sidebar { width: 250px; }
}`,
    goodCode: `@media (max-width: 767.98px) {
  .sidebar { display: none; }
}

@media (min-width: 768px) {
  .sidebar { width: 250px; }
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "At exactly 768px, both `max-width: 768px` and `min-width: 768px` match simultaneously. Using `767.98px` (or using only `min-width` in a mobile-first approach) eliminates the overlap where both rules apply and source order decides the winner.",
    explanationWrong:
      "When the viewport is exactly 768px wide, both media queries match. The sidebar gets `display: none` *and* `width: 250px`, and CSS cascade picks the last one. This is a subtle bug that only appears at one exact width.",
    sourceUrl:
      "https://getbootstrap.com/docs/5.3/layout/breakpoints/#media-queries",
    sourceLabel: "Bootstrap: Breakpoint media queries",
  },
  {
    id: "mq-004",
    category: "media-queries",
    difficulty: "medium",
    title: "Breakpoint ranges",
    badCode: `/* Targeting tablets only */
@media (min-width: 768px) and (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr 1fr;
  }
}`,
    goodCode: `/* Targeting tablets only */
@media (768px <= width < 1024px) {
  .layout {
    grid-template-columns: 1fr 1fr;
  }
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "Media query range syntax (`768px <= width < 1024px`) is supported in all modern browsers and reads like a math expression. The `<` makes it obvious the upper bound is exclusive, preventing overlap with the next breakpoint.",
    explanationWrong:
      "The `and` syntax works but is harder to scan, and `max-width: 1024px` is inclusive, so at 1024px this query *and* a `min-width: 1024px` desktop query both match. Range syntax with `<` avoids this.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries#syntax_improvements_in_level_4",
    sourceLabel: "MDN: Media query range syntax",
  },
  {
    id: "mq-005",
    category: "media-queries",
    difficulty: "medium",
    title: "Prefer feature queries over breakpoints",
    badCode: `/* Hide hover effects on mobile */
@media (max-width: 768px) {
  .card:hover {
    transform: none;
    box-shadow: none;
  }
}`,
    goodCode: `/* Only apply hover where supported */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "Screen width is a poor proxy for input method. A large tablet has no hover; a small laptop does. `@media (hover: hover)` targets the actual capability, not an assumed correlation with screen size.",
    explanationWrong:
      "Using `max-width` to remove hover effects assumes all small screens are touch devices. But iPads in landscape are 1024px+ and still can't hover, while small laptops can. Test for the feature, not the size.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover",
    sourceLabel: "MDN: hover media feature",
  },
  {
    id: "mq-006",
    category: "media-queries",
    difficulty: "hard",
    title: "Combining feature and dimension queries",
    badCode: `@media (min-width: 1024px) {
  .nav { display: flex; }
  .hamburger { display: none; }
}

@media (max-width: 1023px) {
  .nav { display: none; }
  .hamburger { display: flex; }
}`,
    goodCode: `/* Base: always show hamburger */
.nav { display: none; }
.hamburger { display: flex; }

/* Wide screens with fine pointer: full nav */
@media (min-width: 1024px) and (pointer: fine) {
  .nav { display: flex; }
  .hamburger { display: none; }
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "Combining `min-width` with `pointer: fine` ensures the full navigation only shows on wide screens with a precise pointing device. A touch-only large tablet keeps the hamburger menu, which is more ergonomic for finger taps.",
    explanationWrong:
      "Width alone doesn't determine if the user can comfortably navigate a horizontal menu. A 1200px iPad in landscape still benefits from a hamburger menu because tap targets for small nav links are frustrating.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer",
    sourceLabel: "MDN: pointer media feature",
  },
];
