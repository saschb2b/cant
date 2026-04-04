import type { BaseChallenge } from "../../game/types";

export const commonMistakesChallenges: BaseChallenge[] = [
  {
    id: "cm-001",
    category: "common-mistakes",
    difficulty: "easy",
    title: "Image tag strategies for production",
    prompt: "Which image tag strategy is safer for production?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  template:
    spec:
      containers:
        - name: web
          image: myapp:latest
          imagePullPolicy: Always`,

      right: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  template:
    spec:
      containers:
        - name: web
          image: myapp:1.2.3
          # Or use SHA:
          # image: myapp@sha256:abc123...`,
    },

    correctSide: "right",
    explanationCorrect:
      "Pinning a specific version tag (or image digest) ensures every deployment uses the exact same image. Rollbacks go to a known version. You can audit which version is running in each environment. Image digests provide cryptographic guarantees.",
    explanationWrong:
      "`latest` is a mutable tag. Different nodes might pull different versions if the tag was updated between pulls. Rollbacks deploy whatever `latest` currently points to, not the previous version. `imagePullPolicy: Always` adds latency to every pod start.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/containers/images/#image-names",
    sourceLabel: "Kubernetes docs: Image names",
  },
  {
    id: "cm-002",
    category: "common-mistakes",
    difficulty: "easy",
    title: "Container user configuration",
    prompt: "Which container runs with better security?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM python:3.12
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# Running as root (default)
CMD ["python", "app.py"]`,

      right: `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

RUN useradd --create-home appuser
USER appuser

CMD ["python", "app.py"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "Creating a dedicated user and switching with `USER` ensures the application runs with minimal privileges. If an attacker exploits a vulnerability, they can't modify system files, install packages, or access sensitive host resources.",
    explanationWrong:
      "Running as root gives the application (and any attacker who compromises it) full control over the container filesystem. With certain misconfigurations, this can escalate to host-level access. Most security scanning tools flag root containers.",
    sourceUrl:
      "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user",
    sourceLabel: "Docker docs: USER best practices",
  },
  {
    id: "cm-003",
    category: "common-mistakes",
    difficulty: "medium",
    title: "State management in containers",
    prompt: "Which approach handles container state correctly?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  app:
    build: .
    # User uploads stored in container
    # Lost on restart or scaling

  # Uploaded files at /app/uploads/
  # Session data in memory
  # Generated reports in /tmp/`,

      right: `services:
  app:
    build: .
    volumes:
      - uploads:/app/uploads
    environment:
      SESSION_STORE: redis://redis:6379
      REPORT_BUCKET: s3://reports

  redis:
    image: redis:7-alpine

volumes:
  uploads:`,
    },

    correctSide: "right",
    explanationCorrect:
      "Externalizing state to volumes, databases, and object storage lets containers be truly ephemeral. Any replica can handle any request because state lives outside the container. Scaling, restarts, and deployments don't lose data.",
    explanationWrong:
      "Storing uploads, sessions, and files inside the container means data is lost on restart. Scaling to multiple replicas means each one has different data. Users get inconsistent behavior depending on which container handles their request.",
    sourceUrl: "https://12factor.net/processes",
    sourceLabel: "Twelve-Factor App: Processes",
  },
  {
    id: "cm-004",
    category: "common-mistakes",
    difficulty: "medium",
    title: "Build context filtering",
    prompt: "Which build context setup is cleaner?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `# No .dockerignore
# Build context includes:
COPY . .

# Sends to daemon:
# node_modules/  (500 MB)
# .git/          (100 MB)
# .env           (secrets)
# build/         (stale output)
# __pycache__/   (bytecode)
# .vscode/       (editor config)`,

      right: `# .dockerignore
node_modules
.git
.env
.env.*
build
dist
__pycache__
*.pyc
.vscode
.idea
*.log
README.md
docker-compose*.yml
Dockerfile`,
    },

    correctSide: "right",
    explanationCorrect:
      "A comprehensive `.dockerignore` reduces build context size from hundreds of MB to just the files your image needs. Builds are faster, secrets don't leak into layers, and stale build artifacts don't override fresh ones inside the container.",
    explanationWrong:
      "Without `.dockerignore`, every build sends the entire project directory to the Docker daemon. This includes secrets in `.env`, hundreds of MB of `node_modules` and `.git`, and editor configs. Builds are slow and images contain unnecessary files.",
    sourceUrl:
      "https://docs.docker.com/build/concepts/context/#dockerignore-files",
    sourceLabel: "Docker docs: .dockerignore",
  },
  {
    id: "cm-005",
    category: "common-mistakes",
    difficulty: "hard",
    title: "Graceful shutdown handling",
    prompt: "Which container shuts down gracefully?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci

# npm wraps node, eats SIGTERM
CMD ["npm", "start"]`,

      right: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci

# Node receives SIGTERM directly
# and can clean up gracefully
CMD ["node", "server.js"]

# In server.js:
# process.on('SIGTERM', () => {
#   server.close(() => process.exit(0));
# });`,
    },

    correctSide: "right",
    explanationCorrect:
      "Running `node` directly as PID 1 ensures it receives SIGTERM from Docker. The app can finish in-flight requests, close database connections, and flush logs before exiting. Docker gives it 10 seconds (configurable) before sending SIGKILL.",
    explanationWrong:
      "`npm start` spawns a shell that wraps the node process. The shell receives SIGTERM but doesn't forward it to the child process. After the 10-second grace period, Docker sends SIGKILL, abruptly terminating the app mid-request.",
    sourceUrl: "https://docs.docker.com/reference/dockerfile/#cmd",
    sourceLabel: "Docker docs: CMD",
  },
];
