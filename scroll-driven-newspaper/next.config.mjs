/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['gsap', 'lenis'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
