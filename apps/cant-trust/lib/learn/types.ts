import type { ChallengeContent } from "@cant/shared/lib/game";

/** Difficulty tier for sorting and game mode. */
export type Difficulty = "easy" | "medium" | "hard";

/** Category tag for grouping and filtering challenges. */
export type ChallengeCategory =
  | "money-origins"
  | "banking-mechanics"
  | "banking-failures"
  | "central-banks"
  | "nixon-shock"
  | "inflation"
  | "settlement"
  | "cryptography"
  | "consensus"
  | "bitcoin"
  | "wallets-keys"
  | "smart-contracts"
  | "defi"
  | "privacy"
  | "scaling"
  | "cbdcs"
  | "governance"
  | "fix-the-money";

/**
 * A single challenge comparing two approaches to money, finance, or crypto.
 *
 * Each challenge shows a flawed/naive approach next to
 * the better/correct approach with an explanation.
 */
export interface Challenge {
  /** Unique identifier, prefixed by category abbreviation (e.g. "mo-001"). */
  id: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  /** Short title shown above the content panels. */
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
