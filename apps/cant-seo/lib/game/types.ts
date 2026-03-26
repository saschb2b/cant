/**
 * Re-exports challenge types from the learn module and adds game-specific
 * state types used by the /play game mode.
 */

export type {
  Challenge,
  ChallengeCategory,
  CodeLanguage,
  Difficulty,
} from "../learn/types";

/** Snapshot of the current game state. */
export interface GameState {
  /** All challenges in play order (shuffled, difficulty-sorted). */
  challenges: import("../learn/types").Challenge[];
  /** Index of the current challenge. */
  currentIndex: number;
  /** Running score. */
  score: number;
  /** Current streak of correct answers. */
  streak: number;
  /** Best streak achieved this session. */
  bestStreak: number;
  /** Map of challenge id -> answer result and which side was chosen. */
  answers: Record<
    string,
    { result: "correct" | "wrong"; side: "left" | "right" }
  >;
  /** Index of a previously answered challenge being reviewed, or null. */
  reviewIndex: number | null;
  /** Whether the game has ended. */
  isFinished: boolean;
  /** Timestamp game started. */
  startedAt: number;
  /** Timestamp game finished (set when isFinished becomes true). */
  finishedAt: number | null;
  /** Seed string used to generate this session's challenge order. */
  seed: string;
  /** How the game was started. */
  gameType: "daily" | "weekly" | "custom";
}
