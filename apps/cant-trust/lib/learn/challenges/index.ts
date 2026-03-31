import type { Challenge } from "../types";
import { bankingFailuresChallenges } from "./banking-failures";
import { bankingMechanicsChallenges } from "./banking-mechanics";
import { bitcoinChallenges } from "./bitcoin";
import { cbdcsChallenges } from "./cbdcs";
import { centralBanksChallenges } from "./central-banks";
import { consensusChallenges } from "./consensus";
import { cryptographyChallenges } from "./cryptography";
import { defiChallenges } from "./defi";
import { fixTheMoneyChallenges } from "./fix-the-money";
import { governanceChallenges } from "./governance";
import { inflationChallenges } from "./inflation";
import { moneyOriginsChallenges } from "./money-origins";
import { nixonShockChallenges } from "./nixon-shock";
import { privacyChallenges } from "./privacy";
import { scalingChallenges } from "./scaling";
import { settlementChallenges } from "./settlement";
import { smartContractsChallenges } from "./smart-contracts";
import { walletsKeysChallenges } from "./wallets-keys";

/**
 * All challenges, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 */
export const challenges: Challenge[] = [
  ...moneyOriginsChallenges,
  ...bankingMechanicsChallenges,
  ...bankingFailuresChallenges,
  ...centralBanksChallenges,
  ...nixonShockChallenges,
  ...inflationChallenges,
  ...settlementChallenges,
  ...cryptographyChallenges,
  ...consensusChallenges,
  ...bitcoinChallenges,
  ...walletsKeysChallenges,
  ...smartContractsChallenges,
  ...defiChallenges,
  ...privacyChallenges,
  ...scalingChallenges,
  ...cbdcsChallenges,
  ...governanceChallenges,
  ...fixTheMoneyChallenges,
];
