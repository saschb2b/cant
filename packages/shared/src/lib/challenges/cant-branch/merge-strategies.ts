import type { BaseChallenge } from "../../game/types";

export const mergeStrategiesChallenges: BaseChallenge[] = [
  {
    id: "ms-001",
    category: "merge-strategies",
    difficulty: "easy",
    title: "Merge commit vs fast-forward",
    prompt: "Which merge strategy preserves branch history?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Fast-forward merge (default when possible)
git checkout main
git merge feature/auth
# Result: linear history
# a -- b -- c -- d -- e
# No record that d and e were
# developed on a feature branch`,

      right: `# Merge commit with --no-ff
git checkout main
git merge --no-ff feature/auth
# Result: merge commit preserves context
# a -- b -------- M
#       \\        /
#        c -- d -- e
# Clear that c/d/e were a unit of work`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using `--no-ff` creates a merge commit even when a fast-forward is possible. This preserves the fact that a set of commits was developed together as a feature. You can later revert the entire feature by reverting the single merge commit. The branch topology tells the story of how work was organized.",
    explanationWrong:
      "Fast-forward merges create a linear history that loses the context of feature branches. You cannot tell which commits belonged to which feature. Reverting a feature requires identifying and reverting each individual commit. For solo work or trivial changes, fast-forward is fine, but for team features, `--no-ff` is preferred.",
    sourceUrl: "https://git-scm.com/docs/git-merge#_fast_forward_merge",
    sourceLabel: "Git Docs: Fast-Forward Merge",
  },
  {
    id: "ms-002",
    category: "merge-strategies",
    difficulty: "easy",
    title: "Pre-merge branch sync",
    prompt: "Which workflow produces cleaner pull request merges?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Merge main into feature (creates noise)
git checkout feature/auth
git merge main
# Adds a merge commit to the feature branch
# Repeat every time main updates
# PR history is cluttered with merge commits
git checkout main
git merge feature/auth`,

      right: `# Rebase feature onto main (clean)
git checkout feature/auth
git rebase main
# Replays feature commits on top of main
# Linear, clean commit sequence
# No extra merge commits in the PR
git checkout main
git merge feature/auth`,
    },

    correctSide: "right",
    explanationCorrect:
      "Rebasing your feature branch onto main before merging keeps the commit history clean. Your feature commits appear as a neat sequence on top of main, making the PR easy to review commit-by-commit. There are no unnecessary merge commits cluttering the history.",
    explanationWrong:
      "Merging main into your feature branch repeatedly creates merge commits that add noise to the PR. Reviewers have to skip past these merge commits to find actual work. The branch history becomes a tangled web of back-and-forth merges that obscures the real changes.",
    sourceUrl: "https://git-scm.com/docs/git-rebase",
    sourceLabel: "Git Docs: git rebase",
  },
  {
    id: "ms-003",
    category: "merge-strategies",
    difficulty: "medium",
    title: "Rebase on shared branches",
    prompt:
      "Which approach is safe when others are working on the same branch?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Rebase a shared branch (dangerous)
git checkout shared-feature
git rebase main
git push --force origin shared-feature
# Rewrites history that others depend on
# Teammates' local copies are now invalid
# They must force-pull or re-clone
# Commits may be duplicated or lost`,

      right: `# Merge into a shared branch (safe)
git checkout shared-feature
git merge main
git push origin shared-feature
# Adds a merge commit but keeps history
# Teammates can pull without issues
# No history rewriting on shared work
# Everyone stays in sync naturally`,
    },

    correctSide: "right",
    explanationCorrect:
      "Never rebase branches that other people are working on. Rebasing rewrites commit hashes, which means anyone who has already pulled the branch will have conflicts. Merging is safe on shared branches because it only adds new commits without rewriting existing ones.",
    explanationWrong:
      "Force-pushing a rebased shared branch is one of the most disruptive things you can do in a team. It invalidates every teammate's local copy of the branch. They will see duplicate commits, phantom conflicts, or worse, silently lose their own work when they try to reconcile the histories.",
    sourceUrl:
      "https://git-scm.com/book/en/v2/Git-Branching-Rebasing#_rebase_peril",
    sourceLabel: "Git Book: The Perils of Rebasing",
  },
  {
    id: "ms-004",
    category: "merge-strategies",
    difficulty: "medium",
    title: "Squash merge with WIP commits",
    prompt:
      "Which merge strategy is better for a feature with messy WIP commits?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Regular merge preserves all commits
git checkout main
git merge --no-ff feature/auth
# History shows every WIP commit:
#   "wip"
#   "fix typo"
#   "actually fix it"
#   "ugh forgot a file"
#   "ok now it works"
#   "review feedback"`,

      right: `# Squash merge condenses into one commit
git checkout main
git merge --squash feature/auth
git commit -m "feat: add user authentication

Implement JWT-based auth with login,
logout, and session refresh endpoints."
# History shows one clean commit
# Feature branch retains full detail`,
    },

    correctSide: "right",
    explanationCorrect:
      "Squash merging condenses all feature branch commits into a single, well-crafted commit on main. This keeps the main branch history readable and meaningful. The detailed WIP history still exists on the feature branch if you ever need to inspect individual steps.",
    explanationWrong:
      'Preserving every WIP commit on the main branch clutters the history with noise. Commits like "wip" and "fix typo" provide no value to someone reading the project history. A clean main branch history makes `git log`, `git bisect`, and `git blame` significantly more useful.',
    sourceUrl:
      "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github#squashing-your-merge-commits",
    sourceLabel: "GitHub Docs: Squash Merge",
  },
  {
    id: "ms-005",
    category: "merge-strategies",
    difficulty: "hard",
    title: "Configuring default merge strategy",
    prompt: "Which git config enforces consistent merge behavior?",
    content: {
      type: "code",
      lang: "bash",

      left: `# No config, rely on developer memory
git merge feature/auth
# Sometimes fast-forward
# Sometimes merge commit
# Inconsistent history depending on
# who merged and what flags they used
# Some PRs squash, some don't
# No team-wide standard`,

      right: `# Configure merge behavior per branch
git config branch.main.mergeoptions "--no-ff"

# Or set in .gitconfig for the repo
[branch "main"]
  mergeoptions = --no-ff

# Every merge to main creates a merge commit
# Consistent regardless of who merges
# Combine with GitHub branch protection
# to enforce squash or merge commits`,
    },

    correctSide: "right",
    explanationCorrect:
      "Setting `branch.main.mergeoptions` ensures consistent merge behavior regardless of who runs the command. Combined with GitHub branch protection rules that enforce a specific merge method, you get a predictable, uniform history. This eliminates the inconsistency of relying on each developer to remember the right flags.",
    explanationWrong:
      "Relying on individual developers to remember merge flags leads to an inconsistent history. Some merges will be fast-forward, some will have merge commits, and some will be squashed. This makes the git log harder to read and tools like `git bisect` less predictable.",
    sourceUrl:
      "https://git-scm.com/docs/git-config#Documentation/git-config.txt-branchltnamegtmergeoptions",
    sourceLabel: "Git Docs: branch.mergeoptions config",
  },
  {
    id: "ms-006",
    category: "merge-strategies",
    difficulty: "hard",
    title: "Merge vs rebase for diverged branches",
    prompt: "Which approach is better when your branch is far behind main?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Interactive rebase to clean up first
git checkout feature/dashboard
git fetch origin
git rebase -i origin/main
# Reorder, squash, and fix up commits
# Resolve conflicts once per commit
# Result: clean, logical commit sequence
# Easy to review after rebase`,

      right: `# Just merge main and hope for the best
git checkout feature/dashboard
git fetch origin
git merge origin/main
# One big conflict resolution session
# All conflicts mixed together
# Hard to verify correctness
# Merge commit buries the resolution`,
    },

    correctSide: "left",
    explanationCorrect:
      "Interactive rebase lets you resolve conflicts one commit at a time, making each resolution small and verifiable. You can also clean up your commit history (squash WIP commits, reorder for logical flow) before the final merge. This produces a clear, reviewable result that is easier to verify for correctness.",
    explanationWrong:
      "A single merge of a far-behind branch dumps all conflicts into one resolution session. You lose context about which change caused which conflict. It is harder to verify that every conflict was resolved correctly when dozens of files change at once. The resulting merge commit hides the complexity of what was resolved.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History",
    sourceLabel: "Git Book: Rewriting History",
  },
  {
    id: "ms-007",
    category: "merge-strategies",
    difficulty: "medium",
    title: "Merge strategy for feature branches",
    prompt: "Which git history is easier to understand and navigate?",
    content: {
      type: "visual",
      left: { componentId: "GitGraphMessyMerge" },
      right: { componentId: "GitGraphCleanRebase" },
    },
    correctSide: "right",
    explanationCorrect:
      "A clean rebase produces a linear commit history that is easy to follow. Each commit sits neatly on top of the previous one, making tools like `git log`, `git blame`, and `git bisect` straightforward to use. The story of the project reads like a clear timeline.",
    explanationWrong:
      "Frequent merge commits from pulling main into feature branches create a tangled graph that is hard to read. The criss-crossing lines obscure the actual progression of work and make it difficult to identify which commits belong to which feature. Rebasing before merging avoids this clutter.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Branching-Rebasing",
    sourceLabel: "Git Book: Rebasing",
  },
];
