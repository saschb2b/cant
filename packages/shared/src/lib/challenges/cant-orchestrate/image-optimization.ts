import type { BaseChallenge } from "../../game/types";

export const imageOptimizationChallenges: BaseChallenge[] = [
  {
    id: "io-001",
    category: "image-optimization",
    difficulty: "easy",
    title: "Base image tag strategies",
    prompt: "Which base image choice is more reproducible?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:latest

WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "server.js"]`,

      right: `FROM node:20.11-alpine

WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "server.js"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "Pinning a specific tag like `node:20.11-alpine` ensures reproducible builds. The `-alpine` variant is significantly smaller (around 50 MB vs 1 GB for the full image). Your builds produce the same result regardless of when they run.",
    explanationWrong:
      "`latest` is a moving target. Your build could break tomorrow when a new major version is released. The full image includes compilers, documentation, and tools you don't need at runtime, bloating the image to over 1 GB.",
    sourceUrl:
      "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#from",
    sourceLabel: "Docker docs: FROM",
  },
  {
    id: "io-002",
    category: "image-optimization",
    difficulty: "medium",
    title: "Multi-stage builds",
    prompt: "Which Dockerfile produces a leaner image?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Build tools still in final image
CMD ["node", "dist/server.js"]`,

      right: `FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/server.js"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "Multi-stage builds separate the build environment from the runtime environment. The final image only contains production dependencies and compiled output, resulting in a much smaller and more secure image. Build tools, source code, and dev dependencies are left behind.",
    explanationWrong:
      "A single-stage build includes everything: source code, build tools, dev dependencies, and compiled output. This inflates the image size and increases the attack surface. There's no reason to ship TypeScript, webpack, or test frameworks to production.",
    sourceUrl: "https://docs.docker.com/build/building/multi-stage/",
    sourceLabel: "Docker docs: Multi-stage builds",
  },
  {
    id: "io-003",
    category: "image-optimization",
    difficulty: "easy",
    title: "Copy package files first for caching",
    prompt: "Which COPY order caches dependencies better?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine
WORKDIR /app

# Copy everything, then install
COPY . .
RUN npm ci
RUN npm run build

CMD ["node", "dist/server.js"]`,

      right: `FROM node:20-alpine
WORKDIR /app

# Copy dependency files first
COPY package.json package-lock.json ./
RUN npm ci

# Then copy source code
COPY . .
RUN npm run build

CMD ["node", "dist/server.js"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "Copying `package.json` and `package-lock.json` before the rest of the source code means Docker can cache the `npm ci` layer. When you change application code but not dependencies, Docker reuses the cached layer and skips the slow install step.",
    explanationWrong:
      "Copying everything first means any source code change invalidates the layer cache for `npm ci`. Docker rebuilds dependencies from scratch on every code change, even if `package.json` hasn't changed. This makes builds unnecessarily slow.",
    sourceUrl: "https://docs.docker.com/build/cache/",
    sourceLabel: "Docker docs: Build cache",
  },
  {
    id: "io-004",
    category: "image-optimization",
    difficulty: "medium",
    title: "Build context with .dockerignore",
    prompt: "Which setup keeps the build context small?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `# No .dockerignore file
# Build context includes everything:
# node_modules/    (500 MB)
# .git/            (200 MB)
# .env             (secrets!)
# dist/            (stale build)
# coverage/        (test reports)
# *.log            (debug logs)

FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci`,

      right: `# .dockerignore
node_modules
.git
.env
.env.*
dist
coverage
*.log
.DS_Store
Dockerfile
docker-compose.yml

FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci`,
    },

    correctSide: "right",
    explanationCorrect:
      "A `.dockerignore` file excludes files from the build context. This speeds up builds (smaller context to send to the daemon), prevents secrets from leaking into images, and avoids overwriting installed dependencies with stale local `node_modules`.",
    explanationWrong:
      "Without `.dockerignore`, `COPY . .` sends everything to the Docker daemon, including `node_modules` (overwriting the clean install), `.git` (adding hundreds of MB), and `.env` files (leaking secrets into the image layer history).",
    sourceUrl:
      "https://docs.docker.com/build/concepts/context/#dockerignore-files",
    sourceLabel: "Docker docs: .dockerignore",
  },
  {
    id: "io-005",
    category: "image-optimization",
    difficulty: "hard",
    title: "Distroless runtime images",
    prompt: "Which runtime image has a smaller attack surface?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Alpine still has shell, package manager
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]`,

      right: `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Distroless: no shell, no package manager
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["dist/server.js"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "Distroless images contain only the runtime and your application. No shell, no package manager, no unnecessary utilities. This drastically reduces the attack surface and image size. If an attacker exploits your app, they can't spawn a shell.",
    explanationWrong:
      "Alpine is already slim, but it still includes `sh`, `apk`, and other utilities. An attacker who gains code execution can install tools, explore the filesystem, and pivot to other systems. For production workloads, the smaller attack surface of distroless is preferred.",
    sourceUrl: "https://github.com/GoogleContainerTools/distroless",
    sourceLabel: "GitHub: Distroless",
  },
];
