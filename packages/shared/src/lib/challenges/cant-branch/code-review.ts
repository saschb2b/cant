import type { BaseChallenge } from "../../game/types";

export const codeReviewChallenges: BaseChallenge[] = [
  {
    id: "rv-001",
    category: "code-review",
    difficulty: "easy",
    title: "CODEOWNERS file",
    prompt: "Which repository setup ensures the right people review changes?",
    content: {
      type: "code",

      left: `# No CODEOWNERS file
# Anyone can approve any PR
# Frontend changes reviewed by
#   backend engineers (and vice versa)
# No clear ownership of critical paths
# Auth changes merged without
#   security team awareness`,

      right: `# .github/CODEOWNERS
*.ts           @org/frontend-team
*.css          @org/frontend-team
/api/          @org/backend-team
/auth/         @org/security-team
/infra/        @org/platform-team
Dockerfile     @org/platform-team
*.sql          @org/backend-team @org/dba`,
    },

    correctSide: "right",
    explanationCorrect:
      "A CODEOWNERS file automatically assigns reviewers based on file paths. This ensures domain experts review the code they own. Critical paths like auth and infrastructure always get reviewed by the right team, reducing the risk of shipping security or reliability issues.",
    explanationWrong:
      "Without CODEOWNERS, review assignments rely on manual effort or random selection. This leads to rubber-stamp approvals from engineers unfamiliar with the code. Sensitive areas like authentication may be merged without the security team ever seeing the changes.",
    sourceUrl:
      "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners",
    sourceLabel: "GitHub Docs: About code owners",
  },
  {
    id: "rv-002",
    category: "code-review",
    difficulty: "easy",
    title: "Branch protection rules",
    prompt: "Which branch configuration better protects the main branch?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# No branch protection
# Anyone can push directly to main
# Force push is allowed
# No CI checks required
# PRs can be merged without approval
# Branch can be deleted`,

      right: `# Branch protection: main
require_pull_request:
  required_approving_reviews: 1
  dismiss_stale_reviews: true
  require_code_owner_reviews: true
require_status_checks:
  strict: true
  contexts: [ci/build, ci/test, ci/lint]
restrictions:
  enforce_admins: true
allow_force_pushes: false
allow_deletions: false`,
    },

    correctSide: "right",
    explanationCorrect:
      "Branch protection rules prevent direct pushes to main, require passing CI checks, and enforce code review. Dismissing stale reviews ensures that new changes get re-reviewed. These guardrails catch mistakes before they reach production.",
    explanationWrong:
      "An unprotected main branch is one force-push away from disaster. Without required reviews and status checks, broken code can reach production directly. Branch protection is one of the simplest and most impactful safeguards a team can enable.",
    sourceUrl:
      "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
    sourceLabel: "GitHub Docs: About protected branches",
  },
  {
    id: "rv-003",
    category: "code-review",
    difficulty: "medium",
    title: "Review approach",
    prompt: "Which code review approach catches more issues?",
    content: {
      type: "code",

      left: `# Batch review approach
# 1. Glance at the file list
# 2. Skim the diff quickly
# 3. Leave a single comment:
#    "LGTM, looks good to me!"
# 4. Approve after 2 minutes
#
# Time spent: 2 minutes
# Files reviewed: 14 of 14 (skimmed)`,

      right: `# Structured review approach
# 1. Read the PR description and issue
# 2. Check the test changes first
# 3. Review each file individually:
#    - Understand the purpose
#    - Check edge cases
#    - Verify error handling
# 4. Leave specific, actionable comments
#
# Time spent: 25 minutes
# Files reviewed: 14 of 14 (thorough)`,
    },

    correctSide: "right",
    explanationCorrect:
      "A structured review starts with understanding the intent, then examines tests and implementation file by file. Starting with tests tells you what the author expects the code to do. This approach catches logic errors, missing edge cases, and subtle bugs that a quick skim would miss.",
    explanationWrong:
      "A superficial 'LGTM' review provides no value. It creates a false sense of security while letting bugs slip through. Code review is one of the most effective quality gates a team has. Investing 20 to 30 minutes per review pays for itself many times over in prevented production incidents.",
    sourceUrl: "https://google.github.io/eng-practices/review/reviewer/",
    sourceLabel: "Google Engineering: How to do a code review",
  },
  {
    id: "rv-004",
    category: "code-review",
    difficulty: "medium",
    title: "Review comment style",
    prompt: "Which review comment style leads to better outcomes?",
    content: {
      type: "code",

      left: `// Review comment on a PR:

"This is wrong. Why would you do it
this way? This function is a mess and
needs to be completely rewritten.
Have you even tested this?"`,

      right: `// Review comment on a PR:

"This function handles both validation
and persistence. Splitting it into
two functions would make each easier
to test independently.

Suggestion:
  validateOrder(input) -> Result
  persistOrder(order)  -> Promise

What do you think?"`,
    },

    correctSide: "right",
    explanationCorrect:
      "Constructive review comments explain the concern, suggest a concrete alternative, and invite discussion. This approach teaches rather than criticizes, preserves the author's motivation, and leads to better solutions through collaboration.",
    explanationWrong:
      "Harsh, vague criticism shuts down collaboration and damages team trust. Comments like 'this is wrong' or 'this is a mess' do not help the author improve. Effective reviews focus on the code (not the person) and always pair criticism with a constructive suggestion.",
    sourceUrl:
      "https://google.github.io/eng-practices/review/reviewer/comments.html",
    sourceLabel: "Google Engineering: Writing review comments",
  },
  {
    id: "rv-005",
    category: "code-review",
    difficulty: "hard",
    title: "Blocking vs non-blocking comments",
    prompt: "Which review style communicates intent more clearly?",
    content: {
      type: "code",

      left: `// All comments left as plain text,
// no severity indicated:

"Maybe rename this variable"

"I think this could use a try-catch"

"Consider adding a test for null"

"The import order looks off"

// Author unsure which comments
// must be addressed before merge`,

      right: `// Comments use clear prefixes:

"blocker: This query is vulnerable
to SQL injection. Use parameterized
queries instead."

"suggestion: Renaming 'data' to
'userProfile' would improve clarity.
Non-blocking, up to you."

"nit: Import order. Auto-fixable
with the lint rule."

"question: Is this timeout value
from a config or should it be?"`,
    },

    correctSide: "right",
    explanationCorrect:
      "Labeling comments as blocker, suggestion, nit, or question removes ambiguity about what must be fixed before merge. Authors can prioritize effectively and reviewers avoid unnecessary back-and-forth. This convention speeds up the review cycle significantly.",
    explanationWrong:
      "Unlabeled comments force authors to guess which feedback is mandatory and which is optional. This leads to either over-correcting (addressing every nit before merging) or under-correcting (ignoring a critical security issue buried among style preferences). Clear labels solve this.",
    sourceUrl: "https://conventionalcomments.org/",
    sourceLabel: "Conventional Comments",
  },
  {
    id: "rv-006",
    category: "code-review",
    difficulty: "hard",
    title: "Required approvals count",
    prompt: "Which approval policy balances safety and velocity?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# Branch protection settings
required_approving_reviews: 4
# Every PR needs 4 approvals
# Average time to merge: 3-5 days
# Engineers spend 40% of time reviewing
# Small fixes blocked for days
# Team of 8 engineers`,

      right: `# Branch protection settings
required_approving_reviews: 1
# Plus CODEOWNERS for critical paths
bypass_actors: [deploy-bot]
# Average time to merge: 4-8 hours
# Critical paths get domain expert eyes
# Low-risk changes flow quickly
# Team of 8 engineers`,
    },

    correctSide: "right",
    explanationCorrect:
      "One required approval combined with CODEOWNERS for critical paths provides a good balance. Low-risk changes merge quickly while sensitive areas still get expert review. High approval counts create bottlenecks and lead to rubber-stamping as reviewers approve without reading.",
    explanationWrong:
      "Requiring too many approvals does not proportionally increase quality. Beyond two reviewers, additional approvals often become rubber stamps. The bottleneck frustrates engineers and slows delivery. A better approach is targeted ownership: one approval by default, domain experts for critical paths.",
    sourceUrl:
      "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-pull-request-reviews-before-merging",
    sourceLabel: "GitHub Docs: Require pull request reviews",
  },
  {
    id: "rv-007",
    category: "code-review",
    difficulty: "easy",
    title: "Review depth",
    prompt: "Which code review approach catches more bugs?",
    content: {
      type: "visual",
      left: { componentId: "DiffReviewRubberStamp" },
      right: { componentId: "DiffReviewThorough" },
    },
    correctSide: "right",
    explanationCorrect:
      "A thorough code review examines logic, edge cases, error handling, and test coverage. It catches bugs before they reach production and serves as a knowledge-sharing opportunity for the team. Investing time in review consistently prevents costly incidents.",
    explanationWrong:
      "A rubber-stamp approval provides no real quality gate. Approving without reading the code creates a false sense of security and lets bugs pass through unchecked. Code review is one of the most effective defenses against production issues, but only when done with care and attention.",
    sourceUrl: "https://google.github.io/eng-practices/review/reviewer/",
    sourceLabel: "Google Engineering: How to do a code review",
  },
];
