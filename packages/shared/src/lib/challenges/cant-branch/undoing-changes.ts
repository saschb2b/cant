import type { BaseChallenge } from "../../game/types";

export const undoingChangesChallenges: BaseChallenge[] = [
  {
    id: "uc-001",
    category: "undoing-changes",
    difficulty: "easy",
    title: "Revert vs reset on shared branches",
    prompt: "Which is safer for undoing a commit already pushed to main?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Undo the last commit on main
git checkout main
git reset --hard HEAD~1
git push --force`,

      right: `# Undo the last commit on main
git checkout main
git revert HEAD
git push`,
    },

    correctSide: "right",
    explanationCorrect:
      "On shared branches, `git revert` creates a new commit that undoes the changes. This preserves history and does not break other developers' work. Everyone can simply pull the revert commit without conflicts.",
    explanationWrong:
      "Using `reset --hard` and `push --force` on a shared branch rewrites public history. Other developers who already pulled the original commit will have divergent histories, leading to merge conflicts and potential data loss. Never force-push to shared branches.",
    sourceUrl: "https://git-scm.com/docs/git-revert",
    sourceLabel: "Git Docs: git revert",
  },
  {
    id: "uc-002",
    category: "undoing-changes",
    difficulty: "easy",
    title: "Unstaging files with git restore",
    prompt: "Which command safely unstages a file without losing changes?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Unstage a file (keeps working tree changes)
git restore --staged src/app.ts`,

      right: `# Unstage a file
git checkout -- src/app.ts`,
    },

    correctSide: "left",
    explanationCorrect:
      "The `git restore --staged` command moves changes from the staging area back to the working tree without discarding anything. It is the modern, explicit replacement for the confusing `git reset HEAD <file>` syntax.",
    explanationWrong:
      "Using `git checkout -- <file>` discards all working tree changes entirely, not just unstaging them. This is a destructive operation that permanently removes your uncommitted edits. The `restore` command introduced in Git 2.23 separates these two very different operations.",
    sourceUrl: "https://git-scm.com/docs/git-restore",
    sourceLabel: "Git Docs: git restore",
  },
  {
    id: "uc-003",
    category: "undoing-changes",
    difficulty: "medium",
    title: "Reset modes: soft vs mixed vs hard",
    prompt: "Which reset mode preserves your changes in the staging area?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Undo last commit, keep changes staged
git reset --soft HEAD~1
# Changes are still in the index,
# ready to be committed again`,

      right: `# Undo last commit, unstage changes
git reset --mixed HEAD~1
# Changes are in working tree
# but not in the index`,
    },

    correctSide: "left",
    explanationCorrect:
      "With `--soft`, the commit is undone but all changes remain staged (in the index). This is perfect when you want to amend the commit message or add more changes before recommitting. Your working tree is untouched.",
    explanationWrong:
      "The `--mixed` flag (which is the default for `git reset`) unstages the changes, moving them back to the working tree. You would need to `git add` them again before committing. Use `--soft` when you want to keep changes staged, `--mixed` when you want to restage selectively, and `--hard` only when you want to discard everything.",
    sourceUrl: "https://git-scm.com/docs/git-reset",
    sourceLabel: "Git Docs: git reset",
  },
  {
    id: "uc-004",
    category: "undoing-changes",
    difficulty: "medium",
    title: "Recovering a dropped commit with reflog",
    prompt: "Which approach can recover a commit after an accidental reset?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Oops, I lost my commit!
# Check the git log
git log --oneline
# The commit is gone...
# Nothing we can do now`,

      right: `# Oops, I lost my commit!
# Check the reflog for recent HEAD positions
git reflog
# Find the lost commit hash
git cherry-pick a1b2c3d`,
    },

    correctSide: "right",
    explanationCorrect:
      "The reflog records every position HEAD has pointed to, even after resets and rebases. Lost commits stay in the reflog for at least 30 days by default. Use `git reflog` to find the commit hash, then `cherry-pick` or `reset` to recover it.",
    explanationWrong:
      "Commits are almost never truly lost in git. Even after a hard reset, the reflog keeps a record of where HEAD was. The `git reflog` command is your safety net for recovering from mistakes. The only time commits are permanently lost is after `git gc` prunes unreachable objects (typically after 30 days).",
    sourceUrl: "https://git-scm.com/docs/git-reflog",
    sourceLabel: "Git Docs: git reflog",
  },
  {
    id: "uc-005",
    category: "undoing-changes",
    difficulty: "hard",
    title: "Reverting a merge commit",
    prompt: "Which correctly reverts a merge commit on a shared branch?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Revert the merge commit
# -m 1 specifies the mainline parent
git revert -m 1 a1b2c3d`,

      right: `# Revert the merge commit
git revert a1b2c3d`,
    },

    correctSide: "left",
    explanationCorrect:
      "Merge commits have two parents, so git needs to know which parent to revert relative to. The `-m 1` flag tells git to treat parent 1 (usually the branch you merged into) as the mainline. This undoes all changes introduced by the merged branch while keeping the main branch's history intact.",
    explanationWrong:
      'Without the `-m` flag, git will refuse to revert a merge commit because it does not know which parent to use as the base. You will see: "commit is a merge but no -m option was given." Always specify `-m 1` (or `-m 2`) to indicate which parent represents the mainline.',
    sourceUrl:
      "https://git-scm.com/docs/git-revert#Documentation/git-revert.txt--mparent-number",
    sourceLabel: "Git Docs: git revert -m",
  },
  {
    id: "uc-006",
    category: "undoing-changes",
    difficulty: "hard",
    title: "Discarding changes in specific files",
    prompt: "Which selectively discards working tree changes in one file?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Discard all uncommitted changes everywhere
git reset --hard HEAD`,

      right: `# Discard changes only in one specific file
git restore src/config.ts`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using `git restore <file>` discards working tree changes for that specific file only, leaving all other modified files untouched. This is precise and safe. It restores the file to its state in the last commit (or a specified source with `--source`).",
    explanationWrong:
      "Running `git reset --hard HEAD` is a sledgehammer: it discards all uncommitted changes across every file in the repository. If you only want to undo changes in one file, this approach risks losing work in other files. Always use the most targeted command available.",
    sourceUrl: "https://git-scm.com/docs/git-restore",
    sourceLabel: "Git Docs: git restore",
  },
  {
    id: "uc-007",
    category: "undoing-changes",
    difficulty: "medium",
    title: "Undo strategy on shared branches",
    prompt: "Which approach to undoing changes is safer on shared branches?",
    content: {
      type: "visual",
      left: { componentId: "TerminalDestructiveReset" },
      right: { componentId: "TerminalSafeRevert" },
    },
    correctSide: "right",
    explanationCorrect:
      "A safe revert creates a new commit that undoes the unwanted changes while preserving the full history. Other developers can pull normally without conflicts. The revert commit itself serves as documentation of what was undone and why.",
    explanationWrong:
      "A destructive reset with force push rewrites shared history, breaking every other developer's local copy of the branch. They will encounter divergent histories, phantom conflicts, and potentially lose their own commits. On shared branches, always use revert instead of reset.",
    sourceUrl: "https://git-scm.com/docs/git-revert",
    sourceLabel: "Git Docs: git revert",
  },
];
