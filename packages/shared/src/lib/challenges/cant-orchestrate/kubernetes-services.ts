import type { BaseChallenge } from "../../game/types";

export const kubernetesServicesChallenges: BaseChallenge[] = [
  {
    id: "ks-001",
    category: "kubernetes-services",
    difficulty: "easy",
    title: "ClusterIP for internal services",
    prompt: "Which service type fits an internal backend?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  type: NodePort
  selector:
    app: backend
  ports:
    - port: 8080
      targetPort: 8080
      # Exposed on every node
      nodePort: 30080`,

      right: `apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
    - port: 8080
      targetPort: 8080`,
    },

    correctSide: "right",
    explanationCorrect:
      "`ClusterIP` makes the service reachable only within the cluster. Internal services like backends, databases, and caches should never be exposed externally. Other pods reach it via `backend:8080` or `backend.namespace.svc.cluster.local`.",
    explanationWrong:
      "`NodePort` exposes the service on a high port on every node in the cluster. An internal backend API becomes accessible from outside the cluster, increasing the attack surface. NodePort should only be used when you explicitly need external access.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/services-networking/service/#type-clusterip",
    sourceLabel: "Kubernetes docs: ClusterIP",
  },
  {
    id: "ks-002",
    category: "kubernetes-services",
    difficulty: "medium",
    title: "Ingress for HTTP routing",
    prompt: "Which approach routes HTTP traffic more efficiently?",
    content: {
      type: "code",

      lang: "yaml",

      left: `# One LoadBalancer per service
apiVersion: v1
kind: Service
metadata:
  name: app-a
spec:
  type: LoadBalancer
  selector:
    app: app-a
  ports:
    - port: 80
---
apiVersion: v1
kind: Service
metadata:
  name: app-b
spec:
  type: LoadBalancer
  selector:
    app: app-b
  ports:
    - port: 80`,

      right: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: apps
spec:
  rules:
    - host: a.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: app-a
                port:
                  number: 80
    - host: b.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: app-b
                port:
                  number: 80`,
    },

    correctSide: "right",
    explanationCorrect:
      "An Ingress resource routes traffic from a single load balancer to multiple services based on hostname or path. This is cheaper (one LB instead of many), supports TLS termination, and centralizes routing rules in a declarative configuration.",
    explanationWrong:
      "Each `LoadBalancer` service provisions a separate cloud load balancer, which costs money and adds complexity. With many services, you end up with dozens of external IPs to manage, separate TLS certificates, and no centralized routing.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/services-networking/ingress/",
    sourceLabel: "Kubernetes docs: Ingress",
  },
  {
    id: "ks-003",
    category: "kubernetes-services",
    difficulty: "medium",
    title: "Label selectors for routing",
    prompt: "Which selector targets the right pods?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    # Too generic, matches unintended pods
    app: web
  ports:
    - port: 80`,

      right: `apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
    component: frontend
    version: v2
  ports:
    - port: 80`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using multiple labels in the selector ensures the Service only routes traffic to the exact Pods you intend. Labels like `component` and `version` prevent accidental routing to backend Pods or old versions that happen to share the `app: web` label.",
    explanationWrong:
      "A single label selector like `app: web` might match Pods from different components, canary deployments, or batch jobs that share the same label. Traffic gets routed to unexpected destinations, causing errors or security issues.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/",
    sourceLabel: "Kubernetes docs: Labels and selectors",
  },
  {
    id: "ks-004",
    category: "kubernetes-services",
    difficulty: "hard",
    title: "Headless service for StatefulSets",
    prompt: "Which service gives stable per-pod DNS names?",
    content: {
      type: "code",

      lang: "yaml",

      left: `apiVersion: v1
kind: Service
metadata:
  name: db
spec:
  # Regular ClusterIP
  # No stable per-pod DNS
  selector:
    app: db
  ports:
    - port: 5432`,

      right: `apiVersion: v1
kind: Service
metadata:
  name: db
spec:
  clusterIP: None
  selector:
    app: db
  ports:
    - port: 5432
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db
spec:
  serviceName: db
  replicas: 3
  selector:
    matchLabels:
      app: db
  template:
    spec:
      containers:
        - name: postgres
          image: postgres:16`,
    },

    correctSide: "right",
    explanationCorrect:
      "A headless service (`clusterIP: None`) gives each StatefulSet Pod a stable DNS name like `db-0.db.namespace.svc.cluster.local`. This is essential for stateful workloads (databases, message brokers) where clients need to connect to specific instances.",
    explanationWrong:
      "A regular ClusterIP service load-balances across all Pods randomly. For databases, this means reads and writes hit different replicas unpredictably. You can't target the primary for writes or a specific replica for read queries.",
    sourceUrl:
      "https://kubernetes.io/docs/concepts/services-networking/service/#headless-services",
    sourceLabel: "Kubernetes docs: Headless services",
  },
];
