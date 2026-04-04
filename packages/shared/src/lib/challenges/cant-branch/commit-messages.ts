import type { BaseChallenge } from "../../game/types";

export const commitMessagesChallenges: BaseChallenge[] = [
  {
    id: "cm-001",
    category: "commit-messages",
    difficulty: "easy",
    title: "Commit subject tone",
    prompt: "Which commit message follows the imperative mood convention?",
    content: {
      type: "code",
      lang: "bash",

      left: `git commit -m "Added user authentication
to the login page"`,

      right: `git commit -m "Add user authentication
to the login page"`,
    },

    correctSide: "right",
    explanationCorrect:
      'Git itself uses imperative mood in generated messages like "Merge branch" and "Revert commit". Writing "Add" instead of "Added" keeps your history consistent with these conventions.\n\nThink of the subject line as completing the sentence: "If applied, this commit will **add user authentication**".',
    explanationWrong:
      'Past tense ("Added", "Fixed", "Changed") describes what you did. Imperative mood ("Add", "Fix", "Change") describes what the commit does when applied. The imperative form is shorter, more consistent with git\'s own messages, and reads naturally in changelogs and release notes.',
    sourceUrl: "https://cbea.ms/git-commit/#imperative",
    sourceLabel: "How to Write a Git Commit Message: Use the Imperative Mood",
  },
  {
    id: "cm-002",
    category: "commit-messages",
    difficulty: "easy",
    title: "Conventional commit prefixes",
    prompt: "Which commit message uses conventional commit format correctly?",
    content: {
      type: "code",
      lang: "bash",

      left: `git commit -m "fix: resolve null pointer
when user session expires"`,

      right: `git commit -m "bugfix/resolve null pointer
when user session expires"`,
    },

    correctSide: "left",
    explanationCorrect:
      "Conventional Commits uses structured prefixes like `feat:`, `fix:`, `chore:`, `docs:`, and `refactor:` followed by a colon and space. This format enables automated changelog generation, semantic versioning, and consistent filtering.\n\nTools like `semantic-release` and `commitlint` parse these prefixes to determine version bumps automatically.",
    explanationWrong:
      "Free-form prefixes like `bugfix/` are not part of any standard convention. They cannot be parsed by tooling, vary between developers, and do not map to semantic versioning. Conventional Commits provides a well-defined specification that the entire ecosystem supports.",
    sourceUrl: "https://www.conventionalcommits.org/en/v1.0.0/",
    sourceLabel: "Conventional Commits Specification",
  },
  {
    id: "cm-003",
    category: "commit-messages",
    difficulty: "medium",
    title: "Subject and body separation",
    prompt: "Which commit message structure is easier to read in git log?",
    content: {
      type: "code",
      lang: "bash",

      left: `git commit -m "fix: prevent race condition in payment processing

The checkout flow could charge a user twice if they
double-clicked the submit button. Added a debounce
guard and a server-side idempotency check.

Closes #1842"`,

      right: `git commit -m "fix: prevent race condition in payment processing. The checkout flow could charge a user twice if they double-clicked the submit button. Added a debounce guard and a server-side idempotency check. Closes #1842"`,
    },

    correctSide: "left",
    explanationCorrect:
      "A blank line between subject and body is required by git's own formatting tools. Commands like `git log --oneline`, `git shortlog`, and `git format-patch` all rely on this separation to display the subject line alone.\n\nThe body provides context for reviewers. The subject provides a scannable summary for everyone else.",
    explanationWrong:
      "Cramming everything into a single line produces an unreadable wall of text in `git log --oneline`. Git treats the first line as the subject and everything after the blank line as the body. Without that separation, tools cannot distinguish between the summary and the details.",
    sourceUrl: "https://cbea.ms/git-commit/#separate",
    sourceLabel:
      "How to Write a Git Commit Message: Separate Subject from Body",
  },
  {
    id: "cm-004",
    category: "commit-messages",
    difficulty: "medium",
    title: "The 50/72 character rule",
    prompt: "Which commit message respects line length conventions?",
    content: {
      type: "code",
      lang: "bash",

      left: `git commit -m "refactor: extract validation logic into reusable helper functions for the user registration and profile update forms across the entire application"`,

      right: `git commit -m "refactor: extract validation helpers

Move shared validation logic from registration
and profile forms into reusable helpers under
src/lib/validation/."`,
    },

    correctSide: "right",
    explanationCorrect:
      "The widely adopted convention is to keep subject lines under 50 characters and wrap body text at 72 characters. This ensures readability in `git log`, terminal output, email patches, and GitHub's commit list.\n\nGitHub truncates subjects longer than 72 characters with an ellipsis, hiding important context.",
    explanationWrong:
      "A 150-character subject line wraps awkwardly in every tool that displays commits. Terminal windows, GitHub's commit list, and email notifications all assume short subjects. Move the details into the body where they have room to breathe and can be formatted with line breaks.",
    sourceUrl: "https://cbea.ms/git-commit/#limit-50",
    sourceLabel: "How to Write a Git Commit Message: Limit the Subject Line",
  },
  {
    id: "cm-005",
    category: "commit-messages",
    difficulty: "easy",
    title: "Commit message specificity",
    prompt:
      "Which commit message helps you understand the change without reading the diff?",
    content: {
      type: "code",
      lang: "bash",

      left: `git commit -m "fix stuff"`,

      right: `git commit -m "fix: correct off-by-one error
in pagination offset calculation"`,
    },

    correctSide: "right",
    explanationCorrect:
      'A good commit message answers **why** the change was made. "fix stuff" tells you nothing. Six months from now, when you run `git blame` on a confusing line, a descriptive message saves you from re-reading the entire diff to understand the intent.\n\nSpecific messages also make `git log --grep` useful for finding related changes.',
    explanationWrong:
      'Messages like "fix stuff", "wip", "updates", and "misc changes" provide zero information to future readers. They make `git bisect` painful, code review harder, and changelogs useless. Every commit message is documentation for your future self and your teammates.',
    sourceUrl: "https://cbea.ms/git-commit/#why-not-how",
    sourceLabel: "How to Write a Git Commit Message",
  },
  {
    id: "cm-006",
    category: "commit-messages",
    difficulty: "hard",
    title: "Meaningful scope in conventional commits",
    prompt: "Which commit message uses scope to add useful context?",
    content: {
      type: "code",
      lang: "bash",

      left: `git commit -m "fix(code): fix the bug

Fixed a bug in the code that was causing
issues for users."`,

      right: `git commit -m "fix(auth): reject expired refresh tokens

The token validation middleware was only checking
access token expiry. Refresh tokens with a past
exp claim now return 401 instead of silently
issuing a new access token.

Closes #2104"`,
    },

    correctSide: "right",
    explanationCorrect:
      "The scope in `fix(auth)` tells you which module is affected without opening the diff. The body explains the root cause, the fix, and references the issue. This level of detail makes `git log --grep` and `git bisect` genuinely useful.\n\nA scope like `(code)` is meaningless because all commits change code.",
    explanationWrong:
      'The scope `(code)` adds no information since every commit touches code. The subject "fix the bug" repeats the prefix, and the body says "fixed a bug" a third time without explaining what the bug was. Good commit messages describe the problem, the cause, and the solution.',
    sourceUrl: "https://www.conventionalcommits.org/en/v1.0.0/#summary",
    sourceLabel: "Conventional Commits: Summary",
  },
  {
    id: "cm-007",
    category: "commit-messages",
    difficulty: "easy",
    title: "Commit message formatting",
    prompt: "Which commit message follows best practices?",
    content: {
      type: "visual",
      left: { componentId: "CommitCardBadMessage" },
      right: { componentId: "CommitCardGoodMessage" },
    },
    correctSide: "right",
    explanationCorrect:
      "A well-written commit message uses a conventional prefix, stays concise, and explains the intent of the change. This makes the git history scannable and useful for debugging, reviewing, and generating changelogs automatically.",
    explanationWrong:
      "Vague or poorly formatted commit messages provide no context about what changed or why. They make git log, git blame, and git bisect far less useful. Taking a few extra seconds to write a clear message pays off every time someone reads the history.",
    sourceUrl: "https://cbea.ms/git-commit/",
    sourceLabel: "How to Write a Git Commit Message",
  },
];
