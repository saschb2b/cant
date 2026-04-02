import type { ChallengeContent } from "@cant/shared/lib/game";
import type { APP_CATALOG } from "@cant/shared/lib/app-catalog";
import { type GameState as SharedGameState } from "@cant/shared/lib/game";

/** Difficulty tier that determines when a challenge appears in the game. */
export type Difficulty = "easy" | "medium" | "hard";

/** Category tag for grouping and filtering challenges. */
export type ChallengeCategory =
  (typeof APP_CATALOG)["cant-branch"]["categories"][number]["slug"];

export interface Challenge {
  /** Unique identifier, prefixed by category abbreviation (e.g. "cm-001"). */
  id: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  /** Short title shown above the code panels. */
  title: string;
  /** Contextual question telling the player what to evaluate. */
  prompt: string;
  /** The challenge content (code snippets, images, or visual components). */
  content: ChallengeContent;
  /** Which side the good content should appear on - randomized at render time. */
  correctSide: "left" | "right";
  /** Explanation shown when the user picks correctly. */
  explanationCorrect: string;
  /** Explanation shown when the user picks incorrectly. */
  explanationWrong: string;
  /** URL to an authoritative source for learning more. */
  sourceUrl: string;
  /** Display label for the source link. */
  sourceLabel: string;
}

/** Snapshot of the current game state. */
export type GameState = SharedGameState<Challenge>;
