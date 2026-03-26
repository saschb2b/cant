import type { Challenge } from "../types";
import { metaTagsChallenges } from "./meta-tags";
import { openGraphChallenges } from "./open-graph";
import { twitterCardsChallenges } from "./twitter-cards";
import { structuredDataChallenges } from "./structured-data";
import { canonicalUrlsChallenges } from "./canonical-urls";
import { sitemapsRobotsChallenges } from "./sitemaps-robots";
import { imageOptimizationChallenges } from "./image-optimization";
import { internationalizationChallenges } from "./internationalization";

/**
 * All challenges, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 */
export const challenges: Challenge[] = [
  ...metaTagsChallenges,
  ...openGraphChallenges,
  ...twitterCardsChallenges,
  ...structuredDataChallenges,
  ...canonicalUrlsChallenges,
  ...sitemapsRobotsChallenges,
  ...imageOptimizationChallenges,
  ...internationalizationChallenges,
];
