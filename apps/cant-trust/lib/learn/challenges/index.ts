import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-trust";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-trust/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  moneyOriginsChallenges,
  bankingMechanicsChallenges,
  bankingFailuresChallenges,
  centralBanksChallenges,
  nixonShockChallenges,
  inflationChallenges,
  settlementChallenges,
  cryptographyChallenges,
  consensusChallenges,
  bitcoinChallenges,
  walletsKeysChallenges,
  smartContractsChallenges,
  defiChallenges,
  privacyChallenges,
  scalingChallenges,
  cbdcsChallenges,
  governanceChallenges,
  fixTheMoneyChallenges,
} from "@cant/shared/lib/challenges/cant-trust";
