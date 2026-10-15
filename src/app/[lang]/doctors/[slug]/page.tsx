import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Award, Clock, GraduationCap, Languages, ShieldCheck, Stethoscope } from "lucide-react";
import { deptBySlug, doctorBySlug, doctors, site } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale, locales, tr, trl } from "@/lib/i18n";
import { PageHeader } from "@/components/Section";
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

  const facts = [
    { icon: GraduationCap, k: u("qualification", lang), v: d.qualification },
    { icon: Award, k: u("yearsExp", lang), v: `${d.experienceYears}` },
    { icon: ShieldCheck, k: u("regNo", lang), v: d.registration },
    { icon: Stethoscope, k: u("council", lang), v: tr(d.council, lang) },
    { icon: Clock, k: u("opdSchedule", lang), v: tr(site.opdText, lang) },
    { icon: Languages, k: u("languages", lang), v: trl(d.languages, lang).join(" · ") },
  ];

  return (
    <>
      <PageHeader eyebrow={dept ? tr(dept.name, lang) : ""} title={tr(d.name, lang)} sub={tr(d.designation, lang)} />
      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:py-24 lg:grid-cols-[auto_1fr] lg:gap-20">
        <Reveal className="mx-auto"><Portrait initials={tr(d.initials, lang)} size="lg" tone={tone} /></Reveal>
        <div>
          <div className="grid gap-5 sm:grid-cols-2">
            {facts.map((f, i) => (
              <Reveal key={f.k} delay={i * 0.06}>
                <div className="card card-hover flex h-full gap-4 rounded-3xl! p-5">
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
          <Reveal className="mt-10">
            <Link href={`/${lang}/appointment?doctor=${d.slug}`} className="btn btn-green group py-4!">
              {u("bookWith", lang)} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
