import type { BaseChallenge } from "../../game/types";

export const ciTestInfraChallenges: BaseChallenge[] = [
  {
    id: "ci-001",
    category: "ci-test-infra",
    difficulty: "easy",
    title: "Test runner execution mode",
    prompt: "Which test runner configuration is more efficient?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# GitHub Actions workflow
name: Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx vitest --no-threads
      - run: npx vitest --project e2e
      - run: npx vitest --project integration`,

      right: `# GitHub Actions workflow
name: Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx vitest --reporter=verbose`,
    },

    correctSide: "right",
    explanationCorrect:
      "Vitest runs tests in parallel by default using worker threads. A single vitest command with default parallelism lets the runner distribute work across available CPU cores automatically, completing the suite faster with less configuration overhead.",
    explanationWrong:
      "Disabling threads with --no-threads forces sequential execution, removing the main performance benefit of modern test runners. Running separate vitest commands serially also wastes time because each invocation pays the startup cost again and cannot share work across the full suite.",
    sourceUrl: "https://vitest.dev/guide/improving-performance",
    sourceLabel: "Vitest: Improving Performance",
  },
  {
    id: "ci-002",
    category: "ci-test-infra",
    difficulty: "easy",
    title: "Test output and reporting",
    prompt: "Which test reporting setup gives better visibility?",
    content: {
      type: "code",

      left: `// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ["verbose"],
    outputFile: "./test-results.json",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
    },
  },
});`,

      right: `// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reporter: ["text"],
    },
  },
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Generating structured output files (JSON, HTML) alongside console output makes results consumable by CI dashboards, PR comments, and coverage tracking tools. Multiple coverage reporters let developers browse HTML locally while CI parses the JSON summary for threshold checks.",
    explanationWrong:
      "Using only the default reporter and a single text coverage format limits visibility to whoever reads the raw CI log. There is no artifact for dashboards to consume, no HTML report for local debugging, and no structured data for automated coverage gates.",
    sourceUrl: "https://vitest.dev/guide/reporters",
    sourceLabel: "Vitest: Reporters",
  },
  {
    id: "ci-003",
    category: "ci-test-infra",
    difficulty: "medium",
    title: "CI pipeline test stage design",
    prompt: "Which CI pipeline structure handles tests more effectively?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# GitHub Actions workflow
name: CI
on: [push]
jobs:
  test-all:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx vitest run
      - run: npx playwright test
      - run: npm run test:e2e
      - run: npm run lint
      - run: npm run typecheck`,

      right: `# GitHub Actions workflow
name: CI
on: [push]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint && npm run typecheck
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx vitest run
  e2e:
    runs-on: ubuntu-latest
    needs: [lint, unit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test`,
    },

    correctSide: "right",
    explanationCorrect:
      "Splitting lint, unit, and e2e into separate jobs lets them run in parallel where possible and fail independently. Cheap checks (lint, typecheck) surface errors in seconds, while expensive e2e tests only run after the fast jobs pass. This shortens the feedback loop and makes failures easier to diagnose.",
    explanationWrong:
      "Running every check sequentially in a single job means a lint error discovered in the last step wastes all the time spent on earlier test runs. A failure in any step blocks visibility into later steps, and there is no parallelism to reduce total wall-clock time.",
    sourceUrl:
      "https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow",
    sourceLabel: "GitHub Docs: Using jobs in a workflow",
  },
  {
    id: "ci-004",
    category: "ci-test-infra",
    difficulty: "medium",
    title: "Test environment configuration",
    prompt: "Which approach to test environment setup is more reliable?",
    content: {
      type: "code",

      left: `// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: "postgresql://localhost:5432/test",
      API_KEY: "test-key-12345",
      REDIS_URL: "redis://localhost:6379",
      NODE_ENV: "test",
    },
    setupFiles: ["./test/setup.ts"],
    globalSetup: ["./test/global-setup.ts"],
  },
});`,

      right: `// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      NODE_ENV: "test",
    },
    setupFiles: ["./test/setup.ts"],
    globalSetup: ["./test/global-setup.ts"],
    envPrefix: "TEST_",
  },
});

// .env.test (loaded via dotenv in setup.ts)
// DATABASE_URL=postgresql://localhost:5432/test
// REDIS_URL=redis://localhost:6379
// API_KEY=test-key-12345`,
    },

    correctSide: "right",
    explanationCorrect:
      "Keeping connection strings and credentials in a dedicated .env.test file separates configuration from code. Developers can override values locally without touching the vitest config, and CI can inject its own variables through environment settings. The envPrefix option adds a clear boundary between test and production variables.",
    explanationWrong:
      "Hardcoding database URLs and API keys directly in the vitest config file mixes infrastructure details with test runner settings. Every environment (local, CI, staging) that needs different values requires editing the config or layering overrides on top of it, which is fragile and easy to get wrong.",
    sourceUrl: "https://vitest.dev/config/#env",
    sourceLabel: "Vitest: Environment Config",
  },
  {
    id: "ci-005",
    category: "ci-test-infra",
    difficulty: "medium",
    title: "Shared test utilities organization",
    prompt: "Which pattern for organizing test helpers scales better?",
    content: {
      type: "code",

      left: `// test/utils.ts
export function createMockUser(overrides = {}) {
  return {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    role: "viewer",
    createdAt: new Date("2024-01-01"),
    ...overrides,
  };
}

export function createMockPost(overrides = {}) {
  return {
    id: "post-1",
    title: "Test Post",
    authorId: "user-1",
    status: "draft",
    ...overrides,
  };
}

export { renderWithProviders } from "./render";
export { mockFetch } from "./fetch";
export { seedDatabase } from "./db";`,

      right: `// test/utils/index.ts
export * from "./factories";
export * from "./render";
export * from "./fetch";
export * from "./db";

// test/utils/factories.ts
import { faker } from "@faker-js/faker";

let counter = 0;

export function createMockUser(overrides = {}) {
  counter++;
  return {
    id: \`user-\${counter}\`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: "viewer",
    createdAt: faker.date.past(),
    ...overrides,
  };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Splitting test helpers into focused modules (factories, render helpers, mocks) keeps each file small and easy to navigate. Using a library like faker with an incrementing counter ensures each test gets unique data by default, which prevents hidden coupling between tests that accidentally share the same hardcoded IDs.",
    explanationWrong:
      'Putting every factory and re-export in a single utils file works at first, but grows unwieldy as the test suite scales. Hardcoded IDs like "user-1" across all factories mean two tests creating a mock user get identical data, which can mask bugs or cause unexpected collisions in integration tests.',
    sourceUrl: "https://fakerjs.dev/guide/",
    sourceLabel: "Faker.js: Getting Started",
  },
  {
    id: "ci-006",
    category: "ci-test-infra",
    difficulty: "hard",
    title: "Test sharding and parallelization",
    prompt: "Which sharding strategy distributes test load more evenly?",
    content: {
      type: "code",
      lang: "yaml",

      left: `# GitHub Actions workflow
name: Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx vitest --shard=\${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        with:
          name: results-\${{ matrix.shard }}
          path: test-results/`,

      right: `# GitHub Actions workflow
name: Tests
on: [push]
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx vitest --project unit
  api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx vitest --project api
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test`,
    },

    correctSide: "left",
    explanationCorrect:
      "Built-in sharding (--shard=N/M) splits the full test suite evenly across matrix jobs so each shard runs roughly the same number of tests. Adding more shards is a one-line change, and uploading artifacts lets you merge results after all shards finish. This scales linearly with the number of runners.",
    explanationWrong:
      "Splitting by project type (unit, api, e2e) creates a fixed number of jobs with unpredictable durations. If the unit suite takes ten minutes and the api suite takes one minute, most of the wall-clock time is spent waiting for the slowest job. There is no mechanism to rebalance work as the suite grows.",
    sourceUrl: "https://vitest.dev/guide/cli.html#shard",
    sourceLabel: "Vitest: CLI Shard Option",
  },
  {
    id: "ci-007",
    category: "ci-test-infra",
    difficulty: "hard",
    title: "Flake detection and quarantine",
    prompt: "Which approach handles flaky tests more effectively?",
    content: {
      type: "code",

      left: `// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    retry: 3,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});

// In CI pipeline (package.json script)
// "test:ci": "vitest run --retry 3"`,

      right: `// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    retry: 0,
    testTimeout: 10_000,
    reporters: ["default", "json"],
    outputFile: "./test-results.json",
  },
});

// scripts/quarantine-flakes.ts
import results from "../test-results.json";

const FLAKE_LOG = "flake-log.json";

// Track tests that failed then passed on re-run
export function detectFlakes(current: TestRun[]) {
  const known = loadJSON(FLAKE_LOG);
  const flaky = current.filter(
    (t) => t.retries > 0 && t.status === "pass"
  );
  saveJSON(FLAKE_LOG, mergeFlakes(known, flaky));
  if (flaky.length) reportToSlack(flaky);
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Tracking flaky tests in a structured log and reporting them surfaces the real problem instead of hiding it. With zero retries as the baseline, any test that needs a retry is flagged as flaky. Teams can quarantine known flakes into a separate suite and fix them deliberately rather than letting silent retries erode confidence in the suite.",
    explanationWrong:
      "Blindly retrying every failure three times masks genuine flakiness. A test that passes on the third attempt still indicates a real issue (race condition, timing dependency, shared state), but the green CI status hides it. Over time the suite accumulates hidden flakes that slow down runs and cause intermittent failures nobody investigates.",
    sourceUrl:
      "https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-a-warning-message",
    sourceLabel: "GitHub Docs: Workflow Commands",
  },
  {
    id: "ci-008",
    category: "ci-test-infra",
    difficulty: "hard",
    title: "Test data management in CI",
    prompt: "Which test data strategy is more maintainable in CI?",
    content: {
      type: "code",

      left: `// test/global-setup.ts
import { execSync } from "child_process";

export async function setup() {
  execSync("docker compose up -d postgres");
  execSync("npx prisma db push --force-reset");
  execSync("npx prisma db seed");
}

export async function teardown() {
  execSync("docker compose down -v");
}

// test/helpers/db.ts
import { prisma } from "./prisma-client";

export async function resetDatabase() {
  const tables = await prisma.$queryRaw\`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'\`;
  for (const { tablename } of tables) {
    await prisma.$executeRawUnsafe(
      \`TRUNCATE "\${tablename}" CASCADE\`
    );
  }
  await prisma.db.seed();
}`,

      right: `// test/global-setup.ts
import { execSync } from "child_process";

export async function setup() {
  execSync("docker compose up -d postgres");
  execSync("npx prisma db push --force-reset");
}

export async function teardown() {
  execSync("docker compose down -v");
}

// test/helpers/db.ts
import { prisma } from "./prisma-client";

export function useTransaction() {
  let tx: Transaction;
  beforeEach(async () => {
    tx = await prisma.$begin();
  });
  afterEach(async () => {
    await tx.$rollback();
  });
  return () => tx;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Wrapping each test in a transaction that rolls back after the assertion is the fastest way to isolate test data. No rows are ever committed, so there is nothing to truncate or reseed between tests. This approach is orders of magnitude faster than truncating every table and re-seeding, and it guarantees each test starts from a clean state.",
    explanationWrong:
      "Truncating all tables and reseeding between tests is correct in principle, but extremely slow at scale. Each reset issues multiple SQL statements, waits for cascading deletes, and then re-inserts seed rows. As the schema grows, this overhead adds seconds per test, turning a fast unit suite into a slow integration bottleneck.",
    sourceUrl:
      "https://www.prisma.io/docs/orm/prisma-client/queries/transactions",
    sourceLabel: "Prisma Docs: Transactions",
  },
];
