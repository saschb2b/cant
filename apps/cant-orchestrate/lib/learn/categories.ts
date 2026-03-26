import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Foundations
  "dockerfile-basics",
  "image-optimization",
  "docker-compose",
  "volumes-storage",
  // Container Patterns
  "networking",
  "health-checks",
  "security",
  "environment-config",
  // Orchestration
  "kubernetes-pods",
  "kubernetes-services",
  "kubernetes-config",
  "helm-charts",
  // Build & Pipelines
  "docker-swarm",
  "ci-cd-pipelines",
  "build-scripts",
  "common-mistakes",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "dockerfile-basics": "Dockerfile Basics",
  "image-optimization": "Image Optimization",
  "docker-compose": "Docker Compose",
  "volumes-storage": "Volumes & Storage",
  networking: "Networking",
  "health-checks": "Health Checks",
  security: "Security",
  "environment-config": "Environment & Config",
  "kubernetes-pods": "Pods & Deployments",
  "kubernetes-services": "Services & Ingress",
  "kubernetes-config": "ConfigMaps & Secrets",
  "helm-charts": "Helm Charts",
  "docker-swarm": "Docker Swarm",
  "ci-cd-pipelines": "CI/CD Pipelines",
  "build-scripts": "Build Scripts",
  "common-mistakes": "Common Mistakes",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Foundations",
    categories: [
      "dockerfile-basics",
      "image-optimization",
      "docker-compose",
      "volumes-storage",
    ],
  },
  {
    label: "Container Patterns",
    categories: [
      "networking",
      "health-checks",
      "security",
      "environment-config",
    ],
  },
  {
    label: "Orchestration",
    categories: [
      "kubernetes-pods",
      "kubernetes-services",
      "kubernetes-config",
      "helm-charts",
    ],
  },
  {
    label: "Build & Pipelines",
    categories: [
      "docker-swarm",
      "ci-cd-pipelines",
      "build-scripts",
      "common-mistakes",
    ],
  },
];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH: ChallengeCategory[] = [
  "dockerfile-basics",
  "docker-compose",
  "kubernetes-pods",
  "security",
  "common-mistakes",
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "dockerfile-basics":
    "FROM, RUN, COPY, ENTRYPOINT, and CMD instructions for building container images. You'll hit this when your container starts but runs the wrong command or ignores signals.",
  "image-optimization":
    "Multi-stage builds, layer caching, .dockerignore, and base image selection. You'll hit this when your image is 2 GB, builds take 10 minutes, or a small code change invalidates every layer.",
  "docker-compose":
    "Service definitions, depends_on, profiles, and compose file structure. You'll hit this when your local dev stack has five services and you need them to start in the right order.",
  "volumes-storage":
    "Named volumes, bind mounts, tmpfs, and volume drivers. You'll hit this when container restarts lose your database data or your local file edits don't appear inside the container.",
  networking:
    "Bridge networks, overlay networks, port mapping, and DNS resolution. You'll hit this when containers can't reach each other or your app is exposed on the wrong port.",
  "health-checks":
    "HEALTHCHECK in Dockerfiles, readiness and liveness probes in Kubernetes. You'll hit this when your orchestrator routes traffic to a container that hasn't finished starting up.",
  security:
    "Running as non-root, read-only filesystems, secrets management, and image scanning. You'll hit this when a security audit flags your containers for running as root with write access everywhere.",
  "environment-config":
    "Environment variables, .env files, ConfigMaps, and runtime configuration. You'll hit this when you hardcode a database URL and it breaks in staging because the host is different.",
  "kubernetes-pods":
    "Pod specs, Deployments, ReplicaSets, and rolling updates. You'll hit this when you need zero-downtime deploys or your pods keep crashing without clear reasons.",
  "kubernetes-services":
    "ClusterIP, NodePort, LoadBalancer, Ingress resources, and service mesh basics. You'll hit this when external traffic can't reach your pods or internal services can't find each other.",
  "kubernetes-config":
    "ConfigMaps, Secrets, resource requests and limits, and pod scheduling. You'll hit this when your pod gets OOMKilled, can't read its config, or lands on the wrong node.",
  "helm-charts":
    "Chart structure, values.yaml, templates, helpers, and chart dependencies. You'll hit this when you copy-paste Kubernetes manifests across environments instead of parameterizing them.",
  "docker-swarm":
    "Swarm mode, service definitions, stacks, replicas, and rolling updates. You'll hit this when you need simple container orchestration without the complexity of Kubernetes.",
  "ci-cd-pipelines":
    "Building images in CI, layer caching in pipelines, multi-platform builds, and registry tagging. You'll hit this when your CI pipeline rebuilds everything from scratch on every commit.",
  "build-scripts":
    "Makefiles, Ant build files, Gradle tasks, and shell scripts for container workflows. You'll hit this when your team needs a single command to build, test, and deploy containers.",
  "common-mistakes":
    "Misusing latest tags, ignoring .dockerignore, running as root, and other orchestration anti-patterns. You'll hit this when a deploy fails in production but works on your machine.",
};
