import type { BaseChallenge } from "../../game/types";

export const securityChallenges: BaseChallenge[] = [
  {
    id: "sc-001",
    category: "security",
    difficulty: "easy",
    title: "Container user privileges",
    prompt: "Which container has least-privilege access?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci

# Runs as root by default
CMD ["node", "server.js"]`,

      right: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci

# Create and switch to non-root user
RUN addgroup -S appgroup && \\
    adduser -S appuser -G appgroup
USER appuser

CMD ["node", "server.js"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "Running as a non-root user limits what an attacker can do if they exploit a vulnerability. The `appuser` cannot install packages, modify system files, or access other users' data. This is a fundamental container security practice.",
    explanationWrong:
      "Containers run as root by default. If an attacker gains code execution, they have root access inside the container. Combined with misconfigurations (privileged mode, host mounts), this can lead to container escape and host compromise.",
    sourceUrl: "https://docs.docker.com/reference/dockerfile/#user",
    sourceLabel: "Docker docs: USER",
  },
  {
    id: "sc-002",
    category: "security",
    difficulty: "easy",
    title: "Secret management in Dockerfiles",
    prompt: "Which Dockerfile keeps secrets out of layers?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine
WORKDIR /app
COPY . .

# Secret baked into image layer
ENV DATABASE_URL="postgres://admin:s3cret@db:5432/app"
ENV API_KEY="sk-live-abc123def456"

RUN npm ci
CMD ["node", "server.js"]`,

      right: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci

# Secrets injected at runtime
# via docker run --env-file
# or Kubernetes secrets
CMD ["node", "server.js"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "Secrets should be injected at runtime via environment variables, Docker secrets, or Kubernetes Secrets. This keeps credentials out of image layers, version control, and container registries. Anyone with access to the image can extract baked-in secrets.",
    explanationWrong:
      "`ENV` instructions are stored in the image layer history. Running `docker history` or `docker inspect` reveals every `ENV` value. Pushing this image to a registry exposes your credentials to anyone with pull access.",
    sourceUrl: "https://docs.docker.com/build/building/secrets/",
    sourceLabel: "Docker docs: Build secrets",
  },
  {
    id: "sc-003",
    category: "security",
    difficulty: "medium",
    title: "Read-only root filesystem",
    prompt: "Which filesystem setup limits attacker damage?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  app:
    image: myapp:1.0
    # Default: writable filesystem
    # Attacker can write malware`,

      right: `services:
  app:
    image: myapp:1.0
    read_only: true
    tmpfs:
      - /tmp
      - /app/cache`,
    },

    correctSide: "right",
    explanationCorrect:
      "A read-only root filesystem prevents attackers from writing scripts, downloading tools, or modifying application code inside the container. `tmpfs` mounts provide writable directories for legitimate temporary files without persisting anything to disk.",
    explanationWrong:
      "A writable filesystem lets an attacker write and execute malicious binaries, modify application code, or install backdoors. Even without root access, writing to `/tmp` or the app directory can enable further exploitation.",
    sourceUrl:
      "https://docs.docker.com/reference/compose-file/services/#read_only",
    sourceLabel: "Docker docs: read_only",
  },
  {
    id: "sc-004",
    category: "security",
    difficulty: "medium",
    title: "Kubernetes secrets as volumes",
    prompt: "Which approach protects secrets in pod specs?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
    - name: app
      image: myapp:1.0
      env:
        # Secret visible in pod spec,
        # logs, and process listing
        - name: DB_PASSWORD
          value: "s3cret-passw0rd"`,

      right: `apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
    - name: app
      image: myapp:1.0
      env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using `secretKeyRef` reads the value from a Kubernetes Secret object. The secret is stored encrypted (at rest), access is controlled by RBAC, and the plain text value doesn't appear in the pod spec or `kubectl describe` output.",
    explanationWrong:
      "Hardcoding secrets in pod specs means they appear in plain text in `kubectl get pod -o yaml`, etcd backups, audit logs, and version control. Anyone with read access to the namespace can see the credentials.",
    sourceUrl: "https://kubernetes.io/docs/concepts/configuration/secret/",
    sourceLabel: "Kubernetes docs: Secrets",
  },
  {
    id: "sc-005",
    category: "security",
    difficulty: "hard",
    title: "Linux capabilities in containers",
    prompt: "Which security context hardens the container?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
    - name: app
      image: myapp:1.0
      # Default capabilities include
      # NET_RAW, SYS_CHROOT, MKNOD...`,

      right: `apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
    - name: app
      image: myapp:1.0
      securityContext:
        runAsNonRoot: true
        readOnlyRootFilesystem: true
        allowPrivilegeEscalation: false
        capabilities:
          drop:
            - ALL`,
    },

    correctSide: "right",
    explanationCorrect:
      "Dropping all Linux capabilities removes permissions the container doesn't need, like raw network access (`NET_RAW`), filesystem mounting (`SYS_ADMIN`), and process tracing (`SYS_PTRACE`). Combined with `runAsNonRoot` and read-only filesystem, this creates a hardened container.",
    explanationWrong:
      "Default container capabilities include `NET_RAW` (ARP spoofing, network sniffing), `MKNOD` (device file creation), and others. An attacker who compromises the container can leverage these capabilities for lateral movement and privilege escalation.",
    sourceUrl:
      "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/",
    sourceLabel: "Kubernetes docs: Security context",
  },
];
