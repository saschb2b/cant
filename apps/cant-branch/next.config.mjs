/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@cant/shared"],
};

export default nextConfig;
