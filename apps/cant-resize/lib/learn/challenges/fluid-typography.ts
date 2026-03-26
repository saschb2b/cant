import type { Challenge } from "../types";

export const fluidTypographyChallenges: Challenge[] = [
  {
    id: "ft-001",
    category: "fluid-typography",
    difficulty: "easy",
    title: "clamp() vs breakpoint steps",
    badCode: `h1 {
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  h1 { font-size: 2rem; }
}

@media (min-width: 1024px) {
  h1 { font-size: 2.5rem; }
}

@media (min-width: 1280px) {
  h1 { font-size: 3rem; }
}`,
    goodCode: `h1 {
  font-size: clamp(1.5rem, 1rem + 2vw, 3rem);
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "`clamp(min, preferred, max)` scales the font smoothly between 1.5rem and 3rem based on viewport width. No breakpoints needed, no jarring jumps. The `1rem + 2vw` preferred value blends a fixed base with a viewport-relative portion.",
    explanationWrong:
      "Stepped breakpoints create abrupt font size jumps at each threshold. A user at 767px sees 1.5rem, then at 768px it snaps to 2rem. `clamp()` eliminates these discontinuities with a single line.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp",
    sourceLabel: "MDN: clamp()",
  },
  {
    id: "ft-002",
    category: "fluid-typography",
    difficulty: "easy",
    title: "Avoid pure vw for font size",
    badCode: `h1 {
  font-size: 5vw;
}`,
    goodCode: `h1 {
  font-size: clamp(1.25rem, 0.5rem + 3vw, 3rem);
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "Pure `vw` has no minimum or maximum. On a 320px phone it's just 16px (too small for a heading), and on a 2560px monitor it's 128px (enormous). `clamp()` provides guardrails at both ends. The `rem` base also respects the user's browser font-size preference.",
    explanationWrong:
      "`5vw` means the font is always 5% of the viewport width with no bounds. On ultrawide monitors the text becomes comically large; on small phones it may become unreadable. It also ignores the user's preferred font size setting.",
    sourceUrl:
      "https://web.dev/articles/responsive-web-design-basics#sizing_text",
    sourceLabel: "web.dev: Sizing text",
  },
  {
    id: "ft-003",
    category: "fluid-typography",
    difficulty: "medium",
    title: "Fluid type scale with custom properties",
    badCode: `:root {
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
}

@media (min-width: 768px) {
  :root {
    --text-sm: 0.875rem;
    --text-base: 1.125rem;
    --text-lg: 1.5rem;
    --text-xl: 2rem;
    --text-2xl: 3rem;
  }
}`,
    goodCode: `:root {
  --text-sm: clamp(0.8rem, 0.75rem + 0.25vw, 0.9rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.25rem, 1rem + 1vw, 1.5rem);
  --text-xl: clamp(1.5rem, 1rem + 1.5vw, 2rem);
  --text-2xl: clamp(2rem, 1.25rem + 2.5vw, 3rem);
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "A fluid type scale defined once with `clamp()` eliminates the need to redefine every token at each breakpoint. The scale naturally expands on larger screens and contracts on smaller ones, keeping proportions consistent.",
    explanationWrong:
      "Redefining every custom property at each breakpoint creates maintenance overhead and introduces abrupt jumps. Adding a new breakpoint means updating every variable again. The fluid approach is set-and-forget.",
    sourceUrl: "https://utopia.fyi/type/calculator/",
    sourceLabel: "Utopia: Fluid type scale calculator",
  },
  {
    id: "ft-004",
    category: "fluid-typography",
    difficulty: "medium",
    title: "Line height for fluid text",
    badCode: `h1 {
  font-size: clamp(1.5rem, 1rem + 2vw, 3rem);
  line-height: 48px;
}`,
    goodCode: `h1 {
  font-size: clamp(1.5rem, 1rem + 2vw, 3rem);
  line-height: 1.2;
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "A unitless `line-height` of `1.2` scales proportionally with the font size. When the heading is 1.5rem, line-height is 1.8rem; at 3rem, it's 3.6rem. The spacing always feels right because it's relative to the text.",
    explanationWrong:
      "A fixed `48px` line-height works when the font is ~3rem (48px) but creates excessive spacing when the font is 1.5rem (24px). With fluid font sizes, line-height must be relative to stay proportional.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#prefer_unitless_numbers_for_line-height_values",
    sourceLabel: "MDN: Unitless line-height",
  },
  {
    id: "ft-005",
    category: "fluid-typography",
    difficulty: "hard",
    title: "Accessible fluid typography",
    badCode: `body {
  font-size: clamp(14px, 1.2vw, 18px);
}`,
    goodCode: `body {
  font-size: clamp(0.875rem, 0.8rem + 0.4vw, 1.125rem);
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "Using `rem` for the min and max respects the user's browser font size preference. If they set their default to 20px for accessibility, `0.875rem` becomes 17.5px instead of being locked to 14px. The `rem` + `vw` blend in the preferred value also partially scales with their setting.",
    explanationWrong:
      "Hardcoded `px` values in `clamp()` override the user's font size preference. A user who set their browser default to 24px for low vision will still get 14-18px body text. This is a WCAG accessibility failure.",
    sourceUrl: "https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html",
    sourceLabel: "WCAG: Understanding Resize Text",
  },
];
