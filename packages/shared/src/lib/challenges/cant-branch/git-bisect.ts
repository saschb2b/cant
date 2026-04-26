import type { BaseChallenge } from "../../game/types";

export const gitBisectChallenges: BaseChallenge[] = [
  {
    id: "gb-001",
    category: "git-bisect",
    difficulty: "easy",
    title: "Starting a bisect session",
    prompt: "Which correctly starts a binary search for a bug?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Find the bad commit manually
git log --oneline
# Read each commit message...
# Guess which one broke it...
git checkout a1b2c3d
# Test, then try another...`,

      right: `# Start binary search for the bug
git bisect start
git bisect bad          # current commit is broken
git bisect good v1.2.0  # this tag was working
# Git checks out the midpoint automatically`,
    },

    correctSide: "right",
    explanationCorrect:
      "Git bisect performs a binary search through your commit history. You mark a known bad commit and a known good commit, and git automatically checks out the midpoint. This finds the offending commit in O(log n) steps instead of checking each one linearly.",
    explanationWrong:
      "Manually checking out commits one by one is time-consuming and error-prone, especially in long histories. With 1000 commits between good and bad, bisect finds the culprit in about 10 steps. Manual searching could take hundreds of attempts.",
    sourceUrl: "https://git-scm.com/docs/git-bisect",
    sourceLabel: "Git Docs: git bisect",
  },
  {
    id: "gb-002",
    category: "git-bisect",
    difficulty: "easy",
    title: "Marking commits during bisect",
    prompt: "Which correctly narrows down the search during bisect?",
    content: {
      type: "code",
      lang: "bash",

      left: `# After testing the checked-out commit:
# If the bug is present:
git bisect bad
# If the bug is NOT present:
git bisect good
# Git checks out the next midpoint`,

      right: `# After testing the checked-out commit:
# If the bug is present:
git bisect mark broken
# If the bug is NOT present:
git bisect mark working
# Continue manually`,
    },

    correctSide: "left",
    explanationCorrect:
      "The commands `git bisect good` and `git bisect bad` are the standard way to mark commits during a bisect session. After each mark, git automatically calculates and checks out the next midpoint between the remaining good and bad boundaries.",
    explanationWrong:
      "There is no `git bisect mark` command with `broken` or `working` arguments. The correct commands are `git bisect good` and `git bisect bad`. You can also use `git bisect old` and `git bisect new` as alternative terms if the issue is not strictly a bug.",
    sourceUrl: "https://git-scm.com/docs/git-bisect#_basic_bisect_commands",
    sourceLabel: "Git Docs: Basic Bisect Commands",
  },
  {
    id: "gb-003",
    category: "git-bisect",
    difficulty: "medium",
    title: "Automating bisect with a test script",
    prompt: "Which approach automates the entire bisect process?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Manual bisect: test each commit by hand
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
# Now test manually at each step...
npm test
git bisect good  # or bad
# Repeat 10+ times...`,

      right: `# Automated bisect: let a script do it
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
# Run test script at each step automatically
git bisect run npm test`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `git bisect run` command executes a script at each step and uses the exit code to determine good (0) or bad (non-zero). This fully automates the binary search. With a reliable test, you can walk away and come back to find the exact commit that introduced the regression.",
    explanationWrong:
      "Manual bisecting works but requires you to stay at your terminal, test each commit, and type good or bad. For regressions caught by an automated test, `git bisect run` does the same thing in seconds with no human intervention required.",
    sourceUrl: "https://git-scm.com/docs/git-bisect#_bisect_run",
    sourceLabel: "Git Docs: Bisect Run",
  },
  {
    id: "gb-004",
    category: "git-bisect",
    difficulty: "medium",
    title: "Skipping untestable commits",
    prompt: "Which handles a commit that cannot be tested during bisect?",
    content: {
      type: "code",
      lang: "bash",

      left: `# This commit doesn't compile
# Mark it as bad and move on
git bisect bad`,

      right: `# This commit doesn't compile
# Skip it so bisect tries a neighbor
git bisect skip`,
    },

    correctSide: "right",
    explanationCorrect:
      "When a commit cannot be tested (for example, it does not compile), `git bisect skip` tells git to try a neighboring commit instead. Marking it as `bad` would be incorrect because you do not actually know whether the bug is present, and it would skew the binary search results.",
    explanationWrong:
      "Marking an untestable commit as `bad` corrupts the bisect results. If the commit does not compile for reasons unrelated to the bug, it is neither good nor bad. The `skip` command preserves the integrity of the search by trying adjacent commits. For automated runs, exit code 125 signals a skip.",
    sourceUrl: "https://git-scm.com/docs/git-bisect#_bisect_skip",
    sourceLabel: "Git Docs: Bisect Skip",
  },
  {
    id: "gb-005",
    category: "git-bisect",
    difficulty: "hard",
    title: "Custom test script for bisect run",
    prompt: "Which test script works correctly with git bisect run?",
    content: {
      type: "code",
      lang: "bash",

      left: `#!/bin/bash
# test-regression.sh
npm run build
npm test -- --grep "login"
# Script exits with test's exit code`,

      right: `#!/bin/bash
# test-regression.sh
npm run build || exit 125
npm test -- --grep "login"
# Exit 125 = skip, 0 = good, 1+ = bad`,
    },

    correctSide: "right",
    explanationCorrect:
      "Exit code 125 tells bisect to skip the current commit. If the build fails (unrelated to the bug), the script skips instead of falsely marking the commit as bad. Exit code 0 means good, and any other non-zero, non-125 code means bad. This three-way signaling makes automated bisect reliable.",
    explanationWrong:
      "Without handling build failures specially, a commit that fails to compile would be marked as bad (non-zero exit). This is incorrect if the build failure is unrelated to the bug you are hunting. Always use `exit 125` for untestable commits so bisect skips them and tries a neighbor.",
    sourceUrl: "https://git-scm.com/docs/git-bisect#_bisect_run",
    sourceLabel: "Git Docs: Bisect Run",
  },
  {
    id: "gb-006",
    category: "git-bisect",
    difficulty: "hard",
    title: "Ending a bisect session",
    prompt:
      "Which properly concludes a bisect session and returns to your branch?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Bisect found the bad commit
# Just go back to the branch
git checkout main
# (bisect state left behind)`,

      right: `# Bisect found the bad commit
# Clean up bisect state and return to HEAD
git bisect reset
# Back on original branch, refs cleaned up`,
    },

    correctSide: "right",
    explanationCorrect:
      "Running `git bisect reset` cleanly ends the bisect session, removes all bisect refs, and checks out the branch you were on before starting. This is the correct way to conclude a bisect, whether you found the culprit or want to abort the search early.",
    explanationWrong:
      "Using `git checkout` to leave a bisect session does not clean up the bisect state. Git will still think a bisect is in progress, and leftover refs in `.git/BISECT_*` files can cause confusing behavior. Always use `git bisect reset` to properly end the session.",
    sourceUrl: "https://git-scm.com/docs/git-bisect#_bisect_reset",
    sourceLabel: "Git Docs: Bisect Reset",
  },
  {
    id: "gb-007",
    category: "git-bisect",
    difficulty: "medium",
    title: "Bisect workflow efficiency",
    prompt: "Which approach to finding a regression is more efficient?",
    content: {
      type: "visual",
      left: { componentId: "TerminalBisectManual" },
      right: { componentId: "TerminalBisectAutomated" },
    },
    correctSide: "right",
    explanationCorrect:
      "Automated bisect with `git bisect run` executes a test script at each step and determines good or bad from the exit code. This eliminates human error and completes in seconds what might take many minutes of manual testing. It is especially powerful when combined with a targeted test that reproduces the regression.",
    explanationWrong:
      "Manual bisect requires you to test each commit by hand, type good or bad, and stay at your terminal throughout the process. For regressions that have an automated test, this is unnecessarily slow and error-prone. A single mistyped `good` or `bad` can send the search in the wrong direction.",
    sourceUrl: "https://git-scm.com/docs/git-bisect#_bisect_run",
    sourceLabel: "Git Docs: Bisect Run",
  },
];
