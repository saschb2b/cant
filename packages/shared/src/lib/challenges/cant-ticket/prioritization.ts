import type { BaseChallenge } from "../../game/types";

export const prioritizationChallenges: BaseChallenge[] = [
  {
    id: "pr-001",
    category: "prioritization",
    difficulty: "easy",
    title: "Who decides priority",
    prompt: "Who owns the decision when two stories are both 'must have'?",
    content: {
      type: "ticket",
      left: {
        key: "META-50",
        type: "task",
        title: "Backlog prioritization",
        description:
          "The team votes on what to pull next at sprint planning. The most senior engineer breaks ties.",
      },
      right: {
        key: "META-50",
        type: "task",
        title: "Backlog prioritization",
        description:
          "Product owns the backlog order. Engineering owns the size. The team flags risks; product makes the call.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Prioritization is a product conversation. Engineering provides the size and the risks; product decides the order based on value, customer commitments, and roadmap. Mixing the two collapses the accountability.",
    explanationWrong:
      "Letting the team vote on order turns prioritization into a popularity contest. The most senior engineer's preferences win, the product roadmap becomes a side effect of who is loudest, and product loses the lever they need to ship the right thing.",
    sourceUrl: "https://www.scrum.org/resources/what-is-a-product-owner",
    sourceLabel: "Scrum.org: Product Owner",
  },
  {
    id: "pr-002",
    category: "prioritization",
    difficulty: "easy",
    title: "MoSCoW labeling",
    prompt: "Which quarter plan uses MoSCoW labels meaningfully?",
    content: {
      type: "ticket",
      left: {
        key: "META-51",
        type: "task",
        title: "Quarter plan",
        description: "Must: 14 stories. Should: 8. Could: 3. Won't: 0.",
      },
      right: {
        key: "META-51",
        type: "task",
        title: "Quarter plan",
        description:
          "Must: 4 stories. Should: 6. Could: 8. Won't (this quarter): 7 explicitly named items.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "MoSCoW only works if Must is genuinely scarce and Won't is named. The right side leaves room for unplanned work and tells the team what is explicitly off the table this quarter.",
    explanationWrong:
      "Fourteen Musts is a way of saying 'everything is the priority', which means nothing is. The team will negotiate the Musts at standup all quarter and finish about as many as a smaller, honestly-labeled list.",
    sourceUrl:
      "https://www.atlassian.com/agile/product-management/prioritization-framework",
    sourceLabel: "Atlassian: Prioritization Frameworks",
  },
  {
    id: "pr-003",
    category: "prioritization",
    difficulty: "easy",
    title: "Pull-order tiebreaker",
    prompt: "How should the team pick between two stories of equal size?",
    content: {
      type: "ticket",
      left: {
        key: "META-52",
        type: "task",
        title: "Pulling next",
        description:
          "Two stories of equal size. Pull whichever the engineer is most excited about.",
      },
      right: {
        key: "META-52",
        type: "task",
        title: "Pulling next",
        description:
          "Two stories of equal size. Estimate the cost of delay (revenue at risk, customer commitment, dependency unblock) and pull the higher one first.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Cost of delay names what changes if a story slips by a sprint. It puts a number on what excitement and gut feel were doing implicitly, and it lets product defend the order to a stakeholder who asks.",
    explanationWrong:
      "'Whatever the engineer wants' is a fine policy until two engineers want different things. There is no shared rule for the disagreement, so it gets resolved in private and the backlog order has no defensible logic.",
    sourceUrl: "https://blackswanfarming.com/cost-of-delay/",
    sourceLabel: "Black Swan Farming: Cost of Delay",
  },
  {
    id: "pr-004",
    category: "prioritization",
    difficulty: "medium",
    title: "Comparing two stories",
    prompt: "Which framing helps product order two backlog stories?",
    content: {
      type: "ticket",
      left: {
        key: "META-53",
        type: "task",
        title: "Two backlog stories",
        description:
          "Story A: high impact, lots of users want it. Story B: lower impact but easier. Pull A first because it is more important.",
      },
      right: {
        key: "META-53",
        type: "task",
        title: "Two backlog stories",
        description:
          "A: reach 5000 users, impact 2 (massive), confidence 0.7, effort 8 → score 875. B: reach 10000, impact 1 (high), confidence 0.9, effort 3 → score 3000. Pull B first; ship A right after.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "RICE forces the comparison to be quantitative on its three axes (reach, impact, confidence) over effort. The score reveals when 'massive impact' on a small audience is beaten by 'high impact' on a large one for a third of the cost.",
    explanationWrong:
      "Calling A 'more important' without comparing reach and effort is exactly the kind of intuition RICE is designed to interrogate. Half the time the gut answer is right; half the time the cheaper option dominates.",
    sourceUrl:
      "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/",
    sourceLabel: "Intercom: RICE Prioritization",
  },
  {
    id: "pr-005",
    category: "prioritization",
    difficulty: "hard",
    title: "Value vs effort",
    prompt: "Which item should ship next when both have similar value?",
    content: {
      type: "ticket",
      left: {
        key: "META-54",
        type: "task",
        title: "Two stories with similar value",
        description: "Pull the bigger one first to get it out of the way.",
      },
      right: {
        key: "META-54",
        type: "task",
        title: "Two stories with similar value",
        description:
          "Pull the smaller one first. It ships faster, generates real usage data, and the team can use what they learn to size the bigger one more accurately.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "When value is comparable, smaller is better. It ships sooner, it teaches the team something, and it leaves more room in the next sprint for the bigger work that benefits from the learning.",
    explanationWrong:
      "'Get it out of the way' is the kind of phrase that hides a real cost: a long story blocks the small ones behind it, and the small ones often turn out to be more valuable than the big one was estimated to be.",
    sourceUrl:
      "https://www.atlassian.com/agile/product-management/prioritization-framework",
    sourceLabel: "Atlassian: Prioritization Frameworks",
  },
  {
    id: "pr-006",
    category: "prioritization",
    difficulty: "hard",
    title: "Tech debt vs feature work",
    prompt: "Which framing makes the tech-debt vs feature tradeoff visible?",
    content: {
      type: "ticket",
      left: {
        key: "META-55",
        type: "task",
        title: "Tech debt allocation",
        description:
          "Engineering allocates 20% of every sprint to tech debt. The team picks the items.",
      },
      right: {
        key: "META-55",
        type: "task",
        title: "Tech debt allocation",
        description:
          "Each tech-debt item is filed as a story or task with a named cost (slowing feature X, paging on-call, etc.). Product orders them in the same backlog as features. The team flags new tech debt as it appears.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Naming the cost makes tech debt visible to product, which is the only way it gets prioritized against feature work honestly. The 20% rule looks fair on paper and tends to pick the wrong items in practice.",
    explanationWrong:
      "A blanket percentage hides which debt is actually expensive. The team will pick the debt that bothers them most, which is often not the debt that costs the company the most.",
    sourceUrl: "https://martinfowler.com/bliki/TechnicalDebt.html",
    sourceLabel: "Martin Fowler: Technical Debt",
  },
];
