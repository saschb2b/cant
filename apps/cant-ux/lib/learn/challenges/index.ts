import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-ux";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-ux/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  accessibilityChallenges,
  colorChallenges,
  contentCopyChallenges,
  dataDisplayChallenges,
  feedbackChallenges,
  formsChallenges,
  hierarchyChallenges,
  iconsImageryChallenges,
  layoutChallenges,
  listsCardsChallenges,
  microInteractionsChallenges,
  modalsOverlaysChallenges,
  navigationChallenges,
  spacingChallenges,
  typographyChallenges,
} from "@cant/shared/lib/challenges/cant-ux";
