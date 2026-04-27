import type { BaseChallenge } from "../../game/types";

export const connextraTemplateChallenges: BaseChallenge[] = [
  {
    id: "ctt-001",
    category: "connextra-template",
    difficulty: "easy",
    title: "All three clauses",
    prompt: "Which story answers who, what, and why?",
    content: {
      type: "ticket",
      left: {
        key: "NOTIF-12",
        type: "story",
        points: 3,
        title: "Weekly digest emails",
        asA: "user",
        iWant: "weekly digest emails",
        soThat: "I get weekly digest emails",
      },
      right: {
        key: "NOTIF-12",
        type: "story",
        points: 3,
        title: "Active users see what they missed in a weekly digest",
        asA: "user who logs in less than once a week",
        iWant: "a Monday digest of activity in spaces I follow",
        soThat:
          "I can decide whether to log in without scanning the app for changes",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The three Connextra clauses force the answers to who, what, and why before the story enters a sprint. The tradeoff space is now visible: the audience is low-frequency users, the value is reducing the cost of staying informed.",
    explanationWrong:
      "Filling the Connextra fields with 'a user wants weekly emails so they get weekly emails' is process theater. The clauses are present but they answer none of the three questions. The team will rediscover what success looks like in review and probably get it wrong.",
    sourceUrl: "https://www.agilealliance.org/glossary/user-story-template/",
    sourceLabel: "Agile Alliance: User Story Template",
  },
  {
    id: "ctt-002",
    category: "connextra-template",
    difficulty: "easy",
    title: "The so that clause",
    prompt: "Which story keeps the value visible after a refactor?",
    content: {
      type: "ticket",
      left: {
        key: "BIL-44",
        type: "story",
        points: 5,
        title: "Customer downloads invoice PDF",
        asA: "customer",
        iWant: "to download my invoice as a PDF",
      },
      right: {
        key: "BIL-44",
        type: "story",
        points: 5,
        title: "Customer downloads invoice PDF",
        asA: "customer being audited",
        iWant: "to download my invoice as a PDF with the original timestamps",
        soThat:
          "I can submit a tax-authority-acceptable record without asking support",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The 'so that' is the part that survives a refactor of the template. It anchors the work to a real cost the customer is paying, which makes it possible to argue scope down or up against the actual goal.",
    explanationWrong:
      "Without 'so that', the team builds 'a PDF download'. Whether the timestamps match the audit, whether 'support escalation rate' goes down, whether this is even the right format, all evaporate. The work ships. The cost stays.",
    sourceUrl: "https://www.agilealliance.org/glossary/user-story-template/",
    sourceLabel: "Agile Alliance: User Story Template",
  },
  {
    id: "ctt-003",
    category: "connextra-template",
    difficulty: "easy",
    title: "Fake user role",
    prompt: "Which actor is specific enough to make a tradeoff?",
    content: {
      type: "ticket",
      left: {
        key: "SCH-77",
        type: "story",
        points: 3,
        title: "User can see calendar events",
        asA: "user",
        iWant: "to see my events for the week",
        soThat: "I know what is coming up",
      },
      right: {
        key: "SCH-77",
        type: "story",
        points: 3,
        title: "Volunteer coordinators see all upcoming shifts at a glance",
        asA: "volunteer coordinator running a weekend event",
        iWant: "the week-view to highlight unstaffed shifts in red",
        soThat: "I can fill gaps before Friday without sorting through filters",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Naming the actor as a volunteer coordinator running a weekend event makes the tradeoffs concrete. Should we sort by time or by gap? Should we send a notification? You cannot answer those for 'a user'.",
    explanationWrong:
      "'A user' is a wildcard that lets the team build for whoever shows up loudest in review. The Connextra template is a forcing function for specificity, and 'user' opts out of the function entirely.",
    sourceUrl:
      "https://ronjeffries.com/xprog/articles/expcardconversationconfirmation/",
    sourceLabel: "Ron Jeffries: Card, Conversation, Confirmation",
  },
  {
    id: "ctt-004",
    category: "connextra-template",
    difficulty: "hard",
    title: "Plain prose still counts",
    prompt:
      "Both write the same idea. Which one would Ron Jeffries call a story?",
    content: {
      type: "ticket",
      left: {
        key: "PROD-12",
        type: "story",
        points: 3,
        title: "Inventory page filters",
        description:
          "Add filters to the inventory page. Filter by status, location, and SKU prefix. Persist the filters in the URL.",
      },
      right: {
        key: "PROD-12",
        type: "story",
        points: 3,
        title: "Inventory managers come back to a saved view",
        description:
          "Inventory managers run the same filter many times a day. Right now the filter resets on every page load, so they re-apply it for every check. They want filters to persist across visits, ideally in the URL so they can bookmark or share with the warehouse team.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Plain prose is fine. The three Connextra questions are all answered: inventory managers (who), filters that persist across visits (what), so they stop re-applying the same filter all day (why). The template is a forcing function, not a syntactic requirement.",
    explanationWrong:
      "A bulleted feature list is not a story even if it lists every requirement. It tells the team what to build. It does not tell them why, or for whom, or what to drop if the sprint runs hot.",
    sourceUrl: "https://www.agilealliance.org/glossary/user-story-template/",
    sourceLabel: "Agile Alliance: User Story Template",
  },
  {
    id: "ctt-005",
    category: "connextra-template",
    difficulty: "medium",
    title: "Card, Conversation, Confirmation",
    prompt: "Which story respects all three Cs?",
    content: {
      type: "ticket",
      left: {
        key: "CHK-44",
        type: "story",
        points: 5,
        title: "Build new checkout flow",
        asA: "customer",
        iWant: "a new checkout flow",
        soThat: "checkout works",
        acceptanceCriteria: [
          { kind: "bullet", text: "Matches the Notion spec" },
          { kind: "bullet", text: "AC are listed in the doc" },
          { kind: "bullet", text: "See the doc for edge cases" },
        ],
      },
      right: {
        key: "CHK-44",
        type: "story",
        points: 5,
        title: "Returning customers check out in fewer than four screens",
        asA: "returning customer",
        iWant: "to complete checkout without re-entering address or payment",
        soThat: "I do not abandon the cart at the third password prompt",
        acceptanceCriteria: [
          {
            kind: "gwt",
            given: "a returning customer with a saved address and card",
            when: "they click Buy on a product page",
            then: "they reach an order summary in two clicks",
          },
          {
            kind: "gwt",
            given: "a returning customer whose card has expired",
            when: "they click Buy",
            then: "they are prompted to update payment without losing the cart",
          },
        ],
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Card: the title and Connextra clauses fit on a card. Conversation: the framing sets up the team to talk through edge cases. Confirmation: the acceptance criteria are observable on the ticket. All three Cs in the ticket itself.",
    explanationWrong:
      "AC that point at a Notion doc collapse Confirmation into 'go read the doc'. The doc may be excellent, but the ticket is useless to anyone scanning the board, and the doc rots at a different cadence than the work.",
    sourceUrl:
      "https://ronjeffries.com/xprog/articles/expcardconversationconfirmation/",
    sourceLabel: "Ron Jeffries: Card, Conversation, Confirmation",
  },
  {
    id: "ctt-006",
    category: "connextra-template",
    difficulty: "hard",
    title: "When the template fights you",
    prompt: "Which framing fits when there isn't really a single user?",
    content: {
      type: "ticket",
      left: {
        key: "OPS-21",
        type: "task",
        points: 3,
        title: "Rotate the production database secrets",
        description:
          "Quarterly rotation, scheduled. Coordinate the cutover with the on-call.",
      },
      right: {
        key: "OPS-21",
        type: "story",
        points: 3,
        title:
          "As an unspecified user, I want database secrets to be rotated, so that they are rotated.",
        asA: "unspecified user",
        iWant: "database secrets to be rotated",
        soThat: "they are rotated",
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Secret rotation is real work with no user-facing change, so it gets a Task. Trying to force a Connextra clause around it produces tautology. The template is a sanity check for stories, not a costume that every work item has to wear.",
    explanationWrong:
      "Wrapping plumbing work in a fake 'as a user' clause is process theater. It violates Bill Wake's V (Valuable to a user) and adds noise. The honest move is to call it a Task.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Epics, Stories, and Initiatives",
  },
];
