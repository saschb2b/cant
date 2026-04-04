import type { Challenge } from "../types";
import { challenges as sharedChallenges } from "@cant/shared/lib/challenges/cant-branch";

/**
 * All challenges, imported from the shared catalog.
 *
 * To add a new challenge, edit the relevant category file in
 * packages/shared/src/lib/challenges/cant-branch/.
 */
export const challenges: Challenge[] = sharedChallenges as Challenge[];

// Re-export individual category arrays for direct access
export {
  commitMessagesChallenges,
  atomicCommitsChallenges,
  branchingNamingChallenges,
  branchingStrategiesChallenges,
  mergeStrategiesChallenges,
  conflictResolutionChallenges,
  cleanHistoryChallenges,
  undoingChangesChallenges,
  gitBisectChallenges,
  pullRequestsChallenges,
  codeReviewChallenges,
  gitHooksChallenges,
  gitignoreChallenges,
  largeFilesChallenges,
  repoStructureChallenges,
  taggingReleasesChallenges,
  changelogsChallenges,
  gitConfigChallenges,
  worktreesStashingChallenges,
  ciIntegrationChallenges,
} from "@cant/shared/lib/challenges/cant-branch";
