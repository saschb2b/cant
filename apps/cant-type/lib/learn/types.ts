import type { ChallengeContent } from "@cant/shared/lib/game";

/** Difficulty tier for sorting and game mode. */
export type Difficulty = "easy" | "medium" | "hard";

/** Category tag for grouping and filtering challenges. */
export type ChallengeCategory =
  | "type-narrowing"
  | "generics"
  | "utility-types"
  | "union-intersection"
  | "type-assertions"
  | "enums-literals"
  | "function-types"
  | "interface-vs-type"
  | "strict-mode"
  | "template-literals"
  | "mapped-types"
  | "module-types"
  | "react-typescript"
  | "error-handling"
  | "readonly-immutability"
  | "common-mistakes";

/**
 * A single TypeScript challenge.
 *
 * Each challenge shows a fragile/wrong approach next to
 * the resilient/correct approach with an explanation.
 */
export interface Challenge {
  /** Unique identifier, prefixed by category abbreviation (e.g. "tn-001"). */
  id: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  /** Short title shown above the code panels. */
  title: string;
  /** Contextual question telling the player what they are evaluating. */
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
