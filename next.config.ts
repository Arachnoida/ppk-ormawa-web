import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Config Upload Besar (Yang kemarin kita buat)
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  // 2. Config Izin Gambar Supabase (YANG BARU)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Copy hostname dari pesan error Anda tadi:
        hostname: "nuflcrnhlxbumgcedoyw.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
