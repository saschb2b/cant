import type { BaseChallenge } from "../../game/types";

export const conflictResolutionChallenges: BaseChallenge[] = [
  {
    id: "cr-001",
    category: "conflict-resolution",
    difficulty: "easy",
    title: "PR size and conflict frequency",
    prompt: "Which PR strategy leads to fewer merge conflicts?",
    content: {
      type: "code",
      lang: "bash",

      left: `# One large PR touching many files
git checkout -b feature/user-system
# 2 weeks of work across 43 files
# auth, profiles, settings, dashboard
git add .
git commit -m "add entire user system"
# PR has 2,400 lines changed
# 3 other PRs merged while you worked
# Conflicts in 12 files`,

      right: `# Multiple small, focused PRs
git checkout -b feature/user-auth
# 2 days of work across 6 files
git add .
git commit -m "add JWT authentication"
# PR has 180 lines changed
# Merged quickly, minimal conflicts
# Next: git checkout -b feature/user-profile`,
    },

    correctSide: "right",
    explanationCorrect:
      "Small, focused PRs touch fewer files and merge faster. The shorter a branch lives, the less opportunity there is for other changes to conflict with yours. A 180-line PR can be reviewed in minutes, merged the same day, and rarely conflicts with other work.",
    explanationWrong:
      "Large PRs that touch dozens of files over weeks are conflict magnets. Every PR that merges while yours is open increases the chance of conflicts. Beyond conflicts, large PRs get superficial reviews because reviewers lose focus after a few hundred lines.",
    sourceUrl:
      "https://google.github.io/eng-practices/review/developer/small-cls.html",
    sourceLabel: "Google Engineering: Small CLs",
  },
  {
    id: "cr-002",
    category: "conflict-resolution",
    difficulty: "easy",
    title: "Understanding conflict markers",
    prompt: "Which conflict resolution is correct?",
    content: {
      type: "code",

      left: `// Resolved: kept both changes correctly
function getUsers() {
  const users = await db.users.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: { profile: true },
  });
  return users.map(formatUser);
}`,

      right: `// "Resolved": left conflict markers in code
function getUsers() {
<<<<<<< HEAD
  const users = await db.users.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
=======
  const users = await db.users.findMany({
    where: { active: true },
    include: { profile: true },
>>>>>>> feature/profiles
  });
  return users.map(formatUser);
}`,
    },

    correctSide: "left",
    explanationCorrect:
      "Proper conflict resolution means understanding both changes and combining them correctly. Here, one branch added sorting and the other added profile inclusion. The correct resolution includes both additions. Always verify the resolved code compiles and passes tests.",
    explanationWrong:
      "Leaving conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) in committed code is a surprisingly common mistake. These markers are not valid syntax in any language. Always search your resolved files for these markers before committing. Many editors and CI tools can catch this automatically.",
    sourceUrl:
      "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts",
    sourceLabel: "Git Book: Basic Merge Conflicts",
  },
  {
    id: "cr-003",
    category: "conflict-resolution",
    difficulty: "medium",
    title: "Repeated conflict handling",
    prompt: "Which approach handles recurring conflicts better?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Without rerere: resolve same conflict repeatedly
git merge main
# Conflict in config.ts, resolve manually
git add config.ts
git commit

# Later, rebase onto main
git rebase main
# Same conflict in config.ts again!
# Resolve the exact same way, manually
# And again on the next rebase...`,

      right: `# With rerere: resolve once, reuse forever
git config rerere.enabled true

git merge main
# Conflict in config.ts, resolve manually
git add config.ts
git commit
# rerere records the resolution

# Later, rebase onto main
git rebase main
# Same conflict in config.ts
# rerere auto-applies previous resolution
# "Recorded resolution for config.ts"`,
    },

    correctSide: "right",
    explanationCorrect:
      "Git rerere (reuse recorded resolution) remembers how you resolved a conflict and automatically applies the same resolution if it encounters the same conflict again. This is invaluable during long rebases, repeated merges, or when maintaining release branches. Enable it globally with `git config --global rerere.enabled true`.",
    explanationWrong:
      "Without rerere, you manually resolve the same conflict every time it appears. This is tedious and error-prone, especially during interactive rebases where the same conflict can appear for multiple commits. Enabling rerere is a one-time configuration that saves significant time over the life of a project.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Tools-Rerere",
    sourceLabel: "Git Book: Rerere",
  },
  {
    id: "cr-004",
    category: "conflict-resolution",
    difficulty: "medium",
    title: "Choosing ours vs theirs strategically",
    prompt: "Which conflict resolution strategy is more intentional?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Blindly accept one side for everything
git merge feature/redesign
# Conflicts in 8 files
git checkout --theirs .
git add .
git commit -m "resolve conflicts"
# Accepted ALL incoming changes without
# reviewing any of them
# May have silently dropped important fixes`,

      right: `# Choose strategy per file based on context
git merge feature/redesign
# Conflicts in 8 files

# Lock file: accept theirs (regenerated)
git checkout --theirs package-lock.json

# Config: accept ours (our env is correct)
git checkout --ours .env.example

# Source files: review and merge manually
git mergetool src/auth.ts
git mergetool src/api.ts

git add .
git commit -m "resolve conflicts with redesign"`,
    },

    correctSide: "right",
    explanationCorrect:
      "Different files deserve different resolution strategies. Lock files should accept one side entirely (they get regenerated). Config files may need your version. Source code almost always requires manual review to combine both sides correctly. Choosing per file prevents silent data loss.",
    explanationWrong:
      "Running `git checkout --theirs .` on everything is fast but dangerous. It discards all of your side's changes across every conflicting file. Important bug fixes, config adjustments, or logic changes on your branch are silently dropped. Always review source code conflicts individually.",
    sourceUrl:
      "https://git-scm.com/docs/git-checkout#Documentation/git-checkout.txt---ours",
    sourceLabel: "Git Docs: checkout --ours/--theirs",
  },
  {
    id: "cr-005",
    category: "conflict-resolution",
    difficulty: "hard",
    title: "Merge tool vs manual editing",
    prompt: "Which approach is more reliable for complex conflicts?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Use a 3-way merge tool
git config merge.tool vimdiff3
# Or: vscode, meld, kdiff3, p4merge

git mergetool
# Shows 3 panes:
#   LOCAL  (your branch)
#   BASE   (common ancestor)
#   REMOTE (their branch)
# See what BOTH sides changed from BASE
# Make informed decisions per hunk`,

      right: `# Edit conflict markers in a text editor
git merge feature/api
# Open file, see:
# <<<<<<< HEAD
#   ... your code ...
# =======
#   ... their code ...
# >>>>>>> feature/api
# Only see 2 versions, not the original
# Guess at what each side intended`,
    },

    correctSide: "left",
    explanationCorrect:
      "A 3-way merge tool shows the common ancestor alongside both branches. This is critical for understanding what each side actually changed. Without the base version, you are guessing. For example, if both sides modified a function, the base shows you the original so you can combine both modifications correctly.",
    explanationWrong:
      "Editing conflict markers in a plain text editor only shows you two versions: yours and theirs. You cannot see what the code looked like before either change. This makes it easy to accidentally drop one side's changes or combine them incorrectly, especially in complex conflicts spanning many lines.",
    sourceUrl: "https://git-scm.com/docs/git-mergetool",
    sourceLabel: "Git Docs: git mergetool",
  },
  {
    id: "cr-006",
    category: "conflict-resolution",
    difficulty: "hard",
    title: "File ownership and parallel edits",
    prompt: "Which team practice better prevents merge conflicts?",
    content: {
      type: "code",
      lang: "bash",

      left: `# CODEOWNERS to coordinate file ownership
# .github/CODEOWNERS
/src/auth/     @backend-team
/src/ui/       @frontend-team
/src/shared/   @backend-team @frontend-team

# Teams own clear boundaries
# PRs auto-assign correct reviewers
# Shared files get both teams' eyes
# Fewer cases of parallel edits
# Clear ownership reduces stepping on toes`,

      right: `# No ownership, anyone edits anything
# No CODEOWNERS file
# No file ownership conventions

# Monday: Alice refactors auth/login.ts
# Monday: Bob also refactors auth/login.ts
# Neither knows about the other's work
# Friday: both PRs ready, massive conflicts
# Wasted effort resolving or redoing work`,
    },

    correctSide: "left",
    explanationCorrect:
      "CODEOWNERS files establish clear ownership boundaries. When teams own specific directories, they coordinate changes within their area. PRs that touch shared code automatically request reviews from all owning teams, creating visibility. This does not prevent all conflicts, but it dramatically reduces accidental parallel edits to the same files.",
    explanationWrong:
      "Without file ownership, two developers can unknowingly work on the same files for days. The resulting conflicts waste time and create frustration. Even without formal CODEOWNERS, communicating about which files you are changing (via standups, Slack, or PR drafts) helps prevent this problem.",
    sourceUrl:
      "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners",
    sourceLabel: "GitHub Docs: About Code Owners",
  },
  {
    id: "cr-007",
    category: "conflict-resolution",
    difficulty: "easy",
    title: "Merge conflict output",
    prompt: "Which merge conflict resolution is correct?",
    content: {
      type: "visual",
      left: { componentId: "DiffConflictMarkers" },
      right: { componentId: "DiffConflictResolved" },
    },
    correctSide: "right",
    explanationCorrect:
      "A properly resolved merge conflict removes all conflict markers and combines the changes from both branches correctly. The resulting code should compile, pass tests, and include the intent of both sides of the merge.",
    explanationWrong:
      "Leaving conflict markers in committed code is a common and dangerous mistake. The markers are not valid syntax and will cause build failures or runtime errors. Always search for conflict markers before committing a merge resolution, and verify the result compiles and passes tests.",
    sourceUrl:
      "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts",
    sourceLabel: "Git Book: Basic Merge Conflicts",
  },
];
