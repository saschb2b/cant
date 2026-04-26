import type { BaseChallenge } from "../../game/types";

export const kubernetesPodsChallenges: BaseChallenge[] = [
  {
    id: "kp-001",
    category: "kubernetes-pods",
    difficulty: "easy",
    title: "Deployment vs bare Pod",
    prompt: "Which way of running pods is more resilient?",
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
      ports:
        - containerPort: 8080`,

      right: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
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
          ports:
            - containerPort: 8080`,
    },

    correctSide: "right",
    explanationCorrect:
      "Deployments manage Pod replicas, rolling updates, and rollbacks. If a Pod crashes, the Deployment controller creates a replacement. Scaling is a single field change. This is the standard way to run stateless workloads in Kubernetes.",
    explanationWrong:
      "A bare Pod is not managed by any controller. If it crashes or its node goes down, nothing recreates it. You can't scale it, roll back a bad deploy, or do zero-downtime updates. Bare Pods should only be used for one-off debugging.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
    sourceLabel: "Kubernetes docs: Deployment",
  },
  {
    id: "kp-002",
    category: "kubernetes-pods",
    difficulty: "easy",
    title: "Resource requests and limits",
    prompt: "Which pod spec manages resources properly?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
        - name: web
          image: myapp:1.0
          # No resource constraints`,

      right: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
        - name: web
          image: myapp:1.0
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"`,
    },

    correctSide: "right",
    explanationCorrect:
      "Resource requests guarantee minimum resources for scheduling. Limits cap maximum usage to prevent runaway containers from starving others. The scheduler uses requests to place Pods on nodes with enough capacity, ensuring stable performance.",
    explanationWrong:
      "Without resource constraints, a single container can consume all available CPU and memory on a node, causing other Pods to be evicted or throttled. The scheduler can't make informed placement decisions, leading to overloaded nodes.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    sourceLabel: "Kubernetes docs: Resource management",
  },
  {
    id: "kp-003",
    category: "kubernetes-pods",
    difficulty: "medium",
    title: "Rolling update strategy",
    prompt: "Which deployment strategy avoids downtime?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 4
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
        - name: web
          image: myapp:2.0`,

      right: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
        - name: web
          image: myapp:2.0`,
    },

    correctSide: "right",
    explanationCorrect:
      "`RollingUpdate` with `maxUnavailable: 0` ensures all existing Pods keep running while new ones start. `maxSurge: 1` creates one extra Pod at a time. This gives you zero-downtime deployments. If the new version fails health checks, the rollout pauses automatically.",
    explanationWrong:
      "`Recreate` kills all existing Pods before creating new ones. This causes downtime equal to the startup time of the new Pods. If the new version has a bug, you have zero running Pods until you roll back. This is only appropriate for workloads that can't run two versions simultaneously.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy",
    sourceLabel: "Kubernetes docs: Deployment strategy",
  },
  {
    id: "kp-004",
    category: "kubernetes-pods",
    difficulty: "hard",
    title: "Pod disruption budgets",
    prompt: "Which setup protects availability during drains?",
    content: {
      type: "code",

      lang: "yaml",

      left: `# No PDB defined
# During node drain, all pods
# can be evicted simultaneously

apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
        - name: web
          image: myapp:1.0`,

      right: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: web-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: web
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
        - name: web
          image: myapp:1.0`,
    },

    correctSide: "right",
    explanationCorrect:
      "A PodDisruptionBudget guarantees that at least 2 Pods remain available during voluntary disruptions like node upgrades, cluster autoscaling, or `kubectl drain`. The API server blocks eviction requests that would violate the budget.",
    explanationWrong:
      "Without a PDB, `kubectl drain` or a cluster autoscaler can evict all Pods simultaneously during node maintenance. This causes a complete outage even though you have 3 replicas, defeating the purpose of running multiple instances.",
    sourceUrl:
      "https://kubernetes.io/docs/tasks/run-application/configure-pdb/",
    sourceLabel: "Kubernetes docs: PDB",
  },
];
