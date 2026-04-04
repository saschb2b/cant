import type { BaseChallenge, Difficulty } from "@cant/shared/lib/game";
import type { APP_CATALOG } from "@cant/shared/lib/app-catalog";

export type ChallengeCategory =
  (typeof APP_CATALOG)["cant-resize"]["categories"][number]["slug"];

export type Challenge = BaseChallenge<ChallengeCategory>;

export type { Difficulty };
