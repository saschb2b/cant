import type { BaseChallenge } from "../../game/types";

export const branchingNamingChallenges: BaseChallenge[] = [
  {
    id: "bn-001",
    category: "branching-naming",
    difficulty: "easy",
    title: "Branch name prefixes",
    prompt: "Which branch name communicates the type of work at a glance?",
    content: {
      type: "code",
      lang: "bash",

      left: `git checkout -b search-filters`,

      right: `git checkout -b feature/search-filters`,
    },

    correctSide: "right",
    explanationCorrect:
      "Prefixes like `feature/`, `fix/`, `chore/`, and `docs/` categorize branches instantly. Many teams configure CI pipelines and branch protection rules based on these prefixes. A reviewer seeing `feature/search-filters` knows the branch introduces new functionality before reading a single line of code.\n\nThis convention also keeps branches organized when listing them with `git branch`.",
    explanationWrong:
      "A bare name like `search-filters` gives no indication of whether this is a new feature, a bug fix, a refactor, or a documentation update. As the number of branches grows, flat names become hard to filter and sort. Prefixes act as lightweight categories that both humans and automation can use.",
    sourceUrl:
      "https://www.git-scm.com/book/en/v2/Git-Branching-Branch-Management",
    sourceLabel: "Git Book: Branch Management",
  },
  {
    id: "bn-002",
    category: "branching-naming",
    difficulty: "easy",
    title: "Branch name casing",
    prompt: "Which branch name avoids problems across platforms and tools?",
    content: {
      type: "code",
      lang: "bash",

      left: `git checkout -b feature/Add_User_Auth`,

      right: `git checkout -b feature/add-user-auth`,
    },

    correctSide: "right",
    explanationCorrect:
      "Kebab-case (lowercase words separated by hyphens) is the most portable naming convention for git branches. Some filesystems are case-insensitive, meaning `Add_User_Auth` and `add_user_auth` could collide. Underscores work but are harder to type and less common in URL slugs.\n\nKebab-case is also the standard in most git hosting platforms and CI tools.",
    explanationWrong:
      "Mixed-case names cause subtle bugs on case-insensitive filesystems like macOS (HFS+) and Windows (NTFS). A branch created as `Feature/Add_User_Auth` on Linux may conflict with `feature/add_user_auth` on a teammate's Mac. Sticking to lowercase kebab-case avoids these cross-platform issues entirely.",
    sourceUrl: "https://www.git-scm.com/docs/git-check-ref-format",
    sourceLabel: "Git Docs: git check-ref-format",
  },
  {
    id: "bn-003",
    category: "branching-naming",
    difficulty: "medium",
    title: "Ticket number references",
    prompt: "Which branch name links the work to its tracking issue?",
    content: {
      type: "code",
      lang: "bash",

      left: `git checkout -b fix/login-bug`,

      right: `git checkout -b fix/PROJ-1234-login-timeout`,
    },

    correctSide: "right",
    explanationCorrect:
      "Including the ticket number (like `PROJ-1234`) creates a direct link between the branch and the issue tracker. Many tools, including Jira, Linear, and GitHub, automatically detect these references and cross-link commits, branches, and issues.\n\nWhen you see `fix/PROJ-1234-login-timeout` in `git branch`, you can look up the full context immediately.",
    explanationWrong:
      "A branch named `fix/login-bug` forces you to search the issue tracker manually to find the related ticket. With dozens of active branches, this becomes a significant time sink. Embedding the ticket number makes traceability automatic and helps both developers and project managers track what is in progress.",
    sourceUrl:
      "https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue",
    sourceLabel: "GitHub Docs: Linking a Pull Request to an Issue",
  },
  {
    id: "bn-004",
    category: "branching-naming",
    difficulty: "easy",
    title: "Special characters in branch names",
    prompt: "Which branch name will work reliably in all git tools?",
    content: {
      type: "code",
      lang: "bash",

      left: `git checkout -b "feature/user auth (v2)"`,

      right: `git checkout -b feature/user-auth-v2`,
    },

    correctSide: "right",
    explanationCorrect:
      "Git branch names cannot contain spaces, tildes, carets, colons, or most special characters. While some shells let you quote branch names with spaces, this breaks tab completion, CI scripts, webhook payloads, and URL encoding in git hosting platforms.\n\nStick to alphanumeric characters, hyphens, underscores, and forward slashes.",
    explanationWrong:
      "Spaces and parentheses in branch names cause failures in shell scripts, CI pipelines, and webhook integrations. The `git check-ref-format` command defines the allowed characters. Even if git accepts a quoted name locally, downstream tools will break when they encounter the unescaped special characters.",
    sourceUrl: "https://www.git-scm.com/docs/git-check-ref-format",
    sourceLabel: "Git Docs: git check-ref-format",
  },
  {
    id: "bn-005",
    category: "branching-naming",
    difficulty: "medium",
    title: "Branch name length",
    prompt: "Which branch name balances brevity with clarity?",
    content: {
      type: "code",
      lang: "bash",

      left: `git checkout -b feature/implement-the-new-user-\
registration-flow-with-email-verification-\
and-password-strength-validation`,

      right: `git checkout -b feature/user-registration-flow`,
    },

    correctSide: "right",
    explanationCorrect:
      "Branch names appear in merge commits, CI logs, deployment dashboards, and terminal prompts. A concise name like `feature/user-registration-flow` is easy to read, type, and reference in conversation. The details about email verification and password validation belong in the commit messages and PR description.\n\nAim for 3 to 5 descriptive words after the prefix.",
    explanationWrong:
      "An excessively long branch name wraps in terminal output, gets truncated in CI dashboards, and is painful to type. Branch names are identifiers, not descriptions. They need to be unique and recognizable, not exhaustive. Save the full scope for the pull request title and body.",
    sourceUrl:
      "https://www.git-scm.com/book/en/v2/Git-Branching-Branch-Management",
    sourceLabel: "Git Book: Branch Management",
  },
  {
    id: "bn-006",
    category: "branching-naming",
    difficulty: "hard",
    title: "Personal vs convention-based branch names",
    prompt: "Which branch naming pattern works better for team collaboration?",
    content: {
      type: "code",
      lang: "bash",

      left: `git branch -a

  john/stuff
  john/more-stuff
  sarah/my-changes
  sarah/temp
  mike/wip`,

      right: `git branch -a

  feature/PROJ-101-oauth-login
  fix/PROJ-203-cart-total
  chore/upgrade-react-19
  feature/PROJ-118-search-api
  fix/PROJ-210-date-formatting`,
    },

    correctSide: "right",
    explanationCorrect:
      "Personal prefixes like `john/stuff` convey zero information about the work. When John leaves the team, nobody knows what `john/more-stuff` contains or whether it can be deleted. Convention-based names with ticket references are self-documenting and outlive their authors.\n\nTeam-wide naming conventions also enable branch cleanup automation based on merged status and prefix patterns.",
    explanationWrong:
      "Names like `john/stuff` and `sarah/temp` create a graveyard of mystery branches. They cannot be filtered by work type, linked to issues, or cleaned up by automation. Consistent, descriptive naming makes `git branch -a` a useful dashboard rather than a junk drawer of abandoned personal branches.",
    sourceUrl:
      "https://www.git-scm.com/book/en/v2/Git-Branching-Branch-Management",
    sourceLabel: "Git Book: Branch Management",
  },
  {
    id: "bn-007",
    category: "branching-naming",
    difficulty: "easy",
    title: "Branch naming conventions visualized",
    prompt: "Which branch naming convention is more informative?",
    content: {
      type: "visual",
      left: { componentId: "GitGraphBadBranchNames" },
      right: { componentId: "GitGraphGoodBranchNames" },
    },
    correctSide: "right",
    explanationCorrect:
      "Descriptive branch names with type prefixes and ticket references communicate the purpose of each branch at a glance. They enable automation like CI rules based on branch patterns, and they make the output of git branch a useful overview of work in progress.",
    explanationWrong:
      "Vague or inconsistent branch names force developers to check out each branch or read commit logs to understand what it contains. Without a naming convention, branches become difficult to filter, sort, and clean up. A consistent pattern benefits both humans and tooling.",
    sourceUrl:
      "https://www.git-scm.com/book/en/v2/Git-Branching-Branch-Management",
    sourceLabel: "Git Book: Branch Management",
  },
];
