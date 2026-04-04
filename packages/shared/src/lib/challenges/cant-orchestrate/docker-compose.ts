import type { BaseChallenge } from "../../game/types";

export const dockerComposeChallenges: BaseChallenge[] = [
  {
    id: "dc-001",
    category: "docker-compose",
    difficulty: "easy",
    title: "depends_on with health checks",
    prompt: "Which service dependency setup is more reliable?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret

  app:
    build: .
    depends_on:
      - db`,

      right: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy`,
    },

    correctSide: "right",
    explanationCorrect:
      "Using `condition: service_healthy` with a proper `healthcheck` ensures the app container only starts when the database is actually ready to accept connections. The `pg_isready` check verifies PostgreSQL is listening, not just that the container is running.",
    explanationWrong:
      "Plain `depends_on` only waits for the container to start, not for the service inside to be ready. Your app will crash with connection errors because PostgreSQL takes a few seconds to initialize after the container starts.",
    sourceUrl:
      "https://docs.docker.com/reference/compose-file/services/#depends_on",
    sourceLabel: "Docker docs: depends_on",
  },
  {
    id: "dc-002",
    category: "docker-compose",
    difficulty: "easy",
    title: "Named volumes for persistence",
    prompt: "Which database setup preserves data on restart?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    # No volume - data lost on restart`,

      right: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`,
    },

    correctSide: "right",
    explanationCorrect:
      "Named volumes persist data across container restarts and `docker compose down`. The `pgdata` volume is managed by Docker and survives container lifecycle events. Defining it in the top-level `volumes` section makes it explicit and shareable.",
    explanationWrong:
      "Without a volume, all database data lives in the container's writable layer. Running `docker compose down` or recreating the container deletes everything. Development data, test records, and migration state all vanish.",
    sourceUrl: "https://docs.docker.com/reference/compose-file/volumes/",
    sourceLabel: "Docker docs: Compose volumes",
  },
  {
    id: "dc-003",
    category: "docker-compose",
    difficulty: "medium",
    title: "Managing optional services",
    prompt: "Which Compose setup handles optional services?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  app:
    build: .
    ports:
      - "3000:3000"

  # Always starts, even when not needed
  mailhog:
    image: mailhog/mailhog
    ports:
      - "8025:8025"

  # Always starts, even when not needed
  adminer:
    image: adminer
    ports:
      - "8080:8080"`,

      right: `services:
  app:
    build: .
    ports:
      - "3000:3000"

  mailhog:
    image: mailhog/mailhog
    ports:
      - "8025:8025"
    profiles:
      - debug

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    profiles:
      - debug`,
    },

    correctSide: "right",
    explanationCorrect:
      "Profiles let you define optional services that only start when explicitly requested with `docker compose --profile debug up`. This keeps the default `docker compose up` fast and lightweight while debug tools remain available on demand.",
    explanationWrong:
      "Without profiles, every service starts on `docker compose up`, even debugging tools you rarely need. This wastes resources, clutters logs, and slows down your development workflow. Every developer pays the cost whether they need the tools or not.",
    sourceUrl:
      "https://docs.docker.com/reference/compose-file/services/#profiles",
    sourceLabel: "Docker docs: Profiles",
  },
  {
    id: "dc-004",
    category: "docker-compose",
    difficulty: "medium",
    title: "Explicit network isolation",
    prompt: "Which network layout isolates services properly?",
    content: {
      type: "code",

      lang: "yaml",

      left: `services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  backend:
    build: ./backend

  db:
    image: postgres:16
    # All services on default network
    # Frontend can reach DB directly`,

      right: `services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    networks:
      - frontend

  backend:
    build: ./backend
    networks:
      - frontend
      - backend

  db:
    image: postgres:16
    networks:
      - backend

networks:
  frontend:
  backend:`,
    },

    correctSide: "right",
    explanationCorrect:
      "Explicit networks isolate services by tier. The frontend can only reach the backend, and the backend can reach both frontend and database. The frontend cannot access the database directly. This follows the principle of least privilege and mirrors production topology.",
    explanationWrong:
      "The default Compose network puts all services on the same network. Any service can reach any other service directly. The frontend can bypass the backend and query the database, which is a security risk and an architectural violation.",
    sourceUrl: "https://docs.docker.com/reference/compose-file/networks/",
    sourceLabel: "Docker docs: Compose networks",
  },
];
