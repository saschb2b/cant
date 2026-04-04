import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-query";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-query/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  restApiDesignChallenges,
  graphqlPatternChallenges,
  websocketsRealtimeChallenges,
  authPatternChallenges,
  errorHandlingChallenges,
  apiConsumptionChallenges,
  docsContractsChallenges,
} from "@cant/shared/lib/challenges/cant-query";
