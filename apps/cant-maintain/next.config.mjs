/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  transpilePackages: ["@cant/shared"],
};

export default nextConfig;
