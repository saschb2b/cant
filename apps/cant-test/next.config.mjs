import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // pnpm workspace: trace from the repo root, and force the whole
  // @swc/helpers package in. Next 16.3 traces only its cjs/ folder,
  // but the standalone runtime hook loads esm/, so the server exits
  // with MODULE_NOT_FOUND without this.
  outputFileTracingRoot: `${__dirname}/../..`,
  outputFileTracingIncludes: {
    "**/*": [
      "../../node_modules/.pnpm/@swc+helpers@*/node_modules/@swc/helpers/**",
    ],
  },
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@cant/shared"],
};

export default nextConfig;
