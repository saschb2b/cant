import type { BaseChallenge } from "../../game/types";

import { commonMistakeChallenges } from "./common-mistakes";
import { enumsLiteralsChallenges } from "./enums-literals";
import { errorHandlingChallenges } from "./error-handling";
import { functionTypeChallenges } from "./function-types";
import { genericsChallenges } from "./generics";
import { interfaceVsTypeChallenges } from "./interface-vs-type";
import { mappedTypeChallenges } from "./mapped-types";
import { moduleTypeChallenges } from "./module-types";
import { reactTypescriptChallenges } from "./react-typescript";
import { readonlyImmutabilityChallenges } from "./readonly-immutability";
import { strictModeChallenges } from "./strict-mode";
import { templateLiteralChallenges } from "./template-literals";
import { typeAssertionChallenges } from "./type-assertions";
import { typeNarrowingChallenges } from "./type-narrowing";
import { unionIntersectionChallenges } from "./union-intersection";
import { utilityTypeChallenges } from "./utility-types";

export {
  commonMistakeChallenges,
  enumsLiteralsChallenges,
  errorHandlingChallenges,
  functionTypeChallenges,
  genericsChallenges,
  interfaceVsTypeChallenges,
  mappedTypeChallenges,
  moduleTypeChallenges,
  reactTypescriptChallenges,
  readonlyImmutabilityChallenges,
  strictModeChallenges,
  templateLiteralChallenges,
  typeAssertionChallenges,
  typeNarrowingChallenges,
  unionIntersectionChallenges,
  utilityTypeChallenges,
};

export const challenges: BaseChallenge[] = [
  ...commonMistakeChallenges,
  ...enumsLiteralsChallenges,
  ...errorHandlingChallenges,
  ...functionTypeChallenges,
  ...genericsChallenges,
  ...interfaceVsTypeChallenges,
  ...mappedTypeChallenges,
  ...moduleTypeChallenges,
  ...reactTypescriptChallenges,
  ...readonlyImmutabilityChallenges,
  ...strictModeChallenges,
  ...templateLiteralChallenges,
  ...typeAssertionChallenges,
  ...typeNarrowingChallenges,
  ...unionIntersectionChallenges,
  ...utilityTypeChallenges,
];
