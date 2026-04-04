import type { BaseChallenge } from "../../game/types";

export const feedbackChallenges: BaseChallenge[] = [
  {
    id: "fb-001",
    category: "feedback",
    difficulty: "easy",
    title: "Loading states",
    prompt: "Which loading experience feels faster?",
    content: {
      type: "visual",
      left: { componentId: "FeedbackBlankLoading" },
      right: { componentId: "FeedbackSkeleton" },
    },
    correctSide: "right",
    explanationCorrect:
      "Skeleton screens show the shape of upcoming content while data loads, giving users a sense of progress and structure. They feel faster than blank screens because the user can see that something is happening and can anticipate where content will appear.",
    explanationWrong:
      "A blank screen during loading provides no feedback at all. Users cannot tell whether the page is broken, still loading, or empty. This uncertainty leads to impatient clicks, page refreshes, and a perception that the application is slow or unreliable.",
    sourceUrl: "https://www.nngroup.com/articles/skeleton-screens/",
    sourceLabel: "Nielsen Norman Group: Skeleton screens",
  },
  {
    id: "fb-002",
    category: "feedback",
    difficulty: "easy",
    title: "Empty states",
    prompt: "Which empty state guides the user better?",
    content: {
      type: "visual",
      left: { componentId: "FeedbackEmptyBare" },
      right: { componentId: "FeedbackEmptyHelpful" },
    },
    correctSide: "right",
    explanationCorrect:
      'A helpful empty state explains why there is no content and offers a clear next step (such as a "Create your first project" button). It turns a dead end into an onboarding opportunity and reduces confusion for new users who do not know what to do.',
    explanationWrong:
      'A bare empty state (just "No items" or a blank area) leaves users stranded. They do not know if the feature is broken, if they need to do something first, or where to go next. Every empty state is a chance to guide the user, and a blank screen wastes that opportunity.',
    sourceUrl: "https://www.nngroup.com/articles/empty-state-interface-design/",
    sourceLabel: "Nielsen Norman Group: Empty state design",
  },
  {
    id: "fb-003",
    category: "feedback",
    difficulty: "medium",
    title: "Error presentation",
    prompt: "Which error message is more helpful?",
    content: {
      type: "visual",
      left: { componentId: "FeedbackTechnicalError" },
      right: { componentId: "FeedbackFriendlyError" },
    },
    correctSide: "right",
    explanationCorrect:
      "Friendly error screens use plain language, explain what happened, and offer recovery options (retry, go home, contact support). They reassure the user that the problem is temporary and provide a clear path forward instead of a dead end.",
    explanationWrong:
      'Technical error messages with stack traces, error codes, or developer jargon are meaningless to most users. They feel alarming and unprofessional. Users do not know what a "500 Internal Server Error" means or what they should do about it, so they leave.',
    sourceUrl: "https://www.nngroup.com/articles/error-message-guidelines/",
    sourceLabel: "Nielsen Norman Group: Error message guidelines",
  },
  {
    id: "fb-004",
    category: "feedback",
    difficulty: "medium",
    title: "Destructive confirmations",
    prompt: "Which delete flow is safer for users?",
    content: {
      type: "visual",
      left: { componentId: "FeedbackNoConfirmation" },
      right: { componentId: "FeedbackConfirmation" },
    },
    correctSide: "right",
    explanationCorrect:
      'A confirmation dialog for destructive actions (delete, remove, cancel subscription) gives users a chance to reconsider. The dialog should clearly state what will happen and use specific language like "Delete 3 files" instead of a generic "Are you sure?" prompt.',
    explanationWrong:
      "Performing destructive actions immediately with no confirmation is dangerous. A single misclick can delete data permanently, and the user has no way to prevent it. Even with an undo feature, a confirmation step for high-impact actions provides essential peace of mind.",
    sourceUrl: "https://www.nngroup.com/articles/confirmation-dialog/",
    sourceLabel: "Nielsen Norman Group: Confirmation dialogs",
  },
];
