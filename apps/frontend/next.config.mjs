/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // En mode docker, "api" est le nom du conteneur du backend
        destination: `${process.env.API_URL || 'http://api:3001'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
