export type Difficulty = "easy" | "medium" | "hard";

/** Base challenge fields used by shared game components. */
export interface BaseChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  goodCode: string;
  badCode: string;
  correctSide: "left" | "right";
  explanationCorrect: string;
  sourceUrl: string;
  sourceLabel: string;
}

/** Snapshot of the current game state. */
export interface GameState {
  challenges: BaseChallenge[];
  currentIndex: number;
  score: number;
  streak: number;
  bestStreak: number;
  answers: Record<
    string,
    { result: "correct" | "wrong"; side: "left" | "right" }
  >;
  reviewIndex: number | null;
  isFinished: boolean;
  startedAt: number;
  finishedAt: number | null;
  seed: string;
  gameType: "daily" | "weekly" | "custom";
}
