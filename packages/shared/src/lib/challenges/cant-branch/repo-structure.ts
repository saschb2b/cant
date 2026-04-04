import type { BaseChallenge } from "../../game/types";

export const repoStructureChallenges: BaseChallenge[] = [
  {
    id: "rs-001",
    category: "repo-structure",
    difficulty: "easy",
    title: "README essentials",
    prompt: "Which README provides more value to new contributors?",
    content: {
      type: "code",
      lang: "markdown",

      left: `# My Project

A web application.

## Install

\`npm install\`

## Run

\`npm start\``,

      right: `# My Project

A task management API built with
Node.js and PostgreSQL.

## Prerequisites

- Node.js >= 20
- PostgreSQL 16
- pnpm 9+

## Getting Started

\`\`\`bash
cp .env.example .env
pnpm install
pnpm db:migrate
pnpm dev
\`\`\`

## Architecture

See [docs/architecture.md](docs/)
for system design details.`,
    },

    correctSide: "right",
    explanationCorrect:
      "A good README answers three questions: what is this project, what do I need to run it, and how do I get started. Listing prerequisites, providing setup commands (including database migration and env setup), and linking to deeper documentation helps new contributors become productive quickly.",
    explanationWrong:
      "A minimal README with just `npm install` and `npm start` leaves out critical information. What Node version is required? Is there a database? What environment variables are needed? New contributors will waste time guessing or reading source code to answer questions the README should cover.",
    sourceUrl:
      "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
    sourceLabel: "GitHub Docs: About READMEs",
  },
  {
    id: "rs-002",
    category: "repo-structure",
    difficulty: "easy",
    title: "LICENSE file",
    prompt: "Which approach to licensing is correct for open source?",
    content: {
      type: "code",

      left: `# No LICENSE file in the repo
#
# The README says:
# "Feel free to use this code
#  however you want."
#
# (no formal license text)`,

      right: `# LICENSE file at repo root
# Contains full MIT License text:
#
# MIT License
# Copyright (c) 2026 Author
#
# Permission is hereby granted,
# free of charge, to any person
# obtaining a copy of this
# software...
#
# (full standard license text)`,
    },

    correctSide: "right",
    explanationCorrect:
      "Without a LICENSE file, the code is under exclusive copyright by default, regardless of what the README says. No one can legally use, modify, or distribute it. A proper LICENSE file with standard text (MIT, Apache, GPL) gives users clear, legally enforceable permissions.",
    explanationWrong:
      'Informal permission in a README has no legal standing. Under copyright law, code without a license is "all rights reserved" by default. Companies and careful developers will not use unlicensed code because of legal risk. Always include a formal LICENSE file with recognized license text.',
    sourceUrl: "https://choosealicense.com/no-permission/",
    sourceLabel: "Choose a License: No License",
  },
  {
    id: "rs-003",
    category: "repo-structure",
    difficulty: "medium",
    title: "Contributing guidelines",
    prompt: "Which CONTRIBUTING.md is more helpful for new contributors?",
    content: {
      type: "code",
      lang: "markdown",

      left: `# Contributing

1. Fork the repo
2. Make changes
3. Submit a PR

Thanks for contributing!`,

      right: `# Contributing

## Development Setup

\`\`\`bash
pnpm install
pnpm dev
pnpm test
\`\`\`

## Pull Request Process

1. Create a feature branch from \`main\`
2. Follow conventional commits:
   \`feat:\`, \`fix:\`, \`docs:\`
3. Add tests for new features
4. Run \`pnpm lint && pnpm test\`
5. Fill out the PR template

## Code Style

- We use Prettier and ESLint
- Run \`pnpm format\` before commits
- See .editorconfig for basics`,
    },

    correctSide: "right",
    explanationCorrect:
      "A detailed CONTRIBUTING.md reduces back-and-forth on pull requests. When contributors know the commit convention, testing expectations, and code style rules upfront, their first PR is more likely to pass review. This saves time for both contributors and maintainers.",
    explanationWrong:
      "A vague CONTRIBUTING.md leads to PRs that do not match the project's standards. Maintainers then spend time requesting changes that could have been avoided: wrong commit format, missing tests, linting errors. Clear guidelines set expectations before anyone writes code.",
    sourceUrl:
      "https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors",
    sourceLabel: "GitHub Docs: Contributing guidelines",
  },
  {
    id: "rs-004",
    category: "repo-structure",
    difficulty: "medium",
    title: "Directory layout consistency",
    prompt: "Which project structure is easier to navigate?",
    content: {
      type: "visual",
      left: { componentId: "FileTreeInconsistentNaming" },
      right: { componentId: "FileTreeConsistentNaming" },
    },

    correctSide: "right",
    explanationCorrect:
      "Consistent naming conventions (kebab-case for files and directories) make a project predictable. When everything follows the same pattern, developers find files faster and never have to guess whether it is `UserProfile`, `userProfile`, or `user-profile`. Grouping related files in directories (api/) also improves discoverability.",
    explanationWrong:
      "Mixing camelCase, PascalCase, snake_case, and inconsistent directory structures forces developers to memorize arbitrary naming for each file. This slows down navigation, causes import path errors, and creates confusion about where new files should go. Pick one convention and enforce it everywhere.",
    sourceUrl: "https://nextjs.org/docs/getting-started/project-structure",
    sourceLabel: "Next.js Docs: Project Structure",
  },
  {
    id: "rs-005",
    category: "repo-structure",
    difficulty: "hard",
    title: "EditorConfig for consistency",
    prompt: "Which approach ensures consistent formatting across editors?",
    content: {
      type: "code",

      left: `# .editorconfig (at repo root)
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab`,

      right: `# No .editorconfig
#
# Instead, add to README:
#
# "Please configure your editor:
#  - 2 space indentation
#  - LF line endings
#  - UTF-8 encoding
#  - Trim trailing whitespace"`,
    },

    correctSide: "left",
    explanationCorrect:
      "EditorConfig is supported by most editors natively or via plugins. It automatically applies formatting rules when a developer opens the project, with no manual configuration needed. The file-type overrides (tabs for Makefiles, preserve whitespace in Markdown) show its flexibility for mixed-language projects.",
    explanationWrong:
      "Asking developers to manually configure their editors means some will forget, some will misconfigure, and PRs will have unnecessary whitespace changes mixed in with real code changes. EditorConfig automates this. Combined with Prettier for more advanced formatting, it eliminates an entire class of review feedback.",
    sourceUrl: "https://editorconfig.org/",
    sourceLabel: "EditorConfig",
  },
  {
    id: "rs-006",
    category: "repo-structure",
    difficulty: "hard",
    title: "Monorepo vs polyrepo",
    prompt:
      "Which repository strategy works better for tightly coupled services?",
    content: {
      type: "visual",
      left: { componentId: "FileTreeMonorepo" },
      right: { componentId: "FileTreePolyrepo" },
    },

    correctSide: "left",
    explanationCorrect:
      "For tightly coupled services that share types, components, and utilities, a monorepo keeps everything in sync. Changes that span the frontend and backend happen in a single commit and a single PR. Shared packages are used directly without publishing to npm. Tools like Turborepo make builds fast with caching and task orchestration.",
    explanationWrong:
      "Polyrepos work well for truly independent services, but for tightly coupled code they create coordination overhead. Updating a shared type requires publishing a package, then updating each consumer repo separately. Cross-cutting changes need multiple PRs that must be merged in the right order. Shared code versioning becomes a constant source of drift.",
    sourceUrl: "https://turbo.build/repo/docs/crafting-your-repository",
    sourceLabel: "Turborepo Docs: Crafting your repository",
  },
  {
    id: "rs-007",
    category: "repo-structure",
    difficulty: "medium",
    title: "Project directory organization",
    prompt: "Which project structure is easier to navigate and maintain?",
    content: {
      type: "visual",
      left: { componentId: "FileTreeBadStructure" },
      right: { componentId: "FileTreeGoodStructure" },
    },
    correctSide: "right",
    explanationCorrect:
      "A well-organized project groups related files into clearly named directories with consistent naming conventions. Developers can find files by intuition rather than searching. Good structure also scales well as the project grows, because new files have an obvious place to go.",
    explanationWrong:
      "A poorly organized project scatters files without clear grouping or naming patterns. Developers waste time hunting for files, and the lack of conventions means new files get dropped in random locations. This disorder compounds over time and makes onboarding new contributors harder.",
    sourceUrl: "https://nextjs.org/docs/getting-started/project-structure",
    sourceLabel: "Next.js Docs: Project Structure",
  },
];
