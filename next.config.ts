import type { NextConfig } from "next";

// The site is served from https://obakefilter.github.io/text-transpose/, so the
// base path is the repository name. Override with NEXT_PUBLIC_BASE_PATH (use an
// empty string for a root deployment such as Vercel or a custom domain).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/text-transpose";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
