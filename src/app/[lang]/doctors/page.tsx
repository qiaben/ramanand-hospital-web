import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { u } from "@/data/ui";
import { hasLocale } from "@/lib/i18n";
import { PageHeader } from "@/components/Section";
import DoctorCards from "@/components/DoctorCards";

export async function generateMetadata({ params }: PageProps<"/[lang]/doctors">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? u("doctorsPageTitle", lang) : "Doctors" };
}

export default async function Page({ params }: PageProps<"/[lang]/doctors">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <>
      <PageHeader eyebrow={u("docEyebrow", lang)} title={u("doctorsPageTitle", lang)} sub={u("doctorsPageSub", lang)} />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:pb-32"><h2 className="sr-only">{u("doctorsPageTitle", lang)}</h2><DoctorCards lang={lang} /></section>
    </>
  );
}
