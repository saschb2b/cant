import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-explode";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-explode/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  molecularStabilityChallenges,
  acidStrengthChallenges,
  bondEnergyChallenges,
  electronegativityChallenges,
  reactionFavorabilityChallenges,
  solubilityChallenges,
  oxidationReductionChallenges,
  functionalGroupsChallenges,
  structuralFormulasChallenges,
  molecularGeometryChallenges,
  periodicTrendsChallenges,
  electronConfigurationChallenges,
  energyDiagramsChallenges,
  stereochemistryChallenges,
  electrostaticMapsChallenges,
  proteinStructureChallenges,
} from "@cant/shared/lib/challenges/cant-explode";
