import type { BaseChallenge } from "../../game/types";

export const gitHooksChallenges: BaseChallenge[] = [
  {
    id: "gh-001",
    category: "git-hooks",
    difficulty: "easy",
    title: "Pre-commit linting",
    prompt: "Which workflow catches formatting issues earlier?",
    content: {
      type: "code",
      lang: "bash",

      left: `# No pre-commit hook
git add .
git commit -m "feat: add search"
git push origin feat/search

# CI fails 5 minutes later:
# ✗ Lint check failed
# ✗ 12 formatting errors found
# Fix, commit, push, wait again...`,

      right: `# With pre-commit hook
git add .
git commit -m "feat: add search"

# Hook runs instantly:
# ✓ Running ESLint... passed
# ✓ Running Prettier... passed
# ✓ Commit created

git push origin feat/search
# CI passes on first try`,
    },

    correctSide: "right",
    explanationCorrect:
      "Pre-commit hooks catch linting and formatting errors before the code leaves your machine. This provides instant feedback, avoids wasted CI minutes, and eliminates the commit-push-wait-fix cycle. The feedback loop drops from minutes to seconds.",
    explanationWrong:
      "Relying only on CI for lint checks means you discover formatting issues minutes after pushing. Each round trip wastes time and clutters the git history with 'fix lint' commits. Pre-commit hooks solve this by validating code locally before it is committed.",
    sourceUrl: "https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks",
    sourceLabel: "Git Book: Git Hooks",
  },
  {
    id: "gh-002",
    category: "git-hooks",
    difficulty: "easy",
    title: "Commit message validation",
    prompt: "Which setup enforces consistent commit messages?",
    content: {
      type: "code",
      lang: "bash",

      left: `# No commit-msg hook
# Recent commit messages:
#   "fix stuff"
#   "wip"
#   "asdf"
#   "final fix (for real this time)"
#   "update"
#   "changes"`,

      right: `# commit-msg hook with commitlint
# .commitlintrc.json:
# { "extends": ["@commitlint/config-conventional"] }
#
# Rejected:  "fix stuff"
# Rejected:  "wip"
# Accepted:  "fix: resolve race condition in checkout"
# Accepted:  "feat(search): add fuzzy matching"
# Accepted:  "docs: update API reference for v2"`,
    },

    correctSide: "right",
    explanationCorrect:
      "A commit-msg hook with commitlint enforces the Conventional Commits format automatically. This makes git history searchable, enables automated changelogs, and helps teammates understand changes at a glance. The hook rejects vague messages before they enter the history.",
    explanationWrong:
      "Without message validation, commit history becomes a stream of meaningless entries like 'fix stuff' and 'wip'. This makes debugging with git log, bisect, or blame nearly useless. Enforcing a convention through automation is far more reliable than relying on team discipline alone.",
    sourceUrl: "https://www.conventionalcommits.org/en/v1.0.0/",
    sourceLabel: "Conventional Commits specification",
  },
  {
    id: "gh-003",
    category: "git-hooks",
    difficulty: "medium",
    title: "Husky for hook management",
    prompt: "Which approach makes git hooks reliable across the team?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Manual hook setup
# Copy hook script to .git/hooks/
cp scripts/pre-commit .git/hooks/
chmod +x .git/hooks/pre-commit

# Problems:
# - .git/hooks/ is not version controlled
# - New team members must copy manually
# - Easy to forget after a fresh clone
# - Different versions across machines`,

      right: `# Husky setup (version controlled)
# package.json:
#   "prepare": "husky"
#
# .husky/pre-commit:
pnpm lint-staged

# After cloning and running pnpm install:
# ✓ Hooks installed automatically
# ✓ Same hooks on every machine
# ✓ Hooks versioned in the repository`,
    },

    correctSide: "right",
    explanationCorrect:
      "Husky installs git hooks automatically through the npm prepare lifecycle script. Hooks are stored in the .husky/ directory, which is version controlled. Every developer gets the same hooks after running pnpm install, with zero manual setup required.",
    explanationWrong:
      "Manual hook setup does not scale. The .git/hooks/ directory is not tracked by git, so each developer must configure hooks independently. New team members often skip this step, and the hooks drift across machines. Husky solves this with automatic, version-controlled hook installation.",
    sourceUrl: "https://typicode.github.io/husky/",
    sourceLabel: "Husky: Git hooks made easy",
  },
  {
    id: "gh-004",
    category: "git-hooks",
    difficulty: "medium",
    title: "lint-staged for staged files only",
    prompt: "Which pre-commit strategy is faster and more correct?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Pre-commit: lint entire project
# .husky/pre-commit:
pnpm eslint .
pnpm prettier --check .

# Problems:
# - Runs on ALL files (slow on large repos)
# - May fail on files you did not change
# - 45 seconds on a medium codebase
# - Developers start skipping the hook`,

      right: `# Pre-commit: lint only staged files
# .husky/pre-commit:
pnpm lint-staged

# lint-staged.config.js:
# "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
# "*.css":      ["prettier --write"]
#
# Runs only on files in the commit
# 2 seconds on same codebase
# Auto-fixes and re-stages changes`,
    },

    correctSide: "right",
    explanationCorrect:
      "lint-staged runs linters only on files that are staged for commit. This is dramatically faster than linting the entire project and avoids false failures from unrelated files. It can also auto-fix issues and re-stage the corrected files, making the workflow seamless.",
    explanationWrong:
      "Linting the entire project on every commit is wasteful. In a large codebase, this can take a minute or more, which frustrates developers and leads to skipping hooks entirely. lint-staged targets only the changed files, keeping the feedback loop fast and focused.",
    sourceUrl: "https://github.com/lint-staged/lint-staged",
    sourceLabel: "lint-staged: Run linters on staged files",
  },
  {
    id: "gh-005",
    category: "git-hooks",
    difficulty: "hard",
    title: "Pre-push hook for tests",
    prompt: "Which hook strategy catches test failures at the right time?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Run full test suite on pre-commit
# .husky/pre-commit:
pnpm lint-staged
pnpm test          # Full test suite

# Every commit takes 3+ minutes
# Developers avoid committing often
# Small WIP commits become painful
# Breaks the "commit early, commit often"
#   workflow`,

      right: `# Fast checks on commit, tests on push
# .husky/pre-commit:
pnpm lint-staged   # Lint + format (2s)

# .husky/pre-push:
pnpm test          # Full test suite (90s)

# Commit freely and frequently
# Tests run once before sharing code
# Fast local workflow preserved
# Failures caught before CI`,
    },

    correctSide: "right",
    explanationCorrect:
      "Splitting checks between pre-commit and pre-push hooks optimizes the developer workflow. Fast checks like linting run on every commit to keep the feedback loop tight. Slower checks like the test suite run on push, catching failures before code reaches CI without slowing down local work.",
    explanationWrong:
      "Running the full test suite on every commit penalizes the practice of committing frequently. Developers stop making small, incremental commits to avoid the wait. Moving tests to a pre-push hook preserves fast commits while still catching test failures before code is shared with the team.",
    sourceUrl: "https://git-scm.com/docs/githooks#_pre_push",
    sourceLabel: "Git Docs: pre-push hook",
  },
  {
    id: "gh-006",
    category: "git-hooks",
    difficulty: "hard",
    title: "The --no-verify flag",
    prompt: "Which team policy around hook bypassing is more sustainable?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Common team pattern:
git commit --no-verify -m "quick fix"
git push --no-verify

# "I'll fix the lint errors later"
# Hook bypass becomes a habit
# CI catches what hooks should have
# 30% of commits skip hooks
# git history full of lint-fix commits`,

      right: `# Team agreement: no --no-verify
# If a hook fails, fix the issue first.
#
# Escape hatch for genuine emergencies:
# 1. Document why in the commit message
# 2. Fix in the immediately next commit
# 3. Discuss in PR review
#
# Hooks are lightweight (lint-staged: 2s)
# No reason to bypass for speed
# CI mirrors hook checks as a safety net`,
    },

    correctSide: "right",
    explanationCorrect:
      "Treating --no-verify as an emergency-only escape hatch keeps hooks effective. When hooks are fast (thanks to lint-staged), there is no performance reason to bypass them. A team agreement to avoid --no-verify, combined with lightweight hooks, keeps the codebase consistently clean.",
    explanationWrong:
      "Routinely skipping hooks defeats their purpose entirely. If developers bypass hooks for convenience, the team loses the safety net they provide. The solution is not to skip hooks but to make them fast enough that nobody wants to. lint-staged and targeted pre-push checks achieve this.",
    sourceUrl: "https://typicode.github.io/husky/troubleshooting.html",
    sourceLabel: "Husky: Troubleshooting",
  },
  {
    id: "gh-007",
    category: "git-hooks",
    difficulty: "easy",
    title: "Workflow with and without hooks",
    prompt: "Which development workflow catches problems earlier?",
    content: {
      type: "visual",
      left: { componentId: "FlowNoHooks" },
      right: { componentId: "FlowWithHooks" },
    },
    correctSide: "right",
    explanationCorrect:
      "Git hooks provide automated checks at key points in the development workflow: before committing, before pushing, and when preparing commit messages. Catching lint errors, formatting issues, and test failures locally saves CI time and prevents broken code from reaching the remote repository.",
    explanationWrong:
      "Without git hooks, problems are only caught by CI after the code has been pushed. This creates slow feedback loops, wastes CI resources, and clutters the history with fix-up commits. Hooks shift quality checks left, catching issues seconds after they are introduced instead of minutes or hours later.",
    sourceUrl: "https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks",
    sourceLabel: "Git Book: Git Hooks",
  },
];
