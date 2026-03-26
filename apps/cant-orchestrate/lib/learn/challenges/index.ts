import type { Challenge } from "../types";
import { dockerfileBasicsChallenges } from "./dockerfile-basics";
import { imageOptimizationChallenges } from "./image-optimization";
import { dockerComposeChallenges } from "./docker-compose";
import { volumesStorageChallenges } from "./volumes-storage";
import { networkingChallenges } from "./networking";
import { healthChecksChallenges } from "./health-checks";
import { securityChallenges } from "./security";
import { environmentConfigChallenges } from "./environment-config";
import { kubernetesPodsChallenges } from "./kubernetes-pods";
import { kubernetesServicesChallenges } from "./kubernetes-services";
import { kubernetesConfigChallenges } from "./kubernetes-config";
import { helmChartsChallenges } from "./helm-charts";
import { dockerSwarmChallenges } from "./docker-swarm";
import { ciCdPipelinesChallenges } from "./ci-cd-pipelines";
import { buildScriptsChallenges } from "./build-scripts";
import { commonMistakesChallenges } from "./common-mistakes";

/**
 * All challenges, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 */
export const challenges: Challenge[] = [
  ...dockerfileBasicsChallenges,
  ...imageOptimizationChallenges,
  ...dockerComposeChallenges,
  ...volumesStorageChallenges,
  ...networkingChallenges,
  ...healthChecksChallenges,
  ...securityChallenges,
  ...environmentConfigChallenges,
  ...kubernetesPodsChallenges,
  ...kubernetesServicesChallenges,
  ...kubernetesConfigChallenges,
  ...helmChartsChallenges,
  ...dockerSwarmChallenges,
  ...ciCdPipelinesChallenges,
  ...buildScriptsChallenges,
  ...commonMistakesChallenges,
];
