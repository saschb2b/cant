import type { BaseChallenge } from "../../game/types";

export const accessibilityChallenges: BaseChallenge[] = [
  {
    id: "a11y-001",
    category: "accessibility",
    difficulty: "easy",
    title: "Focus indicators",
    prompt: "Which interface is more keyboard-friendly?",
    content: {
      type: "visual",
      left: { componentId: "A11yNoFocusRing" },
      right: { componentId: "A11yVisibleFocusRing" },
    },
    correctSide: "right",
    explanationCorrect:
      "Visible focus indicators are essential for keyboard navigation. They show which element is currently selected, just like a cursor shows where you are typing. Without them, keyboard users are navigating blind, tabbing through elements with no idea where they are on the page.",
    explanationWrong:
      "Removing focus outlines with 'outline: none' may look cleaner, but it makes the interface unusable for keyboard-only users. This includes people using assistive technology, power users who prefer keyboard shortcuts, and anyone with a broken mouse or trackpad.",
    sourceUrl: "https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html",
    sourceLabel: "WCAG 2.1: Focus Visible (2.4.7)",
  },
  {
    id: "a11y-002",
    category: "accessibility",
    difficulty: "easy",
    title: "Icon labeling",
    prompt: "Which toolbar is easier to understand?",
    content: {
      type: "visual",
      left: { componentId: "A11yIconOnly" },
      right: { componentId: "A11yIconWithLabel" },
    },
    correctSide: "right",
    explanationCorrect:
      "Adding text labels next to icons removes ambiguity. Even common icons like the share symbol are interpreted differently across platforms. Text labels make actions immediately clear to all users, including those who are new to the interface or use screen readers.",
    explanationWrong:
      "Icon-only toolbars save space, but force users to guess what each icon means. Studies show that icon recognition varies widely across cultures and experience levels. Users waste time hovering or trial-clicking to discover what each button does.",
    sourceUrl: "https://www.nngroup.com/articles/icon-usability/",
    sourceLabel: "NN/G: Icon usability",
  },
  {
    id: "a11y-003",
    category: "accessibility",
    difficulty: "medium",
    title: "Status communication",
    prompt: "Which status display is more accessible?",
    content: {
      type: "visual",
      left: { componentId: "A11yColorOnlyStatus" },
      right: { componentId: "A11yRichStatus" },
    },
    correctSide: "right",
    explanationCorrect:
      "Combining color with icons and text labels ensures that status information reaches all users. About 8% of men have some form of color vision deficiency. Using multiple visual channels (color, shape, and text) makes the status immediately clear regardless of how someone perceives color.",
    explanationWrong:
      "Relying on color alone to convey meaning violates WCAG 1.4.1 (Use of Color). A red dot and a green dot may look identical to someone with red-green color blindness. Without a secondary indicator like an icon or label, these users cannot determine system status at all.",
    sourceUrl: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html",
    sourceLabel: "WCAG 2.1: Use of Color (1.4.1)",
  },
  {
    id: "a11y-004",
    category: "accessibility",
    difficulty: "medium",
    title: "Link distinction",
    prompt: "Which text makes links easier to find?",
    content: {
      type: "visual",
      left: { componentId: "A11yColorOnlyLinks" },
      right: { componentId: "A11yUnderlinedLinks" },
    },
    correctSide: "right",
    explanationCorrect:
      "Underlined links are universally recognized as clickable. The underline provides a non-color visual cue that distinguishes links from surrounding text, which is critical for users with color vision deficiency and for anyone scanning a page quickly.",
    explanationWrong:
      "Links that differ from body text only by color are easy to miss. Users with low vision or color blindness may not notice the color difference at all. Removing underlines from inline links trades a well-understood convention for a subtle visual distinction that many users will overlook.",
    sourceUrl: "https://www.w3.org/WAI/WCAG21/Techniques/general/G183",
    sourceLabel: "WCAG: Providing a text cue for links within text",
  },
];
