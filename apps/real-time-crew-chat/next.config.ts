import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false, // Prevents double mounting socket connections in dev
  serverExternalPackages: ['@prisma/client', 'bcryptjs', 'socket.io'],
};

export default nextConfig;
