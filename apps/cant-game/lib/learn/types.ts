import type { ChallengeContent } from "@cant/shared/lib/game";

/** Difficulty tier for sorting and game mode. */
export type Difficulty = "easy" | "medium" | "hard";

/** Category tag for grouping and filtering challenges. */
export type ChallengeCategory =
  | "game-loop"
  | "input"
  | "rendering"
  | "physics"
  | "netcode"
  | "shaders"
  | "ai"
  | "state";

/**
 * A single game development challenge.
 *
 * Each challenge shows a naive/wrong approach next to
 * the robust/correct approach with an explanation.
 */
export interface Challenge {
  /** Unique identifier, prefixed by category abbreviation (e.g. "loop-001"). */
  id: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  /** Short title shown above the code panels. */
  title: string;
  /** Contextual question framing what the player is evaluating. */
  prompt: string;
  /** The challenge content (code snippets, images, or visual components). */
  content: ChallengeContent;
  /** Which side the good content appears on. Randomized at render in game mode. */
  correctSide: "left" | "right";
  /** Explanation shown when the user picks correctly (or in learn mode). */
  explanationCorrect: string;
  /** Explanation shown when the user picks incorrectly. */
  explanationWrong: string;
  /** URL to an authoritative source for learning more. */
  sourceUrl: string;
  /** Display label for the source link. */
  sourceLabel: string;
}
