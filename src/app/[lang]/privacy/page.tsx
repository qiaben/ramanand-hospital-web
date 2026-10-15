import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { privacy } from "@/data/legal";
import { hasLocale, tr } from "@/lib/i18n";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? tr(privacy.title, lang) : "Privacy" };
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LegalPage lang={lang} doc={privacy} />;
}
