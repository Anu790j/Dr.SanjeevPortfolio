/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Not recommended
  },
  typescript: {
    ignoreBuildErrors: true, // Not recommended
  },
};

module.exports = nextConfig;