import type { Challenge } from "../types";
import { unitTestingChallenges } from "./unit-testing";
import { integrationTestingChallenges } from "./integration-testing";
import { componentTestingChallenges } from "./component-testing";
import { testStrategyChallenges } from "./test-strategy";
import { mockingStubbingChallenges } from "./mocking-stubbing";
import { asyncTestingChallenges } from "./async-testing";
import { ciTestInfraChallenges } from "./ci-test-infra";

/**
 * All challenges, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 */
export const challenges: Challenge[] = [
  ...unitTestingChallenges,
  ...integrationTestingChallenges,
  ...componentTestingChallenges,
  ...testStrategyChallenges,
  ...mockingStubbingChallenges,
  ...asyncTestingChallenges,
  ...ciTestInfraChallenges,
];
