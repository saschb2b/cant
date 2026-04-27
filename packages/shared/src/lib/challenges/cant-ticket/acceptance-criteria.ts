import type { BaseChallenge } from "../../game/types";

export const acceptanceCriteriaChallenges: BaseChallenge[] = [
  {
    id: "ac-001",
    category: "acceptance-criteria",
    difficulty: "easy",
    title: "Observable behavior",
    prompt:
      "Which acceptance criterion does QA verify without asking the engineer?",
    content: {
      type: "ticket",
      left: {
        key: "INV-12",
        type: "story",
        points: 3,
        title: "Inventory page shows out-of-stock items",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Out-of-stock handling is implemented properly",
          },
          { kind: "bullet", text: "The UX is good" },
        ],
      },
      right: {
        key: "INV-12",
        type: "story",
        points: 3,
        title: "Inventory page shows out-of-stock items",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "an item with stock = 0",
            when: "it appears in the inventory list",
            then: "it shows an 'Out of stock' badge and the row is dimmed",
          },
          {
            kind: "gwt",
            given: "an item with stock > 0",
            when: "it appears in the inventory list",
            then: "the row renders normally with no badge",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Each criterion is observable. A reader who has not seen the code can open the page and confirm. The before/after is binary, which means QA, design, and the PM can all sign off independently.",
    explanationWrong:
      "'Implemented properly' and 'the UX is good' are not acceptance criteria, they are reassurance. Two engineers will reasonably disagree on whether the bar is met, and the disagreement will surface in review.",
    sourceUrl: "https://dannorth.net/blog/introducing-bdd/",
    sourceLabel: "Dan North: Introducing BDD",
  },
  {
    id: "ac-002",
    category: "acceptance-criteria",
    difficulty: "easy",
    title: "AC format for behavior",
    prompt: "Which AC list reads cleanly handed to QA cold?",
    content: {
      type: "ticket",
      left: {
        key: "AUTH-77",
        type: "story",
        points: 3,
        title: "Users with expired sessions are redirected to sign-in",
        acceptanceCriteria: [
          { kind: "bullet", text: "Check the session in the middleware" },
          {
            kind: "bullet",
            text: "If invalid, send a 302 to /sign-in",
          },
          { kind: "bullet", text: "Preserve the original URL in callbackUrl" },
        ],
      },
      right: {
        key: "AUTH-77",
        type: "story",
        points: 3,
        title: "Users with expired sessions are redirected to sign-in",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a user whose session has expired",
            when: "they navigate to a protected route",
            then: "they land on /sign-in with the original URL in callbackUrl",
          },
          {
            kind: "gwt",
            given: "a user with a valid session",
            when: "they navigate to a protected route",
            then: "they reach the route without redirect",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Given/When/Then forces the writer to name the precondition, the action, and the outcome. There is no ambiguity for QA, no implementation language, and the negative case (valid session) is named explicitly.",
    explanationWrong:
      "The left list is implementation steps. They might be correct, but they describe how the engineer will write the code, not what behavior the user will observe. QA cannot test 'check the session in the middleware'.",
    sourceUrl: "https://dannorth.net/blog/introducing-bdd/",
    sourceLabel: "Dan North: Introducing BDD",
  },
  {
    id: "ac-003",
    category: "acceptance-criteria",
    difficulty: "easy",
    title: "Failure-case coverage",
    prompt: "Which AC list covers the failure cases on purpose?",
    content: {
      type: "ticket",
      left: {
        key: "PAY-21",
        type: "story",
        points: 5,
        title: "Customer pays with a saved card at checkout",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a customer with a saved card",
            when: "they click Buy",
            then: "the order is placed and they see the confirmation page",
          },
        ],
      },
      right: {
        key: "PAY-21",
        type: "story",
        points: 5,
        title: "Customer pays with a saved card at checkout",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a customer with a saved card",
            when: "they click Buy",
            then: "the order is placed and they see the confirmation page",
          },
          {
            kind: "gwt",
            given: "a customer whose card has expired",
            when: "they click Buy",
            then: "they are prompted to update payment without losing the cart",
          },
          {
            kind: "gwt",
            given: "the payment provider is unavailable",
            when: "the customer clicks Buy",
            then: "they see a retry banner and the cart is preserved",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Real systems fail. Naming the expired-card and provider-down paths in advance gives engineering a real spec and gives QA a real test plan. The cart preservation rule comes out of the conversation, not the bug report.",
    explanationWrong:
      "Happy-path-only acceptance criteria leave the failure modes to be discovered. They will be discovered by users, then filed as bugs, then patched, then re-broken on the next change.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
  {
    id: "ac-004",
    category: "acceptance-criteria",
    difficulty: "medium",
    title: "Implementation leak",
    prompt: "Which AC list belongs to a Story instead of a tech-design doc?",
    content: {
      type: "ticket",
      left: {
        key: "FEED-44",
        type: "story",
        points: 3,
        title: "Activity feed prepends new items in real time",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Subscribe to the WebSocket /v1/feed channel",
          },
          { kind: "bullet", text: "Use a ring buffer of 200 items in memory" },
          { kind: "bullet", text: "Reuse the existing prepend animation" },
        ],
      },
      right: {
        key: "FEED-44",
        type: "story",
        points: 3,
        title: "Activity feed prepends new items in real time",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a feed open in the browser",
            when: "a new activity is published by another user",
            then: "the new item appears at the top within 2 seconds without a manual refresh",
          },
          {
            kind: "gwt",
            given: "a feed scrolled below the top",
            when: "a new item arrives",
            then: "the user's scroll position is preserved",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Acceptance criteria describe what the user observes. Implementation choices (WebSocket channel, ring buffer, animation reuse) are subtask material. Keep them separate so the story can be reviewed by people who do not know the codebase.",
    explanationWrong:
      "A bullet list of implementation hints is a tech-design doc, not acceptance criteria. The team will probably do those things, but the story is now unverifiable by QA and the implementation is locked in before refinement.",
    sourceUrl: "https://www.agilealliance.org/glossary/user-story-template/",
    sourceLabel: "Agile Alliance: User Story Template",
  },
  {
    id: "ac-005",
    category: "acceptance-criteria",
    difficulty: "medium",
    title: "Out-of-scope clause",
    prompt: "Which story leaves the team aligned on what is not shipping?",
    content: {
      type: "ticket",
      left: {
        key: "EX-66",
        type: "story",
        points: 5,
        title: "Customer exports their order history",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a signed-in customer",
            when: "they click Export on /orders",
            then: "they receive a CSV of their order history",
          },
        ],
      },
      right: {
        key: "EX-66",
        type: "story",
        points: 5,
        title: "Customer exports their order history",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a signed-in customer",
            when: "they click Export on /orders",
            then: "they receive a CSV of their order history",
          },
        ],
        outOfScope:
          "PDF export, scheduled exports, and emailed exports (separate stories).",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Naming what is out is as important as naming what is in. During refinement someone will ask 'what about PDFs?' and the story already answers. The team does not get pulled into scope creep mid-sprint.",
    explanationWrong:
      "Without an out-of-scope clause, every reviewer assumes a different boundary. PDF and email exports will be raised in standup, the work will balloon, and the story will not finish in the sprint.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/user-stories",
    sourceLabel: "Atlassian Team Playbook: User Stories",
  },
  {
    id: "ac-006",
    category: "acceptance-criteria",
    difficulty: "hard",
    title: "Bullets vs Given/When/Then",
    prompt:
      "Which AC format works when the rule is a simple list of constraints?",
    content: {
      type: "ticket",
      left: {
        key: "PRO-12",
        type: "story",
        points: 2,
        title: "User profile page shows verified-email indicator",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a user with a verified email",
            when: "they view their profile",
            then: "a green 'Verified' badge is shown next to the email",
          },
          {
            kind: "gwt",
            given: "a user with an unverified email",
            when: "they view their profile",
            then: "a 'Not verified' link is shown next to the email",
          },
          {
            kind: "gwt",
            given: "a user with no email",
            when: "they view their profile",
            then: "no badge is shown",
          },
        ],
      },
      right: {
        key: "PRO-12",
        type: "story",
        points: 2,
        title: "User profile page shows verified-email indicator",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Verified email shows a green 'Verified' badge",
          },
          {
            kind: "bullet",
            text: "Unverified email shows a 'Not verified' link to the verification flow",
          },
          { kind: "bullet", text: "Missing email shows no badge" },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Format matters less than the property. For a simple list of constraints, three bullets are cleaner than three identical Given/When/Then blocks. Use Given/When/Then when state and timing matter; use bullets when they don't.",
    explanationWrong:
      "Given/When/Then is a forcing function for unambiguous state, action, and outcome. For 'three visual variants on a static page' it adds line count without information. The bullets read faster.",
    sourceUrl: "https://dannorth.net/blog/introducing-bdd/",
    sourceLabel: "Dan North: Introducing BDD",
  },
  {
    id: "ac-007",
    category: "acceptance-criteria",
    difficulty: "medium",
    title: "Quantitative thresholds",
    prompt: "Which AC list keeps performance honest after the next change?",
    content: {
      type: "ticket",
      left: {
        key: "PERF-31",
        type: "story",
        points: 3,
        title: "Search returns results quickly on cellular",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a user on a cellular connection",
            when: "they search for a query",
            then: "the first results feel fast and there is no long spinner",
          },
          {
            kind: "bullet",
            text: "The perf suite covers the search path",
          },
        ],
      },
      right: {
        key: "PERF-31",
        type: "story",
        points: 3,
        title: "Search returns results quickly on cellular",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a 4G connection (Chrome devtools 'Slow 4G')",
            when: "a user searches for a top-100 query",
            then: "the first result row is visible within 400ms (p75) and 800ms (p99)",
          },
          {
            kind: "bullet",
            text: "A regression test in the perf suite catches drops below those thresholds",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Numbers anchor performance work. The defined connection profile, percentile thresholds, and regression test mean future changes either preserve the bar or fail visibly. Without those, performance work decays back to where it started within two sprints.",
    explanationWrong:
      "'Feels fast' is unverifiable and unprotectable. The next refactor will land, the response time will drift, and nobody will notice until users start complaining again.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
];
