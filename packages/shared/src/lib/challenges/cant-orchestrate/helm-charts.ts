import type { BaseChallenge } from "../../game/types";

export const helmChartsChallenges: BaseChallenge[] = [
  {
    id: "hm-001",
    category: "helm-charts",
    difficulty: "easy",
    title: "Values over hardcoded manifests",
    prompt: "Which Helm template is more reusable?",
    content: {
      type: "code",

      lang: "yaml",

      left: `# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: web
          image: myapp:1.2.3
          resources:
            limits:
              memory: 256Mi`,

      right: `# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-web
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: web
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Templating with `{{ .Values.* }}` lets you customize deployments per environment by overriding `values.yaml`. The same chart works for dev, staging, and production. `{{ .Release.Name }}` prevents name collisions when installing multiple releases.",
    explanationWrong:
      "Hardcoded values in templates defeat the purpose of Helm. You can't install the same chart with different configurations without editing the template files. Every environment needs its own copy of the manifests, creating maintenance burden and drift.",
    sourceUrl: "https://helm.sh/docs/chart_template_guide/values_files/",
    sourceLabel: "Helm docs: Values files",
  },
  {
    id: "hm-002",
    category: "helm-charts",
    difficulty: "medium",
    title: "Named templates for reuse",
    prompt: "Which label management avoids duplication?",
    content: {
      type: "code",

      lang: "yaml",

      left: `# templates/deployment.yaml
metadata:
  labels:
    app.kubernetes.io/name: myapp
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    app.kubernetes.io/managed-by: {{ .Release.Service }}

# templates/service.yaml
metadata:
  labels:
    app.kubernetes.io/name: myapp
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    app.kubernetes.io/managed-by: {{ .Release.Service }}`,

      right: `# templates/_helpers.tpl
{{- define "myapp.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

# templates/deployment.yaml
metadata:
  labels:
    {{- include "myapp.labels" . | nindent 4 }}

# templates/service.yaml
metadata:
  labels:
    {{- include "myapp.labels" . | nindent 4 }}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Named templates in `_helpers.tpl` define reusable snippets like standard labels and selectors. Changing the label scheme requires editing one place. The `include` function inserts the template and `nindent` handles YAML indentation correctly.",
    explanationWrong:
      "Duplicating labels across every template file means updating them in multiple places when the label scheme changes. It's easy to miss a file, leading to inconsistent labels that break label selectors and monitoring queries.",
    sourceUrl: "https://helm.sh/docs/chart_template_guide/named_templates/",
    sourceLabel: "Helm docs: Named templates",
  },
  {
    id: "hm-003",
    category: "helm-charts",
    difficulty: "medium",
    title: "Chart hooks for migrations",
    prompt: "Which migration strategy runs at the right time?",
    content: {
      type: "code",

      lang: "yaml",

      left: `# Run migration in init container
# Runs on EVERY pod restart
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      initContainers:
        - name: migrate
          image: myapp:1.0
          command: ["./migrate", "up"]
      containers:
        - name: web
          image: myapp:1.0`,

      right: `# Run migration once per upgrade
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ .Release.Name }}-migrate
  annotations:
    "helm.sh/hook": pre-upgrade
    "helm.sh/hook-weight": "-1"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migrate
          image: myapp:1.0
          command: ["./migrate", "up"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "Helm hooks run Jobs at specific lifecycle points. `pre-upgrade` runs the migration once before new Pods start. `hook-delete-policy: hook-succeeded` cleans up the Job after success. The migration runs exactly once per upgrade, not per Pod restart.",
    explanationWrong:
      "Init containers run every time a Pod starts or restarts. With 3 replicas, the migration runs 3 times concurrently, which can cause race conditions or lock contention. Pod restarts (OOMKill, node drain) trigger unnecessary migration attempts.",
    sourceUrl: "https://helm.sh/docs/topics/charts_hooks/",
    sourceLabel: "Helm docs: Chart hooks",
  },
  {
    id: "hm-004",
    category: "helm-charts",
    difficulty: "hard",
    title: "Conditional resources with if/else",
    prompt: "Which chart adapts to different environments?",
    content: {
      type: "code",

      lang: "yaml",

      left: `# Always creates Ingress and HPA
# even when not needed

# templates/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Release.Name }}
spec:
  rules:
    - host: {{ .Values.host }}

# templates/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ .Release.Name }}`,

      right: `# templates/ingress.yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Release.Name }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  rules:
    - host: {{ .Values.ingress.host }}
{{- end }}

# templates/hpa.yaml
{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ .Release.Name }}
{{- end }}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Wrapping resources in `{{- if .Values.*.enabled }}` makes them optional. Dev environments can disable Ingress and autoscaling while production enables them. The chart adapts to each environment without maintaining separate templates.",
    explanationWrong:
      "Always creating every resource means dev environments get unnecessary Ingress controllers and HPAs. It also means you can't install the chart in a cluster that lacks an Ingress controller or metrics server without errors.",
    sourceUrl: "https://helm.sh/docs/chart_template_guide/control_structures/",
    sourceLabel: "Helm docs: Control structures",
  },
];
