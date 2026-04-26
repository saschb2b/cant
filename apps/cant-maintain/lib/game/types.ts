import type {
  BaseChallenge,
  Difficulty,
  GameState as SharedGameState,
} from "@cant/shared/lib/game";
import type { APP_CATALOG } from "@cant/shared/lib/app-catalog";

export type ChallengeCategory =
  (typeof APP_CATALOG)["cant-maintain"]["categories"][number]["slug"];

export type Challenge = BaseChallenge<ChallengeCategory>;

export type GameState = SharedGameState<Challenge>;

export type { Difficulty };
