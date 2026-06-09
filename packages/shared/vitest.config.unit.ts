import { defineConfig } from "vitest/config";

// Node-only unit tests for shared pure logic. Kept separate from
// vitest.config.ts, which drives the Storybook browser tests (playwright) and
// needs a browser to run. The `test` script targets this config so `pnpm test`
// and CI can exercise shared logic without installing browsers.
export default defineConfig({
  test: {
    name: "unit",
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
