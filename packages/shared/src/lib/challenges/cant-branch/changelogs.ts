import type { BaseChallenge } from "../../game/types";

export const changelogsChallenges: BaseChallenge[] = [
  {
    id: "cl-001",
    category: "changelogs",
    difficulty: "easy",
    title: "Changelog structure",
    prompt: "Which changelog format is easier to scan?",
    content: {
      type: "code",
      lang: "markdown",

      left: `# Changelog

- Fixed login bug
- Added dark mode
- Updated dependencies
- Removed old API endpoint
- Fixed crash on mobile
- Added export feature`,

      right: `# Changelog

## [1.2.0] - 2025-03-15

### Added
- Dark mode support for all pages
- CSV export for reports

### Fixed
- Login failed when password contained special characters
- App crashed on mobile Safari during onboarding

### Removed
- Deprecated v1 API endpoint`,
    },

    correctSide: "right",
    explanationCorrect:
      "The [Keep a Changelog](https://keepachangelog.com) format groups entries by version and change type: Added, Changed, Deprecated, Removed, Fixed, and Security. This structure lets users quickly find what matters to them.\n\nA flat bullet list mixes features, fixes, and removals with no version boundaries, making it impossible to know what shipped when.",
    explanationWrong:
      "An unstructured list of changes gives no indication of which version introduced each change. Users upgrading from 1.0 to 1.2 cannot tell which changes affect them. The Keep a Changelog format solves this by organizing entries under version headings with categorized sections.",
    sourceUrl: "https://keepachangelog.com/en/1.1.0/",
    sourceLabel: "Keep a Changelog",
  },
  {
    id: "cl-002",
    category: "changelogs",
    difficulty: "easy",
    title: "Unreleased section",
    prompt: "Which approach tracks upcoming changes better?",
    content: {
      type: "code",
      lang: "markdown",

      left: `# Changelog

## [1.3.0] - TBD

### Added
- User avatar upload
- Email notifications

### Fixed
- Pagination off-by-one error`,

      right: `# Changelog

## [Unreleased]

### Added
- User avatar upload
- Email notifications

### Fixed
- Pagination off-by-one error

## [1.2.0] - 2025-03-15
...`,
    },

    correctSide: "right",
    explanationCorrect:
      "An `[Unreleased]` section at the top of the changelog collects changes that have been merged but not yet released. When release day comes, you rename it to the new version number and add the date.\n\nUsing a version number with `TBD` as the date implies the version is decided before the scope is finalized, which can lead to incorrect semver bumps.",
    explanationWrong:
      "Assigning a version number before the release is finalized can cause problems. If a breaking change is merged later, you would need to change `1.3.0` to `2.0.0`. The `[Unreleased]` convention avoids premature versioning and makes it clear these changes are not yet shipped.",
    sourceUrl: "https://keepachangelog.com/en/1.1.0/#effort",
    sourceLabel: "Keep a Changelog: Effort",
  },
  {
    id: "cl-003",
    category: "changelogs",
    difficulty: "medium",
    title: "Changelog generation method",
    prompt: "Which commit style enables automated changelogs?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Inconsistent commit messages
git log --oneline
# a1b2c3d fixed the login thing
# d4e5f6g updated stuff
# h7i8j9k WIP
# l0m1n2o misc changes
# p3q4r5s fix`,

      right: `# Conventional Commits
git log --oneline
# a1b2c3d feat: add SSO login support
# d4e5f6g fix: prevent double form submission
# h7i8j9k docs: update API migration guide
# l0m1n2o feat!: redesign user settings page
# p3q4r5s chore: upgrade eslint to v9`,
    },

    correctSide: "right",
    explanationCorrect:
      "Conventional Commits follow a structured format (`type: description`) that tools like `conventional-changelog` and `semantic-release` can parse automatically. The type prefix determines which changelog section the entry belongs to: `feat` goes under Added, `fix` goes under Fixed.\n\nThe `!` after the type signals a breaking change, which triggers a major version bump.",
    explanationWrong:
      'Freeform commit messages like "fixed the login thing" and "updated stuff" cannot be parsed by changelog generators. There is no way to automatically determine whether a commit is a feature, fix, or breaking change. Conventional Commits provide the structure that automation requires.',
    sourceUrl: "https://www.conventionalcommits.org/en/v1.0.0/",
    sourceLabel: "Conventional Commits",
  },
  {
    id: "cl-004",
    category: "changelogs",
    difficulty: "medium",
    title: "Linking PRs and issues",
    prompt: "Which changelog entries are more traceable?",
    content: {
      type: "code",
      lang: "markdown",

      left: `## [2.1.0] - 2025-06-01

### Added
- Dark mode support
- Keyboard shortcuts for navigation

### Fixed
- File upload failed for large files
- Search results were not sorted`,

      right: `## [2.1.0] - 2025-06-01

### Added
- Dark mode support ([#142](https://github.com/org/repo/pull/142))
- Keyboard shortcuts for navigation ([#156](https://github.com/org/repo/pull/156))

### Fixed
- File upload failed for files over 10MB ([#148](https://github.com/org/repo/issues/148))
- Search results ignored sort parameter ([#151](https://github.com/org/repo/pull/151))`,
    },

    correctSide: "right",
    explanationCorrect:
      "Linking to pull requests and issues gives readers a direct path to the discussion, code changes, and context behind each entry. When a user encounters a regression, they can trace it back to the exact PR that introduced the change.\n\nPlain text entries require searching through the repository to find related context.",
    explanationWrong:
      "Changelog entries without links are a dead end. If someone needs more detail about a change, they must search through commit history, PR titles, and issue trackers manually. Links make the changelog a navigable document instead of a flat summary.",
    sourceUrl: "https://keepachangelog.com/en/1.1.0/",
    sourceLabel: "Keep a Changelog",
  },
  {
    id: "cl-005",
    category: "changelogs",
    difficulty: "hard",
    title: "Date format in changelogs",
    prompt: "Which date format is unambiguous internationally?",
    content: {
      type: "code",
      lang: "markdown",

      left: `## [1.5.0] - 03/06/2025

### Added
- Multi-language support

## [1.4.0] - 02/15/2025

### Fixed
- Memory leak in websocket handler`,

      right: `## [1.5.0] - 2025-03-06

### Added
- Multi-language support

## [1.4.0] - 2025-02-15

### Fixed
- Memory leak in websocket handler`,
    },

    correctSide: "right",
    explanationCorrect:
      "ISO 8601 format (YYYY-MM-DD) is unambiguous worldwide. The date `03/06/2025` could mean March 6th (US) or June 3rd (most other countries). `2025-03-06` can only mean March 6th, 2025.\n\nISO 8601 also sorts chronologically as plain text, which is useful for tooling and scripting.",
    explanationWrong:
      "The MM/DD/YYYY format is ambiguous outside the United States. `03/06/2025` is interpreted as June 3rd in Europe and much of the world. For an open source project with international contributors and users, ISO 8601 (YYYY-MM-DD) eliminates this confusion entirely.",
    sourceUrl: "https://keepachangelog.com/en/1.1.0/",
    sourceLabel: "Keep a Changelog",
  },
  {
    id: "cl-006",
    category: "changelogs",
    difficulty: "hard",
    title: "Changelog vs git log",
    prompt: "Which serves end users better?",
    content: {
      type: "code",
      lang: "markdown",

      left: `## [3.0.0] - 2025-04-01

- b4a2e1f refactor: extract auth module
- c7d3f2a chore: update ci pipeline
- e1f4a3b fix: handle null user in middleware
- a8b5c4d feat: add OAuth2 support
- d2e6f5a chore: bump dependencies
- f3a7b6c test: add integration tests for auth
- g4b8c7d style: fix linting warnings`,

      right: `## [3.0.0] - 2025-04-01

### Added
- OAuth2 login with Google and GitHub providers

### Fixed
- App crashed when accessing profile without being logged in

### Changed
- Authentication system rebuilt from scratch.
  See the [migration guide](./docs/auth-migration.md)
  for upgrade instructions.`,
    },

    correctSide: "right",
    explanationCorrect:
      "A changelog is written for **users**, not developers. Users do not care about CI pipeline changes, linting fixes, or dependency bumps. They need to know what changed in behavior, what broke, and how to upgrade.\n\nDumping the git log into a changelog drowns the important changes in noise. Curate the entries to highlight user-facing impact.",
    explanationWrong:
      "Pasting raw git log output into a changelog forces users to read through chores, refactors, and test additions to find the changes that affect them. A curated changelog filters out internal changes and translates commit messages into user-friendly descriptions with context and migration guidance.",
    sourceUrl: "https://keepachangelog.com/en/1.1.0/#bad-practices",
    sourceLabel: "Keep a Changelog: Bad Practices",
  },
  {
    id: "cl-007",
    category: "changelogs",
    difficulty: "easy",
    title: "Changelog presentation",
    prompt: "Which changelog format is more useful for consumers?",
    content: {
      type: "visual",
      left: { componentId: "ChangelogUnstructured" },
      right: { componentId: "ChangelogStructured" },
    },
    correctSide: "right",
    explanationCorrect:
      "A structured changelog groups entries by version and change type (Added, Fixed, Changed, Removed). This lets users quickly find breaking changes, new features, and bug fixes relevant to their upgrade. The Keep a Changelog format is the most widely adopted standard for this.",
    explanationWrong:
      "An unstructured changelog that dumps all changes into a flat list with no versioning or categorization forces readers to scan every entry. They cannot tell which version introduced a change, whether it is a feature or a fix, or if there are breaking changes they need to handle.",
    sourceUrl: "https://keepachangelog.com/en/1.1.0/",
    sourceLabel: "Keep a Changelog",
  },
];
