import type { BaseChallenge } from "../../game/types";

export const storyPointsChallenges: BaseChallenge[] = [
  {
    id: "sp-001",
    category: "story-points",
    difficulty: "easy",
    title: "Points and hours",
    prompt: "Which story is pointed in a way the team can defend later?",
    content: {
      type: "ticket",
      left: {
        key: "INV-9",
        type: "story",
        points: 16,
        title: "Filter inventory by location",
        footer: "Estimate: ~16 hours of work (2 days at 8 hrs/day).",
      },
      right: {
        key: "INV-9",
        type: "story",
        points: 5,
        title: "Filter inventory by location",
        footer:
          "Roughly five times the size of our reference 1-pointer (a config-flag toggle). One area, two edge cases.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Story points are relative size: complexity, uncertainty, and effort bundled into one number compared to a reference story. The right ticket anchors the 5 to a known 1-pointer rather than to hours.",
    explanationWrong:
      "Translating points into hours guarantees a fight at the next sprint planning. Hours vary per engineer, per day, per interruption rate. Points are deliberately abstract because the abstraction is useful.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/why-the-fibonacci-sequence-works-well-for-estimating",
    sourceLabel: "Mike Cohn: Why Fibonacci Works",
  },
  {
    id: "sp-002",
    category: "story-points",
    difficulty: "easy",
    title: "Fibonacci gaps",
    prompt: "Which scale captures the size difference cleanly?",
    content: {
      type: "ticket",
      left: {
        key: "META-01",
        type: "task",
        title: "Team estimation scale",
        description: "Allowed values: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.",
      },
      right: {
        key: "META-01",
        type: "task",
        title: "Team estimation scale",
        description:
          "Allowed values: 1, 2, 3, 5, 8, 13. 13 means 'we do not understand this yet, split or spike it'.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Fibonacci's gaps are the point. Weber's Law: humans cannot reliably distinguish quantities that differ by only a small ratio. A 4 and a 5 are noise. A 3 and an 8 are a real conversation about scope.",
    explanationWrong:
      "A linear 1-10 scale invites the team to argue between 4 and 5 for ten minutes, both of which were the same noise on a Fibonacci scale. The illusion of precision costs more than it adds.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/why-the-fibonacci-sequence-works-well-for-estimating",
    sourceLabel: "Mike Cohn: Why Fibonacci Works",
  },
  {
    id: "sp-003",
    category: "story-points",
    difficulty: "easy",
    title: "Room agrees on 13",
    prompt: "How should the team respond when a story comes back as 13?",
    content: {
      type: "ticket",
      left: {
        key: "ONB-30",
        type: "story",
        points: 13,
        title: "Self-serve onboarding for enterprise tenants",
        footer:
          "Sprint commitment. We will handle whatever comes up as it comes up.",
      },
      right: {
        key: "ONB-30",
        type: "spike",
        points: 3,
        title: "Identify the smallest end-to-end onboarding slice",
        footer:
          "A 13 from the room means we do not understand this yet. Spike for one sprint, return with three smaller stories ready to estimate.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "13 is a signal that the team is uncertain, not an estimate they can commit to. The right move is to split or spike. A spike that returns three sized stories is cheaper than a 13-pointer that misses the sprint and re-splits under pressure.",
    explanationWrong:
      "Pulling a 13 into a sprint is taking a bet. Half the time the team will discover the work was actually 21 and the sprint will end with 'in progress' tickets that nobody can land.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/five-simple-but-powerful-ways-to-split-user-stories",
    sourceLabel: "Mike Cohn: SPIDR",
  },
  {
    id: "sp-004",
    category: "story-points",
    difficulty: "hard",
    title: "Spread of estimates",
    prompt:
      "Three engineers point a story 2, 2, 13. What does the team do next?",
    content: {
      type: "ticket",
      left: {
        key: "META-02",
        type: "task",
        title: "Pointing a story",
        description:
          "Three engineers point: 2, 2, 13. Average to 6, round to 5, move on.",
      },
      right: {
        key: "META-02",
        type: "task",
        title: "Pointing a story",
        description:
          "Three engineers point: 2, 2, 13. The 13 saw something the others did not. Talk it through, then re-estimate.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The point of pointing is the conversation. A spread of 2-2-13 is the signal that two of the three are missing something the third sees. Average it and you ship the same misunderstanding into the sprint.",
    explanationWrong:
      "Averaging a wide spread is the worst move. The number you produce was never an estimate; it was a compromise that buries the disagreement. The work will hit the missed scope mid-sprint.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/why-the-fibonacci-sequence-works-well-for-estimating",
    sourceLabel: "Mike Cohn: Why Fibonacci Works",
  },
  {
    id: "sp-005",
    category: "story-points",
    difficulty: "medium",
    title: "Reference stories",
    prompt: "Which scale anchors the team to a shared baseline?",
    content: {
      type: "ticket",
      left: {
        key: "META-03",
        type: "task",
        title: "How the team points stories",
        description:
          "Each engineer estimates how long it would take them. We average. New engineers calibrate over time.",
      },
      right: {
        key: "META-03",
        type: "task",
        title: "How the team points stories",
        description:
          "Reference stories pinned in the team space: a 1 (config flag toggle), a 3 (typed form with two endpoints), an 8 (cross-cutting feature with a migration). All pointing happens against those.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Reference stories anchor the team to a shared baseline. New joiners and old hands point against the same yardstick, which makes the spread compress over time without anyone having to memorize hours.",
    explanationWrong:
      "Time-based estimates drift per engineer and per week. Without reference stories, a new joiner's 3 is a senior engineer's 1, and the team's velocity becomes unreadable.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/why-the-fibonacci-sequence-works-well-for-estimating",
    sourceLabel: "Mike Cohn: Why Fibonacci Works",
  },
  {
    id: "sp-006",
    category: "story-points",
    difficulty: "medium",
    title: "Pulling an 8 into a sprint",
    prompt: "How should the team handle an 8-point story at planning?",
    content: {
      type: "ticket",
      left: {
        key: "REP-22",
        type: "story",
        points: 8,
        title: "Managers compare team throughput across quarters",
        footer: "Sprint commitment. Will accept the 8 and ship it.",
      },
      right: {
        key: "REP-22",
        type: "story",
        points: 8,
        title: "Managers compare team throughput across quarters",
        footer:
          "Eight points pulled into the sprint. Flagged as a risk in the planning notes; if it slips, we re-split mid-sprint rather than carry over.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "An 8 probably wants to be two stories, but a single sprint can absorb one if the team flags it as a risk and agrees on the re-split rule up front. That is the difference between an honest commitment and an optimistic one.",
    explanationWrong:
      "Pulling an 8 silently means the team has not decided what happens when it slips. The sprint review will rediscover the same conversation, except now there is in-flight work to split around.",
    sourceUrl: "https://xp123.com/invest-in-good-stories-and-smart-tasks/",
    sourceLabel: "Bill Wake: INVEST in Good Stories",
  },
  {
    id: "sp-007",
    category: "story-points",
    difficulty: "medium",
    title: "Using velocity at planning",
    prompt: "How should the team treat last sprint's velocity number?",
    content: {
      type: "ticket",
      left: {
        key: "META-04",
        type: "task",
        title: "Sprint capacity",
        description:
          "Velocity last sprint: 32. Target this sprint: 32. Pull stories until the total reaches 32.",
      },
      right: {
        key: "META-04",
        type: "task",
        title: "Sprint capacity",
        description:
          "Velocity over the last three sprints: 28, 32, 24 (median 28). Pull stories until the total reaches roughly 28, then leave room for unplanned work.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Velocity is a planning aid, not a target. The median across recent sprints is more honest than the last sprint. Leaving headroom for unplanned work means the team finishes; treating velocity as a target means it becomes a ratchet.",
    explanationWrong:
      "Pulling to last sprint's number assumes last sprint was typical. The team rotates, holidays land, fires happen. Pulling to that single number guarantees an over-commit half the time.",
    sourceUrl:
      "https://www.scrum.org/resources/blog/velocity-false-metric-productivity",
    sourceLabel: "Scrum.org: Velocity is a planning aid",
  },
];
