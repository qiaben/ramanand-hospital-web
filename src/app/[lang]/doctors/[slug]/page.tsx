import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Award, BadgeCheck, Check, Clock, FlaskConical, GraduationCap, Languages, MessageCircle, Phone, ShieldCheck, Wallet } from "lucide-react";
import { deptBySlug, doctorBySlug, doctors, site } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale, locales, tr, trl } from "@/lib/i18n";
import { PageHeader, SectionHead } from "@/components/Section";
import Reveal from "@/components/Reveal";
import { Portrait } from "@/components/DoctorCards";

export function generateStaticParams() {
  return locales.flatMap((lang) => doctors.map((d) => ({ lang, slug: d.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/doctors/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const d = doctorBySlug(slug);
  return { title: d && hasLocale(lang) ? tr(d.name, lang) : "Doctor" };
}

export default async function Page({ params }: PageProps<"/[lang]/doctors/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const d = doctorBySlug(slug);
  if (!d) notFound();
  const dept = deptBySlug(d.department);
  const tone = doctors.indexOf(d) % 2 ? "green" : "blue";
  const about = trl(d.about, lang);
  const langs = trl(d.languages, lang).join(", ");

  const facts = [
    { icon: GraduationCap, k: u("qualification", lang), v: d.qualification },
    { icon: Award, k: u("yearsExp", lang), v: `${d.experienceYears}` },
    { icon: ShieldCheck, k: u("regNo", lang), v: d.registration },
    { icon: Clock, k: u("opdSchedule", lang), v: tr(site.opdText, lang) },
  ];

  const confidence = [
    { icon: BadgeCheck, h: u("confRegistered", lang), t: u("confRegisteredText", lang).replace("{council}", tr(d.council, lang)).replace("{no}", d.registration) },
    { icon: Languages, h: u("confLanguage", lang), t: u("confLanguageText", lang).replace("{langs}", langs) },
    { icon: FlaskConical, h: u("confTests", lang), t: u("confTestsText", lang) },
    { icon: Wallet, h: u("confFees", lang), t: u("confFeesText", lang) },
  ];

  return (
    <>
      <PageHeader eyebrow={dept ? tr(dept.name, lang) : ""} title={tr(d.name, lang)} sub={tr(d.designation, lang)} />

      {/* Introduction: portrait, a warm write-up, and the key facts */}
      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:py-24 lg:grid-cols-[auto_1fr] lg:gap-20">
        <Reveal className="mx-auto lg:sticky lg:top-32 lg:self-start">
          <Portrait initials={tr(d.initials, lang)} size="lg" tone={tone} />
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-700">{d.qualification}</span>
            <span className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-bold text-green-700">{d.experienceYears} {u("yearsExp", lang)}</span>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="inline-flex items-center gap-3 text-[11.5px] font-bold uppercase tracking-[0.24em] text-green-600">
              {u("aboutDoctor", lang)}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-display mt-5 text-[clamp(1.4rem,2.4vw,2rem)] leading-snug text-blue-950">{about[0]}</p>
          </Reveal>
          <div className="mt-6 space-y-5">
            {about.slice(1).map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}><p className="text-lg leading-relaxed text-muted">{p}</p></Reveal>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {facts.map((f, i) => (
              <Reveal key={f.k} delay={i * 0.06}>
                <div className="card flex h-full items-center gap-4 rounded-3xl! p-5">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-md ${i % 2 ? "from-green-400 to-green-700" : "from-blue-400 to-blue-700"}`}>
                    <f.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{f.k}</p>
                    <p className="mt-0.5 text-lg font-semibold text-blue-950">{f.v}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex flex-wrap items-center gap-4">
            <Link href={`/${lang}/appointment?doctor=${d.slug}`} className="btn btn-green group py-4!">
              {u("bookWith", lang)} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
            </Link>
            <a href={`tel:${site.tel}`} className="btn btn-outline py-4!">
              <Phone className="h-4 w-4 text-green-600" aria-hidden /> {site.phoneDisplay}
            </a>
          </Reveal>
        </div>
      </section>

      {/* What this doctor can help with */}
      {dept && (
        <section className="bg-mint pattern-cross-blue">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
            <SectionHead eyebrow={tr(dept.name, lang).split(" (")[0]} title={u("treatsTitle", lang)} />
            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {trl(dept.treatments, lang).map((t, i) => (
                <Reveal as="li" key={t} delay={(i % 2) * 0.08}>
                  <div className="card flex h-full gap-4 rounded-3xl! p-5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-[17px] leading-snug text-blue-950/90">{t}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Reassurance, built only from verifiable facts */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <SectionHead center eyebrow={u("confidenceTitle", lang)} title={u("confidenceTitle", lang)} />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {confidence.map((c, i) => (
            <Reveal as="li" key={c.h} delay={i * 0.08}>
              <div className="card card-hover h-full p-7">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg ${i % 2 ? "from-green-400 to-green-700" : "from-blue-400 to-blue-700"}`}>
                  <c.icon className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="mt-6 text-xl text-blue-950">{c.h}</h3>
                <p className="mt-2 leading-relaxed text-muted">{c.t}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14">
          <div className="bg-hero relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] p-8 text-white sm:flex-row sm:items-center sm:p-10">
            <div aria-hidden className="pattern-cross absolute inset-0" />
            <p className="relative flex max-w-xl items-start gap-3 text-lg leading-snug sm:text-xl">
              <MessageCircle className="mt-1 h-6 w-6 shrink-0 text-lime" aria-hidden />
              {u("needHelp", lang)}
            </p>
            <div className="relative flex flex-wrap gap-3">
              <a href={`tel:${site.tel}`} className="btn btn-ghost"><Phone className="h-4 w-4" aria-hidden /> {site.phoneDisplay}</a>
              <Link href={`/${lang}/appointment?doctor=${d.slug}`} className="btn btn-green">{u("bookWith", lang)}</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
