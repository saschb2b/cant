import type { BaseChallenge } from "../../game/types";

export const contentCopyChallenges: BaseChallenge[] = [
  {
    id: "copy-001",
    category: "content-copy",
    difficulty: "easy",
    title: "Error language",
    prompt: "Which error message is more helpful?",
    content: {
      type: "visual",
      left: { componentId: "CopyTechnicalError" },
      right: { componentId: "CopyFriendlyError" },
    },
    correctSide: "right",
    explanationCorrect:
      "A message like 'Please check your email address' tells the user exactly what went wrong and what to do next. Good error messages are written in plain language, identify the problem, and suggest a fix. Users should never have to interpret HTTP status codes or stack traces.",
    explanationWrong:
      "Technical error messages like 'Error 422: Unprocessable Entity' are meaningless to most users. They create anxiety, erode trust, and provide no path forward. Even technical users prefer clear guidance over raw error codes when they are trying to complete a task.",
    sourceUrl: "https://www.nngroup.com/articles/error-message-guidelines/",
    sourceLabel: "NN/G: Error message guidelines",
  },
  {
    id: "copy-002",
    category: "content-copy",
    difficulty: "easy",
    title: "Scannable content",
    prompt: "Which content is easier to scan?",
    content: {
      type: "visual",
      left: { componentId: "CopyWallOfText" },
      right: { componentId: "CopyScannableContent" },
    },
    correctSide: "right",
    explanationCorrect:
      "Breaking content into short sections with clear headings lets users scan for what they need. Research shows that users read only about 20% of text on a page. Headings, short paragraphs, and visual grouping help them find relevant information without reading everything.",
    explanationWrong:
      "A large block of unbroken text is intimidating and hard to scan. Users have to read linearly to find any specific detail, which most will not do. Important information buried in the middle of a paragraph is effectively hidden from the majority of visitors.",
    sourceUrl: "https://www.nngroup.com/articles/how-users-read-on-the-web/",
    sourceLabel: "NN/G: How users read on the web",
  },
  {
    id: "copy-003",
    category: "content-copy",
    difficulty: "medium",
    title: "Link text",
    prompt: "Which links are more useful?",
    content: {
      type: "visual",
      left: { componentId: "CopyGenericLinks" },
      right: { componentId: "CopyDescriptiveLinks" },
    },
    correctSide: "right",
    explanationCorrect:
      "Descriptive link text like 'pricing page' and 'API reference' tells users where the link goes before they click. This is essential for screen reader users who navigate by tabbing through links, but it helps everyone by setting clear expectations about the destination.",
    explanationWrong:
      "Generic 'click here' links carry no meaning when taken out of context. Screen readers often present a list of all links on a page, and a list of 'here, here, here' is useless. Even for sighted users, vague links force them to read surrounding text to understand where each link leads.",
    sourceUrl:
      "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html",
    sourceLabel: "WCAG 2.1: Link Purpose in Context (2.4.4)",
  },
  {
    id: "copy-004",
    category: "content-copy",
    difficulty: "medium",
    title: "Onboarding copy",
    prompt: "Which onboarding is clearer?",
    content: {
      type: "visual",
      left: { componentId: "CopyJargonOnboarding" },
      right: { componentId: "CopyPlainOnboarding" },
    },
    correctSide: "right",
    explanationCorrect:
      "Plain language in onboarding makes complex configuration accessible to users of all skill levels. 'Where should users go after login?' communicates the same concept as 'OAuth2 callback URI' but requires no prior knowledge. Smart defaults and plain labels reduce setup errors.",
    explanationWrong:
      "Jargon-heavy onboarding screens create a barrier for non-expert users and slow down even experienced developers who have to recall specific terminology. Terms like 'PKCE code challenge method' are precise but unhelpful as a first introduction to a configuration screen.",
    sourceUrl: "https://www.gov.uk/guidance/content-design/writing-for-gov-uk",
    sourceLabel: "GOV.UK: Content design and plain language",
  },
];
