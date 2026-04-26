import type { BaseChallenge } from "../../game/types";

export const formsChallenges: BaseChallenge[] = [
  {
    id: "frm-001",
    category: "forms",
    difficulty: "easy",
    title: "Input labels",
    prompt: "Which form labeling approach is clearer?",
    content: {
      type: "visual",
      left: { componentId: "FormPlaceholderLabels" },
      right: { componentId: "FormVisibleLabels" },
    },
    correctSide: "right",
    explanationCorrect:
      "Visible labels above each input remain on screen while the user types, providing persistent context. Users can always see what each field is for, even after entering data. This also helps with error correction because the field purpose is never hidden.",
    explanationWrong:
      "Placeholder text disappears as soon as the user starts typing, removing the only indication of what the field is for. Users who tab back to correct a mistake cannot remember what the field asked for. This is a well-documented usability problem with placeholder-only labels.",
    sourceUrl: "https://www.nngroup.com/articles/form-design-placeholders/",
    sourceLabel: "Nielsen Norman Group: Placeholders in form fields",
  },
  {
    id: "frm-002",
    category: "forms",
    difficulty: "easy",
    title: "Error messages",
    prompt: "Which error feedback helps users more?",
    content: {
      type: "visual",
      left: { componentId: "FormGenericError" },
      right: { componentId: "FormSpecificError" },
    },
    correctSide: "right",
    explanationCorrect:
      'Specific, inline error messages tell the user exactly what is wrong and how to fix it. Placing the error next to the relevant field reduces the time spent searching for the problem. Clear guidance like "Password must be at least 8 characters" is actionable and helpful.',
    explanationWrong:
      'Generic error messages like "Invalid input" or "Please fix errors" leave the user guessing. They do not know which field has the problem or what they need to change. Vague feedback increases frustration and abandonment, especially on longer forms.',
    sourceUrl:
      "https://www.nngroup.com/articles/errors-forms-design-guidelines/",
    sourceLabel: "Nielsen Norman Group: Error message guidelines",
  },
  {
    id: "frm-003",
    category: "forms",
    difficulty: "medium",
    title: "Touch targets",
    prompt: "Which buttons are easier to tap?",
    content: {
      type: "visual",
      left: { componentId: "FormTinyTargets" },
      right: { componentId: "FormLargeTargets" },
    },
    correctSide: "right",
    explanationCorrect:
      "Touch targets of at least 44x44 pixels (Apple's guideline) or 48x48 pixels (Google's guideline) ensure that users can tap buttons and inputs comfortably on mobile devices. Adequate spacing between targets prevents accidental taps on neighboring elements.",
    explanationWrong:
      "Tiny touch targets force users to tap precisely, which is difficult on mobile devices where fingers are imprecise. Users end up tapping the wrong element or needing multiple attempts to hit the right one. This is one of the most common mobile usability failures.",
    sourceUrl: "https://www.w3.org/WAI/WCAG21/Understanding/target-size.html",
    sourceLabel: "WCAG 2.1: Understanding target size",
  },
  {
    id: "frm-004",
    category: "forms",
    difficulty: "medium",
    title: "Form organization",
    prompt: "Which form structure is easier to fill?",
    content: {
      type: "visual",
      left: { componentId: "FormWallOfFields" },
      right: { componentId: "FormGroupedFields" },
    },
    correctSide: "right",
    explanationCorrect:
      "Grouping related fields into logical sections (personal info, address, payment) with clear headings breaks a long form into manageable chunks. Users can process one group at a time, and the structure communicates progress through the form.",
    explanationWrong:
      "A long, undivided wall of fields feels overwhelming and makes users less likely to complete the form. Without grouping, users cannot estimate how much work remains, and related fields (like city and zip code) do not feel connected. Chunking reduces perceived complexity.",
    sourceUrl: "https://www.nngroup.com/articles/web-form-design/",
    sourceLabel: "Nielsen Norman Group: Web form design guidelines",
  },
];
