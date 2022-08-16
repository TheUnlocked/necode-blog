import { withContentlayer } from 'next-contentlayer'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    // Suppress warnings https://github.com/vercel/next.js/issues/33693
    config.infrastructureLogging = {
      level: "error",
    }
    return config;
  },
};

export default withContentlayer(nextConfig);
