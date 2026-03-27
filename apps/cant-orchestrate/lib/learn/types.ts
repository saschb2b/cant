import type { ChallengeContent } from "@cant/shared/lib/game";

/** Difficulty tier for sorting and game mode. */
export type Difficulty = "easy" | "medium" | "hard";

/** Category tag for grouping and filtering challenges. */
export type ChallengeCategory =
  | "dockerfile-basics"
  | "image-optimization"
  | "docker-compose"
  | "volumes-storage"
  | "networking"
  | "health-checks"
  | "security"
  | "environment-config"
  | "kubernetes-pods"
  | "kubernetes-services"
  | "kubernetes-config"
  | "helm-charts"
  | "docker-swarm"
  | "ci-cd-pipelines"
  | "build-scripts"
  | "common-mistakes";

/**
 * A single orchestration challenge.
 *
 * Each challenge shows a fragile/wrong approach next to
 * the resilient/correct approach with an explanation.
 */
export interface Challenge {
  /** Unique identifier, prefixed by category abbreviation (e.g. "df-001"). */
  id: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  /** Short title shown above the code panels. */
  title: string;
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
