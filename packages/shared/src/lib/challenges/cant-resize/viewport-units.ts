import type { BaseChallenge } from "../../game/types";

export const viewportUnitChallenges: BaseChallenge[] = [
  {
    id: "vu-001",
    category: "viewport-units",
    difficulty: "easy",
    title: "The mobile 100vh trap",
    prompt: "Which fills the visible screen on mobile?",
    content: {
      type: "code",

      lang: "css",

      left: `.hero {
  height: 100vh;
}`,

      right: `.hero {
  height: 100dvh;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`100vh` on mobile includes the area behind the browser's URL bar, so content gets hidden. `100dvh` (dynamic viewport height) adjusts when the browser chrome appears or disappears, giving you the actual visible height.",
    explanationWrong:
      "On mobile Safari and Chrome, `100vh` is taller than the visible area because it includes the space behind the collapsible URL bar. Users see a cut-off hero section and can't reach content at the bottom without scrolling.",
    sourceUrl: "https://web.dev/blog/viewport-units",
    sourceLabel: "web.dev: New viewport units",
  },
  {
    id: "vu-002",
    category: "viewport-units",
    difficulty: "easy",
    title: "Choosing the right viewport unit",
    prompt: "Which unit is stable for fixed elements?",
    content: {
      type: "code",

      lang: "css",

      left: `.sticky-footer {
  position: fixed;
  bottom: 0;
  /* Uses dvh for bottom positioning */
  height: calc(100dvh - 60px);
}`,

      right: `.sticky-footer {
  position: fixed;
  bottom: 0;
  /* svh = smallest viewport height (URL bar expanded) */
  height: calc(100svh - 60px);
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`svh` (small viewport height) is the viewport with all browser chrome visible, meaning it's the smallest the viewport can be. For fixed elements, this prevents content from jumping when the URL bar collapses. Use `dvh` for full-screen heroes, `svh` for fixed/sticky UI.",
    explanationWrong:
      "`dvh` changes as the browser chrome animates in and out, causing the fixed footer's height to constantly resize as the user scrolls. `svh` gives a stable value based on the smallest viewport state.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport",
    sourceLabel: "MDN: Viewport-relative units",
  },
  {
    id: "vu-003",
    category: "viewport-units",
    difficulty: "medium",
    title: "Viewport width for layout constraints",
    prompt: "Which respects parent container width?",
    content: {
      type: "code",

      lang: "css",

      left: `.container {
  width: 90vw;
  margin: 0 auto;
}`,

      right: `.container {
  width: min(90%, 1200px);
  margin-inline: auto;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`min(90%, 1200px)` caps the container at 1200px on large screens while staying 90% wide on small screens, and no media query is needed. Using `%` instead of `vw` also respects parent constraints if the container is nested, and `margin-inline` is the logical property equivalent.",
    explanationWrong:
      "`90vw` always refers to the viewport, even inside a nested container. If this `.container` is inside a 50%-width sidebar, it will overflow because `90vw` is relative to the full screen, not the parent. Percentage-based widths respect the parent.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/min",
    sourceLabel: "MDN: min()",
  },
  {
    id: "vu-004",
    category: "viewport-units",
    difficulty: "medium",
    title: "Scroll-linked layout with vh",
    prompt: "Which avoids a horizontal scrollbar?",
    content: {
      type: "code",

      lang: "css",

      left: `.page-section {
  min-height: 100vh;
  scroll-snap-align: start;
}

/* Scrollbar causes horizontal overflow */
.page {
  width: 100vw;
}`,

      right: `.page-section {
  min-height: 100dvh;
  scroll-snap-align: start;
}

.page {
  width: 100%;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`100vw` includes the scrollbar width on Windows/Linux, causing a horizontal scrollbar. `100%` refers to the containing block's width, which excludes the scrollbar. For section heights, `100dvh` gives the correct visible area on mobile.",
    explanationWrong:
      "`100vw` is the full viewport including the scrollbar (typically 15-17px on Windows). This creates a horizontal overflow that's invisible on macOS (overlay scrollbar) but breaks the layout on Windows. Never use `100vw` for full-width elements.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/length#vw",
    sourceLabel: "MDN: vw unit",
  },
  {
    id: "vu-005",
    category: "viewport-units",
    difficulty: "easy",
    title: "Viewport units with fallbacks",
    prompt: "Which supports older browsers gracefully?",
    content: {
      type: "code",

      lang: "css",

      left: `.hero {
  height: 100dvh;
}`,

      right: `.hero {
  height: 100vh;
  height: 100dvh;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "CSS cascade lets you declare `100vh` first as a fallback for older browsers, then `100dvh` which modern browsers will use. Browsers that don't understand `dvh` ignore the second declaration and keep `100vh`. This is progressive enhancement in one rule.",
    explanationWrong:
      "While `dvh` has good browser support now, older browsers and some WebViews still don't support it. Without a `vh` fallback, the hero gets no height at all in unsupported browsers and just collapses to content height.",
    sourceUrl: "https://caniuse.com/viewport-unit-variants",
    sourceLabel: "Can I Use: Viewport unit variants",
  },
];
