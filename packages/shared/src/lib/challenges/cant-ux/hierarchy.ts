import type { BaseChallenge } from "../../game/types";

export const hierarchyChallenges: BaseChallenge[] = [
  {
    id: "hi-001",
    category: "hierarchy",
    difficulty: "easy",
    title: "Visual hierarchy",
    prompt: "Which layout is easier to scan?",
    content: {
      type: "visual",
      left: { componentId: "HierarchyFlat" },
      right: { componentId: "HierarchyClear" },
    },
    correctSide: "right",
    explanationCorrect:
      "Clear visual hierarchy uses size, weight, and color to signal importance. Primary content is large and bold, secondary content is smaller and lighter, and supporting details recede into the background. Users can scan the page quickly and find what matters.",
    explanationWrong:
      "When every element has the same visual weight, nothing stands out. Users are forced to read everything sequentially to determine what is important, which slows them down and increases the chance they miss key information entirely.",
    sourceUrl:
      "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/",
    sourceLabel: "Nielsen Norman Group: Visual hierarchy in UX",
  },
  {
    id: "hi-002",
    category: "hierarchy",
    difficulty: "easy",
    title: "Button hierarchy",
    prompt: "Which button set guides users better?",
    content: {
      type: "visual",
      left: { componentId: "ButtonsAllPrimary" },
      right: { componentId: "ButtonsWithHierarchy" },
    },
    correctSide: "right",
    explanationCorrect:
      "A clear button hierarchy uses one filled primary button for the main action, outlined or text buttons for secondary actions, and subtle links for tertiary options. This guides users toward the most important action without overwhelming them with choices.",
    explanationWrong:
      "When every button looks like a primary action, users cannot tell which one matters most. All actions appear equally important, which creates decision paralysis and slows the user down. The primary action should always be visually dominant.",
    sourceUrl: "https://www.nngroup.com/articles/clickable-elements/",
    sourceLabel: "Nielsen Norman Group: Clickable elements",
  },
  {
    id: "hi-003",
    category: "hierarchy",
    difficulty: "medium",
    title: "Emphasis",
    prompt: "Which text emphasis is more effective?",
    content: {
      type: "visual",
      left: { componentId: "EverythingBold" },
      right: { componentId: "SelectiveEmphasis" },
    },
    correctSide: "right",
    explanationCorrect:
      "Selective emphasis works because it creates contrast. When only key phrases are bold or highlighted, they stand out against the surrounding normal-weight text. The restraint is what gives emphasis its power, and users can scan for important information quickly.",
    explanationWrong:
      "When everything is emphasized, nothing is. Bold text only draws attention when it contrasts with non-bold text around it. Making everything bold is the same as making nothing bold, and the user loses the ability to scan for key points.",
    sourceUrl: "https://www.refactoringui.com/",
    sourceLabel: "Refactoring UI: Emphasize by de-emphasizing",
  },
  {
    id: "hi-004",
    category: "hierarchy",
    difficulty: "medium",
    title: "Label vs value styling",
    prompt: "Which data display is quicker to scan?",
    content: {
      type: "visual",
      left: { componentId: "LabelSameAsValue" },
      right: { componentId: "LabelDimmedValueBold" },
    },
    correctSide: "right",
    explanationCorrect:
      "Dimming labels and making values visually prominent creates a natural scanning pattern. Users can quickly jump from value to value because the labels fade into the background. The important data (values) stands out while labels remain available as context when needed.",
    explanationWrong:
      "When labels and values have the same styling, every piece of text competes equally for attention. Users must carefully read each item to distinguish labels from data. This doubles the visual noise and makes the interface slower to scan.",
    sourceUrl: "https://www.refactoringui.com/",
    sourceLabel: "Refactoring UI: Label and value hierarchy",
  },
];
