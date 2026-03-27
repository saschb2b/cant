/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    viewTransition: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@cant/shared"],
};

export default nextConfig;
