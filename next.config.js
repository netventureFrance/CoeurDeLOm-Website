/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure the Swiss Ephemeris WASM file is bundled with the astro-chart function.
  outputFileTracingIncludes: {
    '/api/admin/astro-chart': ['./node_modules/swisseph-wasm/wasm/**'],
  },
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
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
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
