import type { BaseChallenge } from "../../game/types";

export const kubernetesConfigChallenges: BaseChallenge[] = [
  {
    id: "kc-001",
    category: "kubernetes-config",
    difficulty: "easy",
    title: "ConfigMap for non-secret config",
    prompt: "Which config approach is easier to manage?",
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
        - name: LOG_LEVEL
          value: "info"
        - name: MAX_RETRIES
          value: "3"
        - name: CACHE_TTL
          value: "300"`,

      right: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: "info"
  MAX_RETRIES: "3"
  CACHE_TTL: "300"
---
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
    - name: app
      image: myapp:1.0
      envFrom:
        - configMapRef:
            name: app-config`,
    },

    correctSide: "right",
    explanationCorrect:
      "ConfigMaps separate configuration from Pod specs. Using `envFrom` injects all keys as environment variables automatically. You can update the ConfigMap independently, share it across Deployments, and manage it with GitOps tools.",
    explanationWrong:
      "Hardcoding environment variables in the Pod spec means every config change requires editing the Deployment and triggering a rollout. Shared config must be duplicated across every Deployment that needs it, leading to drift.",
    sourceUrl: "https://kubernetes.io/docs/concepts/configuration/configmap/",
    sourceLabel: "Kubernetes docs: ConfigMap",
  },
  {
    id: "kc-002",
    category: "kubernetes-config",
    difficulty: "medium",
    title: "Resource quotas per namespace",
    prompt: "Which namespace setup prevents resource abuse?",
    content: {
      type: "code",

      lang: "yaml",

      left: `# No quotas on namespace
# Any deployment can claim
# unlimited resources

apiVersion: v1
kind: Namespace
metadata:
  name: dev-team`,

      right: `apiVersion: v1
kind: Namespace
metadata:
  name: dev-team
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-quota
  namespace: dev-team
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "20"`,
    },

    correctSide: "right",
    explanationCorrect:
      "ResourceQuotas cap the total resources a namespace can consume. This prevents one team from monopolizing cluster capacity. It also forces developers to set resource requests/limits on their Pods, since Pods without them are rejected.",
    explanationWrong:
      "Without quotas, a runaway deployment or a developer testing with 100 replicas can exhaust cluster resources. Other teams' workloads get evicted or can't schedule. Quotas are essential in multi-tenant clusters.",
    sourceUrl: "https://kubernetes.io/docs/concepts/policy/resource-quotas/",
    sourceLabel: "Kubernetes docs: Resource quotas",
  },
  {
    id: "kc-003",
    category: "kubernetes-config",
    difficulty: "medium",
    title: "Immutable ConfigMaps and Secrets",
    prompt: "Which ConfigMap is safer against accidental edits?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: v1
kind: ConfigMap
metadata:
  name: feature-flags
data:
  ENABLE_BETA: "true"
  MAX_UPLOAD_SIZE: "10mb"
  # Mutable: any kubectl edit
  # takes effect cluster-wide`,

      right: `apiVersion: v1
kind: ConfigMap
metadata:
  name: feature-flags-v2
immutable: true
data:
  ENABLE_BETA: "true"
  MAX_UPLOAD_SIZE: "10mb"
  # Immutable: changes require
  # a new ConfigMap + rollout`,
    },

    correctSide: "right",
    explanationCorrect:
      "Immutable ConfigMaps cannot be changed after creation. This prevents accidental edits that propagate to all consuming Pods. Changes require creating a new ConfigMap and updating Deployments, giving you a clear audit trail and the ability to roll back.",
    explanationWrong:
      "A mutable ConfigMap can be edited by anyone with access. Changes propagate to Pods automatically (when mounted as volumes), potentially breaking running applications. There's no audit trail of what changed and no easy rollback path.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/configuration/configmap/#configmap-immutable",
    sourceLabel: "Kubernetes docs: Immutable ConfigMaps",
  },
  {
    id: "kc-004",
    category: "kubernetes-config",
    difficulty: "hard",
    title: "Pod topology spread constraints",
    prompt: "Which deployment spreads pods more evenly?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 6
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: myapp:1.0
      # No topology constraints
      # All pods might land on one node`,

      right: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 6
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app: web
      containers:
        - name: web
          image: myapp:1.0`,
    },

    correctSide: "right",
    explanationCorrect:
      "Topology spread constraints distribute Pods evenly across nodes (or zones). `maxSkew: 1` ensures the difference in Pod count between any two nodes is at most 1. If a node goes down, only a fraction of your capacity is lost.",
    explanationWrong:
      "Without topology constraints, the scheduler might place all 6 Pods on a single node for efficiency. If that node fails, you lose 100% of capacity. Even with multiple replicas, you have a single point of failure at the node level.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/",
    sourceLabel: "Kubernetes docs: Topology spread",
  },
];
