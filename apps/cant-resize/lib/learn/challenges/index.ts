import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-resize";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-resize/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  mediaQueryChallenges,
  containerQueryChallenges,
  fluidTypographyChallenges,
  viewportUnitChallenges,
  flexboxPatternChallenges,
  gridPatternChallenges,
  responsiveSpacingChallenges,
  overflowHandlingChallenges,
  breakpointHooksChallenges,
  responsivePropsChallenges,
  conditionalRenderingChallenges,
  responsiveImageChallenges,
  muiResponsiveChallenges,
  tailwindResponsiveChallenges,
  commonMistakeChallenges,
  testingResponsiveChallenges,
} from "@cant/shared/lib/challenges/cant-resize";
