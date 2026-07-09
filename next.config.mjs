/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Local optimized assets live in /public/optimized
  },
  // Allow serving large media without complaints
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
