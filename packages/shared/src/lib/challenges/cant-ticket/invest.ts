import type { BaseChallenge } from "../../game/types";

export const investChallenges: BaseChallenge[] = [
  {
    id: "inv-001",
    category: "invest",
    difficulty: "easy",
    title: "Independent",
    prompt: "Which story can ship without waiting on another?",
    content: {
      type: "ticket",
      left: {
        key: "FEED-12",
        type: "story",
        points: 5,
        title: "Reactions on activity feed posts",
        asA: "team member",
        iWant: "to react to a post with an emoji",
        soThat: "I can acknowledge without typing a reply",
        context:
          "Blocked on: NOTIF-44 (notification refactor) and FEED-09 (feed real-time refresh).",
      },
      right: {
        key: "FEED-12",
        type: "story",
        points: 3,
        title: "Reactions on activity feed posts",
        asA: "team member",
        iWant: "to react to a post with an emoji",
        soThat: "I can acknowledge without typing a reply",
        context:
          "Reactions update on next page reload; the real-time refresh is a separate story (FEED-15) that can ship later.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Independence is about being shippable on its own. The right story decouples the user-visible behavior from the realtime work, so it can land first. The realtime polish becomes its own story to prioritize separately.",
    explanationWrong:
      "Two hard blocks make this story a coordination problem before it is a delivery problem. If either dependency slips, the value never lands. Independence means: redesign the slice so something useful can ship now.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
  {
    id: "inv-002",
    category: "invest",
    difficulty: "easy",
    title: "Negotiable",
    prompt: "Which story leaves the how open to the team?",
    content: {
      type: "ticket",
      left: {
        key: "ONB-21",
        type: "story",
        points: 5,
        title: "New users finish onboarding faster",
        asA: "new user",
        iWant: "a shorter onboarding flow",
        soThat: "I can reach the dashboard quickly",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Replace the wizard with the new wizard library",
          },
          { kind: "bullet", text: "Remove steps 3 and 7 from the flow" },
          {
            kind: "bullet",
            text: "Replace the welcome video with a tooltip",
          },
          {
            kind: "bullet",
            text: "Skip email verification on staging",
          },
        ],
      },
      right: {
        key: "ONB-21",
        type: "story",
        points: 5,
        title: "New users finish onboarding in fewer than three minutes",
        asA: "new user",
        iWant: "to reach the empty dashboard quickly after signup",
        soThat: "I can decide whether the product is for me",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a new signup with valid credentials",
            when: "they complete the wizard",
            then: "the median completion time is under 180 seconds",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The team owns the implementation. The story sets the outcome (under three minutes) and lets engineering pick which steps to drop, which library to use, and what the tradeoff with verification looks like.",
    explanationWrong:
      "When the description specifies the library, the steps to remove, and the staging shortcut, the team is just executing. They will hit a constraint the author missed and either ship a worse solution or escalate every variation.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
  {
    id: "inv-003",
    category: "invest",
    difficulty: "easy",
    title: "Valuable",
    prompt: "Which story has a benefiting actor?",
    content: {
      type: "ticket",
      left: {
        key: "INF-99",
        type: "story",
        points: 5,
        title: "Refactor the metrics pipeline to use the new client library",
        asA: "platform engineer",
        iWant: "the metrics pipeline migrated to the new client",
        soThat: "we are off the EOL client before the deadline",
      },
      right: {
        key: "INF-99",
        type: "story",
        points: 5,
        title: "On-call engineers see metrics within 30 seconds of an incident",
        asA: "on-call engineer paged at 2 a.m.",
        iWant: "metrics to appear in the dashboard within 30 seconds",
        soThat:
          "I can rule out an outage without waiting on the old client's 4-minute backfill",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "INVEST's V (Valuable) is the lever that distinguishes story from task. The right ticket names the on-call engineer and the cost they pay today (waiting four minutes at 2 a.m.). That defends the work to anyone who asks why now.",
    explanationWrong:
      "EOL deadlines are real. They are also a Task: the work has no user-facing value. Wrapping plumbing in story language is fine if you can name the value. If the only beneficiary is the future maintenance budget, file it as a Task.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
  {
    id: "inv-004",
    category: "invest",
    difficulty: "medium",
    title: "Estimable",
    prompt: "Which story can three engineers roughly agree on a size for?",
    content: {
      type: "ticket",
      left: {
        key: "INT-32",
        type: "story",
        points: "?",
        title: "Sync customer data with the partner CRM",
        asA: "support agent",
        iWant: "customer data to stay in sync with the partner CRM",
        soThat: "I am working from accurate data",
        acceptanceCriteria: [
          { kind: "bullet", text: "Pick a sync mechanism" },
          { kind: "bullet", text: "Handle conflicts" },
          { kind: "bullet", text: "Support partial failures" },
          { kind: "bullet", text: "Work for both push and pull" },
          {
            kind: "bullet",
            text: "Gracefully degrade if the partner API is down",
          },
        ],
      },
      right: {
        key: "INT-32",
        type: "story",
        points: 5,
        title: "Customer email changes propagate to the partner CRM",
        asA: "support agent",
        iWant: "the partner CRM to show the customer's current email",
        soThat: "I am not chasing them on a stale address",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a customer updates their email in our app",
            when: "the next sync runs (within 5 minutes)",
            then: "the partner CRM shows the new email",
          },
          {
            kind: "gwt",
            given: "the partner API is down for a sync",
            when: "the sync retries",
            then: "the change is persisted on the next successful run",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Three engineers can roughly agree on the right side. The scope is one field, two paths, and a defined failure mode. The left side is a research project hidden inside a story.",
    explanationWrong:
      "Open-ended scope ('handle conflicts', 'support partial failures', 'work for both push and pull') is what a 13-pointer or a spike looks like. Estimating it produces a wide spread and a wrong number.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
  {
    id: "inv-005",
    category: "invest",
    difficulty: "easy",
    title: "Small",
    prompt: "Which story fits in a sprint as it stands?",
    content: {
      type: "ticket",
      left: {
        key: "SCH-50",
        type: "story",
        points: 13,
        title: "Schedulers manage recurring shifts across multiple locations",
        asA: "scheduler",
        iWant: "to manage recurring shifts across all my locations",
        soThat: "I do not copy the same shift for each week or location",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Recurring shifts (daily, weekly, custom cadences)",
          },
          { kind: "bullet", text: "Multi-location templates" },
          { kind: "bullet", text: "Conflict detection across locations" },
          { kind: "bullet", text: "Swap workflow with approvals" },
          { kind: "bullet", text: "Calendar export and notifications" },
        ],
      },
      right: {
        key: "SCH-50",
        type: "story",
        points: 5,
        title: "Schedulers create a weekly recurring shift for one location",
        asA: "scheduler",
        iWant:
          "to create a shift that repeats every Monday for a chosen location",
        soThat: "I do not have to copy the same shift for each week",
        outOfScope:
          "Multi-location templates, swap workflow, conflict detection (separate stories).",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Small means it fits in a sprint. The right story carves out the simplest end-to-end slice and explicitly defers the variations. Each deferred slice is a separate story product can prioritize on its own merits.",
    explanationWrong:
      "Six features inside one story will not fit in a sprint and cannot be cleanly decomposed mid-sprint. Splitting before pulling is cheaper than splitting in flight.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "inv-006",
    category: "invest",
    difficulty: "easy",
    title: "Testable",
    prompt:
      "Which acceptance criteria can someone other than the engineer verify?",
    content: {
      type: "ticket",
      left: {
        key: "PERF-77",
        type: "story",
        points: 3,
        title: "Dashboard loads faster",
        acceptanceCriteria: [
          { kind: "bullet", text: "The dashboard feels snappier" },
          {
            kind: "bullet",
            text: "Users on slow connections do not get frustrated",
          },
          { kind: "bullet", text: "Performance is improved" },
        ],
      },
      right: {
        key: "PERF-77",
        type: "story",
        points: 3,
        title:
          "Sales reps see today's pipeline within 1 second on the dashboard",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a sales rep with 50 deals on a 4G connection",
            when: "they open /dashboard",
            then: "the pipeline section is interactive within 1 second (p75)",
          },
          {
            kind: "bullet",
            text: "p99 stays under 2 seconds for the same dataset",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Testable is the letter teams fail most. The right side gives observable thresholds (p75 under 1s, p99 under 2s) on a defined dataset. QA can verify it without asking the engineer how it feels.",
    explanationWrong:
      "'Snappier', 'not frustrated', 'improved' are vibes. They cannot be verified without the engineer in the room, which means they will be argued about in retro and never re-tested when the next change ships.",
    sourceUrl: "https://dannorth.net/blog/introducing-bdd/",
    sourceLabel: "Dan North: Introducing BDD",
  },
  {
    id: "inv-007",
    category: "invest",
    difficulty: "hard",
    title: "Multiple letters at once",
    prompt: "Which version passes all six letters?",
    content: {
      type: "ticket",
      left: {
        key: "AUTH-44",
        type: "story",
        points: 13,
        title: "Single sign-on",
        description:
          "Add SSO. Should work everywhere. Use whatever provider makes sense.",
        acceptanceCriteria: [
          { kind: "bullet", text: "SSO works" },
          { kind: "bullet", text: "Existing logins still work" },
        ],
      },
      right: {
        key: "AUTH-44",
        type: "story",
        points: 5,
        title: "Enterprise admins sign in with Okta SAML",
        asA: "admin at a company using Okta",
        iWant: "to sign in with my Okta credentials",
        soThat: "I do not manage another password for our team",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "an admin whose company has configured Okta SAML",
            when: "they click 'Sign in with SSO' on /login",
            then: "they reach /dashboard with the correct organization context",
          },
          {
            kind: "gwt",
            given: "a user without SSO configured",
            when: "they sign in with email and password",
            then: "they reach /dashboard as before",
          },
        ],
        outOfScope: "Google Workspace, Azure AD (separate stories).",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Independent (does not block other auth flows), Negotiable (the team picks the SAML library), Valuable (named admin, named cost), Estimable (one provider, scoped acceptance), Small (fits a sprint), Testable (Given/When/Then). Six for six.",
    explanationWrong:
      "Vague scope, vibe acceptance criteria, and a 13 in the points field: left fails three letters at once. Not Estimable, not Small, not Testable. The story is a wish dressed up.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
];
