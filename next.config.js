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
  // Enable source maps in development
  productionBrowserSourceMaps: true,
  // Enable webpack5 for better performance
  future: {
    webpack5: true,
  },

  // Disable TypeScript type checking during build (handled by IDE)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build (handled by IDE)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
