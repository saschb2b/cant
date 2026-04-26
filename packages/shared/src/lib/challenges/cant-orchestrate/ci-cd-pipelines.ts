import type { BaseChallenge } from "../../game/types";

export const ciCdPipelinesChallenges: BaseChallenge[] = [
  {
    id: "ci-001",
    category: "ci-cd-pipelines",
    difficulty: "easy",
    title: "Cache Docker layers in CI",
    prompt: "Which CI build configuration is faster?",
    content: {
      type: "code",

      lang: "yaml",

      left: `# GitHub Actions
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp:latest .
      # Builds from scratch every time
      # No layer caching`,

      right: `# GitHub Actions
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: false
          tags: myapp:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max`,
    },

    correctSide: "right",
    explanationCorrect:
      "BuildKit's GitHub Actions cache backend (`type=gha`) stores and retrieves Docker layers between CI runs. Unchanged layers are reused, dramatically reducing build times. `mode=max` caches all layers, not just the final image.",
    explanationWrong:
      "Without layer caching, every CI run builds every layer from scratch. Installing dependencies, compiling code, and copying assets all run again even if nothing changed. This wastes time and compute resources on every commit.",
    sourceUrl: "https://docs.docker.com/build/cache/backends/gha/",
    sourceLabel: "Docker docs: GitHub Actions cache",
  },
  {
    id: "ci-002",
    category: "ci-cd-pipelines",
    difficulty: "medium",
    title: "Tag images with commit SHA",
    prompt: "Which image tagging strategy is more traceable?",
    content: {
      type: "code",

      lang: "bash",

      left: `# Build and push with mutable tag
docker build -t registry.io/myapp:latest .
docker push registry.io/myapp:latest

# Deploy
kubectl set image deployment/web \\
  web=registry.io/myapp:latest`,

      right: `# Build and push with immutable tag
SHA=$(git rev-parse --short HEAD)
docker build -t registry.io/myapp:$SHA .
docker push registry.io/myapp:$SHA

# Deploy with specific version
kubectl set image deployment/web \\
  web=registry.io/myapp:$SHA`,
    },

    correctSide: "right",
    explanationCorrect:
      "Tagging with the commit SHA creates an immutable, traceable image. You can always determine which code is running in any environment. Rollbacks point to a specific previous SHA. Two environments running the same SHA are guaranteed to have identical code.",
    explanationWrong:
      "`latest` is a mutable tag that gets overwritten on every push. You can't tell which version is running without inspecting the image digest. Rollbacks to `latest` deploy whatever was last pushed, not a specific known-good version. Different environments pulling `latest` at different times get different code.",
    sourceUrl:
      "https://docs.docker.com/build/ci/github-actions/manage-tags-labels/",
    sourceLabel: "Docker docs: Manage tags",
  },
  {
    id: "ci-003",
    category: "ci-cd-pipelines",
    difficulty: "medium",
    title: "Multi-platform builds",
    prompt: "Which build handles multiple architectures?",
    content: {
      type: "code",

      lang: "bash",

      left: `# Only builds for CI runner's arch
docker build -t myapp:1.0 .
docker push registry.io/myapp:1.0

# Fails on ARM servers or
# Apple Silicon dev machines`,

      right: `# Build for multiple architectures
docker buildx build \\
  --platform linux/amd64,linux/arm64 \\
  --tag registry.io/myapp:1.0 \\
  --push .

# Works on x86 servers, ARM servers,
# and Apple Silicon dev machines`,
    },

    correctSide: "right",
    explanationCorrect:
      "`docker buildx build --platform` creates a multi-architecture manifest. Docker automatically pulls the right image for the host architecture. Your image works on x86 CI runners, ARM-based cloud instances (Graviton, Ampere), and Apple Silicon Macs.",
    explanationWrong:
      "Building without `--platform` produces an image only for the CI runner's architecture (usually amd64). Deploying this on ARM servers causes exec format errors. Developers on Apple Silicon Macs run the image through slow emulation.",
    sourceUrl: "https://docs.docker.com/build/building/multi-platform/",
    sourceLabel: "Docker docs: Multi-platform builds",
  },
  {
    id: "ci-004",
    category: "ci-cd-pipelines",
    difficulty: "hard",
    title: "Scan images before deploying",
    prompt: "Which CI pipeline is more secure?",
    content: {
      type: "code",

      lang: "bash",

      left: `# Build, push, deploy
# No security check
docker build -t myapp:$SHA .
docker push registry.io/myapp:$SHA
kubectl set image deployment/web \\
  web=registry.io/myapp:$SHA`,

      right: `# Build, scan, push, deploy
docker build -t myapp:$SHA .

# Scan for vulnerabilities
docker scout cves myapp:$SHA \\
  --exit-code \\
  --only-severity critical,high

# Only push and deploy if scan passes
docker push registry.io/myapp:$SHA
kubectl set image deployment/web \\
  web=registry.io/myapp:$SHA`,
    },

    correctSide: "right",
    explanationCorrect:
      "Scanning images before pushing to a registry catches known vulnerabilities in base images and dependencies. `--exit-code` makes the scan fail the pipeline on critical/high findings. Vulnerable images never reach production.",
    explanationWrong:
      "Deploying without scanning means known CVEs in your base image or dependencies go straight to production. By the time a periodic scan catches them, the vulnerable image has been serving traffic for hours or days.",
    sourceUrl: "https://docs.docker.com/scout/",
    sourceLabel: "Docker docs: Docker Scout",
  },
];
