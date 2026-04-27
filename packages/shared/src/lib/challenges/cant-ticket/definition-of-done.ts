import type { BaseChallenge } from "../../game/types";

export const definitionOfDoneChallenges: BaseChallenge[] = [
  {
    id: "dod-001",
    category: "definition-of-done",
    difficulty: "easy",
    title: "Closing the loop on a story",
    prompt: "Which closing comment shows the story actually shipped?",
    content: {
      type: "ticket",
      left: {
        key: "AUTH-482",
        type: "story",
        status: "done",
        points: 3,
        title: "Users stay signed in across tab reloads",
        footer: "Closed by author. Code merged.",
      },
      right: {
        key: "AUTH-482",
        type: "story",
        status: "done",
        points: 3,
        title: "Users stay signed in across tab reloads",
        footer:
          "Verified by Priya on staging across Chrome and Safari. Merged to main, deployed to prod 2026-04-23. Sentry session-drop rate: 12% → 0.6% over 24h.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Done means verified by someone other than the implementer, deployed, and observable. The closing comment names the verifier, the environments, the deploy, and a real metric the work moved.",
    explanationWrong:
      "Author-self-closes plus 'code merged' is the minimum bar that lets work skip QA, deploy verification, and the metric check. Two of those three will go wrong if nobody checks them.",
    sourceUrl: "https://www.scrum.org/resources/what-definition-done",
    sourceLabel: "Scrum.org: Definition of Done",
  },
  {
    id: "dod-002",
    category: "definition-of-done",
    difficulty: "easy",
    title: "Test coverage on close",
    prompt: "Which story leaves the next change cheaper?",
    content: {
      type: "ticket",
      left: {
        key: "FEED-22",
        type: "story",
        status: "done",
        points: 3,
        title: "Activity feed prepends new items in real time",
        footer: "Tests: existing snapshot tests still pass. Closed.",
      },
      right: {
        key: "FEED-22",
        type: "story",
        status: "done",
        points: 3,
        title: "Activity feed prepends new items in real time",
        footer:
          "Tests: integration test for WS prepend + scroll-position regression test. Existing snapshot tests still pass.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Tests at the appropriate level for what shipped. The next person who touches the prepend logic will know if they broke the scroll-position behavior, which was the actual user-facing concern.",
    explanationWrong:
      "Snapshot tests passing only means the rendered HTML did not change. They do not exercise the WebSocket path or the scroll-position rule the story committed to. The next refactor will silently regress.",
    sourceUrl: "https://www.scrum.org/resources/what-definition-done",
    sourceLabel: "Scrum.org: Definition of Done",
  },
  {
    id: "dod-003",
    category: "definition-of-done",
    difficulty: "easy",
    title: "From merge to live",
    prompt: "Which closing note tells the team the work is actually live?",
    content: {
      type: "ticket",
      left: {
        key: "BIL-44",
        type: "story",
        status: "done",
        points: 5,
        title: "Customer downloads invoice as PDF",
        footer: "Merged.",
      },
      right: {
        key: "BIL-44",
        type: "story",
        status: "done",
        points: 5,
        title: "Customer downloads invoice as PDF",
        footer:
          "Deployed to prod 2026-04-22. Dashboard /metrics/billing shows 142 PDF downloads in the first 24 hours.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "'Merged' is a halfway point. Done means deployed to the target environment and observable in metrics. The dashboard line confirms the feature is reaching users and the path the change took through the system actually works.",
    explanationWrong:
      "Closing on merge alone hides the deploy gap. If the change sat in a branch waiting on a release window, or rolled out only to a staging tier, nobody on the board can tell. Production reality and the board diverge silently.",
    sourceUrl: "https://www.scrum.org/resources/what-definition-done",
    sourceLabel: "Scrum.org: Definition of Done",
  },
  {
    id: "dod-004",
    category: "definition-of-done",
    difficulty: "medium",
    title: "Docs as part of done",
    prompt: "Which DoD note kept the rest of the org in sync?",
    content: {
      type: "ticket",
      left: {
        key: "API-12",
        type: "story",
        status: "done",
        points: 5,
        title: "API supports filtering by created-after timestamp",
        footer:
          "Shipped. Will write up the docs change later this sprint or next.",
      },
      right: {
        key: "API-12",
        type: "story",
        status: "done",
        points: 5,
        title: "API supports filtering by created-after timestamp",
        footer:
          "Shipped, deployed, OpenAPI spec updated, partner-portal docs published. SDK changelog entry added.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Done includes the documentation that consumers depend on. For an API change, the OpenAPI spec, the partner portal, and the SDK changelog are part of the contract. Without them, the work landed but partners still cannot use it.",
    explanationWrong:
      "'Will write up the docs later' is a debt that grows. The next change will compound it; the team that depends on the API will keep filing 'how do I use this?' tickets; eventually someone has to spend a sprint catching docs up.",
    sourceUrl: "https://www.scrum.org/resources/what-definition-done",
    sourceLabel: "Scrum.org: Definition of Done",
  },
  {
    id: "dod-005",
    category: "definition-of-done",
    difficulty: "medium",
    title: "Closing after mid-sprint scope change",
    prompt: "Which closing note tells the next reader what actually shipped?",
    content: {
      type: "ticket",
      left: {
        key: "RPT-31",
        type: "story",
        status: "done",
        points: 5,
        title: "Managers export team reports as CSV",
        footer: "Done.",
      },
      right: {
        key: "RPT-31",
        type: "story",
        status: "done",
        points: 5,
        title: "Managers export team reports as CSV",
        footer:
          "Shipped CSV export for the throughput report. PDF export descoped during the sprint, captured as RPT-32. Date-range picker also descoped, captured as RPT-33. Verified by Lin in staging.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Stories drift. The right closing comment names what shipped, what was descoped, and where the descoped work lives now. Anyone reading the ticket later can reconstruct the decision without asking the team.",
    explanationWrong:
      "'Done' alone tells you nothing when scope changed mid-sprint. The next sprint planning will rediscover the descoped pieces from scratch, possibly twice.",
    sourceUrl: "https://www.scrum.org/resources/what-definition-done",
    sourceLabel: "Scrum.org: Definition of Done",
  },
];
