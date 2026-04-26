import type { BaseChallenge } from "../../game/types";

export const branchingStrategiesChallenges: BaseChallenge[] = [
  {
    id: "bs-001",
    category: "branching-strategies",
    difficulty: "easy",
    title: "Feature branch lifespan",
    prompt: "Which branching approach reduces integration pain?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Feature branch lives for 3 weeks
git checkout -b feature/redesign
# ... 47 commits over 21 days ...
# Finally merge with massive conflicts
git merge main
# Resolve 23 conflicting files
git checkout main
git merge feature/redesign`,

      right: `# Short-lived branch, merged within 2 days
git checkout -b feature/redesign-header
# ... 4 focused commits ...
git checkout main
git pull
git merge feature/redesign-header
# Next slice
git checkout -b feature/redesign-nav`,
    },

    correctSide: "right",
    explanationCorrect:
      "Short-lived branches minimize merge conflicts by integrating changes frequently. Each branch tackles a small, well-defined slice of work. When branches live for days instead of weeks, the diff stays small and reviewable, and conflicts are rare and easy to resolve.",
    explanationWrong:
      "Long-lived feature branches diverge significantly from the main branch over time. The longer a branch lives, the more likely it is to conflict with other developers' work. Merging a 3-week branch often turns into a painful, error-prone process that can introduce subtle bugs.",
    sourceUrl:
      "https://trunkbaseddevelopment.com/short-lived-feature-branches/",
    sourceLabel: "Trunk Based Development: Short-Lived Feature Branches",
  },
  {
    id: "bs-002",
    category: "branching-strategies",
    difficulty: "easy",
    title: "Feature flags vs feature branches",
    prompt: "Which approach allows safer deployment of incomplete features?",
    content: {
      type: "code",

      left: `// Feature flag in production code
function Dashboard() {
  const flags = useFeatureFlags();

  return (
    <main>
      <Stats />
      {flags.newAnalytics && <AnalyticsV2 />}
      {!flags.newAnalytics && <AnalyticsV1 />}
    </main>
  );
}
// Code is merged to main, toggled off`,

      right: `// Long-running feature branch
// branch: feature/analytics-v2
function Dashboard() {
  return (
    <main>
      <Stats />
      <AnalyticsV2 />
    </main>
  );
}
// Code stays on branch until "ready"
// Merge conflicts accumulate daily`,
    },

    correctSide: "left",
    explanationCorrect:
      "Feature flags let you merge incomplete work into main safely. The code is deployed but not active for users until you flip the flag. This keeps branches short-lived, enables trunk-based development, and allows gradual rollouts. You can enable the feature for 5% of users first, then ramp up.",
    explanationWrong:
      "Keeping incomplete features on long-running branches delays integration and increases merge conflict risk. The branch diverges further from main every day. When it finally merges, you face a large, risky deployment with no ability to gradually roll out or quickly disable the feature.",
    sourceUrl: "https://martinfowler.com/articles/feature-toggles.html",
    sourceLabel: "Martin Fowler: Feature Toggles",
  },
  {
    id: "bs-003",
    category: "branching-strategies",
    difficulty: "medium",
    title: "Git Flow for a small team",
    prompt: "Which workflow fits a small team shipping continuously?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Git Flow: 5 branch types
git checkout develop
git checkout -b feature/login
# ... work ...
git checkout develop
git merge feature/login
git checkout -b release/1.2.0
# ... stabilize ...
git checkout main
git merge release/1.2.0
git tag v1.2.0
git checkout develop
git merge release/1.2.0`,

      right: `# GitHub Flow: 1 branch type
git checkout main
git checkout -b feature/login
# ... work ...
git push -u origin feature/login
# Open pull request, get review
# CI runs automatically
# Merge PR, deploy to production
git checkout main
git pull`,
    },

    correctSide: "right",
    explanationCorrect:
      "GitHub Flow is simpler and works well for small teams doing continuous delivery. You have one main branch, create feature branches from it, open pull requests, and merge back. There is no need for develop, release, or hotfix branches when you deploy frequently and have good CI/CD.",
    explanationWrong:
      "Git Flow was designed for projects with scheduled releases and multiple supported versions. For a small team shipping continuously, the overhead of managing develop, release, and hotfix branches adds complexity without clear benefits. The extra ceremony slows down delivery without improving quality.",
    sourceUrl: "https://docs.github.com/en/get-started/using-git/github-flow",
    sourceLabel: "GitHub Docs: GitHub Flow",
  },
  {
    id: "bs-004",
    category: "branching-strategies",
    difficulty: "medium",
    title: "Trunk-based development discipline",
    prompt: "Which trunk-based approach is safer for a growing team?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Direct commits to main (no review)
git checkout main
git pull
# Make changes directly
git add .
git commit -m "add user auth"
git push origin main
# Hope nothing breaks
# No PR, no CI gate, no review`,

      right: `# Short-lived branches with PR review
git checkout main
git pull
git checkout -b add-user-auth
# Make changes
git add .
git commit -m "add user auth"
git push -u origin add-user-auth
# Open PR, CI runs, teammate reviews
# Merge within 1-2 days`,
    },

    correctSide: "right",
    explanationCorrect:
      "Trunk-based development does not mean skipping code review. The best practice is to use short-lived branches (1-2 days max) with pull requests. This gives you the benefits of frequent integration while maintaining quality through CI checks and peer review. The key constraint is branch lifespan, not the absence of branches.",
    explanationWrong:
      "Committing directly to main without review works for solo projects but creates risk on teams. A single broken commit can block everyone. Without CI gates, bugs slip into production unnoticed. Trunk-based development encourages frequent integration, but that does not mean abandoning review and automated checks.",
    sourceUrl: "https://trunkbaseddevelopment.com/",
    sourceLabel: "Trunk Based Development",
  },
  {
    id: "bs-005",
    category: "branching-strategies",
    difficulty: "hard",
    title: "Release branches for versioned software",
    prompt: "Which strategy handles multiple supported versions better?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Maintain release branches per major version
git checkout main
git checkout -b release/2.x
# Ship v2.0.0 from release/2.x
# Continue v3 development on main
git checkout release/2.x
git cherry-pick <security-fix-sha>
# Ship v2.0.1 patch for v2 users
# v2 and v3 coexist cleanly`,

      right: `# Tag releases, patch on main only
git checkout main
git tag v2.0.0
# Continue development on main
# v2 user reports security bug
git checkout main
# Fix lands in v3 codebase
git tag v3.1.0
# Tell v2 users to upgrade to v3
# No way to patch v2 independently`,
    },

    correctSide: "left",
    explanationCorrect:
      "When you support multiple major versions simultaneously, release branches are essential. They let you backport critical fixes to older versions without forcing users to upgrade. Libraries, frameworks, and enterprise software commonly maintain release branches for each supported major version.",
    explanationWrong:
      "Tagging without release branches works when you only support the latest version. But if users depend on v2 and cannot upgrade to v3 immediately, you need a way to ship patches to v2. Without a release branch, your only option is telling users to upgrade, which is not always feasible.",
    sourceUrl:
      "https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows",
    sourceLabel: "Git Book: Branching Workflows",
  },
  {
    id: "bs-006",
    category: "branching-strategies",
    difficulty: "hard",
    title: "Environment branch promotion",
    prompt: "Which deployment strategy avoids environment branch drift?",
    content: {
      type: "code",
      lang: "bash",

      left: `# Environment branches (antipattern)
git checkout develop
git merge feature/auth
# Promote to staging
git checkout staging
git merge develop
# Promote to production
git checkout production
git merge staging
# Branches drift apart over time
# Hotfixes go to production, skip staging`,

      right: `# Single branch, deploy by pipeline
git checkout main
git merge feature/auth
# CI/CD pipeline handles promotion:
#   main -> build -> test -> staging
#   manual approval -> production
# Same artifact flows through all envs
# No branch drift possible`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using CI/CD pipelines to promote a single artifact through environments eliminates branch drift. The same commit that passed tests in staging is exactly what deploys to production. Environment-specific config lives in environment variables or config files, not in separate branches.",
    explanationWrong:
      "Environment branches (develop, staging, production) inevitably drift apart. Hotfixes applied to production skip staging. Cherry-picks get lost. Over time, the branches diverge so much that merging staging into production becomes unpredictable. The environments no longer represent what they should.",
    sourceUrl:
      "https://www.atlassian.com/continuous-delivery/principles/pipeline",
    sourceLabel: "Atlassian: Continuous Delivery Pipeline",
  },
  {
    id: "bs-007",
    category: "branching-strategies",
    difficulty: "medium",
    title: "Branch lifespan and integration risk",
    prompt: "Which branching pattern leads to fewer merge conflicts?",
    content: {
      type: "visual",
      left: { componentId: "GitGraphLongLivedBranch" },
      right: { componentId: "GitGraphShortLivedBranch" },
    },
    correctSide: "right",
    explanationCorrect:
      "Short-lived branches stay close to the main branch and integrate frequently. Because they diverge for only a day or two, the chance of conflicting with other developers' work is minimal. Each merge is small, predictable, and easy to review.",
    explanationWrong:
      "Long-lived branches accumulate drift over time. The longer a branch exists, the more the main branch changes underneath it. When the branch finally merges, the resulting conflicts can be large and difficult to resolve correctly, increasing the risk of introducing bugs.",
    sourceUrl:
      "https://trunkbaseddevelopment.com/short-lived-feature-branches/",
    sourceLabel: "Trunk Based Development: Short-Lived Feature Branches",
  },
];
