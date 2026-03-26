import type { Challenge } from "../types";
import { typeNarrowingChallenges } from "./type-narrowing";
import { genericsChallenges } from "./generics";
import { utilityTypeChallenges } from "./utility-types";
import { unionIntersectionChallenges } from "./union-intersection";
import { typeAssertionChallenges } from "./type-assertions";
import { enumsLiteralsChallenges } from "./enums-literals";
import { strictModeChallenges } from "./strict-mode";
import { readonlyImmutabilityChallenges } from "./readonly-immutability";
import { functionTypeChallenges } from "./function-types";
import { interfaceVsTypeChallenges } from "./interface-vs-type";
import { mappedTypeChallenges } from "./mapped-types";
import { templateLiteralChallenges } from "./template-literals";
import { reactTypescriptChallenges } from "./react-typescript";
import { moduleTypeChallenges } from "./module-types";
import { errorHandlingChallenges } from "./error-handling";
import { commonMistakeChallenges } from "./common-mistakes";

/**
 * All challenges, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 */
export const challenges: Challenge[] = [
  ...typeNarrowingChallenges,
  ...genericsChallenges,
  ...utilityTypeChallenges,
  ...unionIntersectionChallenges,
  ...typeAssertionChallenges,
  ...enumsLiteralsChallenges,
  ...strictModeChallenges,
  ...readonlyImmutabilityChallenges,
  ...functionTypeChallenges,
  ...interfaceVsTypeChallenges,
  ...mappedTypeChallenges,
  ...templateLiteralChallenges,
  ...reactTypescriptChallenges,
  ...moduleTypeChallenges,
  ...errorHandlingChallenges,
  ...commonMistakeChallenges,
];
