import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-game";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-game/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  gameLoopChallenges,
  stateChallenges,
  inputChallenges,
  physicsChallenges,
  aiChallenges,
  renderingChallenges,
  shadersChallenges,
  netcodeChallenges,
} from "@cant/shared/lib/challenges/cant-game";
