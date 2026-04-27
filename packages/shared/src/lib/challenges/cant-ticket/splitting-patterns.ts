import type { BaseChallenge } from "../../game/types";

export const splittingPatternsChallenges: BaseChallenge[] = [
  {
    id: "spt-001",
    category: "splitting-patterns",
    difficulty: "easy",
    title: "Workflow steps (Paths)",
    prompt: "Which split slices the multi-step process correctly?",
    content: {
      type: "ticket",
      left: {
        key: "PUB-100",
        type: "epic",
        title: "Editors publish articles through legal and marketing approval",
        children: [
          { type: "story", title: "Approval workflow data model and states" },
          { type: "story", title: "Routing service for approver assignment" },
          { type: "story", title: "Approval queue UI for reviewers" },
          { type: "story", title: "Notifications and audit log" },
        ],
      },
      right: {
        key: "PUB-100",
        type: "epic",
        title: "Editors publish articles through legal and marketing approval",
        children: [
          { type: "story", title: "Editor publishes directly without review" },
          { type: "story", title: "Editor publishes after editor review" },
          { type: "story", title: "Editor publishes after legal review" },
          { type: "story", title: "Editor publishes after marketing review" },
          { type: "story", title: "Editor previews in staging before publish" },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Workflow-step splits ship the simplest end-to-end path first, then layer in the intermediate steps. Each slice is a real flow editors can use today.",
    explanationWrong:
      "Splitting by component (data model, routing, queue UI, notifications) is horizontal slicing. None of those stories ship a working publish flow on their own; an editor cannot publish anything until the whole stack lands.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "spt-002",
    category: "splitting-patterns",
    difficulty: "easy",
    title: "Operations (CRUD)",
    prompt: "Which Epic splits into the operations hidden behind 'manage'?",
    content: {
      type: "ticket",
      left: {
        key: "ACC-44",
        type: "epic",
        title: "Users manage their account",
        children: [
          { type: "story", title: "Account management UI" },
          { type: "story", title: "Account API endpoints" },
        ],
      },
      right: {
        key: "ACC-44",
        type: "epic",
        title: "Users manage their account",
        children: [
          { type: "story", title: "User signs up (create)" },
          { type: "story", title: "User views their profile (read)" },
          { type: "story", title: "User updates their profile (update)" },
          { type: "story", title: "User closes their account (delete)" },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "'Manage' is almost always a clue that multiple operations are hiding behind one verb. CRUD-style splitting names them, often with very different priorities. Sign-up is urgent; close-account can wait until next quarter.",
    explanationWrong:
      "'UI' and 'API' is horizontal slicing. The team builds the bones for all four operations, ships none of them, and product cannot reorder a single piece against its actual urgency.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "spt-003",
    category: "splitting-patterns",
    difficulty: "easy",
    title: "Business rule variations (Rules)",
    prompt: "Which split lets product ship the core rule first?",
    content: {
      type: "ticket",
      left: {
        key: "FLT-21",
        type: "epic",
        title: "Search flights with flexible dates",
        children: [
          { type: "story", title: "Date-range picker UI" },
          { type: "story", title: "Search API accepts a date range" },
          {
            type: "story",
            title: "Results list renders flexible-date matches",
          },
        ],
      },
      right: {
        key: "FLT-21",
        type: "epic",
        title: "Search flights with flexible dates",
        children: [
          {
            type: "story",
            title: "Search flights within N days of a target date",
          },
          { type: "story", title: "Search flights on any weekend in a month" },
          {
            type: "story",
            title: "Search flights plus or minus N days of a window",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Three rules, three stories. The team can ship the most-used variant first and learn whether the other two are actually wanted before building them. The split exposes priorities; the lump hides them.",
    explanationWrong:
      "Splitting into picker UI, API, and results list is horizontal slicing dressed up as a feature breakdown. None of the three stories ships a working search alone, and the three actual rule variations are still hidden inside whichever story claims them.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "spt-004",
    category: "splitting-patterns",
    difficulty: "easy",
    title: "Variations in data (Data)",
    prompt: "Which split starts with the simplest data shape?",
    content: {
      type: "ticket",
      left: {
        key: "LOC-12",
        type: "epic",
        title: "Customers find services near a location",
        children: [
          { type: "story", title: "Geocoding service for all location types" },
          {
            type: "story",
            title: "Location index covering country/city/neighborhood",
          },
          { type: "story", title: "Search results UI" },
        ],
      },
      right: {
        key: "LOC-12",
        type: "epic",
        title: "Customers find services near a location",
        children: [
          { type: "story", title: "Search by country" },
          { type: "story", title: "Search by city" },
          { type: "story", title: "Search by neighborhood" },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Start with the simplest data shape (country), ship it end-to-end, then broaden. You often discover that later variations are wanted less than you assumed and can be deprioritized.",
    explanationWrong:
      "Splitting into geocoder, index, and UI is layer-by-layer work. All three data variations are still bundled into each layer, so country users wait for the neighborhood index to land before anything ships.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "spt-005",
    category: "splitting-patterns",
    difficulty: "easy",
    title: "Data entry methods (Interfaces)",
    prompt: "Which split ships the underlying logic before the polished input?",
    content: {
      type: "ticket",
      left: {
        key: "BOOK-31",
        type: "epic",
        title: "Customers book a meeting time",
        children: [
          { type: "story", title: "Booking domain model and persistence" },
          { type: "story", title: "Booking API for create, read, cancel" },
          {
            type: "story",
            title: "Calendar picker and timezone autocomplete UI",
          },
          { type: "story", title: "Confirmation email" },
        ],
      },
      right: {
        key: "BOOK-31",
        type: "epic",
        title: "Customers book a meeting time",
        children: [
          {
            type: "story",
            title: "Customer types a date and time into a plain text field",
          },
          { type: "story", title: "Customer picks a time from a calendar" },
          { type: "story", title: "Customer's timezone autocompletes" },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "When the UI is doing most of the work, ship the feature with a minimal input first. The booking logic, validation, and confirmation are live on day one. The fancy interface lands in slice two without blocking the core value.",
    explanationWrong:
      "Splitting into model, API, UI, and email is layer-by-layer slicing. No customer can book anything until all four ship together; the team cannot trade the calendar picker for an earlier launch even though it is the most expensive piece.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/five-simple-but-powerful-ways-to-split-user-stories",
    sourceLabel: "Mike Cohn: SPIDR",
  },
  {
    id: "spt-006",
    category: "splitting-patterns",
    difficulty: "medium",
    title: "Major effort",
    prompt:
      "Which split lands the infrastructure cost first, then adds variants cheaply?",
    content: {
      type: "ticket",
      left: {
        key: "PAY-50",
        type: "epic",
        title: "Customers pay with any card type",
        children: [
          { type: "story", title: "Payment processor abstraction layer" },
          {
            type: "story",
            title: "Card-network adapters (Visa, MC, Amex, Discover)",
          },
          { type: "story", title: "Checkout UI with card selection" },
          { type: "story", title: "Receipts and refund handling" },
        ],
      },
      right: {
        key: "PAY-50",
        type: "epic",
        title: "Customers pay with any card type",
        children: [
          {
            type: "story",
            title: "Customer pays with Visa end-to-end (the payment pipeline)",
          },
          { type: "story", title: "Customer pays with Mastercard" },
          { type: "story", title: "Customer pays with Amex" },
          { type: "story", title: "Customer pays with Discover" },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The first slice carries the entire infrastructure cost; the rest are nearly free once the pipeline is live. The team estimates Mastercard accurately by the time it lands, because they have learned what the pipeline actually requires.",
    explanationWrong:
      "Splitting into abstraction, adapters, UI, and receipts is layer-by-layer work. No customer pays anything until all four ship, and the team has built the abstraction without ever feeling the shape of one real payment going through.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "spt-007",
    category: "splitting-patterns",
    difficulty: "hard",
    title: "Simple then complex",
    prompt: "What do you do during refinement when the scope keeps expanding?",
    content: {
      type: "ticket",
      left: {
        key: "EXP-77",
        type: "story",
        points: 13,
        title: "Customer exports a report",
        description:
          'During refinement: "yeah, but also schedule it." "Yeah, but also email it." "Yeah, also let them filter the columns." All in scope.',
      },
      right: {
        key: "EXP-77",
        type: "story",
        points: 3,
        title: "Customer exports a report (CSV, current filters)",
        description:
          "Captured during refinement and pulled out as their own candidate stories: scheduled exports (EXP-78), emailed exports (EXP-79), per-column selection (EXP-80). Product prioritizes the candidates separately.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "When the scope keeps growing, capture the simple core as the first story and pull each 'yeah, but also' into its own candidate. Product prioritizes them after; the original story can ship.",
    explanationWrong:
      "Keeping all of it in one story is the cure for productivity. The 13 will not finish in the sprint, and product loses the chance to defer the things they would have deferred anyway if asked.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "spt-008",
    category: "splitting-patterns",
    difficulty: "hard",
    title: "Defer performance",
    prompt: "Which split ships the correct version before the fast version?",
    content: {
      type: "ticket",
      left: {
        key: "RPT-44",
        type: "story",
        points: 8,
        title: "Managers see throughput report (sub-second p99 from day one)",
        description:
          "Compute the report, build the page, and optimize cold-start latency to under 1s p99. Cache layer included.",
      },
      right: {
        key: "RPT-44",
        type: "story",
        points: 3,
        title: "Managers see throughput report (correct, possibly slow)",
        description:
          "Ship the correct report with a loading spinner. Optimization (caching, pre-aggregation) is RPT-45 and gets prioritized after we see real usage.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Ship correct, then ship fast. The optimization story can be sized accurately once you see where the real time is going. Premature optimization wastes estimates and often optimizes the wrong path.",
    explanationWrong:
      "Building the cache before the report ships locks in assumptions about hot paths the team has not measured. Half the optimization work is for usage patterns that never materialize.",
    sourceUrl:
      "https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/",
    sourceLabel: "Humanizing Work: Splitting User Stories",
  },
  {
    id: "spt-009",
    category: "splitting-patterns",
    difficulty: "medium",
    title: "Reaching for a spike",
    prompt: "When does the team file a spike instead of splitting the story?",
    content: {
      type: "ticket",
      left: {
        key: "META-30",
        type: "task",
        title: "When to spike",
        description:
          "Whenever a story looks big or hard, file a spike to research it before estimating.",
      },
      right: {
        key: "META-30",
        type: "task",
        title: "When to spike",
        description:
          "Reach for a spike only when the other splitting patterns do not apply, that is, when the team genuinely cannot estimate because the implementation approach is unclear. A spike is an admission that you cannot split yet, not a default move.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Spike is the explicit last resort in the Humanizing Work guide. Most stories can be split by workflow, data, rules, or interface before research is needed. Defaulting to a spike costs the team a sprint of value while the eight other patterns sit unused.",
    explanationWrong:
      "Spiking by reflex is procrastination dressed as research. Most 'big' stories are not unknowable; they are unsplit. Try the patterns first; spike only when the patterns honestly do not apply.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/five-simple-but-powerful-ways-to-split-user-stories",
    sourceLabel: "Mike Cohn: SPIDR",
  },
];
