import type { ComponentType } from "react";
import {
  GitGraphMessyMerge,
  GitGraphCleanRebase,
  GitGraphLongLivedBranch,
  GitGraphShortLivedBranch,
  GitGraphMonolithCommit,
  GitGraphAtomicCommits,
  GitGraphBadBranchNames,
  GitGraphGoodBranchNames,
  GitGraphDirtyHistory,
  GitGraphCleanHistory,
  GitGraphNoTags,
  GitGraphWithTags,
} from "./git-graph";
import {
  DiffGiantPR,
  DiffFocusedPR,
  DiffNoContext,
  DiffWellDocumented,
  DiffConflictMarkers,
  DiffConflictResolved,
  DiffReviewRubberStamp,
  DiffReviewThorough,
} from "./diff-viewer";
import {
  FlowNoBranchProtection,
  FlowWithProtection,
  FlowNoHooks,
  FlowWithHooks,
} from "./flow-diagram";
import {
  FileTreeDirty,
  FileTreeClean,
  FileTreeBadStructure,
  FileTreeGoodStructure,
  FileTreeBloatedRepo,
  FileTreeLFSRepo,
  FileTreeInconsistentNaming,
  FileTreeConsistentNaming,
  FileTreeMonorepo,
  FileTreePolyrepo,
} from "./file-tree";
import {
  TerminalDestructiveReset,
  TerminalSafeRevert,
  TerminalBisectManual,
  TerminalBisectAutomated,
  TerminalUnconfiguredGit,
  TerminalConfiguredGit,
  TerminalStashChaos,
  TerminalWorktreeClean,
} from "./terminal";
import {
  CommitCardBadMessage,
  CommitCardGoodMessage,
  ChangelogUnstructured,
  ChangelogStructured,
} from "./commit-card";

/** Maps componentId strings to their React components. */
export const visualRegistry: Record<string, ComponentType> = {
  // Git graph
  GitGraphMessyMerge,
  GitGraphCleanRebase,
  GitGraphLongLivedBranch,
  GitGraphShortLivedBranch,
  GitGraphMonolithCommit,
  GitGraphAtomicCommits,
  GitGraphBadBranchNames,
  GitGraphGoodBranchNames,
  GitGraphDirtyHistory,
  GitGraphCleanHistory,
  GitGraphNoTags,
  GitGraphWithTags,
  // Diff viewer
  DiffGiantPR,
  DiffFocusedPR,
  DiffNoContext,
  DiffWellDocumented,
  DiffConflictMarkers,
  DiffConflictResolved,
  DiffReviewRubberStamp,
  DiffReviewThorough,
  // Flow diagrams
  FlowNoBranchProtection,
  FlowWithProtection,
  FlowNoHooks,
  FlowWithHooks,
  // File tree
  FileTreeDirty,
  FileTreeClean,
  FileTreeBadStructure,
  FileTreeGoodStructure,
  FileTreeBloatedRepo,
  FileTreeLFSRepo,
  FileTreeInconsistentNaming,
  FileTreeConsistentNaming,
  FileTreeMonorepo,
  FileTreePolyrepo,
  // Terminal
  TerminalDestructiveReset,
  TerminalSafeRevert,
  TerminalBisectManual,
  TerminalBisectAutomated,
  TerminalUnconfiguredGit,
  TerminalConfiguredGit,
  TerminalStashChaos,
  TerminalWorktreeClean,
  // Commit cards and changelogs
  CommitCardBadMessage,
  CommitCardGoodMessage,
  ChangelogUnstructured,
  ChangelogStructured,
};
