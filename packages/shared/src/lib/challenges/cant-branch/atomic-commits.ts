import type { BaseChallenge } from "../../game/types";

export const atomicCommitsChallenges: BaseChallenge[] = [
  {
    id: "ac-001",
    category: "atomic-commits",
    difficulty: "easy",
    title: "Commit scope",
    prompt: "Which commit history is easier to review and revert?",
    content: {
      type: "code",
      lang: "bash",

      left: `git log --oneline

a1b2c3d Add user avatar upload
f4e5d6c Update profile API endpoint
8g7h6i5 Write avatar upload tests`,

      right: `git log --oneline

z9y8x7w Add avatar upload, fix navbar,
         update deps, refactor utils`,
    },

    correctSide: "left",
    explanationCorrect:
      "Each commit on the left does one thing. If the avatar upload breaks production, you can revert `a1b2c3d` without losing the navbar fix or the dependency update. Atomic commits make `git revert`, `git bisect`, and `git cherry-pick` precise tools instead of blunt instruments.\n\nSmall commits also produce cleaner pull request reviews.",
    explanationWrong:
      "A single commit that bundles four unrelated changes is impossible to partially revert. If the dependency update causes a regression, you would have to undo the avatar feature, the navbar fix, and the utility refactor along with it. Atomic commits keep unrelated changes independent.",
    sourceUrl: "https://www.git-scm.com/book/en/v2/Git-Tools-Rewriting-History",
    sourceLabel: "Git Book: Rewriting History",
  },
  {
    id: "ac-002",
    category: "atomic-commits",
    difficulty: "medium",
    title: "Staging strategy",
    prompt: "Which approach produces cleaner, more focused commits?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Stage only the auth-related changes
git add -p src/middleware.ts
# Review each hunk, stage (y) or skip (n)

git commit -m "fix(auth): validate token expiry"

# Stage the remaining logging changes
git add -p src/middleware.ts
git commit -m "chore: add request logging"`,

      right: `# Stage the entire file at once
git add src/middleware.ts

git commit -m "fix(auth): validate token expiry
and add request logging"`,
    },

    correctSide: "left",
    explanationCorrect:
      "When a single file contains changes for two different purposes, `git add -p` lets you stage individual hunks. This produces two focused commits from one modified file.\n\nThe interactive staging shows you each change in context, which also serves as a self-review before committing. It catches accidental debug statements and unrelated edits.",
    explanationWrong:
      'Staging an entire file forces you to bundle unrelated changes into one commit. The commit message has to use "and" to describe two separate things, which is a strong signal that the commit should be split. Tools like `git add -p` and `git add --patch` exist precisely for this situation.',
    sourceUrl:
      "https://www.git-scm.com/book/en/v2/Git-Tools-Interactive-Staging",
    sourceLabel: "Git Book: Interactive Staging",
  },
  {
    id: "ac-003",
    category: "atomic-commits",
    difficulty: "easy",
    title: "Separating refactoring from features",
    prompt: "Which approach makes the feature change easier to review?",
    content: {
      type: "code",
      lang: "bash",

      left: `git log --oneline

c3d4e5f feat: add dark mode toggle
b2c3d4e refactor: extract ThemeProvider
a1b2c3d refactor: rename CSS variables`,

      right: `git log --oneline

x7y8z9a feat: add dark mode toggle,
         extract ThemeProvider, and
         rename CSS variables`,
    },

    correctSide: "left",
    explanationCorrect:
      "Separating refactoring from feature work means reviewers can verify the refactoring commits are behavior-preserving, then review the feature commit in isolation. Each commit is simple to understand on its own.\n\nThis also makes `git bisect` effective. If dark mode introduces a regression, `bisect` points directly at `c3d4e5f`, not at a 500-line commit mixing three concerns.",
    explanationWrong:
      "Mixing refactoring with feature work creates a large, noisy diff where reviewers cannot tell which changes are structural cleanup and which introduce new behavior. A reviewer seeing renamed variables next to new toggle logic has to mentally separate the two, which increases the chance of missing bugs.",
    sourceUrl: "https://martinfowler.com/articles/workflowsOfRefactoring/",
    sourceLabel: "Martin Fowler: Workflows of Refactoring",
  },
  {
    id: "ac-004",
    category: "atomic-commits",
    difficulty: "hard",
    title: "Commit builds independently",
    prompt: "Which commit sequence keeps the codebase in a working state?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Commit 1: add interface
git add src/types.ts
git commit -m "feat: add PaymentMethod type"

# Commit 2: add implementation
git add src/payment.ts
git commit -m "feat: implement payment processor"

# Commit 3: add tests
git add src/payment.test.ts
git commit -m "test: add payment processor tests"`,

      right: `# Commit 1: add tests (imports missing code)
git add src/payment.test.ts
git commit -m "test: add payment processor tests"

# Commit 2: add implementation (type errors)
git add src/payment.ts
git commit -m "feat: implement payment processor"

# Commit 3: add interface (now it compiles)
git add src/types.ts
git commit -m "feat: add PaymentMethod type"`,
    },

    correctSide: "left",
    explanationCorrect:
      "Every commit in the left sequence compiles and passes lint checks on its own. Commit 1 adds the type, commit 2 uses it, commit 3 tests it. This means `git bisect` can check out any commit and run the test suite.\n\nA broken intermediate commit makes automated bisecting fail and forces manual investigation.",
    explanationWrong:
      "The right sequence has two broken commits. Commit 1 imports code that does not exist yet. Commit 2 references a type that has not been defined. Only after commit 3 does the codebase compile again. This breaks `git bisect`, CI on individual commits, and anyone who checks out the intermediate state.",
    sourceUrl: "https://www.git-scm.com/docs/git-bisect",
    sourceLabel: "Git Docs: git bisect",
  },
  {
    id: "ac-005",
    category: "atomic-commits",
    difficulty: "medium",
    title: "Diff size per commit",
    prompt: "Which pull request is more likely to get a thorough review?",
    content: {
      type: "code",
      lang: "bash",

      left: `Pull Request #412
"Redesign checkout flow"

 47 files changed
 3,218 insertions(+)
 1,845 deletions(-)

Reviewers: 0 approved, 2 pending
Status: Open for 12 days`,

      right: `Pull Request #412 (1 of 4)
"refactor: extract address form component"

  6 files changed
  142 insertions(+)
   38 deletions(-)

Reviewers: 2 approved
Status: Merged after 1 day`,
    },

    correctSide: "right",
    explanationCorrect:
      "Research from Google and Microsoft shows that review quality drops sharply beyond 200-400 lines of changes. Smaller pull requests get faster, more thorough reviews. Splitting a large redesign into a series of focused PRs keeps each one reviewable.\n\nA 3,000-line PR often sits open for days because reviewers are intimidated by the scope.",
    explanationWrong:
      "A 3,200-line pull request is almost impossible to review carefully. Reviewers tend to skim large diffs, approving with surface-level comments. Breaking the work into a series of small, atomic PRs gets each change reviewed properly and merged quickly, reducing integration risk.",
    sourceUrl:
      "https://google.github.io/eng-practices/review/developer/small-cls.html",
    sourceLabel: "Google Engineering Practices: Small CLs",
  },
  {
    id: "ac-006",
    category: "atomic-commits",
    difficulty: "hard",
    title: "Fixup commits during development",
    prompt: "Which workflow produces a cleaner final history?",
    content: {
      type: "code",
      lang: "bash",

      left: `# During development
git commit -m "feat: add search endpoint"
git commit --fixup HEAD    # typo fix
git commit --fixup HEAD~1  # missing test

# Before merging, squash fixups
git rebase -i --autosquash main`,

      right: `# During development
git commit -m "feat: add search endpoint"
git commit -m "fix typo"
git commit -m "oops forgot test"
git commit -m "actually fix the test"
git commit -m "lint"

# Merge as-is
git checkout main && git merge feature`,
    },

    correctSide: "left",
    explanationCorrect:
      "The `--fixup` flag marks a commit as a correction to a previous commit. When you run `rebase --autosquash`, git automatically reorders and squashes these fixup commits into their targets. The final history reads as if you got it right the first time.\n\nThis gives you the freedom to commit often during development while still producing a clean, logical history.",
    explanationWrong:
      'A history littered with "fix typo", "oops", and "lint" commits obscures the meaningful changes. Future developers running `git log` or `git blame` will wade through noise. The `--fixup` and `--autosquash` workflow lets you iterate freely, then clean up before merging.',
    sourceUrl:
      "https://www.git-scm.com/docs/git-commit#Documentation/git-commit.txt---fixupamabordsquashltcommitgt",
    sourceLabel: "Git Docs: git commit --fixup",
  },
  {
    id: "ac-007",
    category: "atomic-commits",
    difficulty: "easy",
    title: "Commit granularity",
    prompt: "Which commit strategy is easier to review and revert?",
    content: {
      type: "visual",
      left: { componentId: "GitGraphMonolithCommit" },
      right: { componentId: "GitGraphAtomicCommits" },
    },
    correctSide: "right",
    explanationCorrect:
      "Atomic commits each contain a single logical change. This makes code review focused, git bisect precise, and reverts safe. If one change introduces a bug, you can revert just that commit without affecting unrelated work.",
    explanationWrong:
      "A monolith commit that bundles many unrelated changes is difficult to review and impossible to partially revert. If any part of the commit needs to be undone, you lose all other changes along with it. Splitting work into atomic commits keeps each change independent and manageable.",
    sourceUrl: "https://www.git-scm.com/book/en/v2/Git-Tools-Rewriting-History",
    sourceLabel: "Git Book: Rewriting History",
  },
];
