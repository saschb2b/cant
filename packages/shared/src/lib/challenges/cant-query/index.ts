import type { BaseChallenge } from "../../game/types";

import { apiConsumptionChallenges } from "./api-consumption";
import { authPatternChallenges } from "./auth-patterns";
import { docsContractsChallenges } from "./docs-contracts";
import { errorHandlingChallenges } from "./error-handling";
import { graphqlPatternChallenges } from "./graphql-patterns";
import { restApiDesignChallenges } from "./rest-api-design";
import { websocketsRealtimeChallenges } from "./websockets-realtime";

export {
  apiConsumptionChallenges,
  authPatternChallenges,
  docsContractsChallenges,
  errorHandlingChallenges,
  graphqlPatternChallenges,
  restApiDesignChallenges,
  websocketsRealtimeChallenges,
};

export const challenges: BaseChallenge[] = [
  ...apiConsumptionChallenges,
  ...authPatternChallenges,
  ...docsContractsChallenges,
  ...errorHandlingChallenges,
  ...graphqlPatternChallenges,
  ...restApiDesignChallenges,
  ...websocketsRealtimeChallenges,
];
