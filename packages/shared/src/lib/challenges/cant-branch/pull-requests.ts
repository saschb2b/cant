import type { BaseChallenge } from "../../game/types";

export const pullRequestsChallenges: BaseChallenge[] = [
  {
    id: "pr-001",
    category: "pull-requests",
    difficulty: "easy",
    title: "PR scope and size",
    prompt: "Which pull request approach leads to better reviews?",
    content: {
      type: "code",
      lang: "bash",

      left: `# PR: "Add user authentication"
# 47 files changed, 2,340 insertions
# Includes:
#   - Database schema changes
#   - Auth middleware
#   - Login/signup UI
#   - Session management
#   - Password reset flow
#   - Email verification`,

      right: `# PR 1: "Add users table and schema"
# 6 files changed, 180 insertions
#
# PR 2: "Add auth middleware"
# 8 files changed, 210 insertions
#
# PR 3: "Add login and signup UI"
# 12 files changed, 340 insertions`,
    },

    correctSide: "right",
    explanationCorrect:
      "Small, focused PRs are easier to review, faster to merge, and less likely to introduce hidden bugs. Reviewers can give meaningful feedback when the scope is narrow. Each PR also becomes a clean revert target if something goes wrong.",
    explanationWrong:
      "Large PRs overwhelm reviewers and often receive superficial approvals. Studies show that review quality drops significantly after 400 lines of changes. Breaking work into smaller PRs leads to more thorough reviews and faster iteration.",
    sourceUrl:
      "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests",
    sourceLabel: "GitHub Docs: Best practices for pull requests",
  },
  {
    id: "pr-002",
    category: "pull-requests",
    difficulty: "easy",
    title: "PR description quality",
    prompt: "Which PR description helps reviewers understand the change?",
    content: {
      type: "code",

      left: `## What
Fixed the bug

## Testing
It works now`,

      right: `## What
Fix race condition in order processing
when two requests arrive simultaneously.

## Why
Users reported duplicate charges (issue #342).

## How
Add a database-level unique constraint on
the idempotency key and handle conflicts
with a retry mechanism.

## Testing
- Added unit test for concurrent orders
- Verified fix against production logs`,
    },

    correctSide: "right",
    explanationCorrect:
      "A good PR description answers what changed, why it changed, and how it was tested. This context helps reviewers focus their attention and makes the PR a useful historical reference when someone investigates the code months later.",
    explanationWrong:
      "Vague descriptions force reviewers to reverse-engineer the intent from the diff. This wastes time and increases the risk of approving changes that do not actually solve the problem. The description is documentation for your future team.",
    sourceUrl:
      "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests",
    sourceLabel: "GitHub Docs: Best practices for pull requests",
  },
  {
    id: "pr-003",
    category: "pull-requests",
    difficulty: "medium",
    title: "PR readiness signaling",
    prompt: "Which workflow gives you earlier feedback on your approach?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Work on feature for 3 days
git checkout -b feat/new-api
# ... many commits over multiple days ...
# Finally open PR when everything is done
gh pr create --title "Add new API layer" \\
  --body "Ready for review"`,

      right: `# Open draft PR on day 1
git checkout -b feat/new-api
git commit -m "feat: scaffold new API layer"
git push -u origin feat/new-api
gh pr create --draft \\
  --title "feat: new API layer" \\
  --body "RFC: seeking feedback on approach"
# Continue pushing commits as you go`,
    },

    correctSide: "right",
    explanationCorrect:
      "Draft PRs signal that work is in progress while inviting early feedback. Opening a draft on day one lets teammates flag architectural concerns before you invest days of effort. It also makes your work visible to the team.",
    explanationWrong:
      "Waiting until the feature is complete before opening a PR risks wasted effort. If a reviewer disagrees with the fundamental approach, you may need to rewrite most of the code. Draft PRs catch these issues early with minimal cost.",
    sourceUrl:
      "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests#draft-pull-requests",
    sourceLabel: "GitHub Docs: Draft pull requests",
  },
  {
    id: "pr-004",
    category: "pull-requests",
    difficulty: "medium",
    title: "Linking PRs to issues",
    prompt: "Which PR approach provides better traceability?",
    content: {
      type: "code",
      lang: "bash",

      left: `gh pr create \\
  --title "Fix login timeout" \\
  --body "Fixed the login timeout issue
that was reported last week."`,

      right: `gh pr create \\
  --title "Fix login timeout" \\
  --body "Closes #287

Increase the OAuth token exchange
timeout from 5s to 30s to handle
slow identity providers.

## Related
- Root cause analysis: #287 (comment)
- Monitoring dashboard: #290"`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using closing keywords like 'Closes #287' automatically closes the issue when the PR merges. Linking related issues creates a traceable chain from bug report to fix. This makes it easy to understand why a change was made months later.",
    explanationWrong:
      "Without issue links, there is no connection between the problem report and the fix. Team members searching for context must dig through commit history manually. GitHub's closing keywords automate issue management and create an audit trail.",
    sourceUrl:
      "https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue",
    sourceLabel: "GitHub Docs: Linking a pull request to an issue",
  },
  {
    id: "pr-005",
    category: "pull-requests",
    difficulty: "hard",
    title: "Pre-review checklist",
    prompt: "Which workflow respects your reviewers' time?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Push and immediately request review
git push origin feat/user-search
gh pr create \\
  --title "Add user search" \\
  --reviewer alice,bob
# Reviewer finds:
#   - console.log left in code
#   - TODO comments in production path
#   - Unused import statements
#   - Failing lint checks`,

      right: `# Self-review checklist before requesting
git diff main...HEAD --stat
git diff main...HEAD  # Read your own diff
pnpm lint && pnpm typecheck
# Remove debug statements and TODOs
# Verify tests pass locally
git push origin feat/user-search
gh pr create \\
  --title "Add user search" \\
  --reviewer alice,bob`,
    },

    correctSide: "right",
    explanationCorrect:
      "Reviewing your own diff before requesting review catches trivial issues that waste reviewer time. Running lint and type checks locally prevents CI failures. This shows respect for your teammates' attention and keeps reviews focused on design and logic.",
    explanationWrong:
      "Pushing code with debug statements, TODO comments, and lint failures signals carelessness. Reviewers waste cycles on mechanical issues instead of providing valuable architectural feedback. A quick self-review takes five minutes and dramatically improves PR quality.",
    sourceUrl: "https://google.github.io/eng-practices/review/developer/",
    sourceLabel: "Google Engineering: The CL Author's Guide",
  },
  {
    id: "pr-006",
    category: "pull-requests",
    difficulty: "hard",
    title: "Stacked pull requests",
    prompt: "Which approach handles dependent features better?",
    content: {
      type: "code",
      lang: "bash",

      left: `# One massive branch with everything
git checkout -b feat/notifications
# Add data model, API, UI, emails...
# 3 weeks of work, 89 files changed
# Merge conflicts with main grow daily
# Review takes a full week`,

      right: `# Stack PRs on top of each other
git checkout -b feat/notif-model
# PR 1: data model (base: main)
git checkout -b feat/notif-api
# PR 2: API routes (base: notif-model)
git checkout -b feat/notif-ui
# PR 3: UI components (base: notif-api)
# Each PR merges independently
# Conflicts stay small and manageable`,
    },

    correctSide: "right",
    explanationCorrect:
      "Stacked PRs break large features into reviewable layers. Each PR builds on the previous one and can be reviewed and merged independently. This keeps individual reviews small, reduces merge conflicts, and unblocks teammates who depend on lower layers.",
    explanationWrong:
      "A single massive branch accumulates merge conflicts and becomes nearly impossible to review thoroughly. Stacking PRs in layers lets you ship incremental progress, get faster feedback, and avoid the risk of a painful all-or-nothing merge at the end.",
    sourceUrl:
      "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests",
    sourceLabel: "GitHub Docs: Best practices for pull requests",
  },
  {
    id: "pr-007",
    category: "pull-requests",
    difficulty: "medium",
    title: "Pull request scope",
    prompt: "Which pull request diff is easier to review thoroughly?",
    content: {
      type: "visual",
      left: { componentId: "DiffGiantPR" },
      right: { componentId: "DiffFocusedPR" },
    },
    correctSide: "right",
    explanationCorrect:
      "A focused PR with a small, well-scoped diff is far easier to review. Reviewers can understand the full context, spot edge cases, and give meaningful feedback. Studies show that review quality drops sharply beyond 400 lines of changes.",
    explanationWrong:
      "A giant PR with thousands of lines across dozens of files overwhelms reviewers. The typical result is a quick skim and an approval without catching subtle bugs. Large PRs also take longer to merge, increasing the chance of merge conflicts with other work.",
    sourceUrl:
      "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests",
    sourceLabel: "GitHub Docs: Best practices for pull requests",
  },
  {
    id: "pr-008",
    category: "pull-requests",
    difficulty: "hard",
    title: "PR metadata and context",
    prompt: "Which pull request description helps reviewers more?",
    content: {
      type: "visual",
      left: { componentId: "DiffNoContext" },
      right: { componentId: "DiffWellDocumented" },
    },
    correctSide: "right",
    explanationCorrect:
      "A well-documented PR description provides the why behind the changes, links to related issues, and explains testing steps. This context lets reviewers focus on design and correctness rather than reverse-engineering intent from the diff alone.",
    explanationWrong:
      "A PR with no description or context forces reviewers to guess the purpose of the changes. They cannot tell if the code achieves its goal because they do not know what the goal is. Missing context leads to superficial reviews and missed bugs.",
    sourceUrl:
      "https://google.github.io/eng-practices/review/developer/cl-descriptions.html",
    sourceLabel: "Google Engineering: Writing Good CL Descriptions",
  },
];
