import type { BaseChallenge } from "../../game/types";

export const estimationRitualsChallenges: BaseChallenge[] = [
  {
    id: "er-001",
    category: "estimation-rituals",
    difficulty: "easy",
    title: "Order of estimates",
    prompt: "Which planning poker procedure does the team adopt?",
    content: {
      type: "ticket",
      left: {
        key: "META-10",
        type: "task",
        title: "Planning poker procedure",
        description:
          "The senior engineer states their estimate first. The rest of the team says whether they agree.",
      },
      right: {
        key: "META-10",
        type: "task",
        title: "Planning poker procedure",
        description:
          "Each engineer picks a number privately. All numbers are revealed at once. The room discusses spreads, then re-estimates.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Independent estimates surface real disagreement. The reveal is the moment that lets the room see who saw what differently. Anchoring on one engineer's number first collapses the spread before it has a chance to inform anyone.",
    explanationWrong:
      "When the senior estimates first, the rest of the room rounds to that number. The disagreement that would have surfaced never does, and the team takes the implicit anchor into the sprint.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/why-the-fibonacci-sequence-works-well-for-estimating",
    sourceLabel: "Mike Cohn: Why Fibonacci Works",
  },
  {
    id: "er-002",
    category: "estimation-rituals",
    difficulty: "easy",
    title: "Who estimates",
    prompt: "Who should be in the room when the team points stories?",
    content: {
      type: "ticket",
      left: {
        key: "META-11",
        type: "task",
        title: "Who estimates",
        description:
          "The team lead and the PM estimate together and bring the result to the team for confirmation.",
      },
      right: {
        key: "META-11",
        type: "task",
        title: "Who estimates",
        description:
          "Everyone who might do the work estimates: engineers, QA, design, on-call rotation. The PM brings the story; the team owns the number.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The number belongs to the people who do the work. Including QA, design, and on-call surfaces variations the dev-only estimate would miss. The PM's job is to bring the story; the team's job is to estimate it.",
    explanationWrong:
      "Pre-cooking the estimate excludes the people who carry the implementation cost. They will discover the missing scope mid-sprint and the team's trust in the planning ritual will degrade.",
    sourceUrl:
      "https://ronjeffries.com/xprog/articles/expcardconversationconfirmation/",
    sourceLabel: "Ron Jeffries: Card, Conversation, Confirmation",
  },
  {
    id: "er-003",
    category: "estimation-rituals",
    difficulty: "easy",
    title: "Output of a pointing session",
    prompt: "What does each story carry away from refinement?",
    content: {
      type: "ticket",
      left: {
        key: "META-12",
        type: "task",
        title: "Output of pointing",
        description:
          "Each story leaves with a number on it. Disagreements are averaged. The team moves on quickly.",
      },
      right: {
        key: "META-12",
        type: "task",
        title: "Output of pointing",
        description:
          "Each story leaves with a number, a one-line note on what made it that size, and any open questions for the next refinement.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The number is a side effect; the conversation is the point. Capturing what made the size what it is plus the open questions means the next refinement starts with context, not from scratch.",
    explanationWrong:
      "A naked number tells the next reader nothing about the tradeoffs the room considered. When the story is pulled three sprints later, the team re-points it from scratch and the original disagreement reappears.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/why-the-fibonacci-sequence-works-well-for-estimating",
    sourceLabel: "Mike Cohn: Why Fibonacci Works",
  },
  {
    id: "er-004",
    category: "estimation-rituals",
    difficulty: "medium",
    title: "T-shirts vs Fibonacci",
    prompt: "Which scale fits epic-level early estimation?",
    content: {
      type: "ticket",
      left: {
        key: "META-13",
        type: "task",
        title: "Epic-level estimation",
        description:
          "Each Epic in the next quarter gets a Fibonacci number (3, 5, 8, 13, 21).",
      },
      right: {
        key: "META-13",
        type: "task",
        title: "Epic-level estimation",
        description:
          "Each Epic in the next quarter gets a t-shirt size (S, M, L, XL). Stories inside the Epic get Fibonacci once they enter refinement.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "T-shirt sizes match the precision available at the Epic stage: rough relative size for roadmap planning. Fibonacci comes in once the work is concrete enough to estimate against reference stories.",
    explanationWrong:
      "Fibonacci numbers on Epics imply a precision the team does not have yet. The numbers will be wrong by 2x in either direction and stakeholders will treat them as commitments anyway.",
    sourceUrl:
      "https://www.atlassian.com/agile/project-management/epics-stories-themes",
    sourceLabel: "Atlassian: Epics, Stories, and Initiatives",
  },
  {
    id: "er-005",
    category: "estimation-rituals",
    difficulty: "medium",
    title: "When to skip pointing",
    prompt: "Which work is correctly handled outside the pointing ritual?",
    content: {
      type: "ticket",
      left: {
        key: "META-14",
        type: "task",
        title: "What gets pointed",
        description:
          "Every backlog item including bug tickets, copy tweaks, and config changes is pointed at refinement.",
      },
      right: {
        key: "META-14",
        type: "task",
        title: "What gets pointed",
        description:
          "Stories and bigger Tasks are pointed. Tiny chores (copy tweaks, single-line config) ride along as no-point or 1-point items, capped per sprint.",
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Pointing every two-minute change costs more than the change. The right side reserves the ritual for work where the conversation matters and lets small chores ride along on a cap so velocity stays meaningful.",
    explanationWrong:
      "Pointing a copy tweak as a 1 inflates velocity without telling you anything. Multiply it across 30 chores a sprint and the velocity number becomes unrelated to the size of real work.",
    sourceUrl:
      "https://www.mountaingoatsoftware.com/blog/why-the-fibonacci-sequence-works-well-for-estimating",
    sourceLabel: "Mike Cohn: Why Fibonacci Works",
  },
];
