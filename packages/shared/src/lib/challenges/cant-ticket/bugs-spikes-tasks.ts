import type { BaseChallenge } from "../../game/types";

export const bugsSpikesTasksChallenges: BaseChallenge[] = [
  {
    id: "bst-001",
    category: "bugs-spikes-tasks",
    difficulty: "easy",
    title: "Bug ticket essentials",
    prompt: "Which bug report can someone other than the reporter reproduce?",
    content: {
      type: "ticket",
      left: {
        key: "RPT-91",
        type: "bug",
        title: "CSV export is broken",
        context: "Acme noticed something off in their export.",
        acceptanceCriteria: [
          { kind: "bullet", text: "CSV export works" },
          { kind: "bullet", text: "File looks normal" },
          { kind: "bullet", text: "Acme is happy" },
        ],
        footer: "Reported in Slack",
      },
      right: {
        key: "RPT-91",
        type: "bug",
        title: "CSV export drops the trailing comma in numeric columns",
        context:
          "Reproduced on staging with the Q1 sales report (12 rows, 3 numeric columns). Open the export in any tool that respects RFC 4180 and the last numeric value is concatenated with the next row.",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Reproduce on staging using the Q1 sales report",
          },
          {
            kind: "bullet",
            text: "Numeric columns export with their full value",
          },
          {
            kind: "bullet",
            text: "Existing CSV-export tests still pass; add a row-boundary test",
          },
        ],
        footer: "Reported by Acme on 2026-04-22, ticket SUP-1208",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The right ticket gives reproduction steps, the surface the bug touches, and a test the engineer can write to prove the fix. Anyone on the team can pick it up cold.",
    explanationWrong:
      "'Sometimes the file looks weird' is a starting point for a conversation, not a bug ticket. Without reproduction, scope, or expected behavior, the engineer is doing the bug investigation from scratch every time.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Issue Types",
  },
  {
    id: "bst-002",
    category: "bugs-spikes-tasks",
    difficulty: "easy",
    title: "Spike vs story",
    prompt:
      "Which is the right shape when the team can't yet estimate the work?",
    content: {
      type: "ticket",
      left: {
        key: "PAY-077",
        type: "story",
        points: 13,
        title: "Customers can pay with SEPA direct debit",
        asA: "EU customer",
        iWant: "to set up SEPA as my payment method",
        soThat: "I can avoid card processing fees",
        context:
          "We don't know yet which provider fits, but we want the flow shipped this sprint.",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Pick the best provider for our needs",
          },
          {
            kind: "bullet",
            text: "Customer can enter bank details and sign the mandate",
          },
          {
            kind: "bullet",
            text: "Direct debit appears on receipts",
          },
        ],
      },
      right: {
        key: "PAY-077",
        type: "spike",
        points: 3,
        title: "Investigate which payment providers fit our SEPA constraints",
        context:
          "Time-boxed to one sprint. The work of integrating becomes its own Story after this spike lands.",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Three candidate providers compared on cost, latency, and EU coverage",
          },
          {
            kind: "bullet",
            text: "A recommendation written up in the team space",
          },
          {
            kind: "bullet",
            text: "Open questions for the next refinement listed",
          },
        ],
        footer: "Timebox: 5 days. Outcome: a written recommendation, not code.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "When the team cannot estimate because the implementation approach is genuinely unclear, a timeboxed spike is the right move. Its acceptance criteria are answers to questions, not shipped behavior. The integration story comes after, with real numbers.",
    explanationWrong:
      "A 13-point story with 'pick the best provider' inside it is a bet, not a plan. The team will burn the sprint discovering tradeoffs the spike could have surfaced in three days. 13 is a signal: split it or spike it.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/five-simple-but-powerful-ways-to-split-user-stories",
    sourceLabel: "Mike Cohn: SPIDR",
  },
  {
    id: "bst-003",
    category: "bugs-spikes-tasks",
    difficulty: "easy",
    title: "Task or Story",
    prompt: "Which item is correctly classed as a Task?",
    content: {
      type: "ticket",
      left: {
        key: "DASH-92",
        type: "task",
        points: 5,
        title: "Sales reps see deals sorted by close date",
        subtasks: [
          "Add a sort dropdown to the dashboard header",
          "Default the dashboard sort to upcoming close date",
          "Update copy on the empty state",
          "Add analytics for the new sort option",
        ],
        footer: "Visible on the sales dashboard for all reps.",
      },
      right: {
        key: "PLAT-44",
        type: "task",
        points: 3,
        title: "Upgrade Next.js from 15 to 16",
        subtasks: [
          "Update package.json to next@16",
          "Run codemod for the new caching defaults",
          "Fix any breaking changes in route handlers",
          "Confirm CI is green",
        ],
        footer: "No user-facing change. Quarterly framework upkeep.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Framework upgrade is plumbing. Nobody on the outside notices, the team tracks it because it has to happen, and Task is the right shape: real work, no user, no story framing.",
    explanationWrong:
      "The subtasks read like plumbing, but the footer gives it away: every sales rep on the dashboard sees this change. That makes it a Story with acceptance criteria, not a Task. Filing it as a Task hides user-visible work from the demo.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Epics, Stories, and Initiatives",
  },
  {
    id: "bst-004",
    category: "bugs-spikes-tasks",
    difficulty: "medium",
    title: "Spike outcome shape",
    prompt: "Which spike's acceptance criteria let the team know it's done?",
    content: {
      type: "ticket",
      left: {
        key: "AI-22",
        type: "spike",
        points: 5,
        title: "Look into LLMs for support replies",
        description: "See what's possible. Build a prototype if there is time.",
        acceptanceCriteria: [
          { kind: "bullet", text: "Explore LLM options" },
          { kind: "bullet", text: "Get a feel for what's doable" },
          { kind: "bullet", text: "Share findings with the team" },
        ],
      },
      right: {
        key: "AI-22",
        type: "spike",
        points: 3,
        title: "Decide whether to use LLMs for first-draft support replies",
        context:
          "Support handles ~120 tickets a day. Most are repetitive. The question is whether an LLM-assisted draft would save time without leaking PII.",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "A short doc compares two model options on cost, latency, and PII handling",
          },
          {
            kind: "bullet",
            text: "A 50-ticket sample shows whether drafts would save support time",
          },
          {
            kind: "bullet",
            text: "A go/no-go recommendation with named blockers",
          },
        ],
        footer: "Timebox: 4 days. No production code.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "A spike is research. Its acceptance criteria are answers to specific questions and a recommendation. The timebox and 'no production code' line keep the work honest.",
    explanationWrong:
      "'See what's possible' is a curiosity, not a spike. With no question to answer and no time bound, it expands to fill the sprint and produces a half-prototype that nobody owns.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/five-simple-but-powerful-ways-to-split-user-stories",
    sourceLabel: "Mike Cohn: SPIDR",
  },
  {
    id: "bst-005",
    category: "bugs-spikes-tasks",
    difficulty: "medium",
    title: "Bug or Story",
    prompt: "Which is correctly filed as a bug?",
    content: {
      type: "ticket",
      left: {
        key: "FEED-71",
        type: "bug",
        points: 5,
        title:
          "Users want infinite scroll on the activity feed instead of pagination",
        context:
          "Several users have asked for infinite scroll in support tickets and the #feedback channel. The current pagination feels dated.",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Activity feed loads more items as the user scrolls",
          },
          {
            kind: "bullet",
            text: "The Next/Prev pagination controls are removed",
          },
          {
            kind: "bullet",
            text: "Loading state is shown at the bottom of the feed",
          },
        ],
      },
      right: {
        key: "FEED-71",
        type: "bug",
        points: 2,
        title:
          "Activity feed loses scroll position when a new item is prepended",
        context:
          "On Chrome and Safari, when a new activity arrives via WebSocket, the feed jumps to the top instead of preserving the user's scroll position.",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Reproduce by sending a WS event while scrolled to position 1200",
          },
          {
            kind: "bullet",
            text: "Scroll position is preserved when new items prepend",
          },
          {
            kind: "bullet",
            text: "Existing prepend tests pass; add a regression for the WS case",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "A bug is something working incorrectly against an existing expectation. Scroll-position drift on a feed update is a regression with a clear before/after. The acceptance criteria are reproducible.",
    explanationWrong:
      "'Users want X instead of Y' is a feature request, not a bug. Filing it as a bug ducks the prioritization conversation and lets it skip the line in front of actual regressions.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Issue Types",
  },
];
