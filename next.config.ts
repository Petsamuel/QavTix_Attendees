import type { NextConfig } from "next";

const nextConfig : NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: '/**'
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: '/**'
      },
    ],
  },
}

export default nextConfig;
