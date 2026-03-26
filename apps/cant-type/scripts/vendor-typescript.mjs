/**
 * Minifies node_modules/typescript/lib/typescript.js into
 * public/workers/typescript.min.js so the playground web worker
 * can load the compiler from same-origin instead of a CDN.
 *
 * Runs automatically before dev/build via the package.json scripts.
 * The output is gitignored.
 */

import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

const out = "public/workers/typescript.min.js";

if (existsSync(out)) {
  process.exit(0);
}

console.log("Minifying TypeScript compiler for playground worker...");
execSync(
  `npx terser node_modules/typescript/lib/typescript.js --compress --mangle -o ${out}`,
  { stdio: "inherit" },
);
console.log("Done.");
