/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    viewTransition: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@cant/shared"],
};

export default nextConfig;
