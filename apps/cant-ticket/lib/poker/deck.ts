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
