import type { BaseChallenge } from "../../game/types";

export const ciIntegrationChallenges: BaseChallenge[] = [
  {
    id: "ci-001",
    category: "ci-integration",
    difficulty: "easy",
    title: "CI on PRs vs only on main",
    prompt: "When should CI checks run?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

# Tests only run after merging to main
# Broken code discovered too late`,

      right: `# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

# Tests run on every PR before merge
# Broken code caught early`,
    },

    correctSide: "right",
    explanationCorrect:
      "Running CI on `pull_request` events catches problems before they reach the main branch. If tests only run on `push` to main, broken code is already merged by the time you discover it, and the fix requires another commit.\n\nThe `pull_request` trigger runs against the PR branch, giving reviewers confidence that the code passes all checks before they approve.",
    explanationWrong:
      "CI that only runs on main is a safety net with holes. By the time tests fail, the broken code is already in the main branch and potentially deployed. Running checks on pull requests shifts failure detection left, where it is cheaper and less disruptive to fix.",
    sourceUrl:
      "https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#pull_request",
    sourceLabel: "GitHub Docs: Workflow Triggers",
  },
  {
    id: "ci-002",
    category: "ci-integration",
    difficulty: "easy",
    title: "Branch protection rules",
    prompt: "Which branch protection setup is safer?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# Branch protection: main
# Settings:
#   Require pull request: No
#   Require status checks: No
#   Require approvals: No
#
# Anyone can push directly to main
# No checks required before merge
# Force push allowed

git push origin main
# Success: pushed directly`,

      right: `# Branch protection: main
# Settings:
#   Require pull request: Yes
#   Require status checks: Yes
#     - ci/tests
#     - ci/lint
#     - ci/typecheck
#   Require approvals: 1
#   Dismiss stale reviews: Yes
#   No force push: Yes

git push origin main
# Error: protected branch`,
    },

    correctSide: "right",
    explanationCorrect:
      "Branch protection rules prevent direct pushes to main, require CI checks to pass, and enforce code review through approval requirements. This means no code reaches main without being tested and reviewed.\n\nDismissing stale reviews ensures that if new commits are pushed after an approval, the PR must be re-reviewed. Disabling force push prevents history rewriting on the shared branch.",
    explanationWrong:
      "An unprotected main branch is one bad push away from a broken deployment. Without required status checks, untested code can be merged. Without required reviews, a single developer can ship changes without a second pair of eyes. Branch protection is the foundation of a safe delivery pipeline.",
    sourceUrl:
      "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-a-branch-protection-rule/about-branch-protection-rules",
    sourceLabel: "GitHub Docs: Branch Protection Rules",
  },
  {
    id: "ci-003",
    category: "ci-integration",
    difficulty: "medium",
    title: "Required status checks",
    prompt: "Which status check configuration is more reliable?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# Single CI job does everything
name: CI
on: [pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build

# If lint fails, you wait for it to finish
# before discovering the test failure too`,

      right: `# Parallel jobs with clear names
name: CI
on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test`,
    },

    correctSide: "right",
    explanationCorrect:
      "Parallel jobs run lint, typecheck, and tests simultaneously, giving you all failures at once instead of one at a time. If lint fails in 10 seconds, you see that immediately while tests are still running.\n\nSeparate jobs also make branch protection more granular. You can require all three checks individually, and the PR status shows exactly which check failed.",
    explanationWrong:
      "A single sequential job means each step must pass before the next one runs. If lint fails at step 3, you never learn whether tests also fail until you fix the lint error and push again. Parallel jobs reveal all problems in a single CI run, reducing the number of fix-and-push cycles.",
    sourceUrl:
      "https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/using-jobs-in-a-workflow",
    sourceLabel: "GitHub Docs: Using Jobs in a Workflow",
  },
  {
    id: "ci-004",
    category: "ci-integration",
    difficulty: "medium",
    title: "Deploy previews for PRs",
    prompt: "Which review workflow gives better confidence?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# Review by reading the diff only
# Reviewer reads code on GitHub
# Checks out locally to test manually
# Approves based on code reading

# PR comment:
# "LGTM, code looks good to me"
# Merged without running the app`,

      right: `# Deploy preview on every PR
name: Preview
on: [pull_request]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - name: Deploy to preview URL
        run: |
          npx vercel deploy --prebuilt \\
            --token $VERCEL_TOKEN
      - name: Comment preview URL
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: 'Preview: https://pr-' + context.issue.number + '.example.com'
            })`,
    },

    correctSide: "right",
    explanationCorrect:
      "Deploy previews let reviewers interact with the actual running application instead of just reading code. Visual bugs, broken links, and UX issues are often invisible in a diff but obvious in a live preview.\n\nAutomatic preview URLs also make it easy for designers, product managers, and QA to review changes without setting up a local development environment.",
    explanationWrong:
      "Code review by reading diffs alone misses an entire class of bugs: visual regressions, responsive layout issues, broken user flows, and performance problems. A deploy preview provides a live, shareable URL where anyone on the team can verify the changes work as intended.",
    sourceUrl: "https://vercel.com/docs/deployments/preview-deployments",
    sourceLabel: "Vercel Docs: Preview Deployments",
  },
  {
    id: "ci-005",
    category: "ci-integration",
    difficulty: "hard",
    title: "Auto-merge after checks pass",
    prompt: "Which merge workflow reduces bottlenecks?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# Manual merge after approval
# 1. Developer opens PR
# 2. CI passes
# 3. Reviewer approves
# 4. Developer waits for reviewer
#    to click "Merge"
# 5. Or developer merges themselves
#    hours later when they notice

# Approved PRs sit unmerged for hours
# Slows down the entire team`,

      right: `# Auto-merge when requirements are met
# 1. Developer opens PR
# 2. Developer enables auto-merge
# 3. CI runs in parallel with review
# 4. Reviewer approves
# 5. GitHub merges automatically
#    when all checks pass

# Branch protection still enforced
# No human needed to click merge
# PRs land as soon as they are ready`,
    },

    correctSide: "right",
    explanationCorrect:
      "GitHub's auto-merge feature merges a PR automatically once all required status checks pass and the required number of approvals is met. This eliminates the idle time between approval and merge, where PRs often sit for hours waiting for someone to click the button.\n\nAuto-merge respects all branch protection rules, so it is just as safe as manual merging.",
    explanationWrong:
      "Manual merging creates an unnecessary bottleneck. After a PR is approved and all checks pass, there is no reason to wait for a human to click merge. That delay can cause merge conflicts with other PRs, slow down the team, and leave approved code unmerged over weekends. Auto-merge solves this without sacrificing safety.",
    sourceUrl:
      "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request",
    sourceLabel: "GitHub Docs: Automatically Merging a PR",
  },
  {
    id: "ci-006",
    category: "ci-integration",
    difficulty: "hard",
    title: "Workflow triggers and path filters",
    prompt: "Which workflow configuration avoids unnecessary CI runs?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# Run everything on every change
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd frontend && npm test

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd backend && npm test

# Both jobs run even if only
# README.md was changed`,

      right: `# Run only what changed
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.labels.*.name, 'frontend') || true
    steps:
      - uses: actions/checkout@v4
      - run: cd frontend && npm test

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd backend && npm test

# Use path filters at the workflow level
on:
  pull_request:
    paths:
      - 'frontend/**'
      - 'backend/**'
      - 'package.json'

# Docs-only changes skip CI entirely`,
    },

    correctSide: "right",
    explanationCorrect:
      "Path filters prevent CI from running when changes are irrelevant. A README update should not trigger a full test suite. In a monorepo, path filters can limit each job to its own directory, saving compute time and reducing queue wait times.\n\nThis is especially impactful for large repositories where a full CI run takes many minutes and consumes billable runner time.",
    explanationWrong:
      "Running every CI job on every change wastes compute resources and developer time. If your test suite takes 15 minutes and someone pushes a typo fix to a markdown file, that is 15 minutes of unnecessary waiting. Path filters let you skip irrelevant checks and focus CI on the code that actually changed.",
    sourceUrl:
      "https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#pull_request",
    sourceLabel: "GitHub Docs: Workflow Triggers",
  },
  {
    id: "ci-007",
    category: "ci-integration",
    difficulty: "medium",
    title: "Branch protection and CI",
    prompt: "Which workflow provides a safer path to production?",
    content: {
      type: "visual",
      left: { componentId: "FlowNoBranchProtection" },
      right: { componentId: "FlowWithProtection" },
    },
    correctSide: "right",
    explanationCorrect:
      "Branch protection rules enforce that all CI checks pass and at least one reviewer approves before code can be merged. This creates a consistent quality gate that prevents broken or unreviewed code from reaching the main branch, regardless of who pushes the change.",
    explanationWrong:
      "Without branch protection, any developer can push directly to main or merge a failing PR. A single bad commit can break the build for the entire team, trigger a broken deployment, or introduce a security vulnerability. Branch protection is one of the simplest and most effective safeguards available.",
    sourceUrl:
      "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-a-branch-protection-rule/about-branch-protection-rules",
    sourceLabel: "GitHub Docs: Branch Protection Rules",
  },
];
