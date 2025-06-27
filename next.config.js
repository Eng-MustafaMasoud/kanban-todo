/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/:path*",
      },
    ];
  },
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Disable TypeScript type checking during build (handled by IDE)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build (handled by IDE)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Compression
  compress: true,

  // Power by header
  poweredByHeader: false,
};

module.exports = nextConfig;
