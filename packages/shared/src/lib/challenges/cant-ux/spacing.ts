import type { BaseChallenge } from "../../game/types";

export const spacingChallenges: BaseChallenge[] = [
  {
    id: "sp-001",
    category: "spacing",
    difficulty: "easy",
    title: "Spacing consistency",
    prompt: "Which spacing system looks more polished?",
    content: {
      type: "visual",
      left: { componentId: "SpacingRandom" },
      right: { componentId: "SpacingConsistentScale" },
    },
    correctSide: "right",
    explanationCorrect:
      "A spacing scale (4px, 8px, 12px, 16px, 24px, 32px) creates visual consistency throughout the interface. When every gap is a multiple of a base unit, the layout feels intentional and cohesive even across different sections of the page.",
    explanationWrong:
      "Random spacing values (7px here, 13px there, 22px elsewhere) produce a layout that feels subtly off. The inconsistency makes the design look unpolished, and maintaining it becomes difficult because there is no system to follow.",
    sourceUrl: "https://lawsofux.com/law-of-uniform-connectedness/",
    sourceLabel: "Laws of UX: Law of Uniform Connectedness",
  },
  {
    id: "sp-002",
    category: "spacing",
    difficulty: "easy",
    title: "Whitespace",
    prompt: "Which layout uses space better?",
    content: {
      type: "visual",
      left: { componentId: "SpacingCramped" },
      right: { componentId: "SpacingGenerous" },
    },
    correctSide: "right",
    explanationCorrect:
      "Generous whitespace gives content room to breathe and makes the interface feel calm and professional. Elements that are not crowded together are easier to scan, and users can focus on one piece of content at a time.",
    explanationWrong:
      "Cramped layouts overwhelm the user with too much information in too little space. When elements are packed tightly together, nothing stands out, and the entire page feels stressful to navigate. More space almost always improves readability.",
    sourceUrl: "https://lawsofux.com/law-of-proximity/",
    sourceLabel: "Laws of UX: Law of Proximity",
  },
  {
    id: "sp-003",
    category: "spacing",
    difficulty: "medium",
    title: "Proximity grouping",
    prompt: "Which grouping is easier to understand?",
    content: {
      type: "visual",
      left: { componentId: "SpacingNoProximity" },
      right: { componentId: "SpacingProximity" },
    },
    correctSide: "right",
    explanationCorrect:
      "The law of proximity states that items placed close together are perceived as a group. By tightening spacing within related items and increasing spacing between groups, you create a clear visual structure without needing borders or dividers.",
    explanationWrong:
      "When all items have equal spacing, the user cannot tell which elements belong together. Labels float ambiguously between sections, and the user has to read every item carefully to understand the grouping. This adds unnecessary cognitive load.",
    sourceUrl: "https://lawsofux.com/law-of-proximity/",
    sourceLabel: "Laws of UX: Law of Proximity",
  },
  {
    id: "sp-004",
    category: "spacing",
    difficulty: "medium",
    title: "Borders vs whitespace",
    prompt: "Which separation method feels cleaner?",
    content: {
      type: "visual",
      left: { componentId: "SpacingBorderSeparation" },
      right: { componentId: "SpacingWhitespaceSeparation" },
    },
    correctSide: "right",
    explanationCorrect:
      "Whitespace is a cleaner way to separate content groups than adding borders everywhere. It reduces visual clutter while still making the structure obvious. Fewer visual elements on screen means less work for the user's eye to process.",
    explanationWrong:
      "Borders around every section create a grid-like, boxy appearance that feels heavy and dated. Each border is another visual element competing for attention. In most cases, sufficient spacing between groups communicates separation just as effectively with less noise.",
    sourceUrl: "https://www.refactoringui.com/",
    sourceLabel: "Refactoring UI: Separating content with whitespace",
  },
];
