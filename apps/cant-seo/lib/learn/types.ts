import type {
  BaseChallenge,
  Difficulty,
  GameState as SharedGameState,
} from "@cant/shared/lib/game";
import type { CategorySlug } from "@cant/shared/lib/app-categories";

/** Category slugs this app declares in the shared catalog. */
export type ChallengeCategory = CategorySlug<"cant-seo">;

/** A challenge belonging to this app. */
export type Challenge = BaseChallenge<ChallengeCategory>;

/** Snapshot of the current game state. */
export type GameState = SharedGameState<Challenge>;

export type { Difficulty };
