import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  transpilePackages: ['@smartfood/ui', '@smartfood/shared', '@smartfood/database'],
  serverExternalPackages: ['@electric-sql/pglite', 'pg', '@prisma/client', 'prisma'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle node: protocol and native modules that webpack can't bundle
      const originalExternals = Array.isArray(config.externals)
        ? config.externals
        : config.externals
        ? [config.externals]
        : [];

      config.externals = [
        ...originalExternals,
        // Treat node: protocol imports as CommonJS externals (bcryptjs is pure JS, no longer needed)
        (
          { request }: { request?: string },
          callback: (err?: Error | null, result?: string) => void
        ) => {
          if (request?.startsWith('node:')) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
