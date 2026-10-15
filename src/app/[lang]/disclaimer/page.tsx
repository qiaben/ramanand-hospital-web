import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { disclaimer } from "@/data/legal";
import { hasLocale, tr } from "@/lib/i18n";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/disclaimer">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? tr(disclaimer.title, lang) : "Disclaimer" };
}

export default async function Page({ params }: PageProps<"/[lang]/disclaimer">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LegalPage lang={lang} doc={disclaimer} />;
}
