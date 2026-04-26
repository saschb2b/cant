import type { BaseChallenge } from "../../game/types";

export const gitignoreChallenges: BaseChallenge[] = [
  {
    id: "gi-001",
    category: "gitignore",
    difficulty: "easy",
    title: "Ignoring node_modules",
    prompt: "Which .gitignore entry correctly excludes dependencies?",
    content: {
      type: "code",

      left: `# Dependencies
node_modules/`,

      right: `# Dependencies
npm-packages/
bower_components/`,
    },

    correctSide: "left",
    explanationCorrect:
      "The `node_modules/` directory is where npm and pnpm install packages. Ignoring it is one of the most important .gitignore rules for any JavaScript project. Dependencies should be installed from package-lock.json or pnpm-lock.yaml, never committed to the repo.",
    explanationWrong:
      "`npm-packages/` is not a real directory that package managers use. The actual directory is `node_modules/`. Committing dependencies bloats the repo, causes merge conflicts, and makes cloning painfully slow.",
    sourceUrl:
      "https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files",
    sourceLabel: "GitHub Docs: Ignoring files",
  },
  {
    id: "gi-002",
    category: "gitignore",
    difficulty: "easy",
    title: "Environment variables",
    prompt: "Which approach keeps secrets out of version control?",
    content: {
      type: "code",

      left: `# Environment files
.env
.env.local
.env.*.local

# Keep the template
!.env.example`,

      right: `# Environment files
.env.production
.env.staging

# Dev env is fine to commit
# .env.local`,
    },

    correctSide: "left",
    explanationCorrect:
      "All .env files should be ignored by default, since any of them could contain secrets. The negation pattern `!.env.example` keeps a template file in the repo so new contributors know which variables to set. This is the standard approach recommended by dotenv and most frameworks.",
    explanationWrong:
      "Only ignoring production and staging env files is dangerous. Local .env files often contain database passwords, API keys, and other secrets. If `.env.local` is not ignored, a developer could accidentally commit credentials. Always ignore all .env files and provide a .env.example template instead.",
    sourceUrl: "https://github.com/motdotla/dotenv#should-i-commit-my-env-file",
    sourceLabel: "dotenv: Should I commit my .env file?",
  },
  {
    id: "gi-003",
    category: "gitignore",
    difficulty: "medium",
    title: "OS-generated files",
    prompt: "Which strategy handles OS-specific files better?",
    content: {
      type: "code",

      left: `# macOS
.DS_Store
.AppleDouble
.LSOverride

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini

# Linux
*~
.directory`,

      right: `# OS files (developers should use
# global gitignore instead)
#
# Don't add OS-specific entries
# to shared repo .gitignore
#
# See: git config --global
#   core.excludesFile`,
    },

    correctSide: "right",
    explanationCorrect:
      "OS-specific files like .DS_Store and Thumbs.db are a developer environment concern, not a project concern. Each developer should configure a global gitignore (`~/.gitignore_global`) via `git config --global core.excludesFile`. This keeps the repo .gitignore focused on project-specific patterns.",
    explanationWrong:
      "While adding OS files to the repo .gitignore does work, it mixes project concerns with personal environment concerns. Every new OS or tool would require updating every repo. A global gitignore handles this once for all repositories on your machine.",
    sourceUrl:
      "https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files#configuring-ignored-files-for-all-repositories-on-your-computer",
    sourceLabel: "GitHub Docs: Global gitignore",
  },
  {
    id: "gi-004",
    category: "gitignore",
    difficulty: "medium",
    title: "Build output",
    prompt: "Which approach to ignoring build output is more maintainable?",
    content: {
      type: "code",

      left: `# Build output
dist/
build/
.next/
out/
.turbo/
coverage/`,

      right: `# Ignore everything
*

# Except source files
!*.ts
!*.tsx
!*.json
!*.md`,
    },

    correctSide: "left",
    explanationCorrect:
      "Explicitly listing build output directories is clear and predictable. Anyone reading the .gitignore immediately understands what is excluded and why. This approach works well with most build tools and CI systems.",
    explanationWrong:
      "Inverting the pattern with a blanket `*` ignore and selective un-ignoring is fragile and confusing. It breaks when new file types are added, it hides directories that should be tracked, and it makes debugging .gitignore issues much harder. Stick to explicit directory exclusions.",
    sourceUrl: "https://git-scm.com/docs/gitignore",
    sourceLabel: "Git Docs: gitignore",
  },
  {
    id: "gi-005",
    category: "gitignore",
    difficulty: "hard",
    title: "Negation patterns",
    prompt: "Which negation pattern correctly tracks a specific config file?",
    content: {
      type: "code",

      left: `# Ignore all IDE config
.vscode/

# But track shared settings
!.vscode/settings.json
!.vscode/extensions.json`,

      right: `# Ignore IDE config except shared
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json`,
    },

    correctSide: "right",
    explanationCorrect:
      "When a parent directory is ignored with a trailing slash (`.vscode/`), Git will not look inside it at all, so negation patterns for files inside it will not work. Using `.vscode/*` (with a wildcard) ignores the contents but keeps Git aware of the directory, allowing negation patterns like `!.vscode/settings.json` to take effect.",
    explanationWrong:
      "Ignoring `.vscode/` (with trailing slash) tells Git to skip the entire directory. Once a directory is fully ignored, no negation pattern can un-ignore files within it. You must use `.vscode/*` to ignore the contents rather than the directory itself. This is a common and subtle .gitignore mistake.",
    sourceUrl: "https://git-scm.com/docs/gitignore#_pattern_format",
    sourceLabel: "Git Docs: gitignore pattern format",
  },
  {
    id: "gi-006",
    category: "gitignore",
    difficulty: "hard",
    title: "IDE configuration sharing",
    prompt: "Which approach to IDE config is better for team projects?",
    content: {
      type: "code",

      left: `# .vscode/settings.json (committed)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter":
    "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk":
    "node_modules/typescript/lib"
}`,

      right: `# .vscode/settings.json (committed)
{
  "editor.fontSize": 16,
  "editor.fontFamily": "Fira Code",
  "workbench.colorTheme": "One Dark Pro",
  "editor.minimap.enabled": false,
  "editor.wordWrap": "on",
  "window.zoomLevel": 1
}`,
    },

    correctSide: "left",
    explanationCorrect:
      "Shared IDE settings should only contain project-relevant configuration: formatters, linters, TypeScript SDK paths, and code actions. These ensure consistent behavior across the team. Personal preferences like font size, color theme, and zoom level belong in user-level settings.",
    explanationWrong:
      "Committing personal editor preferences forces your font choices, theme, and zoom level on every team member. Shared settings should focus on tooling consistency (formatter, linter, TypeScript version) that affects code quality, not visual preferences that vary per developer.",
    sourceUrl:
      "https://code.visualstudio.com/docs/getstarted/settings#_workspace-settings",
    sourceLabel: "VS Code Docs: Workspace settings",
  },
  {
    id: "gi-007",
    category: "gitignore",
    difficulty: "medium",
    title: "Repository file tree contents",
    prompt: "Which repository file tree is better maintained?",
    content: {
      type: "visual",
      left: { componentId: "FileTreeDirty" },
      right: { componentId: "FileTreeClean" },
    },
    correctSide: "right",
    explanationCorrect:
      "A clean file tree with a proper .gitignore only tracks source code, configuration, and documentation. Build artifacts, dependency directories, and OS-generated files are excluded. This keeps the repository small, cloning fast, and diffs free of noise.",
    explanationWrong:
      "A dirty file tree that tracks generated files, build output, or dependency folders causes unnecessary bloat. It slows down cloning, creates noisy diffs full of auto-generated changes, and can even expose secrets if .env files are committed. A well-crafted .gitignore prevents all of this.",
    sourceUrl: "https://git-scm.com/docs/gitignore",
    sourceLabel: "Git Docs: gitignore",
  },
];
