export const DECK = [
  "0",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "21",
  "?",
  "coffee",
] as const;

export type Vote = (typeof DECK)[number];

export function isVote(value: unknown): value is Vote {
  return (
    typeof value === "string" && (DECK as readonly string[]).includes(value)
  );
}

export interface DeckGuideRow {
  value: Vote;
  label: string;
  description: string;
}

export const DECK_GUIDE: readonly DeckGuideRow[] = [
  {
    value: "0",
    label: "Already done",
    description: "Nothing to do, or the work is already complete.",
  },
  {
    value: "1",
    label: "Trivial",
    description: "Tiny tweak with no unknowns. A copy change or one-line fix.",
  },
  {
    value: "2",
    label: "Small",
    description:
      "Small and predictable. You have done this kind of thing before.",
  },
  {
    value: "3",
    label: "Standard",
    description:
      "A normal slice of work. Familiar shape, no surprises expected.",
  },
  {
    value: "5",
    label: "Medium",
    description: "Bigger or has one real unknown. Worth a quick design chat.",
  },
  {
    value: "8",
    label: "Large",
    description: "Spans several parts of the system or has multiple unknowns.",
  },
  {
    value: "13",
    label: "Stretching",
    description: "Pushing the limits of a single story. Consider splitting.",
  },
  {
    value: "21",
    label: "Too big",
    description: "Almost certainly an epic. Split before pulling it in.",
  },
  {
    value: "?",
    label: "Not enough info",
    description: "You cannot estimate this yet. Needs more clarity first.",
  },
  {
    value: "coffee",
    label: "Break",
    description: "Time to step away. Brains do not estimate well when tired.",
  },
];
