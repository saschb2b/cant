import type { ChallengeContent } from "@cant/shared/lib/game";

/** Difficulty tier for sorting and game mode. */
export type Difficulty = "easy" | "medium" | "hard";

/** Category tag for grouping and filtering challenges. */
export type ChallengeCategory =
  | "molecular-stability"
  | "acid-strength"
  | "bond-energy"
  | "electronegativity"
  | "reaction-favorability"
  | "solubility"
  | "oxidation-reduction"
  | "functional-groups"
  | "structural-formulas"
  | "molecular-geometry"
  | "periodic-trends"
  | "electron-configuration"
  | "energy-diagrams"
  | "stereochemistry"
  | "electrostatic-maps"
  | "protein-structure";

/**
 * A single chemistry challenge.
 *
 * Each challenge shows two chemical concepts side by side
 * and asks the user to pick the better or more correct option.
 */
export interface Challenge {
  /** Unique identifier, prefixed by category abbreviation (e.g. "ms-001"). */
  id: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  /** Short title shown above the content panels. */
  title: string;
  /** Contextual question telling the player what to evaluate. */
  prompt: string;
  /** The challenge content (code snippets, images, molecules, or visual components). */
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
