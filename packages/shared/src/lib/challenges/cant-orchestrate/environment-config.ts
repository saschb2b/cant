import type { BaseChallenge } from "../../game/types";

export const environmentConfigChallenges: BaseChallenge[] = [
  {
    id: "ec-001",
    category: "environment-config",
    difficulty: "easy",
    title: "Environment variable management in Compose",
    prompt: "Which way of managing env vars scales better?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  app:
    build: .
    environment:
      NODE_ENV: production
      DB_HOST: db
      DB_PORT: "5432"
      DB_USER: admin
      DB_PASSWORD: changeme
      DB_NAME: myapp
      REDIS_URL: redis://cache:6379`,

      right: `services:
  app:
    build: .
    env_file:
      - .env
    environment:
      # Only overrides go here
      NODE_ENV: production`,
    },

    correctSide: "right",
    explanationCorrect:
      "An `env_file` keeps environment variables in a separate `.env` file that can be git-ignored, swapped per environment, and shared between services. Only environment-specific overrides belong in the Compose file itself.",
    explanationWrong:
      "Inlining all environment variables in the Compose file makes it hard to manage per-environment differences. Secrets end up in version control, and changing a single value requires editing the Compose file. The file grows unwieldy as services multiply.",
    sourceUrl:
      "https://docs.docker.com/reference/compose-file/services/#env_file",
    sourceLabel: "Docker docs: env_file",
  },
  {
    id: "ec-002",
    category: "environment-config",
    difficulty: "medium",
    title: "Kubernetes ConfigMap from file",
    prompt: "Which ConfigMap approach is easier to maintain?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  # Entire config inlined in YAML
  # Hard to maintain and validate
  nginx.conf: |
    server {
      listen 80;
      server_name localhost;
      location / {
        proxy_pass http://backend:8080;
      }
    }`,

      right: `# Create from file:
# kubectl create configmap app-config \\
#   --from-file=nginx.conf

apiVersion: v1
kind: Pod
metadata:
  name: web
spec:
  containers:
    - name: nginx
      image: nginx:alpine
      volumeMounts:
        - name: config
          mountPath: /etc/nginx/conf.d
  volumes:
    - name: config
      configMap:
        name: app-config`,
    },

    correctSide: "right",
    explanationCorrect:
      "Creating ConfigMaps from files (`--from-file`) keeps configuration in its native format where it can be linted, tested, and version-controlled independently. Mounting as a volume lets you update the config without rebuilding the image.",
    explanationWrong:
      "Inlining configuration as a YAML string loses syntax highlighting, editor support, and the ability to validate the config independently. Indentation errors in the embedded string are hard to spot and can break the application.",
    sourceUrl: "https://kubernetes.io/docs/concepts/configuration/configmap/",
    sourceLabel: "Kubernetes docs: ConfigMap",
  },
  {
    id: "ec-003",
    category: "environment-config",
    difficulty: "medium",
    title: "ARG vs ENV in Dockerfiles",
    prompt: "Which approach keeps build-time secrets safe?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine

# Available at runtime, visible in image
ENV NPM_TOKEN=abc123

WORKDIR /app
COPY . .
RUN echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc && \\
    npm ci
# .npmrc with token persists in image

CMD ["node", "server.js"]`,

      right: `FROM node:20-alpine

# Only available during build
ARG NPM_TOKEN

WORKDIR /app
COPY . .
RUN echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc && \\
    npm ci && \\
    rm -f .npmrc

CMD ["node", "server.js"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "`ARG` values are only available during build and don't persist in the final image metadata (though they remain in layer history). Removing `.npmrc` in the same `RUN` layer ensures the token isn't stored in any layer. Pass with `--build-arg NPM_TOKEN=...`.",
    explanationWrong:
      "`ENV` persists in the image and is visible via `docker inspect`. The token is baked into the image and accessible to anyone who pulls it. The `.npmrc` file also persists in the layer, creating two paths to credential exposure.",
    sourceUrl: "https://docs.docker.com/reference/dockerfile/#arg",
    sourceLabel: "Docker docs: ARG",
  },
  {
    id: "ec-004",
    category: "environment-config",
    difficulty: "hard",
    title: "Variable substitution in Compose",
    prompt: "Which Compose file works across environments?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  app:
    image: myapp:latest
    ports:
      - "3000:3000"

  app-staging:
    image: myapp:latest
    ports:
      - "3001:3000"
    environment:
      NODE_ENV: staging

  app-prod:
    image: myapp:latest
    ports:
      - "80:3000"
    environment:
      NODE_ENV: production`,

      right: `# docker-compose.yml
services:
  app:
    image: myapp:\${APP_TAG:-latest}
    ports:
      - "\${APP_PORT:-3000}:3000"
    environment:
      NODE_ENV: \${NODE_ENV:-development}

# .env.staging
# APP_TAG=v2.1.0
# APP_PORT=3001
# NODE_ENV=staging`,
    },

    correctSide: "right",
    explanationCorrect:
      "Variable substitution with `${VAR:-default}` lets a single Compose file work across environments. Each environment provides its own `.env` file or exports variables. The `:-` syntax provides sensible defaults for local development.",
    explanationWrong:
      "Duplicating service definitions per environment leads to drift, maintenance burden, and copy-paste errors. Any change to the service configuration must be replicated across all variants. Environment-specific values should be external, not structural.",
    sourceUrl: "https://docs.docker.com/reference/compose-file/interpolation/",
    sourceLabel: "Docker docs: Interpolation",
  },
];
