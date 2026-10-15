import type { NextConfig } from "next";

// Static website: `npm run build` writes plain HTML/CSS/JS into the `out` folder,
// which can be uploaded to any host (GitHub Pages, Netlify, cPanel, ...).
const nextConfig: NextConfig = {
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
