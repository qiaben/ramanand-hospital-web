import type { NextConfig } from "next";

// Static website: `npm run build` writes plain HTML/CSS/JS into the `out` folder,
// which can be uploaded to any host (GitHub Pages, Netlify, cPanel, ...).
const rawBase = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
const basePath = rawBase === "" || rawBase === "/" || rawBase === "root" ? "" : `/${rawBase.replace(/^\/+|\/+$/g, "")}`;

const nextConfig: NextConfig = {
  // Sub-folder for the GitHub Pages preview; empty for the real domain.
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false, // hides the Next.js badge shown only during local development
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
