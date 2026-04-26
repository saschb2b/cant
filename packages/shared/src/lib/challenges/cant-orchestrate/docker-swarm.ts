import type { BaseChallenge } from "../../game/types";

export const dockerSwarmChallenges: BaseChallenge[] = [
  {
    id: "sw-001",
    category: "docker-swarm",
    difficulty: "easy",
    title: "Services vs standalone containers",
    prompt: "Which approach manages replicas better?",
    content: {
      type: "code",

      lang: "bash",

      left: `# Running containers directly
docker run -d --name web-1 myapp:1.0
docker run -d --name web-2 myapp:1.0
docker run -d --name web-3 myapp:1.0

# Manual management needed
# No auto-restart on failure
# No load balancing`,

      right: `# Initialize swarm (once)
docker swarm init

# Create a service with replicas
docker service create \\
  --name web \\
  --replicas 3 \\
  --publish 80:8080 \\
  myapp:1.0

# Swarm handles scheduling,
# load balancing, and restarts`,
    },

    correctSide: "right",
    explanationCorrect:
      "Swarm services automatically schedule replicas across nodes, restart failed containers, and load-balance incoming traffic. Scaling is a single command: `docker service scale web=5`. The desired state is maintained automatically.",
    explanationWrong:
      "Running standalone containers requires manual placement, manual restart on failure, and external load balancing. Scaling means manually running more containers and updating the load balancer. There's no built-in health monitoring or self-healing.",
    sourceUrl:
      "https://docs.docker.com/engine/swarm/how-swarm-mode-works/services/",
    sourceLabel: "Docker docs: Swarm services",
  },
  {
    id: "sw-002",
    category: "docker-swarm",
    difficulty: "medium",
    title: "Swarm secrets for credentials",
    prompt: "Which credential management is more secure?",
    content: {
      type: "code",

      lang: "yaml",

      left: `# docker-compose.yml for swarm
services:
  db:
    image: postgres:16
    environment:
      # Plain text in stack file
      POSTGRES_PASSWORD: "s3cret"

  app:
    image: myapp:1.0
    environment:
      DB_PASSWORD: "s3cret"`,

      right: `# Create secret first:
# echo "s3cret" | docker secret create db_password -

services:
  db:
    image: postgres:16
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

  app:
    image: myapp:1.0
    secrets:
      - db_password

secrets:
  db_password:
    external: true`,
    },

    correctSide: "right",
    explanationCorrect:
      "Docker secrets are encrypted at rest in the Swarm Raft log and only mounted into containers that need them as in-memory files at `/run/secrets/`. They never appear in environment variables, docker inspect, or stack definitions.",
    explanationWrong:
      "Environment variables are visible in `docker inspect`, process listings (`/proc/*/environ`), and the stack file. Anyone with access to the Docker API or the host filesystem can read the plain text password.",
    sourceUrl: "https://docs.docker.com/engine/swarm/secrets/",
    sourceLabel: "Docker docs: Swarm secrets",
  },
  {
    id: "sw-003",
    category: "docker-swarm",
    difficulty: "medium",
    title: "Rolling updates in Swarm",
    prompt: "Which update strategy minimizes downtime?",
    content: {
      type: "code",

      lang: "bash",

      left: `docker service update \\
  --image myapp:2.0 \\
  web

# Default: updates all tasks at once
# No health check verification
# No automatic rollback`,

      right: `docker service update \\
  --image myapp:2.0 \\
  --update-parallelism 1 \\
  --update-delay 10s \\
  --update-failure-action rollback \\
  --update-order start-first \\
  web`,
    },

    correctSide: "right",
    explanationCorrect:
      "`--update-parallelism 1` updates one task at a time. `--update-delay 10s` waits between updates. `--update-order start-first` starts the new task before stopping the old one (zero downtime). `--update-failure-action rollback` automatically reverts on failure.",
    explanationWrong:
      "Default update settings replace all tasks simultaneously, causing downtime. Without a failure action, a bad image leaves the service broken. Without `start-first`, each task has a brief period of unavailability during the swap.",
    sourceUrl:
      "https://docs.docker.com/engine/swarm/swarm-tutorial/rolling-update/",
    sourceLabel: "Docker docs: Rolling updates",
  },
  {
    id: "sw-004",
    category: "docker-swarm",
    difficulty: "hard",
    title: "Placement constraints for scheduling",
    prompt: "Which scheduling approach places workloads wisely?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  db:
    image: postgres:16
    deploy:
      replicas: 1
      # No constraint
      # DB could land on any node
      # including workers with no SSD`,

      right: `services:
  db:
    image: postgres:16
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
          - node.labels.storage == ssd
        preferences:
          - spread: datacenter`,
    },

    correctSide: "right",
    explanationCorrect:
      "Placement constraints ensure workloads run on appropriate nodes. A database needs SSD storage and stable nodes (managers). Spread preferences distribute replicas across datacenters for high availability. This gives you predictable, hardware-aware scheduling.",
    explanationWrong:
      "Without constraints, the scheduler places the database on any available node, potentially one with slow storage, insufficient memory, or in the same datacenter as all other replicas. A single node or datacenter failure could take down the database.",
    sourceUrl:
      "https://docs.docker.com/engine/swarm/services/#placement-constraints",
    sourceLabel: "Docker docs: Placement constraints",
  },
];
