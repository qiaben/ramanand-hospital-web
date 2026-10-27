import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Crown, Package, Wrench } from "lucide-react";
import { departments, deptBySlug, doctorBySlug, doctors } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale, locales, tr, trl } from "@/lib/i18n";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";
import { Portrait } from "@/components/DoctorCards";

export function generateStaticParams() {
  return locales.flatMap((lang) => departments.map((d) => ({ lang, slug: d.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/departments/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const d = deptBySlug(slug);
  return { title: d && hasLocale(lang) ? tr(d.name, lang) : "Department" };
}

function Panel({ title, icon: Icon, tone, children }: { title: string; icon: typeof Check; tone: "blue" | "green"; children: React.ReactNode }) {
  return (
    <div className="card h-full p-8 sm:p-10">
      <div className="flex items-center gap-4">
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg ${tone === "blue" ? "from-blue-400 to-blue-700" : "from-green-400 to-green-700"}`}>
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="text-3xl text-blue-950">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Ticks({ items, tone }: { items: string[]; tone: "blue" | "green" }) {
  return (
    <ul className="space-y-3.5">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-[17px] text-blue-950/85">
          <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${tone === "blue" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
            <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

export default async function Page({ params }: PageProps<"/[lang]/departments/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const d = deptBySlug(slug);
  if (!d) notFound();
  const head = doctorBySlug(d.head);
  const docs = doctors.filter((x) => x.department === d.slug);

  return (
    <>
      <PageHeader eyebrow={u("department", lang)} title={tr(d.name, lang)} sub={tr(d.short, lang)} />

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:pb-28 sm:pt-20">
        <Reveal><p className="max-w-3xl text-[clamp(1.2rem,2vw,1.55rem)] font-medium leading-relaxed text-blue-950/90">{tr(d.description, lang)}</p></Reveal>

        <div className="mt-14 grid grid-cols-1 gap-7 lg:grid-cols-2">
          <Reveal><Panel title={u("treatments", lang)} icon={Crown} tone="blue"><Ticks items={trl(d.treatments, lang)} tone="blue" /></Panel></Reveal>
          <div className="grid gap-7">
            <Reveal delay={0.1}><Panel title={u("equipment", lang)} icon={Wrench} tone="green"><Ticks items={trl(d.equipment, lang)} tone="green" /></Panel></Reveal>
            <Reveal delay={0.2}>
              <Panel title={u("healthPackages", lang)} icon={Package} tone="blue">
                <p className="text-muted">{u("updatingSoon", lang)}</p>
              </Panel>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-mint pattern-cross-blue">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <h2 className="text-4xl text-blue-950">{u("inThisDept", lang)}</h2>
          <div className="mt-10 flex flex-wrap gap-8">
            {docs.map((doc, i) => (
              <Reveal key={doc.slug}>
                <Link href={`/${lang}/doctors/${doc.slug}`} className="card card-hover group flex items-center gap-6 p-5 pr-9">
                  <Portrait initials={tr(doc.initials, lang)} tone={i % 2 ? "green" : "blue"} />
                  <span>
                    <span className="font-display block text-3xl text-blue-950 transition group-hover:text-blue-600">{tr(doc.name, lang)}</span>
                    <span className="mt-1 block text-muted">{doc.qualification}</span>
                    {head?.slug === doc.slug && (
                      <span className="mt-3 inline-block rounded-full bg-green-100 px-3.5 py-1 text-xs font-bold text-green-700">{u("headOfDept", lang)}</span>
                    )}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14">
            <Link href={`/${lang}/appointment?dept=${d.slug}`} className="btn btn-green group py-4!">
              {u("requestAppt", lang)} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
