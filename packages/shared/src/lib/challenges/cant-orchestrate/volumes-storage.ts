import type { BaseChallenge } from "../../game/types";

export const volumesStorageChallenges: BaseChallenge[] = [
  {
    id: "vs-001",
    category: "volumes-storage",
    difficulty: "easy",
    title: "Named volumes vs anonymous volumes",
    prompt: "Which volume type is easier to manage?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  db:
    image: postgres:16
    volumes:
      # Anonymous volume
      - /var/lib/postgresql/data`,

      right: `services:
  db:
    image: postgres:16
    volumes:
      # Named volume
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`,
    },

    correctSide: "right",
    explanationCorrect:
      "Named volumes are easy to identify, back up, and manage with `docker volume` commands. They have a meaningful name (`pgdata`) so you can find them later. They persist across `docker compose down` by default.",
    explanationWrong:
      "Anonymous volumes get a random hash name like `a1b2c3d4...`. They're hard to identify, easy to lose track of, and accumulate as orphans over time. Running `docker compose down -v` deletes them, making accidental data loss more likely.",
    sourceUrl: "https://docs.docker.com/engine/storage/volumes/",
    sourceLabel: "Docker docs: Volumes",
  },
  {
    id: "vs-002",
    category: "volumes-storage",
    difficulty: "medium",
    title: "Bind mounts for development",
    prompt: "Which bind mount preserves container dependencies?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  app:
    build: .
    volumes:
      # Copies node_modules from host
      - .:/app`,

      right: `services:
  app:
    build: .
    volumes:
      - .:/app
      # Preserve container's node_modules
      - /app/node_modules`,
    },

    correctSide: "right",
    explanationCorrect:
      "The anonymous volume at `/app/node_modules` prevents the host bind mount from overwriting the container's installed dependencies. The container keeps its own `node_modules` (built for its OS and architecture) while your source code is still synced from the host.",
    explanationWrong:
      "Bind-mounting the entire project directory overwrites `node_modules` inside the container with whatever is on your host. If your host OS differs from the container (e.g., macOS vs Linux), native modules will be incompatible and your app will crash.",
    sourceUrl: "https://docs.docker.com/engine/storage/bind-mounts/",
    sourceLabel: "Docker docs: Bind mounts",
  },
  {
    id: "vs-003",
    category: "volumes-storage",
    difficulty: "medium",
    title: "Read-only bind mounts",
    prompt: "Which mount option protects host files?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  nginx:
    image: nginx:alpine
    volumes:
      # Read-write access to config
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./html:/usr/share/nginx/html`,

      right: `services:
  nginx:
    image: nginx:alpine
    volumes:
      # Read-only access to config
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./html:/usr/share/nginx/html:ro`,
    },

    correctSide: "right",
    explanationCorrect:
      "The `:ro` flag makes bind mounts read-only inside the container. If the container is compromised, it cannot modify your configuration files or static assets on the host. This follows the principle of least privilege.",
    explanationWrong:
      "Without `:ro`, the container has full read-write access to mounted files. A compromised Nginx process could overwrite your configuration or inject malicious content into your HTML files, affecting the host filesystem.",
    sourceUrl:
      "https://docs.docker.com/engine/storage/bind-mounts/#use-a-read-only-bind-mount",
    sourceLabel: "Docker docs: Read-only bind mounts",
  },
  {
    id: "vs-004",
    category: "volumes-storage",
    difficulty: "hard",
    title: "tmpfs for sensitive temp data",
    prompt: "Which storage keeps temp data out of disk?",
    content: {
      type: "code",

      lang: "yaml",

      left: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci

# Temp files written to container layer
# Visible in docker inspect, image history
CMD ["node", "server.js"]`,

      right: `# In docker-compose.yml
services:
  app:
    build: .
    tmpfs:
      - /app/tmp:size=100m
    # Or in docker run:
    # docker run --tmpfs /app/tmp:size=100m`,
    },

    correctSide: "right",
    explanationCorrect:
      "`tmpfs` mounts store data in memory only. It never touches disk, is not included in image layers, and is automatically cleaned up when the container stops. This is ideal for session tokens, temporary uploads, and other sensitive ephemeral data.",
    explanationWrong:
      "Writing temporary files to the container's writable layer persists them to disk. They can be recovered from the container filesystem, show up in `docker diff`, and survive container restarts. Sensitive data should never be written to the container layer.",
    sourceUrl: "https://docs.docker.com/engine/storage/tmpfs/",
    sourceLabel: "Docker docs: tmpfs mounts",
  },
];
