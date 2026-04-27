import type { BaseChallenge } from "../../game/types";

export const storyVsBraindumpChallenges: BaseChallenge[] = [
  {
    id: "svb-001",
    category: "story-vs-braindump",
    difficulty: "easy",
    title: "Title shape",
    prompt: "Which title reads as a story rather than a note to self?",
    content: {
      type: "ticket",
      left: {
        key: "AUTH-482",
        type: "story",
        points: 3,
        title: "Refactor useAuthController to support new session structure",
      },
      right: {
        key: "AUTH-482",
        type: "story",
        points: 3,
        title: "Users stay signed in across tab reloads",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The title names a user-visible outcome a designer, PM, or new engineer can reason about cold. Same work underneath, but the framing answers what changes for whoever is on the other end.",
    explanationWrong:
      "A title that names the implementation tells you what the engineer plans to do, not what users will get. A new joiner reads it and learns nothing about the product. Save implementation language for the subtasks or the PR description.",
    sourceUrl: "https://www.agilealliance.org/glossary/user-story-template/",
    sourceLabel: "Agile Alliance: User Story Template",
  },
  {
    id: "svb-002",
    category: "story-vs-braindump",
    difficulty: "easy",
    title: "Shape of acceptance criteria",
    prompt:
      "Which acceptance criteria list can QA verify without reading the code?",
    content: {
      type: "ticket",
      left: {
        key: "AUTH-482",
        type: "story",
        points: 3,
        title: "Users stay signed in across tab reloads",
        acceptanceCriteria: [
          { kind: "bullet", text: "Sessions survive reload" },
          {
            kind: "implementation-note",
            text: "Refactor getSession() to use the new cookie helper",
          },
          {
            kind: "implementation-note",
            text: "Delete the old legacyAuth module",
          },
        ],
      },
      right: {
        key: "AUTH-482",
        type: "story",
        points: 3,
        title: "Users stay signed in across tab reloads",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a signed-in user",
            when: "they reload the page",
            then: "they remain signed in",
          },
          {
            kind: "gwt",
            given: "a signed-in user",
            when: "they open the app in a new tab",
            then: "they are signed in in that tab",
          },
          {
            kind: "gwt",
            given: "a user whose session has expired",
            when: "they reload",
            then: "they see the sign-in screen",
          },
        ],
        subtasks: [
          "Adopt the new cookie helper from DEV-1234",
          "Delete the legacyAuth module",
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Acceptance criteria describe outcomes. Implementation steps live in subtasks where they belong. QA can verify each AC by clicking, without asking the engineer what the cookie helper does.",
    explanationWrong:
      "Refactoring a helper is not an acceptance criterion, it is engineering work. Mixed lists make QA's job impossible: half the items are not testable from the outside, half look like work that already happened.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
  {
    id: "svb-003",
    category: "story-vs-braindump",
    difficulty: "easy",
    title: "Where the why lives",
    prompt: "Which story tells you why this work is happening at all?",
    content: {
      type: "ticket",
      left: {
        key: "RPT-91",
        type: "story",
        points: 5,
        title: "Improve report exports",
        description:
          "Needs updates in exporter.ts and reportTable. @priya knows the context. See thread in #squad-reports from last Tuesday.",
      },
      right: {
        key: "RPT-91",
        type: "story",
        points: 5,
        title: "Analysts export filtered reports without opening them",
        asA: "analyst",
        iWant:
          "to export the report I am filtering directly from the list view",
        soThat:
          "I do not have to open every report to grab the same CSV I just configured",
        context:
          "Analysts run the same filter across 30 reports a week. Today they have to open each report to export, which costs them roughly an afternoon.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The right side names the actor, the outcome, and the cost they pay today. Six months from now, when the team has rotated, the ticket still answers 'why did we do this?' on its own.",
    explanationWrong:
      "Pointing at a Slack thread and a person's name puts the why entirely in two places that will disappear: the thread will scroll out of search, and the person will rotate off the team.",
    sourceUrl: "https://www.agilealliance.org/glossary/user-story-template/",
    sourceLabel: "Agile Alliance: User Story Template",
  },
  {
    id: "svb-004",
    category: "story-vs-braindump",
    difficulty: "easy",
    title: "Linked vs assumed",
    prompt: "Which story makes its dependencies legible?",
    content: {
      type: "ticket",
      left: {
        key: "CHK-218",
        type: "story",
        points: 3,
        title: "Customers see the new tax line on the invoice",
        asA: "customer in the EU",
        iWant: "the invoice to show the tax line as a separate row",
        soThat: "I can reconcile against my accounting software",
        context:
          "Depends on the tax service being live. Mark says it should be ready next sprint.",
        outOfScope: "Country-specific tax labels, Mark will scope those later.",
      },
      right: {
        key: "CHK-218",
        type: "story",
        points: 3,
        title: "Customers see the new tax line on the invoice",
        asA: "customer in the EU",
        iWant: "the invoice to show the tax line as a separate row",
        soThat: "I can reconcile against my accounting software",
        context:
          "Blocked by TAX-117 (tax service /v1/quote). Once that is shipped, this story unblocks.",
        outOfScope:
          "Country-specific tax labels (Mehrwertsteuer, IVA) ship in CHK-219.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The dependency is a linked ticket key, not a hallway conversation. When TAX-117 moves the planning board can see the unblock automatically and the next refinement can pull this story without hunting for context.",
    explanationWrong:
      "Mentioning a name and a service in prose is not a link. Nothing in the planning board updates when the dependency moves, and 'next sprint' has the half-life of one slipped commitment.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
  {
    id: "svb-005",
    category: "story-vs-braindump",
    difficulty: "medium",
    title: "Outcome vs mechanism",
    prompt:
      "Which description states the change in terms a non-engineer reads cleanly?",
    content: {
      type: "ticket",
      left: {
        key: "EDIT-218",
        type: "story",
        points: 3,
        title: "Editors see autosave confirmation while drafting",
        description:
          "Add a debounced effect on draftStore that calls /api/drafts/autosave every 5s. Wire the response into useToast. Watch out for the SSR hydration mismatch we hit in EDIT-201.",
        acceptanceCriteria: [
          {
            kind: "implementation-note",
            text: "draftStore has a 5s debounced autosave effect",
          },
          {
            kind: "implementation-note",
            text: "Autosave response is piped through useToast",
          },
          {
            kind: "implementation-note",
            text: "SSR hydration mismatch from EDIT-201 does not regress",
          },
        ],
      },
      right: {
        key: "EDIT-218",
        type: "story",
        points: 3,
        title: "Editors see autosave confirmation while drafting",
        asA: "editor",
        iWant: "a visible signal that my draft has saved",
        soThat:
          "I am not anxious about losing work during long writing sessions",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a draft with unsaved changes",
            when: "5 seconds pass",
            then: 'a "Saved" indicator appears',
          },
          {
            kind: "gwt",
            given: "a save failure",
            when: "the editor types",
            then: "a retry banner is shown above the editor",
          },
        ],
        subtasks: [
          "Debounce the autosave call to 5s",
          "Wire response into the existing toast helper",
          "Cover the SSR hydration edge case from EDIT-201",
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Outcome on the front, mechanism in the subtasks. Product can demo what changed, engineering still has the implementation breadcrumbs, and the SSR caveat is captured where it will be read by whoever picks up the work.",
    explanationWrong:
      "A description full of file names, hooks, and edge-case warnings is a note to self in disguise. Anyone reading cold has to pattern-match through the codebase to figure out what the user gets.",
    sourceUrl: "https://www.agilealliance.org/glossary/user-story-template/",
    sourceLabel: "Agile Alliance: User Story Template",
  },
  {
    id: "svb-006",
    category: "story-vs-braindump",
    difficulty: "medium",
    title: "The new-joiner test",
    prompt: "Which story orients someone who arrived this morning?",
    content: {
      type: "ticket",
      left: {
        key: "ONB-12",
        type: "story",
        points: 5,
        title: "Fix the onboarding bug from last quarter",
        description:
          'See the Q3 retro doc. We agreed Tomas would own this. The 8-step page in the wizard should "do what we said in the meeting."',
      },
      right: {
        key: "ONB-12",
        type: "story",
        points: 5,
        title:
          "New users finish onboarding without losing progress on a refresh",
        asA: "new user",
        iWant:
          "the wizard to remember which step I was on if my browser reloads",
        soThat:
          "I can pick up where I left off instead of restarting the 8-step flow",
        context:
          "The wizard currently stores progress only in memory. Funnel data shows ~12% of users drop off between steps 4 and 5, correlating with refresh events.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "A new joiner reads three lines and is oriented: who suffers, what changes, why it matters, and roughly the size of the problem. The funnel datum makes the priority defensible without needing to find the meeting it came from.",
    explanationWrong:
      "Cross-referencing a retro doc, a name, and a meeting outcome makes the ticket only readable by people who were there. Six months later, none of those references will resolve.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/user-stories",
    sourceLabel: "Atlassian Team Playbook: User Stories",
  },
  {
    id: "svb-007",
    category: "story-vs-braindump",
    difficulty: "medium",
    title: "Story or refactor",
    prompt: "Which ticket reads as a user-facing story?",
    content: {
      type: "ticket",
      left: {
        key: "PLAT-201",
        type: "story",
        points: 5,
        title: "Switch from useEffect to useSyncExternalStore in CartContext",
        description:
          "The current implementation re-renders on every browser tab focus. New API gives us tearing-free reads.",
        acceptanceCriteria: [
          {
            kind: "implementation-note",
            text: "CartContext reads go through useSyncExternalStore",
          },
          {
            kind: "implementation-note",
            text: "useEffect-based subscription is removed",
          },
          {
            kind: "implementation-note",
            text: "No tearing on tab focus events",
          },
        ],
      },
      right: {
        key: "CART-87",
        type: "story",
        points: 5,
        title: "Cart contents stay in sync across multiple browser tabs",
        asA: "shopper with the store open in two tabs",
        iWant: "items I add in one tab to appear in the other",
        soThat:
          "I do not think the app dropped my items when I switch back to the first tab",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a cart with two items in tab A",
            when: "the user adds a third item in tab B",
            then: "tab A shows three items without a manual reload",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The right ticket describes what shoppers experience and why it matters. The implementation choice (useSyncExternalStore, store wiring) lives in the code review, not the title. The same engineer can do the same work, but everyone else can read along.",
    explanationWrong:
      "A title that begins with 'Switch from X to Y' is a refactor in disguise. It might be the right refactor, but it is not a story until someone outside engineering can describe what changes for the user.",
    sourceUrl: "https://www.agilealliance.org/glossary/user-story-template/",
    sourceLabel: "Agile Alliance: User Story Template",
  },
];
