import type { BaseChallenge } from "../../game/types";

export const gitConfigChallenges: BaseChallenge[] = [
  {
    id: "gc-001",
    category: "git-config",
    difficulty: "easy",
    title: "Default branch name",
    prompt: "Which default branch configuration is current best practice?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Use the Git default
git init
# Initialized empty Git repository
# Default branch: master

git config --list | grep init
# (no init.defaultBranch set)`,

      right: `# Set a modern default branch name
git config --global init.defaultBranch main

git init
# Initialized empty Git repository
# Default branch: main

git config --list | grep init
# init.defaultBranch=main`,
    },

    correctSide: "right",
    explanationCorrect:
      "Setting `init.defaultBranch` to `main` aligns with the convention adopted by GitHub, GitLab, and the broader community. It avoids confusion when collaborating on projects that already use `main` as their default branch.\n\nGit 2.28+ supports this config option natively.",
    explanationWrong:
      "Relying on Git's compiled-in default means your local repositories may use a different branch name than the remote. This causes friction when pushing a new repo to GitHub, which defaults to `main`. Setting the config once globally prevents this mismatch for every future repository.",
    sourceUrl:
      "https://git-scm.com/docs/git-config#Documentation/git-config.txt-initdefaultBranch",
    sourceLabel: "Git Docs: init.defaultBranch",
  },
  {
    id: "gc-002",
    category: "git-config",
    difficulty: "easy",
    title: "Pull rebase configuration",
    prompt: "Which pull strategy keeps history cleaner?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Default pull behavior: merge
git config --global pull.rebase false

git pull origin main
# Creates a merge commit every time
# Merge branch 'main' of origin into main

# Log fills with merge bubbles
# *   Merge branch 'main'
# |\
# | * commit from remote
# * commit from local`,

      right: `# Pull with rebase
git config --global pull.rebase true

git pull origin main
# Replays local commits on top of remote
# No merge commit created

# Clean linear history
# * commit from local
# * commit from remote
# * previous commit`,
    },

    correctSide: "right",
    explanationCorrect:
      "Setting `pull.rebase true` replays your local commits on top of the fetched remote commits instead of creating a merge commit. This keeps the history linear and avoids the noise of \"Merge branch 'main'\" commits that add no information.\n\nFor teams that prefer merge commits for feature branches, rebasing on pull still makes sense because it only affects the sync between your local and remote copy of the same branch.",
    explanationWrong:
      "Merge-on-pull creates a merge commit every time you sync with the remote, even when there is no meaningful divergence. Over time, these merge commits clutter the log and make it harder to follow the actual development history. Rebase-on-pull avoids this by keeping the branch linear.",
    sourceUrl:
      "https://git-scm.com/docs/git-config#Documentation/git-config.txt-pullrebase",
    sourceLabel: "Git Docs: pull.rebase",
  },
  {
    id: "gc-003",
    category: "git-config",
    difficulty: "medium",
    title: "Useful git aliases",
    prompt: "Which aliases save more time in daily work?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Simple shorthand aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# Usage
git co main
git br -d feature/old
git ci -m "fix: typo"
git st`,

      right: `# Aliases for complex operations
git config --global alias.lg \\
  "log --oneline --graph --decorate --all"
git config --global alias.undo \\
  "reset --soft HEAD~1"
git config --global alias.amend \\
  "commit --amend --no-edit"
git config --global alias.wip \\
  "commit -am 'chore: work in progress'"

# Usage
git lg
git undo
git amend
git wip`,
    },

    correctSide: "right",
    explanationCorrect:
      "Aliases that wrap complex multi-flag commands save real time and reduce errors. `git lg` replaces a long log command with flags you would otherwise need to memorize. `git undo` provides a safe soft reset without remembering the `--soft HEAD~1` syntax.\n\nShorthand aliases like `co` for `checkout` save only a few keystrokes and can confuse team members reading your shell history.",
    explanationWrong:
      "Aliases like `co`, `br`, and `ci` save minimal effort since most terminals offer tab completion for git subcommands already. Aliases shine when they encapsulate commands with multiple flags or options, turning `git log --oneline --graph --decorate --all` into a memorable `git lg`.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases",
    sourceLabel: "Git Book: Git Aliases",
  },
  {
    id: "gc-004",
    category: "git-config",
    difficulty: "medium",
    title: "Global vs local config scope",
    prompt: "Which approach handles work and personal projects correctly?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Set email globally, override per-repo
git config --global user.email "alice@personal.com"

# In work repo, manually override
cd ~/work/project
git config user.email "alice@company.com"

# Easy to forget for new repos
# Commits leak personal email to work repos`,

      right: `# Use conditional includes by directory
# ~/.gitconfig
# [user]
#   name = Alice
#   email = alice@personal.com
# [includeIf "gitdir:~/work/"]
#   path = ~/.gitconfig-work

# ~/.gitconfig-work
# [user]
#   email = alice@company.com

# All repos under ~/work/ automatically
# use the work email. No manual setup.`,
    },

    correctSide: "right",
    explanationCorrect:
      "Conditional includes (`includeIf`) automatically apply configuration based on the repository location. All repos under `~/work/` use the work email without any manual per-repo setup. This eliminates the risk of committing to a work project with your personal email.\n\nThis feature was introduced in Git 2.13 and works with `gitdir` path matching.",
    explanationWrong:
      "Manually setting `user.email` in each work repository is error-prone. Every time you clone a new work repo, you must remember to override the email. One forgotten `git config` command means commits with your personal email end up in the company repository. Conditional includes automate this entirely.",
    sourceUrl: "https://git-scm.com/docs/git-config#_conditional_includes",
    sourceLabel: "Git Docs: Conditional Includes",
  },
  {
    id: "gc-005",
    category: "git-config",
    difficulty: "hard",
    title: "Commit signing setup",
    prompt: "Which signing configuration is more practical?",
    content: {
      type: "code",
      lang: "bash",

      left: `# GPG signing (traditional)
gpg --gen-key
# Select RSA, 4096 bits, set expiry

gpg --list-secret-keys --keyid-format=long
# sec rsa4096/ABC123DEF456 2025-01-01

git config --global user.signingkey ABC123DEF456
git config --global commit.gpgsign true

# Requires GPG agent, key management,
# and sharing public key with GitHub`,

      right: `# SSH signing (modern, simpler)
# Reuse your existing SSH key
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true

# Add the same SSH key to GitHub as
# a "signing key" in settings

# No GPG agent or key management needed`,
    },

    correctSide: "right",
    explanationCorrect:
      "SSH signing (Git 2.34+) reuses the SSH key you already have for authentication. There is no need to generate and manage a separate GPG key, configure a GPG agent, or deal with key expiry and renewal.\n\nGitHub, GitLab, and Codeberg all support SSH signature verification. For most developers, SSH signing is simpler to set up and maintain.",
    explanationWrong:
      "GPG signing works and is still valid, but it introduces a separate key management workflow. You need to generate a GPG key, configure the agent, export the public key, and keep the key renewed. SSH signing achieves the same goal with the key you already use for pushing, reducing setup complexity significantly.",
    sourceUrl:
      "https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification",
    sourceLabel: "GitHub Docs: Commit Signature Verification",
  },
  {
    id: "gc-006",
    category: "git-config",
    difficulty: "hard",
    title: "Diff and merge tool configuration",
    prompt: "Which merge tool setup handles conflicts better?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Use default inline conflict markers
# No merge tool configured

# During a conflict:
<<<<<<< HEAD
const timeout = 3000;
=======
const timeout = 5000;
>>>>>>> feature/update-timeout

# Manually edit the file to resolve
# Easy to miss nested conflicts`,

      right: `# Configure a visual merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd \\
  'code --wait --merge $REMOTE $LOCAL $BASE $MERGED'
git config --global merge.conflictstyle diff3
git config --global mergetool.keepBackup false

# During a conflict:
git mergetool
# Opens VS Code with 3-way merge view
# Shows BASE, LOCAL, REMOTE, and RESULT`,
    },

    correctSide: "right",
    explanationCorrect:
      "A visual merge tool shows the base, local, and remote versions side by side, making it clear what each branch changed relative to the common ancestor. The `diff3` conflict style adds the base version to inline markers too, which helps when both sides modified the same code differently.\n\nInline conflict markers work for simple conflicts but become hard to parse when conflicts span many lines or are nested.",
    explanationWrong:
      "Default inline conflict markers show only the two conflicting versions without the common ancestor. You cannot tell whether one side added code, the other deleted it, or both modified it differently. A 3-way merge tool with `diff3` style provides the context needed to resolve conflicts correctly.",
    sourceUrl: "https://git-scm.com/docs/git-mergetool",
    sourceLabel: "Git Docs: git-mergetool",
  },
  {
    id: "gc-007",
    category: "git-config",
    difficulty: "easy",
    title: "Git initial configuration",
    prompt: "Which git configuration leads to fewer problems?",
    content: {
      type: "visual",
      left: { componentId: "TerminalUnconfiguredGit" },
      right: { componentId: "TerminalConfiguredGit" },
    },
    correctSide: "right",
    explanationCorrect:
      "A properly configured git setup includes user identity, default branch name, pull strategy, commit signing, and useful aliases. These settings prevent common issues like misattributed commits, unnecessary merge commits on pull, and inconsistent branch names across the team.",
    explanationWrong:
      "Using git without configuring it leads to a stream of small problems: commits attributed to the wrong email, merge commits cluttering the history on every pull, and warnings about unset defaults. Spending a few minutes on initial configuration prevents these recurring issues for every future repository.",
    sourceUrl:
      "https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup",
    sourceLabel: "Git Book: First-Time Git Setup",
  },
];
