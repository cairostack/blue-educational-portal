import type { NextConfig } from "next";
import { resolve } from "path";

/** Extract hostname from a URL string, or return null */
function hostnameFrom(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const strapiHost =
  hostnameFrom(process.env.STRAPI_API_URL) ??
  hostnameFrom(process.env.STRAPI_BASE_URL) ??
  "admin-blue-educational.com";

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(__dirname),
  },
  images: {
    remotePatterns: [
      // Strapi media uploads (dynamic host from env)
      {
        protocol: "https",
        hostname: strapiHost,
        pathname: "/uploads/**",
      },
      // Placeholder / development images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
