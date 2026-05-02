/** @type {import('next').NextConfig} */
const nextConfig = {
  // Replit: no custom Node server needed, Next.js handles everything
  // eslint errors should not block the dev preview
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Type errors are caught by the editor; don't block Replit preview builds
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

module.exports = nextConfig;
