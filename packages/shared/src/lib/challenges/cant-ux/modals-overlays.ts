import type { BaseChallenge } from "../../game/types";

export const modalsOverlaysChallenges: BaseChallenge[] = [
  {
    id: "modal-001",
    category: "modals-overlays",
    difficulty: "easy",
    title: "Confirmation scope",
    prompt: "Which confirmation feels proportionate?",
    content: {
      type: "visual",
      left: { componentId: "ModalFullScreenConfirm" },
      right: { componentId: "ModalInlineConfirm" },
    },
    correctSide: "right",
    explanationCorrect:
      "An inline confirmation keeps the action in context, right next to the item it affects. Users can see what they are acting on without losing their place. For simple, reversible actions, this lighter pattern is faster and less disruptive than a full modal overlay.",
    explanationWrong:
      "A full-screen modal for a simple confirmation is disproportionate to the action. It blocks the entire page, forces the user to context-switch, and creates unnecessary visual weight. Modal dialogs should be reserved for actions that truly need the user's undivided attention.",
    sourceUrl: "https://www.nngroup.com/articles/modal-nonmodal-dialog/",
    sourceLabel: "NN/G: Modal vs non-modal dialogs",
  },
  {
    id: "modal-002",
    category: "modals-overlays",
    difficulty: "easy",
    title: "Dismissibility",
    prompt: "Which dialog is easier to dismiss?",
    content: {
      type: "visual",
      left: { componentId: "ModalNoDismiss" },
      right: { componentId: "ModalMultipleDismiss" },
    },
    correctSide: "right",
    explanationCorrect:
      "Multiple dismiss methods (X button, backdrop click, explicit 'No thanks' text) respect user autonomy. Users expect to close dialogs the way they are most comfortable: some click X, others click outside, others look for a text link. Providing all three is standard and expected.",
    explanationWrong:
      "A dialog with no visible close mechanism traps users. If they do not want to subscribe, they have no way out. This hostile pattern damages trust and often leads users to leave the site entirely rather than engage with the forced interaction.",
    sourceUrl: "https://www.nngroup.com/articles/popups/",
    sourceLabel: "NN/G: Pop-ups and overlays",
  },
  {
    id: "modal-003",
    category: "modals-overlays",
    difficulty: "medium",
    title: "Information overload",
    prompt: "Which approach handles complex input better?",
    content: {
      type: "visual",
      left: { componentId: "ModalOverloadedForm" },
      right: { componentId: "ModalMultiStepFlow" },
    },
    correctSide: "right",
    explanationCorrect:
      "A multi-step page flow breaks complex input into manageable chunks with clear progress. Each step shows only the relevant fields, reducing cognitive load. The full page width gives fields room to breathe, and users can use the browser's back button naturally.",
    explanationWrong:
      "Cramming a long form into a modal creates a scrollable box within a page, which is disorienting. Users cannot see all fields at once, the narrow modal width squeezes inputs, and the overlay prevents them from referencing page content they might need to fill in the form.",
    sourceUrl: "https://www.nngroup.com/articles/wizards/",
    sourceLabel: "NN/G: Wizard design pattern",
  },
  {
    id: "modal-004",
    category: "modals-overlays",
    difficulty: "medium",
    title: "Interruption timing",
    prompt: "Which first impression is less intrusive?",
    content: {
      type: "visual",
      left: { componentId: "ModalPopupOverload" },
      right: { componentId: "ModalCleanFirstVisit" },
    },
    correctSide: "right",
    explanationCorrect:
      "A clean first visit with only a minimal cookie notice lets users explore the content they came for. Newsletter prompts and chat widgets are more effective after the user has shown interest by scrolling, clicking, or spending time on the page.",
    explanationWrong:
      "Stacking a cookie banner, newsletter popup, and chat widget on first load overwhelms new visitors. They must dismiss multiple interruptions before seeing any content, which creates frustration and increases bounce rates. Each popup competes for attention and none gets a fair hearing.",
    sourceUrl: "https://www.nngroup.com/articles/modal-nonmodal-dialog/",
    sourceLabel: "NN/G: When to use modal dialogs",
  },
];
