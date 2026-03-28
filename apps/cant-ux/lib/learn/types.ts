import type { ChallengeContent } from "@cant/shared/lib/game";

/** Difficulty tier for sorting and (future) game mode. */
export type Difficulty = "easy" | "medium" | "hard";

/** Category tag for grouping and filtering challenges. */
export type ChallengeCategory =
  | "typography"
  | "spacing"
  | "color"
  | "hierarchy"
  | "layout"
  | "forms"
  | "feedback";

/**
 * A single UX design challenge.
 *
 * Each challenge shows a poor approach next to
 * the better approach with an explanation.
 */
export interface Challenge {
  /** Unique identifier, prefixed by category abbreviation (e.g. "typ-001"). */
  id: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  /** Short title shown above the visual panels. */
  title: string;
  /** Contextual question telling the player what to evaluate. */
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
