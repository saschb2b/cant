import type { BaseChallenge } from "../../game/types";

export const definitionOfReadyChallenges: BaseChallenge[] = [
  {
    id: "dor-001",
    category: "definition-of-ready",
    difficulty: "easy",
    title: "Story readiness signals",
    prompt: "Which story is ready to enter a sprint?",
    content: {
      type: "ticket",
      left: {
        key: "ALERT-12",
        type: "story",
        points: 3,
        title: "Improve alert handling for on-call",
        asA: "on-call engineer",
        iWant: "alerts to work better",
        soThat: "being on-call is less painful",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Alert acknowledgement should be improved",
          },
          {
            kind: "bullet",
            text: "Pages should stop once the alert is handled",
          },
        ],
      },
      right: {
        key: "ALERT-12",
        type: "story",
        points: 3,
        title: "On-call engineers acknowledge alerts in one click",
        asA: "on-call engineer paged at night",
        iWant: "to acknowledge an alert without opening a separate tool",
        soThat: "I can quiet the page before fully waking up",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a paged on-call engineer",
            when: "they tap the Acknowledge button in the SMS link or in the dashboard",
            then: "the alert moves to 'acknowledged' and the page stops within 60 seconds",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Ready means actor, outcome, and reason are present, plus at least one testable acceptance criterion. The right story passes that bar; whoever pulls it knows exactly what 'done' looks like.",
    explanationWrong:
      "'Improve' is not an outcome and 'we agreed in product review' is not a reason that survives the meeting. Pulling this into a sprint means the team negotiates the spec mid-flight.",
    sourceUrl:
      "https://www.scrum.org/resources/blog/walking-through-definition-ready",
    sourceLabel: "Scrum.org: Definition of Ready",
  },
  {
    id: "dor-002",
    category: "definition-of-ready",
    difficulty: "easy",
    title: "Linked dependencies",
    prompt: "Which story makes its blockers explicit?",
    content: {
      type: "ticket",
      left: {
        key: "BIL-21",
        type: "story",
        points: 5,
        title: "Customers see VAT on the invoice",
        asA: "EU customer",
        iWant: "VAT shown as a separate line on the invoice",
        soThat: "my accounting software can match the line",
        description: "Should be doable once the new tax service is live.",
      },
      right: {
        key: "BIL-21",
        type: "story",
        points: 5,
        title: "Customers see VAT on the invoice",
        asA: "EU customer",
        iWant: "VAT shown as a separate line on the invoice",
        soThat: "my accounting software can match the line",
        context:
          "Blocked by TAX-117 (tax service /v1/quote endpoint). Pull only after TAX-117 is in 'done'.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Dependencies linked, not assumed. When TAX-117 moves, the planning board sees the unblock. The team will not pull this story prematurely and discover the dependency after they have started.",
    explanationWrong:
      "'Should be doable once the new service is live' is the kind of sentence that wastes a sprint. Without an explicit link, nobody knows whether the dependency is shipped, in progress, or still being argued about.",
    sourceUrl:
      "https://www.scrum.org/resources/blog/walking-through-definition-ready",
    sourceLabel: "Scrum.org: Definition of Ready",
  },
  {
    id: "dor-003",
    category: "definition-of-ready",
    difficulty: "easy",
    title: "Refinement room test",
    prompt:
      "Which story would let everyone leave refinement with the same understanding?",
    content: {
      type: "ticket",
      left: {
        key: "FILT-08",
        type: "story",
        points: 5,
        title: "Better filtering on the contacts page",
        asA: "user of the contacts page",
        iWant: "better filtering",
        soThat: "I can find the right contacts",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Filtering matches what the team discussed in the last refinement",
          },
          {
            kind: "bullet",
            text: "Filter state behaves the way users expect",
          },
        ],
      },
      right: {
        key: "FILT-08",
        type: "story",
        points: 5,
        title: "Sales reps narrow contacts by lifecycle stage",
        asA: "sales rep",
        iWant:
          "to filter the contact list to a single lifecycle stage (lead, MQL, SQL, customer)",
        soThat: "I can work the right pipeline at the right time",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "the contacts list",
            when: "the rep selects a lifecycle stage in the filter",
            then: "only contacts in that stage are shown",
          },
          {
            kind: "gwt",
            given: "an active filter",
            when: "the rep navigates away and back",
            then: "the filter is preserved",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Nobody in the refinement room walks out saying 'I still do not really know what this is.' The actor, the four stages, the persistence behavior, and the demo path are all on the card.",
    explanationWrong:
      "Pointing back at a previous refinement makes the story unreadable to anyone who was not there or has since rotated off the team. The story is not yet a contract; it is a memory.",
    sourceUrl:
      "https://ronjeffries.com/xprog/articles/expcardconversationconfirmation/",
    sourceLabel: "Ron Jeffries: Card, Conversation, Confirmation",
  },
  {
    id: "dor-004",
    category: "definition-of-ready",
    difficulty: "hard",
    title: "Fits in a sprint",
    prompt: "Which story has been split before being pulled?",
    content: {
      type: "ticket",
      left: {
        key: "ONB-30",
        type: "story",
        points: 13,
        title: "Self-serve onboarding for enterprise tenants",
        asA: "enterprise admin",
        iWant: "to set up my organization, invite the team, and pick a plan",
        soThat: "I do not need a sales call to evaluate the product",
      },
      right: {
        key: "ONB-30",
        type: "story",
        points: 5,
        title: "Enterprise admin creates the organization and invites the team",
        asA: "enterprise admin",
        iWant: "to create my organization and invite three teammates",
        soThat: "I can start a free trial without a sales call",
        outOfScope:
          "Plan selection (ONB-31), payment setup (ONB-32), SCIM provisioning (ONB-33).",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "13 points is a signal, not an estimate. The right side has been sliced before being pulled: the first slice ships and the variations exist as named follow-ups. Definition of Ready means the slicing has already happened.",
    explanationWrong:
      "Pulling a 13-pointer is taking a bet against the sprint. The team will discover halfway through that two of the three sub-flows are bigger than expected, miss the sprint, and re-split under pressure.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "dor-005",
    category: "definition-of-ready",
    difficulty: "medium",
    title: "Commitment confidence",
    prompt: "Which story can the team commit to with confidence?",
    content: {
      type: "ticket",
      left: {
        key: "REP-19",
        type: "story",
        points: 5,
        title: "Better reports for managers",
        asA: "manager",
        iWant: "the reports to be more useful",
        soThat: "I can manage my team better",
        acceptanceCriteria: [
          {
            kind: "bullet",
            text: "Reports surface the information managers actually need",
          },
          {
            kind: "bullet",
            text: "Numbers are easy to read at a glance",
          },
        ],
      },
      right: {
        key: "REP-19",
        type: "story",
        points: 5,
        title: "Managers see weekly throughput per direct report",
        asA: "engineering manager with five direct reports",
        iWant:
          "a weekly report of merged PRs and review comments per direct report",
        soThat: "I can spot blocked engineers before our 1:1",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a manager with five direct reports",
            when: "they open /reports/team",
            then: "they see PR count and review count per report for the past 7 days, with a sparkline",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Connextra clauses present, observable AC, named scope. Whoever pulls the story knows what to build, what to demo, and what success looks like. Ready.",
    explanationWrong:
      "'More useful' is not an outcome. Without testable acceptance criteria, the team is guessing what 'better' means and will probably ship something that gets rejected in review.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
];
