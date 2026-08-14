/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@cant/shared"],
};

export default nextConfig;
