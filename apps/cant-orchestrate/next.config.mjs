/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@cant/shared"],
};

export default nextConfig;
