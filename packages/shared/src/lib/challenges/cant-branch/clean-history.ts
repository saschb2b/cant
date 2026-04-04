import type { BaseChallenge } from "../../game/types";

export const cleanHistoryChallenges: BaseChallenge[] = [
  {
    id: "ch-001",
    category: "clean-history",
    difficulty: "easy",
    title: "WIP commits in history",
    prompt: "Which git history is easier to review and bisect?",
    content: {
      type: "code",
      lang: "bash",

      left: `git log --oneline
a3f1c2d WIP
b7e4a91 WIP more stuff
c9d0f3e fix typo
d2b8e74 actually fix it
e5a1c90 Add user authentication`,

      right: `git log --oneline
a3f1c2d Add user authentication
b7e4a91 Add login form validation
c9d0f3e Add session persistence
d2b8e74 Add logout confirmation dialog
e5a1c90 Add password reset flow`,
    },

    correctSide: "right",
    explanationCorrect:
      "Each commit describes a complete, meaningful change. This makes code review faster, git bisect reliable, and reverts safe. Before merging a feature branch, squash or fixup your WIP commits into logical units using interactive rebase.",
    explanationWrong:
      "WIP commits and typo fixes add noise to the permanent history. They make git log harder to scan, git bisect less useful, and reverts unpredictable. Use `git rebase -i` to clean up before merging.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History",
    sourceLabel: "Git Book: Rewriting History",
  },
  {
    id: "ch-002",
    category: "clean-history",
    difficulty: "easy",
    title: "Pre-merge branch update",
    prompt: "Which approach produces a cleaner merge into main?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Merge directly with merge commit
git checkout main
git merge feature/auth`,

      right: `# Rebase onto main first, then merge
git checkout feature/auth
git rebase main
git checkout main
git merge feature/auth`,
    },

    correctSide: "right",
    explanationCorrect:
      "Rebasing your feature branch onto main before merging creates a linear history. The merge becomes a fast-forward (or a clean merge commit), and there are no unnecessary criss-crossing merge points. This makes the history much easier to follow.",
    explanationWrong:
      "Merging directly can work, but it often creates tangled merge commits when the feature branch has diverged significantly. Rebasing first replays your commits on top of the latest main, resulting in a cleaner, linear history.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Branching-Rebasing",
    sourceLabel: "Git Book: Rebasing",
  },
  {
    id: "ch-003",
    category: "clean-history",
    difficulty: "medium",
    title: "Interactive rebase: fixup vs pick",
    prompt: "Which interactive rebase cleans up a typo fix properly?",
    content: {
      type: "code",
      lang: "bash",

      left: `# git rebase -i HEAD~3
pick a1b2c3d Add email validation
pick d4e5f6a Fix typo in validation
pick g7h8i9j Add phone validation`,

      right: `# git rebase -i HEAD~3
pick a1b2c3d Add email validation
fixup d4e5f6a Fix typo in validation
pick g7h8i9j Add phone validation`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `fixup` command squashes the typo fix into the previous commit and discards its commit message. The result is two clean commits: one for email validation and one for phone validation. The typo fix becomes invisible in the final history.",
    explanationWrong:
      "Keeping `pick` for the typo fix preserves it as a separate commit in history. Typo fixes, formatting changes, and small corrections should be folded into the commit they belong to using `fixup` (discard message) or `squash` (combine messages).",
    sourceUrl: "https://git-scm.com/docs/git-rebase#_interactive_mode",
    sourceLabel: "Git Docs: Interactive Rebase",
  },
  {
    id: "ch-004",
    category: "clean-history",
    difficulty: "medium",
    title: "Using commit --fixup with autosquash",
    prompt: "Which workflow is more efficient for fixing a previous commit?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Fix the typo, then manually rebase
git add src/auth.ts
git commit -m "Fix typo in auth"
# Later, manually reorder in rebase
git rebase -i HEAD~5
# Move the fixup commit by hand...`,

      right: `# Fix the typo with --fixup targeting the original
git add src/auth.ts
git commit --fixup a1b2c3d
# Autosquash handles reordering automatically
git rebase -i --autosquash HEAD~5`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `--fixup` flag creates a commit prefixed with `fixup!` that references the target commit. When you run `rebase -i --autosquash`, git automatically reorders and marks it as a fixup. No manual editing of the rebase todo list required.",
    explanationWrong:
      "Manually reordering commits in an interactive rebase is error-prone, especially with many commits. The `--fixup` and `--autosquash` workflow automates this entirely. You can also set `rebase.autoSquash = true` in your git config to make autosquash the default.",
    sourceUrl:
      "https://git-scm.com/docs/git-commit#Documentation/git-commit.txt---fixupamaborereabordsquashltcommitgt",
    sourceLabel: "Git Docs: git commit --fixup",
  },
  {
    id: "ch-005",
    category: "clean-history",
    difficulty: "hard",
    title: "Reword vs squash in interactive rebase",
    prompt: "Which rebase command keeps both changes but improves the message?",
    content: {
      type: "code",
      lang: "bash",

      left: `# git rebase -i HEAD~3
pick a1b2c3d Add auth module
squash d4e5f6a Add OAuth provider support
pick g7h8i9j Add rate limiting`,

      right: `# git rebase -i HEAD~3
pick a1b2c3d Add auth module
pick d4e5f6a Add OAuth provider support
reword g7h8i9j Add rate limiting`,
    },

    correctSide: "left",
    explanationCorrect:
      "The `squash` command merges the OAuth commit into the auth module commit and opens an editor to combine both messages. This is ideal when two commits are logically one feature. The result is two commits: a comprehensive auth commit and the rate limiting commit.",
    explanationWrong:
      "Using `reword` only changes the commit message of the rate limiting commit. It does not combine the auth and OAuth commits. When two commits represent parts of the same logical change, `squash` (combine with merged messages) or `fixup` (combine and discard message) is the right tool.",
    sourceUrl: "https://git-scm.com/docs/git-rebase#_interactive_mode",
    sourceLabel: "Git Docs: Interactive Rebase",
  },
  {
    id: "ch-006",
    category: "clean-history",
    difficulty: "hard",
    title: "Preserving meaningful history granularity",
    prompt: "Which commit history strikes the right balance?",
    content: {
      type: "code",
      lang: "bash",

      left: `git log --oneline
a3f1c2d Add authentication system
# (one giant commit: 47 files changed)`,

      right: `git log --oneline
a3f1c2d Add JWT token generation
b7e4a91 Add login endpoint and validation
c9d0f3e Add session middleware
d2b8e74 Add password hashing utilities
e5a1c90 Add auth integration tests`,
    },

    correctSide: "right",
    explanationCorrect:
      "Each commit is a self-contained, logical unit that can be reviewed, reverted, or cherry-picked independently. If a bug appears in session handling, you can revert just that commit. Overly large commits defeat the purpose of version control.",
    explanationWrong:
      "A single massive commit makes it impossible to isolate changes. If you need to revert the session middleware but keep the JWT generation, you cannot. Clean history means atomic commits, not fewer commits. Each commit should represent one logical change that compiles and passes tests.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History",
    sourceLabel: "Git Book: Rewriting History",
  },
  {
    id: "ch-007",
    category: "clean-history",
    difficulty: "easy",
    title: "Commit history readability",
    prompt: "Which commit history is easier to navigate?",
    content: {
      type: "visual",
      left: { componentId: "GitGraphDirtyHistory" },
      right: { componentId: "GitGraphCleanHistory" },
    },
    correctSide: "right",
    explanationCorrect:
      "A clean commit history has descriptive messages, logical ordering, and no noise from WIP commits or typo fixes. This makes git log easy to scan, git bisect reliable, and git blame informative. Clean history is achieved by squashing and rewriting before merging.",
    explanationWrong:
      "A messy history full of WIP commits, fixup attempts, and vague messages makes it nearly impossible to understand the evolution of the codebase. Tools like git bisect become unreliable when intermediate commits are broken or unclear. Always clean up your history before merging to the main branch.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History",
    sourceLabel: "Git Book: Rewriting History",
  },
];
