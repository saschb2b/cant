import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-type";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-type/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  typeNarrowingChallenges,
  genericsChallenges,
  utilityTypeChallenges,
  unionIntersectionChallenges,
  typeAssertionChallenges,
  enumsLiteralsChallenges,
  strictModeChallenges,
  readonlyImmutabilityChallenges,
  functionTypeChallenges,
  interfaceVsTypeChallenges,
  mappedTypeChallenges,
  templateLiteralChallenges,
  reactTypescriptChallenges,
  moduleTypeChallenges,
  errorHandlingChallenges,
  commonMistakeChallenges,
} from "@cant/shared/lib/challenges/cant-type";
