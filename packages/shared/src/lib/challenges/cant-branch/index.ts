import type { BaseChallenge } from "../../game/types";

import { atomicCommitsChallenges } from "./atomic-commits";
import { branchingNamingChallenges } from "./branching-naming";
import { branchingStrategiesChallenges } from "./branching-strategies";
import { changelogsChallenges } from "./changelogs";
import { ciIntegrationChallenges } from "./ci-integration";
import { cleanHistoryChallenges } from "./clean-history";
import { codeReviewChallenges } from "./code-review";
import { commitMessagesChallenges } from "./commit-messages";
import { conflictResolutionChallenges } from "./conflict-resolution";
import { gitBisectChallenges } from "./git-bisect";
import { gitConfigChallenges } from "./git-config";
import { gitHooksChallenges } from "./git-hooks";
import { gitignoreChallenges } from "./gitignore";
import { largeFilesChallenges } from "./large-files";
import { mergeStrategiesChallenges } from "./merge-strategies";
import { pullRequestsChallenges } from "./pull-requests";
import { repoStructureChallenges } from "./repo-structure";
import { taggingReleasesChallenges } from "./tagging-releases";
import { undoingChangesChallenges } from "./undoing-changes";
import { worktreesStashingChallenges } from "./worktrees-stashing";

export {
  atomicCommitsChallenges,
  branchingNamingChallenges,
  branchingStrategiesChallenges,
  changelogsChallenges,
  ciIntegrationChallenges,
  cleanHistoryChallenges,
  codeReviewChallenges,
  commitMessagesChallenges,
  conflictResolutionChallenges,
  gitBisectChallenges,
  gitConfigChallenges,
  gitHooksChallenges,
  gitignoreChallenges,
  largeFilesChallenges,
  mergeStrategiesChallenges,
  pullRequestsChallenges,
  repoStructureChallenges,
  taggingReleasesChallenges,
  undoingChangesChallenges,
  worktreesStashingChallenges,
};

export const challenges: BaseChallenge[] = [
  ...atomicCommitsChallenges,
  ...branchingNamingChallenges,
  ...branchingStrategiesChallenges,
  ...changelogsChallenges,
  ...ciIntegrationChallenges,
  ...cleanHistoryChallenges,
  ...codeReviewChallenges,
  ...commitMessagesChallenges,
  ...conflictResolutionChallenges,
  ...gitBisectChallenges,
  ...gitConfigChallenges,
  ...gitHooksChallenges,
  ...gitignoreChallenges,
  ...largeFilesChallenges,
  ...mergeStrategiesChallenges,
  ...pullRequestsChallenges,
  ...repoStructureChallenges,
  ...taggingReleasesChallenges,
  ...undoingChangesChallenges,
  ...worktreesStashingChallenges,
];
