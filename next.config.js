import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
      },
      {
        protocol: 'https',
        hostname: 'images.kabum.com.br',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Avatares do Google
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com', // Avatares do Discord
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Imagens de storage do Supabase
      }
    ],
  },
};

export default nextConfig;