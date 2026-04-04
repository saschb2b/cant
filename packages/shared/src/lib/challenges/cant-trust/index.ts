import type { BaseChallenge } from "../../game/types";

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

export {
  bankingFailuresChallenges,
  bankingMechanicsChallenges,
  bitcoinChallenges,
  cbdcsChallenges,
  centralBanksChallenges,
  consensusChallenges,
  cryptographyChallenges,
  defiChallenges,
  fixTheMoneyChallenges,
  governanceChallenges,
  inflationChallenges,
  moneyOriginsChallenges,
  nixonShockChallenges,
  privacyChallenges,
  scalingChallenges,
  settlementChallenges,
  smartContractsChallenges,
  walletsKeysChallenges,
};

export const challenges: BaseChallenge[] = [
  ...bankingFailuresChallenges,
  ...bankingMechanicsChallenges,
  ...bitcoinChallenges,
  ...cbdcsChallenges,
  ...centralBanksChallenges,
  ...consensusChallenges,
  ...cryptographyChallenges,
  ...defiChallenges,
  ...fixTheMoneyChallenges,
  ...governanceChallenges,
  ...inflationChallenges,
  ...moneyOriginsChallenges,
  ...nixonShockChallenges,
  ...privacyChallenges,
  ...scalingChallenges,
  ...settlementChallenges,
  ...smartContractsChallenges,
  ...walletsKeysChallenges,
];
