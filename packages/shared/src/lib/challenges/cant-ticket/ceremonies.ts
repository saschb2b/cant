import type { BaseChallenge } from "../../game/types";

export const ceremoniesChallenges: BaseChallenge[] = [
  {
    id: "cer-001",
    category: "ceremonies",
    difficulty: "easy",
    title: "Standup purpose",
    prompt: "Which standup serves the team rather than reporting upward?",
    content: {
      type: "ticket",
      left: {
        key: "META-70",
        type: "task",
        title: "Daily standup",
        description:
          "Each person reports yesterday, today, and blockers in turn. Manager listens for status. Lasts 30 minutes.",
      },
      right: {
        key: "META-70",
        type: "task",
        title: "Daily standup",
        description:
          "Walk the board right to left. Anything stuck for more than a day gets a focused conversation after standup. Within the 15-minute timebox; deeper threads happen after.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Walking the board surfaces what is stuck, not what each person did. The team coordinates around finishing in-progress work first; deeper threads happen with the right people, not in front of everyone.",
    explanationWrong:
      "A turn-taking status report is a meeting for the manager. The team learns nothing they did not already know, blockers surface late, and 30 minutes per day per engineer adds up to a day per week.",
    sourceUrl: "https://www.scrum.org/resources/what-is-a-daily-scrum",
    sourceLabel: "Scrum.org: Daily Scrum",
  },
  {
    id: "cer-002",
    category: "ceremonies",
    difficulty: "easy",
    title: "Backlog refinement format",
    prompt: "How should the team run backlog refinement?",
    content: {
      type: "ticket",
      left: {
        key: "META-71",
        type: "task",
        title: "Backlog refinement",
        description:
          "PM presents the next ten stories at refinement. Engineers point them. Move on.",
      },
      right: {
        key: "META-71",
        type: "task",
        title: "Backlog refinement",
        description:
          "PM brings the top of the backlog. Each story is talked through, ACs are clarified, splits happen if needed, dependencies are linked. Stories that pass DoR are pulled forward; the rest go back for prep.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Refinement produces stories the team can pull next sprint without surprise. Splitting and AC clarification happen here so they are not happening mid-sprint. The Definition of Ready is the gate.",
    explanationWrong:
      "Speed-pointing ten stories produces ten numbers and zero shared understanding. The first sprint into those stories will spend the first three days re-refining the work the team supposedly already estimated.",
    sourceUrl: "https://www.scrum.org/resources/product-backlog-refinement",
    sourceLabel: "Scrum.org: Backlog Refinement",
  },
  {
    id: "cer-003",
    category: "ceremonies",
    difficulty: "easy",
    title: "Sprint planning shape",
    prompt: "Which sprint planning ends with a workable plan?",
    content: {
      type: "ticket",
      left: {
        key: "META-72",
        type: "task",
        title: "Sprint planning",
        description:
          "Pull the top of the backlog until the total points equal velocity. Move on.",
      },
      right: {
        key: "META-72",
        type: "task",
        title: "Sprint planning",
        description:
          "Pick a sprint goal that explains why this sprint matters. Pull stories that serve the goal up to capacity (with headroom). Walk through the first day's work so the team starts cleanly tomorrow.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "A sprint goal anchors the work. Stories that serve the goal pull together; the headroom absorbs the unplanned. Walking through day one means nobody starts the sprint hunting for context.",
    explanationWrong:
      "Pulling to a velocity number with no goal produces a sprint where each story is unrelated to the next. The review is a list of disconnected demos, and the team cannot tell whether the sprint succeeded or failed.",
    sourceUrl: "https://www.scrum.org/resources/what-is-sprint-planning",
    sourceLabel: "Scrum.org: Sprint Planning",
  },
  {
    id: "cer-004",
    category: "ceremonies",
    difficulty: "medium",
    title: "Sprint review format",
    prompt: "How should the team run a sprint review with stakeholders?",
    content: {
      type: "ticket",
      left: {
        key: "META-73",
        type: "task",
        title: "Sprint review",
        description:
          "Each engineer demos their stories. Stakeholders applaud. The PM thanks the team.",
      },
      right: {
        key: "META-73",
        type: "task",
        title: "Sprint review",
        description:
          "PM walks the sprint goal. Team shows shipped work in user-flow order, names what changed mid-sprint, and surfaces stakeholder questions for next-sprint planning.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "A review is a working session, not a celebration. Showing the work in user-flow order with mid-sprint changes named makes it useful for prioritization. The questions feed straight into the next refinement.",
    explanationWrong:
      "Per-engineer demos optimize for individual recognition, not product alignment. Stakeholders see fragments and have nowhere to push back; the team learns nothing about how the work landed.",
    sourceUrl: "https://www.scrum.org/resources/what-is-a-sprint-review",
    sourceLabel: "Scrum.org: Sprint Review",
  },
  {
    id: "cer-005",
    category: "ceremonies",
    difficulty: "medium",
    title: "Retrospective format",
    prompt: "Which retrospective format makes outcomes follow?",
    content: {
      type: "ticket",
      left: {
        key: "META-74",
        type: "task",
        title: "Sprint retro",
        description:
          "Round-robin: what went well, what didn't. Notes captured in the retro doc. Move on.",
      },
      right: {
        key: "META-74",
        type: "task",
        title: "Sprint retro",
        description:
          "Pick the one or two issues that cost the team most this sprint. For each, agree on a concrete change with an owner and a tripwire ('if X happens again, do Y'). Review last sprint's tripwires first.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Retros that change behavior name a small number of changes, give them owners, and follow up. Reviewing last retro's tripwires at the start keeps the team honest about whether anything actually changed.",
    explanationWrong:
      "A round-robin retro that ends with a note in a doc is a feelings-check, not a learning loop. Without owners and follow-up, the same item appears in next sprint's retro and the one after.",
    sourceUrl: "https://www.scrum.org/resources/what-is-a-sprint-retrospective",
    sourceLabel: "Scrum.org: Sprint Retrospective",
  },
  {
    id: "cer-006",
    category: "ceremonies",
    difficulty: "hard",
    title: "Ceremony cadence policy",
    prompt: "How should the team treat its standing ceremonies over time?",
    content: {
      type: "ticket",
      left: {
        key: "META-75",
        type: "task",
        title: "Ceremony hygiene",
        description:
          "Standup, refinement, planning, review, retro happen on the calendar every sprint regardless of whether they are working.",
      },
      right: {
        key: "META-75",
        type: "task",
        title: "Ceremony hygiene",
        description:
          "Each ceremony has a stated purpose. If it stops serving that purpose, change the format or drop it for a sprint. The forcing function is the team's outcomes, not the calendar.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Ceremonies are tools. When the tool stops doing the job, change it. Naming the purpose makes it possible to tell whether the ceremony is working, and dropping one for a sprint usually shows the team whether they actually needed it.",
    explanationWrong:
      "Keeping a broken ceremony on the calendar is the most common form of agile theater. The team attends, the work does not improve, and the cost is real (a half-day a week per engineer adds up).",
    sourceUrl: "https://agilemanifesto.org/principles.html",
    sourceLabel: "Agile Manifesto: Principles",
  },
];
