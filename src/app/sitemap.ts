import type { MetadataRoute } from "next";
import { departments, doctors, site } from "@/data/content";
import { locales } from "@/lib/i18n";
import { isPreview } from "@/lib/base-path";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];
  const base = `https://${site.domain}`;
  const pages = [
    "", "/about", "/departments", "/doctors", "/facilities", "/patient-info", "/appointment", "/contact", "/privacy", "/disclaimer",
    ...departments.map((d) => `/departments/${d.slug}`),
    ...doctors.map((d) => `/doctors/${d.slug}`),
  ];
  return locales.flatMap((lang) =>
    pages.map((p) => ({
      url: `${base}/${lang}${p}/`,
      alternates: { languages: { en: `${base}/en${p}/`, hi: `${base}/hi${p}/` } },
    })),
  );
}
