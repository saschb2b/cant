import type { Challenge } from "../types";
import { commitMessagesChallenges } from "./commit-messages";
import { atomicCommitsChallenges } from "./atomic-commits";
import { branchingNamingChallenges } from "./branching-naming";
import { branchingStrategiesChallenges } from "./branching-strategies";
import { mergeStrategiesChallenges } from "./merge-strategies";
import { conflictResolutionChallenges } from "./conflict-resolution";
import { cleanHistoryChallenges } from "./clean-history";
import { undoingChangesChallenges } from "./undoing-changes";
import { gitBisectChallenges } from "./git-bisect";
import { pullRequestsChallenges } from "./pull-requests";
import { codeReviewChallenges } from "./code-review";
import { gitHooksChallenges } from "./git-hooks";
import { gitignoreChallenges } from "./gitignore";
import { largeFilesChallenges } from "./large-files";
import { repoStructureChallenges } from "./repo-structure";
import { taggingReleasesChallenges } from "./tagging-releases";
import { changelogsChallenges } from "./changelogs";
import { gitConfigChallenges } from "./git-config";
import { worktreesStashingChallenges } from "./worktrees-stashing";
import { ciIntegrationChallenges } from "./ci-integration";

/**
 * All challenges for the game, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 * Difficulty sorting and side randomization happen automatically in the game hook.
 */
export const challenges: Challenge[] = [
  ...commitMessagesChallenges,
  ...atomicCommitsChallenges,
  ...branchingNamingChallenges,
  ...branchingStrategiesChallenges,
  ...mergeStrategiesChallenges,
  ...conflictResolutionChallenges,
  ...cleanHistoryChallenges,
  ...undoingChangesChallenges,
  ...gitBisectChallenges,
  ...pullRequestsChallenges,
  ...codeReviewChallenges,
  ...gitHooksChallenges,
  ...gitignoreChallenges,
  ...largeFilesChallenges,
  ...repoStructureChallenges,
  ...taggingReleasesChallenges,
  ...changelogsChallenges,
  ...gitConfigChallenges,
  ...worktreesStashingChallenges,
  ...ciIntegrationChallenges,
];
