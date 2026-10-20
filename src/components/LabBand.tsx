import Link from "next/link";
import { ArrowRight, Building2, Clock, FlaskConical, Home } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { tr, type Lang } from "@/lib/i18n";
import Reveal from "./Reveal";
import { Eyebrow } from "./Section";

const areas = [
  { en: "Microbiology", hi: "माइक्रोबायोलॉजी" },
  { en: "Biochemistry", hi: "बायोकेमिस्ट्री" },
  { en: "Hematology", hi: "हेमेटोलॉजी" },
  { en: "ECG", hi: "ECG" },
];

/** Home page call to action for booking a lab test slot, by visiting the laboratory or by home collection. */
export default function LabBand({ lang }: { lang: Lang }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:pb-24">
      <Reveal>
        <div className="bg-hero relative overflow-hidden rounded-[2rem] p-7 text-white sm:p-12">
          <div aria-hidden className="pattern-cross absolute inset-0" />
          <FlaskConical aria-hidden strokeWidth={1} className="absolute -right-6 -top-6 h-56 w-56 text-white/10 sm:h-72 sm:w-72" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <div>
              <Eyebrow tone="dark">{tr(site.name, lang)}</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{u("labBandTitle", lang)}</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">{u("labBandSub", lang)}</p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {areas.map((a) => (
                  <li key={a.en} className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold">{tr(a, lang)}</li>
                ))}
                <li className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-blue-900">
                  <Clock className="h-4 w-4 text-green-700" aria-hidden /> {tr(site.labPharmacyText, lang)}
                </li>
              </ul>
            </div>
            <div className="grid gap-3">
              <Link href={`/${lang}/lab-booking`} className="group flex items-center gap-4 rounded-2xl bg-white p-5 text-blue-950 shadow-xl shadow-blue-950/20 transition hover:-translate-y-0.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Building2 className="h-6 w-6" aria-hidden /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{u("labHospital", lang)}</span>
                  <span className="mt-0.5 block text-sm text-muted">{u("labHospitalSub", lang)}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-blue-700 transition group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link href={`/${lang}/lab-booking`} className="group flex items-center gap-4 rounded-2xl bg-white p-5 text-blue-950 shadow-xl shadow-blue-950/20 transition hover:-translate-y-0.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700"><Home className="h-6 w-6" aria-hidden /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{u("labHome", lang)}</span>
                  <span className="mt-0.5 block text-sm text-muted">{u("labHomeSub", lang)}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-green-700 transition group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link href={`/${lang}/lab-booking`} className="btn btn-green justify-center py-4!">
                <FlaskConical className="h-5 w-5" aria-hidden /> {u("bookLabTest", lang)}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
