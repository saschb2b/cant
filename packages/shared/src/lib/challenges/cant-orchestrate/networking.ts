import type { BaseChallenge } from "../../game/types";

export const networkingChallenges: BaseChallenge[] = [
  {
    id: "nw-001",
    category: "networking",
    difficulty: "easy",
    title: "Container DNS resolution",
    prompt: "Which service hostname approach is more reliable?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  app:
    build: .
    environment:
      # Hardcoded IP, will break
      DB_HOST: "172.18.0.3"

  db:
    image: postgres:16`,

      right: `services:
  app:
    build: .
    environment:
      # Docker DNS resolves service names
      DB_HOST: "db"

  db:
    image: postgres:16`,
    },

    correctSide: "right",
    explanationCorrect:
      "Docker Compose creates a DNS entry for each service name. Using `db` as the hostname lets Docker resolve it to the correct container IP automatically. This works even when containers are recreated and get new IPs.",
    explanationWrong:
      "Container IPs are assigned dynamically and change on every restart or recreation. Hardcoding an IP address means your app breaks as soon as the container gets a different IP, which happens frequently during development.",
    sourceUrl: "https://docs.docker.com/engine/network/#dns-services",
    sourceLabel: "Docker docs: DNS services",
  },
  {
    id: "nw-002",
    category: "networking",
    difficulty: "easy",
    title: "Bind to specific interface",
    prompt: "Which port binding is safer for development?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  db:
    image: postgres:16
    ports:
      # Exposed on all interfaces
      - "5432:5432"`,

      right: `services:
  db:
    image: postgres:16
    ports:
      # Only accessible from localhost
      - "127.0.0.1:5432:5432"`,
    },

    correctSide: "right",
    explanationCorrect:
      "Binding to `127.0.0.1` restricts the port to the host's loopback interface. The database is accessible from the host machine for development but not from the network. This prevents accidental exposure of development databases.",
    explanationWrong:
      "Omitting the bind address exposes the port on `0.0.0.0`, which means every network interface. Your development database becomes accessible to anyone on the same network, including Wi-Fi networks at coffee shops or coworking spaces.",
    sourceUrl: "https://docs.docker.com/engine/network/#published-ports",
    sourceLabel: "Docker docs: Published ports",
  },
  {
    id: "nw-003",
    category: "networking",
    difficulty: "medium",
    title: "Expose vs ports",
    prompt: "Which config limits unnecessary port exposure?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  backend:
    build: .
    # Published to host, but only
    # other containers need access
    ports:
      - "8080:8080"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"`,

      right: `services:
  backend:
    build: .
    # Only visible to other containers
    expose:
      - "8080"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"`,
    },

    correctSide: "right",
    explanationCorrect:
      "`expose` documents that a service listens on a port and makes it reachable from other containers on the same network, without publishing it to the host. Only the frontend needs a host-published port since it's the entry point for users.",
    explanationWrong:
      "Publishing the backend port to the host lets users bypass the frontend and hit the API directly. This increases the attack surface unnecessarily. Internal services should only be reachable from other containers, not from the host network.",
    sourceUrl:
      "https://docs.docker.com/reference/compose-file/services/#expose",
    sourceLabel: "Docker docs: expose",
  },
  {
    id: "nw-004",
    category: "networking",
    difficulty: "hard",
    title: "Custom bridge network for isolation",
    prompt: "Which network setup provides better isolation?",
    content: {
      type: "code",

      lang: "bash",

      left: `# Using default bridge network
docker run -d --name app1 myapp
docker run -d --name app2 myapp

# Containers on default bridge
# must use --link or IP addresses
# No automatic DNS resolution`,

      right: `# Create custom bridge network
docker network create mynet

docker run -d --name app1 --network mynet myapp
docker run -d --name app2 --network mynet myapp

# Containers resolve each other by name
# Isolated from other containers`,
    },

    correctSide: "right",
    explanationCorrect:
      "Custom bridge networks provide automatic DNS resolution between containers, better isolation from unrelated containers, and the ability to connect/disconnect containers at runtime. Containers on different custom networks cannot communicate by default.",
    explanationWrong:
      "The default bridge network doesn't provide automatic DNS resolution. Containers must use `--link` (deprecated) or IP addresses to communicate. All containers on the default bridge can reach each other, providing no isolation between unrelated workloads.",
    sourceUrl: "https://docs.docker.com/engine/network/drivers/bridge/",
    sourceLabel: "Docker docs: Bridge networks",
  },
];
