import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-orchestrate";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-orchestrate/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  dockerfileBasicsChallenges,
  imageOptimizationChallenges,
  dockerComposeChallenges,
  volumesStorageChallenges,
  networkingChallenges,
  healthChecksChallenges,
  securityChallenges,
  environmentConfigChallenges,
  kubernetesPodsChallenges,
  kubernetesServicesChallenges,
  kubernetesConfigChallenges,
  helmChartsChallenges,
  dockerSwarmChallenges,
  ciCdPipelinesChallenges,
  buildScriptsChallenges,
  commonMistakesChallenges,
} from "@cant/shared/lib/challenges/cant-orchestrate";
