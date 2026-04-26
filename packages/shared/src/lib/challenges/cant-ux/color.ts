import type { BaseChallenge } from "../../game/types";

export const colorChallenges: BaseChallenge[] = [
  {
    id: "col-001",
    category: "color",
    difficulty: "easy",
    title: "Text contrast",
    prompt: "Which text has better contrast?",
    content: {
      type: "visual",
      left: { componentId: "ColorLowContrast" },
      right: { componentId: "ColorAccessibleContrast" },
    },
    correctSide: "right",
    explanationCorrect:
      "WCAG requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. Meeting these thresholds ensures that text remains readable for users with low vision, color blindness, or screens viewed in bright sunlight.",
    explanationWrong:
      "Low-contrast text may look sleek in a design mockup, but it fails real users. People with even mild vision impairment struggle to read light grey text on white backgrounds. Accessibility is not optional, and contrast is the most basic requirement.",
    sourceUrl: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum",
    sourceLabel: "WCAG 2.1: Understanding contrast minimum",
  },
  {
    id: "col-002",
    category: "color",
    difficulty: "easy",
    title: "Color palette",
    prompt: "Which color palette is more effective?",
    content: {
      type: "visual",
      left: { componentId: "ColorTooManyColors" },
      right: { componentId: "ColorLimitedPalette" },
    },
    correctSide: "right",
    explanationCorrect:
      "A limited color palette (one primary, one accent, and a few neutral shades) keeps the interface cohesive and makes it easy to establish visual hierarchy. When color is used sparingly, it becomes a powerful tool for drawing attention to key elements.",
    explanationWrong:
      "Using too many colors creates visual chaos. Every color competes for the user's attention, and nothing stands out as important. A cluttered palette also makes it harder to maintain consistency as the interface grows, because there are no clear rules for when to use which color.",
    sourceUrl: "https://www.refactoringui.com/",
    sourceLabel: "Refactoring UI: Choosing a color palette",
  },
  {
    id: "col-003",
    category: "color",
    difficulty: "medium",
    title: "Text on colored backgrounds",
    prompt: "Which secondary text looks better?",
    content: {
      type: "visual",
      left: { componentId: "ColorGreyOnColor" },
      right: { componentId: "ColorTintedOnColor" },
    },
    correctSide: "right",
    explanationCorrect:
      "On colored backgrounds, secondary text looks best when you tint it with the background color rather than using plain grey. A tinted version (such as a lighter or more transparent shade of the background hue) feels natural and cohesive, maintaining the overall color harmony.",
    explanationWrong:
      "Plain grey text on a colored background looks washed out and disconnected from the surrounding design. The grey clashes subtly with the background hue, creating an unintentional dull appearance. Tinting the text to match the background produces a much more polished result.",
    sourceUrl: "https://www.refactoringui.com/",
    sourceLabel: "Refactoring UI: Text on colored backgrounds",
  },
  {
    id: "col-004",
    category: "color",
    difficulty: "medium",
    title: "Black vs dark grey",
    prompt: "Which text color is easier to read?",
    content: {
      type: "visual",
      left: { componentId: "ColorPureBlackOnWhite" },
      right: { componentId: "ColorSoftContrast" },
    },
    correctSide: "right",
    explanationCorrect:
      "Dark grey text (such as #333 or #374151) on a white background provides excellent readability while feeling softer and more comfortable than pure black. The slightly reduced contrast is still well above WCAG requirements and reduces eye strain during extended reading.",
    explanationWrong:
      "Pure black (#000) on pure white (#fff) creates the maximum possible contrast, which can cause eye strain during long reading sessions. The harsh contrast produces a vibrating effect at text edges on some displays. A dark grey provides a more comfortable reading experience without sacrificing legibility.",
    sourceUrl:
      "https://uxmovement.com/content/why-you-should-never-use-pure-black-for-text-or-backgrounds/",
    sourceLabel: "UX Movement: Why you should never use pure black for text",
  },
];
