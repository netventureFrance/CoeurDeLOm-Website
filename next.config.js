/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coeurdelom.fr',
      },
      {
        protocol: 'https',
        hostname: '**.airtableusercontent.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/fr',
      },
    ];
  },
}

module.exports = nextConfig
