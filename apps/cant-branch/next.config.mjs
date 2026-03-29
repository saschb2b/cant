/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    viewTransition: true,
  },
  transpilePackages: ["@cant/shared"],
};

export default nextConfig;
