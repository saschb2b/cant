import type { BaseChallenge } from "../../game/types";

export const splittingVerticalChallenges: BaseChallenge[] = [
  {
    id: "sv-001",
    category: "splitting-vertical",
    difficulty: "easy",
    title: "Horizontal vs vertical (epic level)",
    prompt: "Which split lets product ship something this sprint?",
    content: {
      type: "ticket",
      left: {
        key: "PAY-100",
        type: "epic",
        title: "Customers can pay with SEPA direct debit",
        children: [
          { type: "story", title: "Backend: SEPA mandate API endpoint" },
          { type: "story", title: "Frontend: SEPA fields on checkout" },
          {
            type: "story",
            title: "DB: SEPA_MANDATE table + migration",
          },
          {
            type: "story",
            title: "Analytics: instrument SEPA conversion funnel",
          },
        ],
      },
      right: {
        key: "PAY-100",
        type: "epic",
        title: "Customers can pay with SEPA direct debit",
        children: [
          {
            type: "story",
            title:
              "Customer enters bank details and sees the mandate confirmation",
          },
          { type: "story", title: "Customer signs the mandate inline" },
          {
            type: "story",
            title: "Customer sees the direct debit on the receipt",
          },
          {
            type: "story",
            title:
              "Failed debits notify the customer and pause the subscription",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Each vertical slice goes through the data, logic, and UI layers it needs and ships a piece of customer-visible value end-to-end. After slice one, the team has shipped something real and learned what the next slice should look like.",
    explanationWrong:
      "Layer-by-layer splits fail INVEST on three letters at once: the backend slice is not Independent (frontend waits), not Valuable (no user benefits from an API nobody calls), and not Testable from the user perspective. Nothing ships until everything ships.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "sv-002",
    category: "splitting-vertical",
    difficulty: "easy",
    title: "The slice that teaches",
    prompt: "Which first slice makes slice two cheaper?",
    content: {
      type: "ticket",
      left: {
        key: "AUTH-50",
        type: "story",
        points: 5,
        title:
          "Build the entire SSO infrastructure (no provider integration yet)",
        description:
          "Add SAML support, JWT issuance, session refresh, and the new sign-in page. No provider wired up; that comes next sprint.",
      },
      right: {
        key: "AUTH-50",
        type: "story",
        points: 5,
        title: "Enterprise admins sign in with one specific Okta tenant",
        description:
          "End-to-end: one Okta tenant, the new sign-in page, SAML handling for that one provider. The next slice generalizes to other tenants.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The right slice ships value AND teaches the team about real SAML edge cases the second slice would otherwise rediscover. The 'infrastructure first' framing is horizontal slicing in disguise.",
    explanationWrong:
      "An infrastructure-only slice carries all the cost of the provider integration without the learning. The next sprint will discover that the chosen abstraction does not fit Okta's actual response shape and rework most of it.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "sv-003",
    category: "splitting-vertical",
    difficulty: "medium",
    title: "Three INVEST violations",
    prompt: "Which split keeps each slice valuable on its own?",
    content: {
      type: "ticket",
      left: {
        key: "REP-100",
        type: "epic",
        title: "Managers see weekly throughput per direct report",
        children: [
          { type: "story", title: "Schema migration for the throughput table" },
          { type: "story", title: "Backend: aggregation job (cron)" },
          { type: "story", title: "API: GET /reports/throughput" },
          { type: "story", title: "Frontend: throughput dashboard" },
        ],
      },
      right: {
        key: "REP-100",
        type: "epic",
        title: "Managers see weekly throughput per direct report",
        children: [
          {
            type: "story",
            title:
              "Manager sees PR count for one direct report on /reports/team (read-only)",
          },
          {
            type: "story",
            title: "Manager sees PR + review count for all direct reports",
          },
          {
            type: "story",
            title: "Manager sees the same data with a sparkline",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Each slice ships a usable view a manager can demo. Slice one is rough but real; slice two broadens the scope; slice three polishes it. Product can deprioritize slice three on its own merits.",
    explanationWrong:
      "Schema → job → API → UI is a textbook horizontal split. Three slices have no user-visible result. The fourth slice has all the integration cost, and product cannot demo anything until the entire epic is done.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
  {
    id: "sv-004",
    category: "splitting-vertical",
    difficulty: "medium",
    title: "Generate multiple splits",
    prompt: "Which planning behavior produces the better split?",
    content: {
      type: "ticket",
      left: {
        key: "META-20",
        type: "task",
        title: "Splitting at refinement",
        description:
          "When a story is too big, the most senior engineer proposes a split and the team accepts it.",
      },
      right: {
        key: "META-20",
        type: "task",
        title: "Splitting at refinement",
        description:
          "When a story is too big, the team generates three different splits using three different patterns (workflow, data, rules), sketches each on the board, then picks the split that lets product deprioritize the least valuable slices most cleanly.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The first workable split is rarely the best one. Generating three lets the team see which one yields the most product optionality. That is the lever that turns slicing from 'making it smaller' into 'making it deliverable'.",
    explanationWrong:
      "Stopping at the first workable split is a common shortcut that costs the team product flexibility. The senior's split may be technically valid and still leave product with one big slice and two unimportant ones.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "sv-005",
    category: "splitting-vertical",
    difficulty: "medium",
    title: "Equal-sized slices",
    prompt: "Which split gives product useful options?",
    content: {
      type: "ticket",
      left: {
        key: "ONB-30",
        type: "epic",
        title: "Self-serve enterprise onboarding",
        children: [
          {
            type: "story",
            title:
              "Set up the org, invite teammates, pick a plan, configure SSO",
          },
          { type: "story", title: "Add a help-center link to the wizard" },
          {
            type: "story",
            title: "Pre-fill the org name from the email domain",
          },
        ],
      },
      right: {
        key: "ONB-30",
        type: "epic",
        title: "Self-serve enterprise onboarding",
        children: [
          {
            type: "story",
            title: "Admin creates the org and invites teammates",
          },
          { type: "story", title: "Admin picks a plan and starts the trial" },
          { type: "story", title: "Admin configures SSO during onboarding" },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Three roughly equal slices give product three real options: ship all, drop the SSO slice for now, or move the plan slice to a later sprint. The slices are individually valuable.",
    explanationWrong:
      "A 12-1-1 split has one real slice plus two rounding errors. Product cannot meaningfully reorder them, and the big slice is the same Epic with two trivial decorations attached.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "sv-006",
    category: "splitting-vertical",
    difficulty: "medium",
    title: "Splitting before the story is a story",
    prompt:
      "Which preflight catches a non-story before the team tries to split it?",
    content: {
      type: "ticket",
      left: {
        key: "META-21",
        type: "task",
        title: "Splitting preflight",
        description:
          "If a story is too big, run it through the splitting patterns until it fits in a sprint.",
      },
      right: {
        key: "META-21",
        type: "task",
        title: "Splitting preflight",
        description:
          "Before splitting: confirm it is a story (named user, observable outcome) and confirm INVEST fails only on Small. If it also fails on Valuable or Testable, fix the framing first.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Splitting patterns apply to stories. 'Refactor the payment module' is not a story, and no pattern will turn it into one. Confirming the framing first prevents the team from generating four equally-bad sub-tasks.",
    explanationWrong:
      "Reaching for splitting patterns first will produce four small things that still fail INVEST in the same way the original did. The split looks like progress; the work has not actually been clarified.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
];
