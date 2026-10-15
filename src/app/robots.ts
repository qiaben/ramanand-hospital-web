import type { MetadataRoute } from "next";
import { site } from "@/data/content";
import { isPreview } from "@/lib/base-path";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `https://${site.domain}/sitemap.xml` };
}
