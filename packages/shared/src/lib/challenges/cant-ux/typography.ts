import type { BaseChallenge } from "../../game/types";

export const typographyChallenges: BaseChallenge[] = [
  {
    id: "typ-001",
    category: "typography",
    difficulty: "easy",
    title: "Size-only hierarchy",
    prompt: "Which heading hierarchy works better?",
    content: {
      type: "visual",
      left: { componentId: "TypoSizeOnlyHierarchy" },
      right: { componentId: "TypoMultiDimensionHierarchy" },
    },
    correctSide: "right",
    explanationCorrect:
      "Effective typographic hierarchy uses multiple dimensions: size, weight, color, and spacing. Combining these signals lets you create clear distinctions between heading levels without relying on extreme size differences alone.",
    explanationWrong:
      "Relying on font size alone forces you into extreme jumps to create visible contrast. Smaller headings end up looking like body text, and larger ones feel disproportionate. Adding weight and color variations creates a much richer hierarchy.",
    sourceUrl: "https://www.refactoringui.com/",
    sourceLabel: "Refactoring UI: Visual hierarchy fundamentals",
  },
  {
    id: "typ-002",
    category: "typography",
    difficulty: "easy",
    title: "Line length",
    prompt: "Which line length is more comfortable?",
    content: {
      type: "visual",
      left: { componentId: "TypoLongLines" },
      right: { componentId: "TypoOptimalWidth" },
    },
    correctSide: "right",
    explanationCorrect:
      "Optimal line length for body text is 45 to 75 characters per line. This range reduces eye fatigue because the reader's eye can comfortably track from the end of one line to the beginning of the next.",
    explanationWrong:
      "Lines that stretch too wide force the reader's eye to travel a long horizontal distance, making it easy to lose track of which line comes next. Reading speed and comprehension both drop noticeably beyond 80 characters per line.",
    sourceUrl: "https://practicaltypography.com/line-length.html",
    sourceLabel: "Practical Typography: Line length",
  },
  {
    id: "typ-003",
    category: "typography",
    difficulty: "easy",
    title: "Line height",
    prompt: "Which paragraph spacing reads better?",
    content: {
      type: "visual",
      left: { componentId: "TypoTightLeading" },
      right: { componentId: "TypoRelaxedLeading" },
    },
    correctSide: "right",
    explanationCorrect:
      "A line height of 1.5 to 1.75 for body text gives each line enough breathing room for comfortable reading. This spacing helps the eye track smoothly from line to line, especially in longer paragraphs.",
    explanationWrong:
      "Tight line height causes lines of text to feel cramped and merge together visually. Readers lose their place more often, and the overall block of text looks dense and uninviting. This is especially problematic for users with dyslexia or low vision.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/line-height",
    sourceLabel: "MDN: line-height property",
  },
  {
    id: "typ-004",
    category: "typography",
    difficulty: "medium",
    title: "Type scale",
    prompt: "Which type scale feels more harmonious?",
    content: {
      type: "visual",
      left: { componentId: "TypoNoScale" },
      right: { componentId: "TypoHarmonicScale" },
    },
    correctSide: "right",
    explanationCorrect:
      "A harmonic type scale uses a consistent ratio (such as 1.25 or 1.333) to generate font sizes. Each step feels proportional to the others, creating a natural visual rhythm that makes the hierarchy predictable and easy to follow.",
    explanationWrong:
      "Arbitrary font sizes with no consistent ratio produce an uneven hierarchy. Some steps feel too close together while others jump dramatically. Without a system, every new heading size becomes a guessing game that leads to visual inconsistency.",
    sourceUrl: "https://typescale.com/",
    sourceLabel: "Type Scale: A visual type scale calculator",
  },
];
