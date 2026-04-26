import type { BaseChallenge } from "../../game/types";

export const buildScriptsChallenges: BaseChallenge[] = [
  {
    id: "bs-001",
    category: "build-scripts",
    difficulty: "easy",
    title: "Makefile for container workflows",
    prompt: "Which approach organizes container tasks better?",
    content: {
      type: "code",

      lang: "bash",

      left: `#!/bin/bash
# build.sh - hard to discover, no help

docker build -t myapp:latest .
docker run --rm -p 3000:3000 myapp:latest

# Different scripts for different tasks
# No dependency tracking
# No tab completion`,

      right: `# Makefile - self-documenting
.PHONY: build run test clean

build: ## Build the container image
\tdocker build -t myapp:latest .

run: build ## Run the app locally
\tdocker run --rm -p 3000:3000 myapp:latest

test: build ## Run tests in container
\tdocker run --rm myapp:latest npm test

clean: ## Remove images and volumes
\tdocker compose down -v
\tdocker rmi myapp:latest

help: ## Show available targets
\t@grep -E '^[a-zA-Z_-]+:.*?##' $(MAKEFILE_LIST) | sort | \\
\t  awk 'BEGIN {FS = ":.*?## "}; {printf "  \\033[36m%-15s\\033[0m %s\\n", $$1, $$2}'`,
    },

    correctSide: "right",
    explanationCorrect:
      "Makefiles provide discoverable, self-documenting commands with dependency tracking. `make run` automatically builds first if needed. The `help` target documents all available commands. Make is pre-installed on most Unix systems and supports tab completion.",
    explanationWrong:
      "Scattered shell scripts are hard to discover and have no built-in dependency tracking. New team members don't know which script to run. There's no way to list available commands or ensure prerequisites are met before running a task.",
    sourceUrl: "https://www.gnu.org/software/make/manual/make.html",
    sourceLabel: "GNU Make manual",
  },
  {
    id: "bs-002",
    category: "build-scripts",
    difficulty: "medium",
    title: "Ant build with Docker integration",
    prompt: "Which Ant build integrates Docker correctly?",
    content: {
      type: "code",

      lang: "xml",

      left: `<!-- build.xml - manual process -->
<project name="myapp" default="build">
  <target name="build">
    <javac srcdir="src"
           destdir="build/classes"
           includeantruntime="false"/>
    <jar destfile="build/myapp.jar"
         basedir="build/classes"/>
  </target>

  <!-- Developer must manually
       docker build after ant build -->
</project>`,

      right: `<!-- build.xml - integrated pipeline -->
<project name="myapp" default="docker-build">
  <target name="compile">
    <javac srcdir="src"
           destdir="build/classes"
           includeantruntime="false"/>
  </target>

  <target name="jar" depends="compile">
    <jar destfile="build/myapp.jar"
         basedir="build/classes"/>
  </target>

  <target name="docker-build" depends="jar">
    <exec executable="docker" failonerror="true">
      <arg line="build -t myapp:latest ."/>
    </exec>
  </target>

  <target name="docker-push" depends="docker-build">
    <exec executable="docker" failonerror="true">
      <arg line="push registry.io/myapp:latest"/>
    </exec>
  </target>
</project>`,
    },

    correctSide: "right",
    explanationCorrect:
      'Integrating Docker commands into Ant\'s dependency chain ensures the JAR is always built before the image. `depends` enforces the order: compile, then JAR, then Docker build. `failonerror="true"` stops the pipeline if any step fails.',
    explanationWrong:
      "Separating the Ant build from the Docker build means developers must remember to run both in the right order. Forgetting to rebuild the JAR before `docker build` results in deploying stale code. There's no single command for the full pipeline.",
    sourceUrl: "https://ant.apache.org/manual/Tasks/exec.html",
    sourceLabel: "Ant docs: exec task",
  },
  {
    id: "bs-003",
    category: "build-scripts",
    difficulty: "medium",
    title: "Docker Compose for dev scripts",
    prompt: "Which onboarding approach is more reliable?",
    content: {
      type: "code",

      lang: "bash",

      left: `# README.md says:
# 1. Install Node 20
# 2. Install PostgreSQL 16
# 3. Create database "myapp"
# 4. Copy .env.example to .env
# 5. Run npm install
# 6. Run npm run migrate
# 7. Run npm run dev
# Good luck!`,

      right: `# Makefile
.PHONY: dev setup test

setup: ## First-time setup
\tcp -n .env.example .env 2>/dev/null || true
\tdocker compose build

dev: ## Start development environment
\tdocker compose up

test: ## Run tests
\tdocker compose run --rm app npm test

# docker-compose.yml handles:
# - Node.js version
# - PostgreSQL setup
# - Database creation
# - Hot reloading`,
    },

    correctSide: "right",
    explanationCorrect:
      "Docker Compose encapsulates the entire development environment. New developers run `make setup && make dev` instead of following a multi-step guide. Everyone gets the same versions, same database, same configuration. The setup is reproducible and version-controlled.",
    explanationWrong:
      "Manual setup instructions are error-prone, platform-specific, and quickly become outdated. Different developers end up with different versions of Node, PostgreSQL, and other tools. 'Works on my machine' becomes the default state.",
    sourceUrl: "https://docs.docker.com/compose/use-cases/",
    sourceLabel: "Docker docs: Compose use cases",
  },
  {
    id: "bs-004",
    category: "build-scripts",
    difficulty: "hard",
    title: "Gradle Jib for Java containers",
    prompt: "Which Java container build is more efficient?",
    content: {
      type: "code",

      lang: "bash",

      left: `# Dockerfile for Java app
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ./gradlew build

FROM eclipse-temurin:21-jre
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

# Needs Docker daemon
# Rebuilds entire fat JAR layer
# No layer optimization`,

      right: `// build.gradle.kts
plugins {
  id("com.google.cloud.tools.jib") version "3.4.4"
}

jib {
  from { image = "eclipse-temurin:21-jre" }
  to { image = "registry.io/myapp" }
  container {
    jvmFlags = listOf("-Xms256m", "-Xmx512m")
    ports = listOf("8080")
    mainClass = "com.example.App"
  }
}

// Build: ./gradlew jib
// No Docker daemon required
// Optimized layer caching`,
    },

    correctSide: "right",
    explanationCorrect:
      "Jib builds optimized container images directly from your build tool without a Dockerfile or Docker daemon. It separates dependencies, resources, and classes into distinct layers, so code changes only rebuild the thin classes layer. Builds are faster and reproducible.",
    explanationWrong:
      "A traditional Dockerfile packages everything into a fat JAR in a single layer. Any code change rebuilds the entire layer, including unchanged dependencies (which are often 100+ MB). It also requires a running Docker daemon in CI.",
    sourceUrl: "https://github.com/GoogleContainerTools/jib",
    sourceLabel: "GitHub: Jib",
  },
];
