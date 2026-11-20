import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Esto permite imágenes de CUALQUIER página
      },
    ],
  },
};

export default nextConfig;