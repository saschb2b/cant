import type { BaseChallenge } from "../../game/types";

export const dockerfileBasicsChallenges: BaseChallenge[] = [
  {
    id: "df-001",
    category: "dockerfile-basics",
    difficulty: "easy",
    title: "COPY vs ADD",
    prompt: "Which instruction copies files more predictably?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine

# Add application files
ADD . /app
WORKDIR /app

RUN npm install
CMD ["node", "server.js"]`,

      right: `FROM node:20-alpine

# Copy application files
COPY . /app
WORKDIR /app

RUN npm install
CMD ["node", "server.js"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "`COPY` is explicit and predictable: it copies files from the build context into the image. Use `COPY` unless you specifically need `ADD`'s extra features (auto-extracting tarballs or fetching remote URLs). Most builds only need `COPY`.",
    explanationWrong:
      "`ADD` has implicit behavior: it auto-extracts compressed archives and can fetch remote URLs. This makes builds less predictable. Docker's own best practices recommend `COPY` for plain file copying.",
    sourceUrl:
      "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#add-or-copy",
    sourceLabel: "Docker docs: ADD or COPY",
  },
  {
    id: "df-002",
    category: "dockerfile-basics",
    difficulty: "easy",
    title: "CMD exec form vs shell form",
    prompt: "Which CMD form handles signals correctly?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install

# Shell form
CMD npm start`,

      right: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install

# Exec form
CMD ["npm", "start"]`,
    },

    correctSide: "right",
    explanationCorrect:
      'The exec form (`CMD ["npm", "start"]`) runs the command directly without a shell wrapper. This means the process receives signals like SIGTERM properly, enabling graceful shutdown. It also avoids unexpected shell variable expansion.',
    explanationWrong:
      "The shell form (`CMD npm start`) wraps the command in `/bin/sh -c`, which means the shell process (PID 1) receives signals instead of your app. Your container won't shut down gracefully because the app never gets SIGTERM.",
    sourceUrl: "https://docs.docker.com/reference/dockerfile/#cmd",
    sourceLabel: "Docker docs: CMD",
  },
  {
    id: "df-003",
    category: "dockerfile-basics",
    difficulty: "medium",
    title: "ENTRYPOINT + CMD",
    prompt: "Which setup allows flexible runtime arguments?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM python:3.12-slim

COPY app.py /app/app.py
WORKDIR /app

# Hardcoded command, can't override args
ENTRYPOINT ["python", "app.py", "--port", "8080"]`,

      right: `FROM python:3.12-slim

COPY app.py /app/app.py
WORKDIR /app

# Fixed binary, overridable defaults
ENTRYPOINT ["python", "app.py"]
CMD ["--port", "8080"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "Splitting `ENTRYPOINT` (the fixed executable) from `CMD` (the default arguments) lets users override arguments at runtime with `docker run myimage --port 9090` without replacing the entire command. This is the standard pattern for flexible container images.",
    explanationWrong:
      "Putting all arguments in `ENTRYPOINT` means users must use `--entrypoint` to change anything, which replaces the entire command. This makes the image inflexible and harder to use in different environments.",
    sourceUrl:
      "https://docs.docker.com/reference/dockerfile/#understand-how-cmd-and-entrypoint-interact",
    sourceLabel: "Docker docs: CMD and ENTRYPOINT",
  },
  {
    id: "df-004",
    category: "dockerfile-basics",
    difficulty: "medium",
    title: "Minimize RUN layers",
    prompt: "Which RUN instruction produces a smaller image?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM ubuntu:24.04

RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get install -y wget
RUN rm -rf /var/lib/apt/lists/*`,

      right: `FROM ubuntu:24.04

RUN apt-get update && \\
    apt-get install -y \\
      curl \\
      git \\
      wget && \\
    rm -rf /var/lib/apt/lists/*`,
    },

    correctSide: "right",
    explanationCorrect:
      "Combining related commands in a single `RUN` instruction creates one layer instead of five. The cleanup (`rm -rf /var/lib/apt/lists/*`) actually removes files from the image because it happens in the same layer as the install. Fewer layers also mean a smaller image.",
    explanationWrong:
      "Each `RUN` creates a new layer. The `apt-get update` layer is separate from the install layers, so the package index can go stale in cached builds. The cleanup in a separate `RUN` doesn't reduce image size because the files still exist in earlier layers.",
    sourceUrl:
      "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#minimize-the-number-of-layers",
    sourceLabel: "Docker docs: Minimize layers",
  },
  {
    id: "df-005",
    category: "dockerfile-basics",
    difficulty: "hard",
    title: "WORKDIR vs cd in RUN",
    prompt: "Which approach sets the working directory properly?",
    content: {
      type: "code",

      lang: "dockerfile",

      left: `FROM node:20-alpine

RUN mkdir -p /app
RUN cd /app && npm init -y
RUN cd /app && npm install express
COPY server.js /app/server.js
RUN cd /app && node -e "require('./server')"

CMD ["node", "/app/server.js"]`,

      right: `FROM node:20-alpine

WORKDIR /app
RUN npm init -y
RUN npm install express
COPY server.js .
RUN node -e "require('./server')"

CMD ["node", "server.js"]`,
    },

    correctSide: "right",
    explanationCorrect:
      "`WORKDIR` sets the working directory for all subsequent instructions. It creates the directory if it doesn't exist and persists across layers. This eliminates repetitive `cd` commands and makes paths relative to the app directory.",
    explanationWrong:
      "`cd` inside `RUN` only affects that single `RUN` instruction. Each new `RUN` starts from `/` again unless you repeat the `cd`. This leads to repetitive code and easy-to-miss bugs when you forget the `cd` in one layer.",
    sourceUrl: "https://docs.docker.com/reference/dockerfile/#workdir",
    sourceLabel: "Docker docs: WORKDIR",
  },
];
