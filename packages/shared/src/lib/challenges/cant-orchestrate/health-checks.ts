import type { BaseChallenge } from "../../game/types";

export const healthChecksChallenges: BaseChallenge[] = [
  {
    id: "hc-001",
    category: "health-checks",
    difficulty: "easy",
    title: "Dockerfile HEALTHCHECK",
    prompt: "Which container monitors app health properly?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci

# No health check defined
CMD ["node", "server.js"]`,

      right: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci

HEALTHCHECK --interval=30s --timeout=3s \\
  --start-period=10s --retries=3 \\
  CMD wget --spider -q http://localhost:3000/health

CMD ["node", "server.js"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "A `HEALTHCHECK` instruction lets Docker monitor whether your application is actually working, not just whether the process is running. The `--start-period` gives the app time to boot before checks begin. Docker marks unhealthy containers so orchestrators can restart them.",
    explanationWrong:
      "Without a health check, Docker only knows if the process is running. A container can have a running process that's deadlocked, out of memory, or stuck in a crash loop. Docker will report it as healthy when it's actually broken.",
    sourceUrl: "https://docs.docker.com/reference/dockerfile/#healthcheck",
    sourceLabel: "Docker docs: HEALTHCHECK",
  },
  {
    id: "hc-002",
    category: "health-checks",
    difficulty: "medium",
    title: "Kubernetes liveness vs readiness",
    prompt: "Which probe configuration is more accurate?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: v1
kind: Pod
metadata:
  name: web
spec:
  containers:
    - name: web
      image: myapp:1.0
      # Same check for both probes
      livenessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 5
      readinessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 5`,

      right: `apiVersion: v1
kind: Pod
metadata:
  name: web
spec:
  containers:
    - name: web
      image: myapp:1.0
      # Restart if app is broken
      livenessProbe:
        httpGet:
          path: /healthz
          port: 8080
        initialDelaySeconds: 15
        periodSeconds: 20
      # Route traffic only when ready
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 5`,
    },

    correctSide: "right",
    explanationCorrect:
      "Liveness and readiness probes serve different purposes. Liveness checks if the app needs to be restarted (deadlocked, corrupted). Readiness checks if it can handle traffic (still loading data, warming caches). Using different endpoints and intervals lets each probe do its job correctly.",
    explanationWrong:
      "Using the same endpoint for both probes means you can't distinguish between 'needs restart' and 'temporarily busy'. If the health check fails during a slow startup, the liveness probe kills and restarts the pod before it finishes starting, creating a crash loop.",
    sourceUrl:
      "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/",
    sourceLabel: "Kubernetes docs: Probes",
  },
  {
    id: "hc-003",
    category: "health-checks",
    difficulty: "medium",
    title: "Startup probe for slow apps",
    prompt: "Which probe setup handles slow startups better?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: v1
kind: Pod
metadata:
  name: legacy-app
spec:
  containers:
    - name: app
      image: legacy:1.0
      livenessProbe:
        httpGet:
          path: /healthz
          port: 8080
        # Very long delay to account
        # for slow startup
        initialDelaySeconds: 120
        periodSeconds: 10`,

      right: `apiVersion: v1
kind: Pod
metadata:
  name: legacy-app
spec:
  containers:
    - name: app
      image: legacy:1.0
      startupProbe:
        httpGet:
          path: /healthz
          port: 8080
        failureThreshold: 30
        periodSeconds: 10
      livenessProbe:
        httpGet:
          path: /healthz
          port: 8080
        periodSeconds: 10`,
    },

    correctSide: "right",
    explanationCorrect:
      "A startup probe runs during initialization and disables liveness/readiness probes until it succeeds. This gives slow-starting apps up to 300 seconds (30 x 10s) to boot. Once the startup probe passes, the liveness probe takes over with normal intervals.",
    explanationWrong:
      "A long `initialDelaySeconds` on the liveness probe means the app is unmonitored for 2 minutes after every restart. If it crashes at second 30, Kubernetes won't notice until second 120. The startup probe solves this without sacrificing ongoing health monitoring.",
    sourceUrl:
      "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes",
    sourceLabel: "Kubernetes docs: Startup probes",
  },
  {
    id: "hc-004",
    category: "health-checks",
    difficulty: "hard",
    title: "Health check with dependency awareness",
    prompt: "Which health endpoint detects real failures?",
    content: {
      type: "code",

      lang: "bash",

      left: `# /health endpoint
app.get('/health', (req, res) => {
  // Always returns 200
  res.status(200).json({ status: 'ok' });
});`,

      right: `# /ready endpoint
app.get('/ready', async (req, res) => {
  try {
    await db.query('SELECT 1');
    await redis.ping();
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(503).json({
      status: 'unavailable',
      reason: err.message,
    });
  }
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "A readiness check that verifies downstream dependencies (database, cache) ensures the pod only receives traffic when it can actually serve requests. Returning 503 removes the pod from the service's endpoint list until dependencies recover.",
    explanationWrong:
      "A health check that always returns 200 tells the orchestrator everything is fine even when the database is down. Traffic gets routed to a pod that can't serve requests, causing user-facing errors that could have been avoided.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate",
    sourceLabel: "Kubernetes docs: Pod readiness",
  },
];
