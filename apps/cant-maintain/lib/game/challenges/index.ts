import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-maintain";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-maintain/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  componentNamingChallenges,
  callbackNamingChallenges,
  booleanNamingChallenges,
  jsdocChallenges,
  propSpecificityChallenges,
  renderPropsChallenges,
  childrenPatternChallenges,
  discriminatedUnionsChallenges,
  extendingHtmlChallenges,
  refForwardingChallenges,
  accessibilityPropsChallenges,
  defaultValuesChallenges,
  propOrganizationChallenges,
  controlledUncontrolledChallenges,
  serverComponentPropsChallenges,
  genericPropsChallenges,
  enumeratedVariantsChallenges,
  stylingApiChallenges,
} from "@cant/shared/lib/challenges/cant-maintain";
