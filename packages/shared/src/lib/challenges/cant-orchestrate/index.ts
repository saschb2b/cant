import type { BaseChallenge } from "../../game/types";

import { buildScriptsChallenges } from "./build-scripts";
import { ciCdPipelinesChallenges } from "./ci-cd-pipelines";
import { commonMistakesChallenges } from "./common-mistakes";
import { dockerComposeChallenges } from "./docker-compose";
import { dockerSwarmChallenges } from "./docker-swarm";
import { dockerfileBasicsChallenges } from "./dockerfile-basics";
import { environmentConfigChallenges } from "./environment-config";
import { healthChecksChallenges } from "./health-checks";
import { helmChartsChallenges } from "./helm-charts";
import { imageOptimizationChallenges } from "./image-optimization";
import { kubernetesConfigChallenges } from "./kubernetes-config";
import { kubernetesPodsChallenges } from "./kubernetes-pods";
import { kubernetesServicesChallenges } from "./kubernetes-services";
import { networkingChallenges } from "./networking";
import { securityChallenges } from "./security";
import { volumesStorageChallenges } from "./volumes-storage";

export {
  buildScriptsChallenges,
  ciCdPipelinesChallenges,
  commonMistakesChallenges,
  dockerComposeChallenges,
  dockerSwarmChallenges,
  dockerfileBasicsChallenges,
  environmentConfigChallenges,
  healthChecksChallenges,
  helmChartsChallenges,
  imageOptimizationChallenges,
  kubernetesConfigChallenges,
  kubernetesPodsChallenges,
  kubernetesServicesChallenges,
  networkingChallenges,
  securityChallenges,
  volumesStorageChallenges,
};

export const challenges: BaseChallenge[] = [
  ...buildScriptsChallenges,
  ...ciCdPipelinesChallenges,
  ...commonMistakesChallenges,
  ...dockerComposeChallenges,
  ...dockerSwarmChallenges,
  ...dockerfileBasicsChallenges,
  ...environmentConfigChallenges,
  ...healthChecksChallenges,
  ...helmChartsChallenges,
  ...imageOptimizationChallenges,
  ...kubernetesConfigChallenges,
  ...kubernetesPodsChallenges,
  ...kubernetesServicesChallenges,
  ...networkingChallenges,
  ...securityChallenges,
  ...volumesStorageChallenges,
];
