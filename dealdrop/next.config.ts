import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
