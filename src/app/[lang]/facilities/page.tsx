import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlaskConical } from "lucide-react";
import { u } from "@/data/ui";
import { hasLocale } from "@/lib/i18n";
import { PageHeader } from "@/components/Section";
import FacilityGrid from "@/components/FacilityGrid";
import Reveal from "@/components/Reveal";

export async function generateMetadata({ params }: PageProps<"/[lang]/facilities">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? u("facPageTitle", lang) : "Facilities" };
}

export default async function Page({ params }: PageProps<"/[lang]/facilities">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const labs = lang === "en" ? ["Microbiology", "Biochemistry", "Hematology", "ECG"] : ["माइक्रोबायोलॉजी", "बायोकेमिस्ट्री", "हेमेटोलॉजी", "ECG"];
  return (
    <>
      <PageHeader eyebrow={u("facEyebrow", lang)} title={u("facPageTitle", lang)} sub={u("facPageSub", lang)} />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:pb-32"><h2 className="sr-only">{u("facPageTitle", lang)}</h2><FacilityGrid lang={lang} /></section>
      <section className="bg-mint pattern-cross-blue">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <h2 className="flex items-center gap-4 text-3xl text-blue-950 sm:text-4xl">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-green-400 to-green-700 text-white shadow-lg"><FlaskConical className="h-6 w-6" aria-hidden /></span>
            {u("labCovers", lang)}
          </h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {labs.map((l, i) => (
              <Reveal as="li" key={l} delay={i * 0.07} className="card font-display rounded-full! px-8 py-4 text-xl text-blue-900">{l}</Reveal>
            ))}
          </ul>
          {/* PENDING: the client asked for "all the tests" to be listed but has not supplied the list. */}
          <p className="mt-8 max-w-xl text-muted">{u("testsNote", lang)}</p>
        </div>
      </section>
    </>
  );
}
