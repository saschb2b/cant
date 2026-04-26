import type { BaseChallenge } from "../../game/types";

export const worktreesStashingChallenges: BaseChallenge[] = [
  {
    id: "ws-001",
    category: "worktrees-stashing",
    difficulty: "easy",
    title: "Stash identification",
    prompt: "Which stash approach is easier to manage?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Stash without a message
git stash

git stash list
# stash@{0}: WIP on main: a1b2c3d fix: typo
# stash@{1}: WIP on main: d4e5f6g feat: auth
# stash@{2}: WIP on main: h7i8j9k chore: deps

# Which stash has your half-done work?`,

      right: `# Stash with a descriptive message
git stash push -m "WIP: payment form validation"

git stash list
# stash@{0}: On main: WIP: payment form validation
# stash@{1}: On main: experiment: dark mode toggle
# stash@{2}: On main: debug: reproduce issue #42

# Easy to find the right stash`,
    },

    correctSide: "right",
    explanationCorrect:
      "Adding a message with `git stash push -m` makes each stash entry self-documenting. When you come back hours or days later, `WIP: payment form validation` tells you exactly what is in that stash without needing to inspect it.\n\nWithout messages, every entry shows the generic `WIP on branch: commit-hash` format, which is nearly useless when you have multiple stashes.",
    explanationWrong:
      "Plain `git stash` labels every entry with the branch name and last commit hash. If you stashed three times on the same branch, the entries look almost identical. You end up running `git stash show stash@{0}`, `git stash show stash@{1}`, and so on just to find the right one. A descriptive message eliminates this guesswork.",
    sourceUrl: "https://git-scm.com/docs/git-stash",
    sourceLabel: "Git Docs: git-stash",
  },
  {
    id: "ws-002",
    category: "worktrees-stashing",
    difficulty: "easy",
    title: "Stash pop vs stash apply",
    prompt: "Which is safer when restoring stashed changes?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Pop removes the stash after applying
git stash pop

# If there is a conflict:
# Changes partially applied
# Stash is NOT dropped (safe)
# But on success: stash is gone forever

# Cannot re-apply to another branch
# Cannot verify the apply was correct`,

      right: `# Apply keeps the stash intact
git stash apply

# Changes applied to working directory
# Stash entry remains in the list

# Verify everything looks right, then:
git stash drop stash@{0}

# Can apply the same stash to
# multiple branches if needed`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using `git stash apply` followed by an explicit `git stash drop` is a two-step process that gives you a chance to verify the changes were applied correctly before discarding the stash. If something goes wrong, the stash is still available.\n\nThis is especially useful when applying a stash to a branch that has diverged since the stash was created.",
    explanationWrong:
      "While `git stash pop` is convenient for simple cases, it immediately removes the stash on successful apply. If you realize the changes conflicted with something else or were applied to the wrong branch, the stash is already gone. The safer pattern is apply, verify, then drop.",
    sourceUrl:
      "https://git-scm.com/docs/git-stash#Documentation/git-stash.txt-emapplyem--televentgtltindexgt",
    sourceLabel: "Git Docs: git-stash apply",
  },
  {
    id: "ws-003",
    category: "worktrees-stashing",
    difficulty: "medium",
    title: "Worktree for parallel work",
    prompt: "Which approach is better for switching between tasks?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Stash and switch branches
git stash push -m "feature work in progress"
git checkout hotfix/critical-bug

# Fix the bug
git commit -am "fix: critical production bug"
git checkout feature/payments

# Restore stashed work
git stash pop
# Hope nothing conflicts...`,

      right: `# Use a worktree for the hotfix
git worktree add ../hotfix-critical hotfix/critical-bug

# Work in the separate directory
cd ../hotfix-critical
git commit -am "fix: critical production bug"
git push origin hotfix/critical-bug

# Go back to original directory
cd ../main-repo
# Feature work is untouched, no stashing

# Clean up when done
git worktree remove ../hotfix-critical`,
    },

    correctSide: "right",
    explanationCorrect:
      "Git worktrees let you check out multiple branches simultaneously in separate directories. Your in-progress feature work stays exactly as you left it. There is no risk of stash conflicts, no need to remember to pop, and no loss of IDE state like open tabs or breakpoints.\n\nWorktrees share the same `.git` directory, so they use minimal extra disk space.",
    explanationWrong:
      "Stashing interrupts your flow. You must save your work, switch contexts, fix the issue, switch back, and restore. If the stash conflicts with changes made while you were away, you have an extra problem to solve. Worktrees eliminate this entire workflow by keeping both branches checked out simultaneously.",
    sourceUrl: "https://git-scm.com/docs/git-worktree",
    sourceLabel: "Git Docs: git-worktree",
  },
  {
    id: "ws-004",
    category: "worktrees-stashing",
    difficulty: "medium",
    title: "Stash vs WIP commit",
    prompt: "Which is better for saving incomplete work overnight?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Stash before leaving for the day
git stash push -m "end of day: auth flow WIP"

# Next morning
git stash pop

# Risks:
# - Stash is local only, not backed up
# - If your machine dies, work is lost
# - Stash can be accidentally dropped`,

      right: `# WIP commit on a feature branch
git add -A
git commit -m "wip: auth flow, saving progress"

# Next morning, continue working then:
git reset --soft HEAD~1
# Or just amend the WIP commit later

# Benefits:
# - Pushed to remote as backup
# - Visible in branch history
# - Safe from local machine failure`,
    },

    correctSide: "right",
    explanationCorrect:
      "A WIP commit on a feature branch is safer than a stash for overnight or multi-day pauses. It can be pushed to the remote as a backup, it is visible in the branch history, and it will not be accidentally lost.\n\nBefore merging, you can squash or amend the WIP commit to keep the final history clean. Stashes are local-only and provide no protection against hardware failure.",
    explanationWrong:
      "Stashes are convenient for quick context switches lasting minutes, but they are a poor choice for overnight storage. They exist only on your local machine, are not pushed to any remote, and can be lost if you run `git stash clear` or if your disk fails. A WIP commit provides the same convenience with the safety of remote backup.",
    sourceUrl: "https://git-scm.com/docs/git-stash",
    sourceLabel: "Git Docs: git-stash",
  },
  {
    id: "ws-005",
    category: "worktrees-stashing",
    difficulty: "hard",
    title: "Stashing specific files",
    prompt: "Which approach stashes only the files you want?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Stash everything, restore what you don't want
git stash

# Selectively restore files you want to keep
git checkout stash@{0} -- src/utils.ts
git checkout stash@{0} -- src/types.ts

# The rest stays stashed
# Confusing: mixed state between
# working directory and stash`,

      right: `# Stash only specific files
git stash push -m "WIP: auth changes" \\
  src/auth/login.ts \\
  src/auth/session.ts

# Only those two files are stashed
# Everything else remains in your
# working directory untouched

git stash show stash@{0}
# src/auth/login.ts   | 15 +++---
# src/auth/session.ts | 8 ++--`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `git stash push` command accepts file paths, letting you stash only specific files. The rest of your working directory stays untouched. This is cleaner than stashing everything and then selectively restoring files.\n\nThis is particularly useful when you have changes across multiple features and want to stash just one set of changes while keeping the others.",
    explanationWrong:
      "Stashing everything and then restoring selected files creates a confusing state. Some changes exist in both your working directory and the stash, while others exist only in the stash. It is easy to lose track of what is where. Targeted stashing with file paths keeps the boundary clean.",
    sourceUrl:
      "https://git-scm.com/docs/git-stash#Documentation/git-stash.txt-push-televentgt-p--patch--S--staged-k--no-keep-index-u--include-untracked-a--all-q--quiet-m--televentgtmessage--pathspec-from-fileltfilegt--pathspec-file-nul--ltpathspecgt82televentgt",
    sourceLabel: "Git Docs: git-stash push",
  },
  {
    id: "ws-006",
    category: "worktrees-stashing",
    difficulty: "hard",
    title: "Worktree for code review",
    prompt: "Which approach lets you review a PR without losing context?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Stash your work to review a PR
git stash push -m "saving my work"
git fetch origin
git checkout origin/feature/new-api

# Review the code, run tests
npm test

# Switch back
git checkout feature/my-work
git stash pop

# IDE loses all state: open files,
# terminal sessions, debug configs`,

      right: `# Add a worktree for the review
git fetch origin
git worktree add ../review-new-api \\
  origin/feature/new-api

# Open in a new IDE window
code ../review-new-api

# Review and run tests in parallel
cd ../review-new-api && npm test

# Original workspace is completely
# untouched. Clean up when done:
git worktree remove ../review-new-api`,
    },

    correctSide: "right",
    explanationCorrect:
      "Opening the PR branch in a separate worktree lets you review code and run tests in a completely isolated environment. Your original workspace stays untouched with all IDE state preserved: open files, terminal history, breakpoints, and running dev servers.\n\nYou can even have both the original and review workspaces open side by side in separate IDE windows.",
    explanationWrong:
      "Checking out a PR branch for review disrupts your entire development environment. Your IDE loses open files and terminal sessions, running processes are interrupted, and you have to restore everything when you switch back. Worktrees provide true isolation, letting you review without any disruption to your ongoing work.",
    sourceUrl: "https://git-scm.com/docs/git-worktree",
    sourceLabel: "Git Docs: git-worktree",
  },
  {
    id: "ws-007",
    category: "worktrees-stashing",
    difficulty: "easy",
    title: "Context switching strategy",
    prompt: "Which approach for switching context is safer?",
    content: {
      type: "visual",
      left: { componentId: "TerminalStashChaos" },
      right: { componentId: "TerminalWorktreeClean" },
    },
    correctSide: "right",
    explanationCorrect:
      "Git worktrees let you check out multiple branches in separate directories simultaneously. Your in-progress work stays exactly as you left it with no risk of stash conflicts or lost changes. Each worktree has its own working directory while sharing the same repository data.",
    explanationWrong:
      "Relying heavily on git stash for context switching leads to a growing pile of unnamed or forgotten stash entries. Applying the wrong stash, dealing with stash conflicts, and accidentally dropping entries are all common problems. Worktrees provide clean isolation without any of these risks.",
    sourceUrl: "https://git-scm.com/docs/git-worktree",
    sourceLabel: "Git Docs: git-worktree",
  },
];
