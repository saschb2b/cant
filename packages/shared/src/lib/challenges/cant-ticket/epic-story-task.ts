import type { BaseChallenge } from "../../game/types";

export const epicStoryTaskChallenges: BaseChallenge[] = [
  {
    id: "est-001",
    category: "epic-story-task",
    difficulty: "easy",
    title: "Children of an Epic",
    prompt:
      "Which Epic breakdown lets product roadmap directly from the board?",
    content: {
      type: "ticket",
      left: {
        key: "PAY-100",
        type: "epic",
        title: "Customers can pay with SEPA direct debit",
        children: [
          { type: "task", title: "Migrate paymentService to v3 client" },
          { type: "task", title: "Add SEPA_MANDATE table" },
          { type: "task", title: "Update useCheckout hook" },
          { type: "task", title: "Wire up webhook handler" },
          { type: "task", title: "Backfill existing customers" },
        ],
      },
      right: {
        key: "PAY-100",
        type: "epic",
        title: "Customers can pay with SEPA direct debit",
        children: [
          { type: "story", title: "Customer enters bank details on checkout" },
          { type: "story", title: "Customer signs the mandate inline" },
          { type: "story", title: "Customer sees direct debit on receipts" },
          {
            type: "story",
            title:
              "Failed debits notify the customer and pause the subscription",
          },
          { type: "task", title: "Backfill existing customers" },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Each child of the Epic answers what a customer will be able to do that they couldn't before. Product can sequence them, design can spot friction, and the operational backfill is correctly tagged as a Task because no human benefits from it directly.",
    explanationWrong:
      "Five Tasks under an Epic signal plumbing to everyone reading the board. The Epic's reason for existing evaporates between the description and the implementation list, and nobody outside the original author can tell what 'done' looks like for the Epic as a whole.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Epics, Stories, and Initiatives",
  },
  {
    id: "est-002",
    category: "epic-story-task",
    difficulty: "easy",
    title: "Epic context over time",
    prompt: "Which Epic still makes sense after the original team rotates off?",
    content: {
      type: "ticket",
      left: {
        key: "AUTH-100",
        type: "epic",
        title: "Auth refactor",
        context: "Came out of last week's planning. Mark has the details.",
        description: "See Figma. Lead: Mark.",
        outOfScope: "TBD, ask Mark.",
      },
      right: {
        key: "AUTH-100",
        type: "epic",
        title: "Users stay signed in across tab reloads",
        context:
          "Support has flagged dropped sessions as the top complaint this month. Users open the app in a second tab and lose their work.",
        description:
          "Reloading or opening a new tab keeps the session, unless the session has actually expired.",
        outOfScope:
          '"Remember me" persistence across browser restarts (separate Epic).',
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The Epic states the outcome, the reason it matters, and what is explicitly out. Six months from now, when nobody on the team remembers the original support complaint, the Epic still answers 'why did we touch the auth layer?' for itself.",
    explanationWrong:
      "A one-line description and a Figma link puts the why entirely in the original author's head. New joiners cannot tell what is being shipped, and there is no shared definition of when the Epic is done.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Epics, Stories, and Initiatives",
  },
  {
    id: "est-003",
    category: "epic-story-task",
    difficulty: "easy",
    title: "Framework upgrade ticket",
    prompt:
      "Both describe the same upgrade. Which one will a new joiner understand without asking?",
    content: {
      type: "ticket",
      left: {
        key: "PLAT-44",
        type: "task",
        points: 3,
        title: "Upgrade Next.js from 15 to 16",
        subtasks: [
          "Update package.json to next@16",
          "Run codemod for the new caching defaults",
          "Fix breaking changes in route handlers",
          "Confirm CI is green",
        ],
      },
      right: {
        key: "PLAT-44",
        type: "task",
        points: 3,
        title: "Upgrade Next.js from 15 to 16",
        description:
          "Streaming preview in EDIT-218 only works on Next 16. This Task moves with that Story.",
        subtasks: [
          "Update package.json to next@16",
          "Run codemod for the new caching defaults",
          "Fix breaking changes in route handlers",
          "Confirm CI is green",
        ],
        footer: "Unblocks EDIT-218: Editors get streaming-render preview",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Plumbing is correctly shaped as a Task, and the link to EDIT-218 anchors it to the user value it unblocks. When that Story moves on the board, this Task moves with it. When the team sequences the sprint, they can see which user-facing work sits behind the upgrade.",
    explanationWrong:
      "The subtasks are honest and the work is real, but the Task is an island. Nobody reading the board can answer 'why now?' without asking the author. If the Story it was meant to unblock slips, this Task sits in a corner with no signal.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Epics, Stories, and Initiatives",
  },
  {
    id: "est-004",
    category: "epic-story-task",
    difficulty: "easy",
    title: "Subtask scope",
    prompt: "Which Subtask sits at the right level inside its parent Story?",
    content: {
      type: "ticket",
      left: {
        key: "AUTH-482",
        type: "story",
        points: 3,
        title: "Users stay signed in across tab reloads",
        subtasks: [
          "Adopt new cookie helper from DEV-1234",
          "Remove the legacy parseToken path",
          "Add integration tests for reload and new-tab flows",
          "Build the entire authentication feature for SEPA payments",
        ],
      },
      right: {
        key: "AUTH-482",
        type: "story",
        points: 3,
        title: "Users stay signed in across tab reloads",
        subtasks: [
          "Adopt new cookie helper from DEV-1234",
          "Remove the legacy parseToken path",
          "Add integration tests for reload and new-tab flows",
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Each Subtask is engineering detail inside the parent Story, scoped narrowly enough that it doesn't need its own acceptance criteria. The parent Story's Connextra and AC speak for the whole bundle.",
    explanationWrong:
      "Building an entire authentication feature for an unrelated payment Epic is not a Subtask, it is its own Story under a different Epic. Subtasks should be implementation steps inside one work item, not separate features smuggled in.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Epics, Stories, and Initiatives",
  },
  {
    id: "est-005",
    category: "epic-story-task",
    difficulty: "medium",
    title: "Epic children granularity",
    prompt: "Which Epic shape lets QA verify what was shipped?",
    content: {
      type: "ticket",
      left: {
        key: "ADM-12",
        type: "epic",
        title: "Admin tooling",
        children: [
          { type: "subtask", title: "Build CRUD endpoints for teams" },
          { type: "subtask", title: "Wire up React table on /admin/teams" },
          { type: "subtask", title: "Add role guard to admin routes" },
          {
            type: "subtask",
            title: "Migrate existing team rows to new schema",
          },
        ],
      },
      right: {
        key: "ADM-12",
        type: "epic",
        title: "Admins can self-serve team membership",
        children: [
          { type: "story", title: "Admin invites a new member by email" },
          { type: "story", title: "Admin removes a member from a team" },
          { type: "story", title: "Admin transfers team ownership" },
          { type: "task", title: "Migrate existing team rows to new schema" },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Each Story names an admin action, which gives QA a thing to verify and product a thing to demo. The schema migration stays a Task because no admin sees it. Subtasks would live inside each Story, not directly under the Epic.",
    explanationWrong:
      "Subtasks hung directly off an Epic skip the Story layer entirely. There is no shippable, demoable unit between 'Epic' and 'engineering detail', so progress can only be reported as a percentage of subtasks, not as features delivered.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Epics, Stories, and Initiatives",
  },
  {
    id: "est-006",
    category: "epic-story-task",
    difficulty: "medium",
    title: "Reading an Epic's children",
    prompt:
      "Which Epic's children tell you what users will actually be able to do?",
    content: {
      type: "ticket",
      left: {
        key: "SEARCH-44",
        type: "epic",
        title: "Search v2",
        children: [
          { type: "task", title: "Replace Postgres FTS with OpenSearch" },
          { type: "task", title: "Reindex articles nightly" },
          { type: "task", title: "Add /api/search/v2 endpoint" },
          { type: "task", title: "Migrate /search page to call v2" },
        ],
      },
      right: {
        key: "SEARCH-44",
        type: "epic",
        title: "Readers find articles by topic and date range",
        children: [
          { type: "story", title: "Reader filters search results by topic" },
          { type: "story", title: "Reader narrows results to a date range" },
          {
            type: "story",
            title: "Reader sees why a result matched (highlighted snippet)",
          },
          { type: "task", title: "Replace Postgres FTS with OpenSearch" },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Reading just the children, you can answer 'readers will be able to filter by topic, narrow by date, and see match snippets.' The infrastructure swap stays as a Task because readers don't see it. The Story layer is what makes the Epic readable to people who weren't in the planning meeting.",
    explanationWrong:
      "All-Task children describe the implementation, not the user-visible change. Without a Story layer, the Epic's name 'Search v2' has to carry the meaning, and 'v2' tells you nothing about what readers actually gain.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Epics, Stories, and Initiatives",
  },
];
