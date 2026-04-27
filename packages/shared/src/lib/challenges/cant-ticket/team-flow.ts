import type { BaseChallenge } from "../../game/types";

export const teamFlowChallenges: BaseChallenge[] = [
  {
    id: "tf-001",
    category: "team-flow",
    difficulty: "easy",
    title: "Velocity vs throughput",
    prompt: "Which metric tells the team how much work is finishing?",
    content: {
      type: "ticket",
      left: {
        key: "META-60",
        type: "task",
        title: "Team flow metric",
        description:
          "Track velocity each sprint and trend it over time. The number going up means the team is improving.",
      },
      right: {
        key: "META-60",
        type: "task",
        title: "Team flow metric",
        description:
          "Track throughput (stories shipped per sprint) and lead time (idea to deploy). Velocity is a planning aid; throughput is the outcome.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Throughput counts what users got. Lead time names how long they waited. Velocity is a useful capacity number for the next sprint, but it is not the goal; treating it as one creates pressure to inflate point estimates rather than ship.",
    explanationWrong:
      "Velocity going up can mean the team got faster, or it can mean the team learned to point bigger. Without throughput as a counter-check, the trend is unreadable.",
    sourceUrl:
      "https://www.scrum.org/resources/blog/velocity-false-metric-productivity",
    sourceLabel: "Scrum.org: Velocity is a planning aid",
  },
  {
    id: "tf-002",
    category: "team-flow",
    difficulty: "easy",
    title: "WIP limits",
    prompt: "Which board policy keeps work moving?",
    content: {
      type: "ticket",
      left: {
        key: "META-61",
        type: "task",
        title: "In-progress policy",
        description:
          "Engineers pull whatever they can while waiting on review. Average four cards in progress per person.",
      },
      right: {
        key: "META-61",
        type: "task",
        title: "In-progress policy",
        description:
          "Each engineer has at most two cards in progress. If a card is blocked, swarm to unblock it before pulling new work.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "WIP limits force the team to finish before starting. Two cards per person caps the context-switching cost; the swarm-to-unblock rule turns 'waiting on review' from a personal problem into a team one.",
    explanationWrong:
      "Four cards in progress means three are waiting for something. The team is busy and slow at the same time. Throughput drops, lead time stretches, and the board fills up with 'in progress' that is not progressing.",
    sourceUrl: "https://www.atlassian.com/agile/kanban/wip-limits",
    sourceLabel: "Atlassian: WIP Limits",
  },
  {
    id: "tf-003",
    category: "team-flow",
    difficulty: "easy",
    title: "Sprint pull volume",
    prompt: "How much work should the team pull into the next sprint?",
    content: {
      type: "ticket",
      left: {
        key: "META-62",
        type: "task",
        title: "Sprint planning",
        description:
          "Pull stories totalling the team's average velocity. Commit to finishing all of them.",
      },
      right: {
        key: "META-62",
        type: "task",
        title: "Sprint planning",
        description:
          "Pull stories totalling about 70% of the team's median velocity. The remaining capacity absorbs incident response, support, and the work the team will discover mid-sprint.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "70% leaves room for the work the team will discover mid-sprint. Incidents, support escalations, and 'oh, this story was bigger than we thought' all need somewhere to land. A pre-allocated buffer means they land cleanly.",
    explanationWrong:
      "Pulling to 100% of velocity means every interruption forces a story to be cut, and the team drifts into a culture of over-commitment. Reviews become rationalization sessions instead of learning.",
    sourceUrl:
      "https://www.scrum.org/resources/blog/obsession-commitment-matching-velocity",
    sourceLabel: "Scrum.org: Forecast vs Commitment",
  },
  {
    id: "tf-004",
    category: "team-flow",
    difficulty: "medium",
    title: "Lead time vs cycle time",
    prompt: "Which definition matches what the team is measuring?",
    content: {
      type: "ticket",
      left: {
        key: "META-63",
        type: "task",
        title: "Time-on-the-board metrics",
        description:
          "Lead time = time from story creation to deploy. Cycle time = time from In Progress to Done. Both reported as a single average.",
      },
      right: {
        key: "META-63",
        type: "task",
        title: "Time-on-the-board metrics",
        description:
          "Lead time = idea (or customer request) to live in production. Cycle time = pulled into In Progress to Done. Both reported as p50 and p85, not as averages.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Lead time tells the customer how long they wait. Cycle time tells the team how long the work itself took. Reporting percentiles (not averages) catches the long tail that averages hide.",
    explanationWrong:
      "An average flattens the long-tailed distribution that matters most. The 5% of stories that take three sprints are exactly the stories the team needs to talk about, and the average buries them.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/kanban-metrics",
    sourceLabel: "Atlassian: Cycle Time",
  },
  {
    id: "tf-005",
    category: "team-flow",
    difficulty: "hard",
    title: "Focus factor",
    prompt:
      "Which capacity calculation reflects what the team can actually do?",
    content: {
      type: "ticket",
      left: {
        key: "META-64",
        type: "task",
        title: "Capacity for next sprint",
        description:
          "Five engineers × 10 working days = 50 person-days available. Pull stories worth 50 person-days.",
      },
      right: {
        key: "META-64",
        type: "task",
        title: "Capacity for next sprint",
        description:
          "Five engineers × 10 working days × ~0.6 focus factor (meetings, reviews, on-call rotation, support) = ~30 person-days. Subtract holidays and known interrupts. Pull to that.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Engineers do not spend 100% of their day shipping. Meetings, reviews, on-call, and support are real. A ~0.6 focus factor is honest; pretending the number is 1.0 produces over-commitment every sprint.",
    explanationWrong:
      "Treating every working day as a delivery day means the sprint is over-pulled by 40% before it starts. The team finishes 60% of the plan and is told they are slow.",
    sourceUrl:
      "https://www.scrum.org/resources/blog/obsession-commitment-matching-velocity",
    sourceLabel: "Scrum.org: Forecast vs Commitment",
  },
  {
    id: "tf-006",
    category: "team-flow",
    difficulty: "medium",
    title: "Carryover policy",
    prompt: "Which rule keeps the team from drifting into perma-carryover?",
    content: {
      type: "ticket",
      left: {
        key: "META-65",
        type: "task",
        title: "When a story does not finish",
        description:
          "Roll the story into the next sprint. Subtract its remaining points from next sprint's capacity.",
      },
      right: {
        key: "META-65",
        type: "task",
        title: "When a story does not finish",
        description:
          "Move the story back to the backlog and re-refine. If it carried because of missing scope, split it. If it carried because of estimation error, raise that in retro.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Stories that did not finish are signal. Sending them back through refinement forces the team to name what went wrong (under-scoped, over-estimated, blocked). Auto-rolling buries the signal and the same problem recurs.",
    explanationWrong:
      "Auto-carryover is a way of pretending the sprint succeeded. The same story will roll again, the velocity number will be unreadable, and the retro will not see the pattern because the carry happens silently.",
    sourceUrl: "https://www.scrum.org/resources/what-is-a-sprint-retrospective",
    sourceLabel: "Scrum.org: Retrospective",
  },
];
