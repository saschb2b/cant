import type { BaseChallenge } from "../../game/types";

import { canonicalUrlsChallenges } from "./canonical-urls";
import { imageOptimizationChallenges } from "./image-optimization";
import { internationalizationChallenges } from "./internationalization";
import { metaTagsChallenges } from "./meta-tags";
import { openGraphChallenges } from "./open-graph";
import { sitemapsRobotsChallenges } from "./sitemaps-robots";
import { structuredDataChallenges } from "./structured-data";
import { twitterCardsChallenges } from "./twitter-cards";

export {
  canonicalUrlsChallenges,
  imageOptimizationChallenges,
  internationalizationChallenges,
  metaTagsChallenges,
  openGraphChallenges,
  sitemapsRobotsChallenges,
  structuredDataChallenges,
  twitterCardsChallenges,
};

export const challenges: BaseChallenge[] = [
  ...canonicalUrlsChallenges,
  ...imageOptimizationChallenges,
  ...internationalizationChallenges,
  ...metaTagsChallenges,
  ...openGraphChallenges,
  ...sitemapsRobotsChallenges,
  ...structuredDataChallenges,
  ...twitterCardsChallenges,
];
