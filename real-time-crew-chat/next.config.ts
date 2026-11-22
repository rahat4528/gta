import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false, // Prevents double mounting socket connections in dev
  serverExternalPackages: ['@prisma/client', 'bcryptjs', 'socket.io'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
