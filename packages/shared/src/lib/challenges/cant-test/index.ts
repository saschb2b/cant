import type { BaseChallenge } from "../../game/types";

import { asyncTestingChallenges } from "./async-testing";
import { ciTestInfraChallenges } from "./ci-test-infra";
import { componentTestingChallenges } from "./component-testing";
import { integrationTestingChallenges } from "./integration-testing";
import { mockingStubbingChallenges } from "./mocking-stubbing";
import { testStrategyChallenges } from "./test-strategy";
import { unitTestingChallenges } from "./unit-testing";

export {
  asyncTestingChallenges,
  ciTestInfraChallenges,
  componentTestingChallenges,
  integrationTestingChallenges,
  mockingStubbingChallenges,
  testStrategyChallenges,
  unitTestingChallenges,
};

export const challenges: BaseChallenge[] = [
  ...asyncTestingChallenges,
  ...ciTestInfraChallenges,
  ...componentTestingChallenges,
  ...integrationTestingChallenges,
  ...mockingStubbingChallenges,
  ...testStrategyChallenges,
  ...unitTestingChallenges,
];
