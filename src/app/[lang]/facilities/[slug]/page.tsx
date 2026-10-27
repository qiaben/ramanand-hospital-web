import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, BedDouble, CalendarCheck, FlaskConical, Check, Info, Microscope, Phone, Pill } from "lucide-react";
import { facilities, site } from "@/data/content";
import { facilityDetails } from "@/data/facility-details";
import { u } from "@/data/ui";
import { hasLocale, locales, tr, trl } from "@/lib/i18n";
import { PageHeader, SectionHead } from "@/components/Section";
import Reveal from "@/components/Reveal";

const icons = { daycare: BedDouble, lab: Microscope, pharmacy: Pill } as const;

export function generateStaticParams() {
  return locales.flatMap((lang) => facilities.map((f) => ({ lang, slug: f.key })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/facilities/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const f = facilities.find((x) => x.key === slug);
  return { title: f && hasLocale(lang) ? tr(f.title, lang) : "Facility" };
}

export default async function Page({ params }: PageProps<"/[lang]/facilities/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const f = facilities.find((x) => x.key === slug);
  const detail = f && facilityDetails[f.key];
  if (!f || !detail) notFound();

  const Icon = icons[f.key as keyof typeof icons];
  const intro = trl(detail.intro, lang);
  const others = facilities.filter((x) => x.key !== f.key);

  return (
    <>
      <PageHeader eyebrow={u("facEyebrow", lang)} title={tr(f.title, lang)} sub={tr(f.text, lang)} />

      {/* Introduction with the key facts */}
      <section className="mx-auto grid grid-cols-1 max-w-7xl items-start gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
        <div>
          <Reveal>
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-400 to-blue-700 text-white shadow-lg">
              <Icon className="h-8 w-8" aria-hidden />
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-display mt-7 text-[clamp(1.4rem,2.4vw,2rem)] leading-snug text-blue-950">{intro[0]}</p>
          </Reveal>
          <div className="mt-6 space-y-5">
            {intro.slice(1).map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}><p className="text-lg leading-relaxed text-muted">{p}</p></Reveal>
            ))}
          </div>
          <Reveal className="mt-9 flex flex-wrap items-center gap-4">
            <Link href={`/${lang}/appointment`} className="btn btn-green group py-4!">
              <CalendarCheck className="h-5 w-5" aria-hidden />
              {u("requestAppt", lang)}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
            </Link>
            <a href={`tel:${site.tel}`} className="btn btn-outline py-4!">
              <Phone className="h-4 w-4 text-green-600" aria-hidden /> {site.phoneDisplay}
            </a>
          </Reveal>
          {f.key === "lab" && (
            <Reveal delay={0.1} className="mt-8">
              <div className="rounded-3xl border border-green-200 bg-green-50 p-5 sm:p-6">
                <p className="text-[15px] leading-relaxed text-blue-950/85">{u("bookLabNote", lang)}</p>
                <Link href={`/${lang}/lab-booking`} className="btn btn-green group mt-4 py-4!">
                  <FlaskConical className="h-5 w-5" aria-hidden />
                  {u("bookLabTest", lang)}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1}>
          <dl className="card divide-y divide-line p-2">
            {detail.facts.map((fact) => (
              <div key={fact.k.en} className="px-5 py-5">
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{tr(fact.k, lang)}</dt>
                <dd className="font-display mt-1 text-2xl text-blue-950">{tr(fact.v, lang)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* What is here */}
      <section className="bg-mint pattern-cross-blue">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <SectionHead eyebrow={tr(f.title, lang)} title={tr(detail.offersTitle, lang)} />
          <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {detail.offers.map((o, i) => (
              <Reveal as="li" key={o.h.en} delay={(i % 2) * 0.08}>
                <div className="card card-hover flex h-full gap-5 rounded-3xl! p-6 sm:p-7">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <Check className="h-5 w-5" strokeWidth={3} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-xl text-blue-950 sm:text-2xl">{tr(o.h, lang)}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{tr(o.t, lang)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Good to know */}
      <section className="mx-auto max-w-4xl px-5 py-20 sm:py-28">
        <SectionHead center eyebrow={u("goodToKnow", lang)} title={u("goodToKnow", lang)} />
        <ul className="mt-12 space-y-4">
          {detail.goodToKnow.map((g, i) => (
            <Reveal as="li" key={i} delay={i * 0.07}>
              <div className="card flex gap-4 rounded-3xl! p-5 sm:p-6">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Info className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-lg leading-relaxed text-blue-950/90">{tr(g, lang)}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12">
          <div className="bg-hero relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] p-8 text-white sm:flex-row sm:items-center sm:p-10">
            <div aria-hidden className="pattern-cross absolute inset-0" />
            <p className="relative max-w-md text-lg leading-snug sm:text-xl">{u("facHelp", lang)}</p>
            <div className="relative flex flex-wrap gap-3">
              <a href={`tel:${site.tel}`} className="btn btn-ghost"><Phone className="h-4 w-4" aria-hidden /> {site.phoneDisplay}</a>
              <Link href={`/${lang}/appointment`} className="btn btn-green">{u("requestAppt", lang)}</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* The other two facilities */}
      <section className="border-t border-line bg-mist">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <h2 className="text-3xl text-blue-950">{u("otherFacilities", lang)}</h2>
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {others.map((o) => {
              const OIcon = icons[o.key as keyof typeof icons];
              return (
                <li key={o.key}>
                  <Link href={`/${lang}/facilities/${o.key}`} className="card card-hover group flex items-center gap-5 rounded-3xl! p-5">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors duration-500 group-hover:bg-blue-600 group-hover:text-white">
                      <OIcon className="h-7 w-7" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-display block text-2xl text-blue-950">{tr(o.title, lang)}</span>
                      <span className="mt-0.5 block text-sm text-muted">{tr(o.text, lang)}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-blue-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
