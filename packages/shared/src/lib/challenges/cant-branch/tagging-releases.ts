import type { BaseChallenge } from "../../game/types";

export const taggingReleasesChallenges: BaseChallenge[] = [
  {
    id: "tr-001",
    category: "tagging-releases",
    difficulty: "easy",
    title: "Annotated vs lightweight tags",
    prompt: "Which tagging approach is better for releases?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Lightweight tag
git tag v1.4.0

# No metadata attached
git show v1.4.0
# commit 3a1f...
# Author: Alice
# Date: Mon Mar 10`,

      right: `# Annotated tag
git tag -a v1.4.0 -m "Release v1.4.0: payment refactor"

# Includes tagger, date, and message
git show v1.4.0
# tag v1.4.0
# Tagger: Alice <alice@example.com>
# Date: Mon Mar 10
# Release v1.4.0: payment refactor`,
    },

    correctSide: "right",
    explanationCorrect:
      "Annotated tags store the tagger name, email, date, and a message as a full Git object. This metadata is essential for release management because it records **who** created the release and **why**.\n\nLightweight tags are just pointers to a commit with no additional context. Use them for temporary or personal bookmarks, not for releases.",
    explanationWrong:
      "Lightweight tags lack metadata. You cannot see who created the tag or when it was created independently of the commit it points to. For releases that other people depend on, annotated tags provide the audit trail and context that lightweight tags cannot.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Basics-Tagging",
    sourceLabel: "Git Book: Tagging",
  },
  {
    id: "tr-002",
    category: "tagging-releases",
    difficulty: "easy",
    title: "Semantic versioning format",
    prompt: "Which version bump is correct for a breaking API change?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Current version: v2.3.1
# Change: renamed public API method
#   getUserName() -> getDisplayName()

git tag -a v2.4.0 -m "Rename getUserName to getDisplayName"

# Bumped MINOR version
# 2.3.1 -> 2.4.0`,

      right: `# Current version: v2.3.1
# Change: renamed public API method
#   getUserName() -> getDisplayName()

git tag -a v3.0.0 -m "Rename getUserName to getDisplayName"

# Bumped MAJOR version
# 2.3.1 -> 3.0.0`,
    },

    correctSide: "right",
    explanationCorrect:
      "Semantic versioning defines MAJOR.MINOR.PATCH. A **major** bump signals breaking changes. Renaming a public API method breaks existing consumers, so the major version must increment.\n\nMinor bumps are for backwards-compatible new features. Patch bumps are for backwards-compatible bug fixes.",
    explanationWrong:
      "Renaming a public method is a breaking change. Consumers who call `getUserName()` will get errors after upgrading. A minor version bump (2.3.1 to 2.4.0) signals new features that are backwards-compatible, which this change is not. The correct bump is to major: 3.0.0.",
    sourceUrl: "https://semver.org/",
    sourceLabel: "Semantic Versioning 2.0.0",
  },
  {
    id: "tr-003",
    category: "tagging-releases",
    difficulty: "medium",
    title: "Tagging before vs after merge",
    prompt: "When should you create the release tag?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Tag the feature branch before merging
git checkout feature/payments
git tag -a v1.5.0 -m "Release v1.5.0"

# Then merge to main
git checkout main
git merge feature/payments
git push origin main --tags`,

      right: `# Merge to main first
git checkout main
git merge feature/payments

# Tag the merge commit on main
git tag -a v1.5.0 -m "Release v1.5.0"
git push origin main --tags`,
    },

    correctSide: "right",
    explanationCorrect:
      "Tags should point to commits on the main branch, specifically the merge commit that includes all changes for the release. Tagging a feature branch commit means the tag points to a commit that may not exist on main after a squash merge.\n\nThe release tag should always reflect the exact state of the code that was shipped.",
    explanationWrong:
      "Tagging a feature branch before merging creates a disconnect. If the merge introduces a conflict resolution or if you use squash merging, the tagged commit and the actual main branch state will differ. Always tag after merging so the tag represents what was actually released.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Basics-Tagging",
    sourceLabel: "Git Book: Tagging",
  },
  {
    id: "tr-004",
    category: "tagging-releases",
    difficulty: "medium",
    title: "Release branch workflow",
    prompt: "Which release branch strategy is safer?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Release directly from main
git checkout main
git pull origin main

# Tag and deploy
git tag -a v2.1.0 -m "Release v2.1.0"
git push origin v2.1.0

# Hotfix? Commit directly to main
git commit -m "fix: patch critical bug"
git tag -a v2.1.1 -m "Hotfix v2.1.1"`,

      right: `# Create a release branch for stabilization
git checkout -b release/2.1.0 main

# Only bug fixes go here, no new features
git commit -m "fix: patch critical bug"

# When stable, merge back and tag
git checkout main
git merge release/2.1.0
git tag -a v2.1.0 -m "Release v2.1.0"
git push origin main --tags`,
    },

    correctSide: "right",
    explanationCorrect:
      "A release branch gives you a stabilization period where only bug fixes are allowed. New feature work continues on main without interfering with the release. This separation prevents last-minute features from sneaking into a release.\n\nDirect tagging on main works for small teams with continuous deployment, but release branches are safer for coordinated releases.",
    explanationWrong:
      "Releasing directly from main means every commit on main is a potential release candidate. If someone merges a half-finished feature while you are preparing a release, it gets included. A release branch isolates the release scope and gives QA a stable target to test against.",
    sourceUrl: "https://nvie.com/posts/a-successful-git-branching-model/",
    sourceLabel: "A Successful Git Branching Model",
  },
  {
    id: "tr-005",
    category: "tagging-releases",
    difficulty: "hard",
    title: "Tag signing for verification",
    prompt: "Which approach provides verifiable releases?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Unsigned annotated tag
git tag -a v3.0.0 -m "Release v3.0.0: new auth system"

# Push the tag
git push origin v3.0.0

# Anyone with write access could have
# created or moved this tag`,

      right: `# GPG-signed annotated tag
git tag -s v3.0.0 -m "Release v3.0.0: new auth system"

# Verify the signature
git tag -v v3.0.0
# gpg: Good signature from "Alice <alice@example.com>"

# Push the verified tag
git push origin v3.0.0`,
    },

    correctSide: "right",
    explanationCorrect:
      "Signed tags (`git tag -s`) use GPG to cryptographically prove who created the tag. Anyone can verify the signature with `git tag -v`. This is critical for open source projects and security-sensitive releases where you need to confirm the tag was created by a trusted maintainer.\n\nUnsigned tags offer no proof of authorship.",
    explanationWrong:
      "Without signing, there is no way to verify who created a tag. An attacker with push access could delete and recreate a tag pointing to a different commit. Signed tags make tampering detectable because the signature would no longer match.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work",
    sourceLabel: "Git Book: Signing Your Work",
  },
  {
    id: "tr-006",
    category: "tagging-releases",
    difficulty: "hard",
    title: "Pre-release version tagging",
    prompt: "Which pre-release versioning is correct?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Pre-release versions
git tag -a v2.0.0-beta -m "Beta release"
git tag -a v2.0.0-beta2 -m "Second beta"
git tag -a v2.0.0-rc -m "Release candidate"

# No numeric ordering, hard to sort
# v2.0.0-beta, v2.0.0-beta2, v2.0.0-rc`,

      right: `# Pre-release versions with semver identifiers
git tag -a v2.0.0-beta.1 -m "First beta release"
git tag -a v2.0.0-beta.2 -m "Second beta release"
git tag -a v2.0.0-rc.1 -m "Release candidate 1"

# Dot-separated, numerically sortable
# v2.0.0-beta.1 < v2.0.0-beta.2 < v2.0.0-rc.1`,
    },

    correctSide: "right",
    explanationCorrect:
      "Semver specifies dot-separated pre-release identifiers with numeric ordering. `beta.1` and `beta.2` sort correctly because the numeric part after the dot is compared as an integer. Without the dot separator, `beta2` sorts lexicographically, which breaks at `beta10`.\n\nThis convention also makes it clear how many pre-releases have been published.",
    explanationWrong:
      "Tags like `v2.0.0-beta` and `v2.0.0-beta2` lack consistent structure. Lexicographic sorting puts `beta10` before `beta2`. The semver spec requires dot-separated identifiers so that numeric comparisons work correctly: `beta.1 < beta.2 < beta.10`.",
    sourceUrl: "https://semver.org/#spec-item-11",
    sourceLabel: "Semver: Pre-release Versions",
  },
  {
    id: "tr-007",
    category: "tagging-releases",
    difficulty: "easy",
    title: "Release point visibility",
    prompt: "Which release history is easier to navigate?",
    content: {
      type: "visual",
      left: { componentId: "GitGraphNoTags" },
      right: { componentId: "GitGraphWithTags" },
    },
    correctSide: "right",
    explanationCorrect:
      "Tags mark specific commits as release points, making it easy to check out, compare, and reference any version. Commands like git diff v1.0.0..v2.0.0 and git log v1.0.0..v2.0.0 become available. Without tags, you would need to look up commit hashes manually.",
    explanationWrong:
      "A repository without tags has no visible milestones in its history. Finding the commit that corresponds to a specific release requires searching through logs or external documentation. Tags provide permanent, human-readable markers that integrate with tooling and hosting platforms.",
    sourceUrl: "https://git-scm.com/book/en/v2/Git-Basics-Tagging",
    sourceLabel: "Git Book: Tagging",
  },
];
