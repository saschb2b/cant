import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Fundamentals
  "commit-messages",
  "atomic-commits",
  "branching-naming",
  // Branching & Merging
  "branching-strategies",
  "merge-strategies",
  "conflict-resolution",
  // History & Navigation
  "clean-history",
  "undoing-changes",
  "git-bisect",
  // Collaboration
  "pull-requests",
  "code-review",
  "git-hooks",
  // Repository Hygiene
  "gitignore",
  "large-files",
  "repo-structure",
  // Release Management
  "tagging-releases",
  "changelogs",
  // Advanced
  "git-config",
  "worktrees-stashing",
  "ci-integration",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "commit-messages": "Commit Messages",
  "atomic-commits": "Atomic Commits",
  "branching-naming": "Branch Naming",
  "branching-strategies": "Branching Strategies",
  "merge-strategies": "Merge Strategies",
  "conflict-resolution": "Conflict Resolution",
  "clean-history": "Clean History",
  "undoing-changes": "Undoing Changes",
  "git-bisect": "Git Bisect",
  "pull-requests": "Pull Requests",
  "code-review": "Code Review",
  "git-hooks": "Git Hooks",
  gitignore: "Gitignore",
  "large-files": "Large Files",
  "repo-structure": "Repo Structure",
  "tagging-releases": "Tagging & Releases",
  changelogs: "Changelogs",
  "git-config": "Git Config",
  "worktrees-stashing": "Worktrees & Stashing",
  "ci-integration": "CI Integration",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Fundamentals",
    categories: ["commit-messages", "atomic-commits", "branching-naming"],
  },
  {
    label: "Branching & Merging",
    categories: [
      "branching-strategies",
      "merge-strategies",
      "conflict-resolution",
    ],
  },
  {
    label: "History & Navigation",
    categories: ["clean-history", "undoing-changes", "git-bisect"],
  },
  {
    label: "Collaboration",
    categories: ["pull-requests", "code-review", "git-hooks"],
  },
  {
    label: "Repository Hygiene",
    categories: ["gitignore", "large-files", "repo-structure"],
  },
  {
    label: "Release Management",
    categories: ["tagging-releases", "changelogs"],
  },
  {
    label: "Advanced",
    categories: ["git-config", "worktrees-stashing", "ci-integration"],
  },
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "commit-messages":
    "Writing clear, conventional commit messages with imperative mood, proper subject/body separation, and meaningful scope.",
  "atomic-commits":
    "Making single-purpose commits that are easy to review, revert, and bisect. Staging hunks instead of entire files.",
  "branching-naming":
    "Naming branches with prefixes like feature/, fix/, and chore/. Keeping names short, descriptive, and kebab-cased.",
  "branching-strategies":
    "Choosing between trunk-based development, GitHub flow, and git flow based on team size and release cadence.",
  "merge-strategies":
    "Knowing when to merge, rebase, or squash. Understanding fast-forward, merge commits, and their trade-offs.",
  "conflict-resolution":
    "Resolving merge conflicts cleanly, using rerere, and structuring code to minimize conflicts in the first place.",
  "clean-history":
    "Using interactive rebase, fixup commits, and autosquash to keep the commit log readable and meaningful.",
  "undoing-changes":
    "Choosing between reset, revert, and restore. Understanding soft, mixed, and hard resets and when each is safe.",
  "git-bisect":
    "Using binary search to find the commit that introduced a bug. Automating bisect with test scripts.",
  "pull-requests":
    "Keeping PRs small and focused. Writing clear descriptions, using draft PRs, and structuring stacked PRs.",
  "code-review":
    "Reviewing diffs effectively, using CODEOWNERS, setting up branch protection rules, and approval workflows.",
  "git-hooks":
    "Automating quality checks with pre-commit, commit-msg, and pre-push hooks using husky and lint-staged.",
  gitignore:
    "Tracking what matters, ignoring what doesn't. Handling secrets, build artifacts, OS files, and IDE config.",
  "large-files":
    "Keeping repos fast with Git LFS, avoiding checked-in binaries, and managing repository size over time.",
  "repo-structure":
    "Organizing repos with clear README conventions, license files, contributing guides, and consistent directory layouts.",
  "tagging-releases":
    "Using semantic versioning, annotated tags, and release workflows to mark stable points in your history.",
  changelogs:
    "Maintaining changelogs from conventional commits, linking to issues, and following the Keep a Changelog format.",
  "git-config":
    "Setting up useful aliases, configuring diff and merge tools, signing commits, and managing global vs local config.",
  "worktrees-stashing":
    "Using git worktrees for parallel work, stashing changes properly, and knowing when stash vs WIP commits are better.",
  "ci-integration":
    "Setting up branch protection rules, required status checks, deploy previews, and pipeline triggers for safe delivery.",
};
