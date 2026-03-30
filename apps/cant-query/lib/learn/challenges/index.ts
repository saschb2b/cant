import type { Challenge } from "../types";
import { restApiDesignChallenges } from "./rest-api-design";
import { graphqlPatternChallenges } from "./graphql-patterns";
import { websocketsRealtimeChallenges } from "./websockets-realtime";
import { authPatternChallenges } from "./auth-patterns";
import { errorHandlingChallenges } from "./error-handling";
import { apiConsumptionChallenges } from "./api-consumption";
import { docsContractsChallenges } from "./docs-contracts";

/**
 * All challenges, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 */
export const challenges: Challenge[] = [
  ...restApiDesignChallenges,
  ...graphqlPatternChallenges,
  ...websocketsRealtimeChallenges,
  ...authPatternChallenges,
  ...errorHandlingChallenges,
  ...apiConsumptionChallenges,
  ...docsContractsChallenges,
];
