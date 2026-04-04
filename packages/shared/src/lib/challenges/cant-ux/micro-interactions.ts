import type { BaseChallenge } from "../../game/types";

export const microInteractionsChallenges: BaseChallenge[] = [
  {
    id: "micro-001",
    category: "micro-interactions",
    difficulty: "easy",
    title: "Button feedback",
    prompt: "Which button gives better feedback?",
    content: {
      type: "visual",
      left: { componentId: "MicroNoButtonFeedback" },
      right: { componentId: "MicroButtonWithFeedback" },
    },
    correctSide: "right",
    explanationCorrect:
      "A button that transitions through pressed, loading, and success states gives users confidence that their action was received. Each state change confirms progress, which is especially important for actions that take time, like form submissions or API calls.",
    explanationWrong:
      "A button with no visual response to clicks leaves users uncertain. They do not know if the click registered, if the system is processing, or if something failed silently. This often leads to frustrated double-clicks that can trigger duplicate submissions.",
    sourceUrl: "https://www.nngroup.com/articles/buttons-vs-links/",
    sourceLabel: "NN/G: Button states and feedback",
  },
  {
    id: "micro-002",
    category: "micro-interactions",
    difficulty: "easy",
    title: "Toggle response",
    prompt: "Which toggle feels more responsive?",
    content: {
      type: "visual",
      left: { componentId: "MicroInstantToggle" },
      right: { componentId: "MicroAnimatedToggle" },
    },
    correctSide: "right",
    explanationCorrect:
      "A smooth sliding animation on a toggle switch creates a clear cause-and-effect relationship between the user's action and the UI response. The transition gives the brain time to register the state change, making the interaction feel physical and intentional.",
    explanationWrong:
      "An instant snap between states can feel jarring and mechanical. Without any transition, users may question whether the toggle actually changed, especially if the color shift is subtle. The abrupt change lacks the tactile quality that makes toggle switches intuitive.",
    sourceUrl: "https://m3.material.io/components/switch/overview",
    sourceLabel: "Material Design: Switch component",
  },
  {
    id: "micro-003",
    category: "micro-interactions",
    difficulty: "medium",
    title: "Content entrance",
    prompt: "Which list feels more polished?",
    content: {
      type: "visual",
      left: { componentId: "MicroAbruptEntrance" },
      right: { componentId: "MicroStaggeredEntrance" },
    },
    correctSide: "right",
    explanationCorrect:
      "Staggered entrance animations help users process a list by revealing items one at a time in quick succession. The slight delay between items creates a natural reading rhythm and draws attention to each item briefly, making the content feel more organized and intentional.",
    explanationWrong:
      "Displaying all items at once forces the user to process an entire block of content simultaneously. While this is functional, it misses an opportunity to guide the eye and create a sense of flow. For longer lists, the sudden appearance can feel like a jarring content dump.",
    sourceUrl: "https://m3.material.io/styles/motion/overview",
    sourceLabel: "Material Design: Motion principles",
  },
  {
    id: "micro-004",
    category: "micro-interactions",
    difficulty: "medium",
    title: "Progress communication",
    prompt: "Which upload gives more useful feedback?",
    content: {
      type: "visual",
      left: { componentId: "MicroIndeterminateProgress" },
      right: { componentId: "MicroStepProgress" },
    },
    correctSide: "right",
    explanationCorrect:
      "A step-by-step progress indicator with file names and a percentage bar gives users a clear mental model of what is happening. They can estimate remaining time, see which files succeeded, and identify any that might fail. This transparency builds trust and reduces perceived wait time.",
    explanationWrong:
      "An indeterminate spinner with no context gives users no idea how long the upload will take or how many files remain. Users cannot tell if the process is 10% or 90% complete, which makes even short waits feel longer and creates anxiety about whether the upload is stalled.",
    sourceUrl: "https://www.nngroup.com/articles/progress-indicators/",
    sourceLabel: "NN/G: Progress indicators",
  },
];
