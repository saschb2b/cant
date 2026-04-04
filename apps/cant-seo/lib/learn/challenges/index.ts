import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-seo";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-seo/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  metaTagsChallenges,
  openGraphChallenges,
  twitterCardsChallenges,
  structuredDataChallenges,
  canonicalUrlsChallenges,
  sitemapsRobotsChallenges,
  imageOptimizationChallenges,
  internationalizationChallenges,
} from "@cant/shared/lib/challenges/cant-seo";
