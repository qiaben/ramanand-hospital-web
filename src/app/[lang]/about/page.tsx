import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Target } from "lucide-react";
import { about, site } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale, tr, trl } from "@/lib/i18n";
import { PageHeader, SectionHead } from "@/components/Section";
import Reveal from "@/components/Reveal";
import Pillars from "@/components/Pillars";
import Logo from "@/components/Logo";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? u("aboutEyebrow", lang) : "About" };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const m = about.message;
  const vm = [
    { k: u("vision", lang), t: tr(about.vision, lang), icon: Eye, tile: "bg-blue-50 text-blue-600", top: "border-t-blue-600" },
    { k: u("mission", lang), t: tr(about.mission, lang), icon: Target, tile: "bg-green-50 text-green-700", top: "border-t-green-500" },
  ];

  return (
    <>
      <PageHeader eyebrow={u("aboutEyebrow", lang)} title={u("aboutTitle", lang)} />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <Reveal>
          <div className="card mx-auto flex aspect-square w-full max-w-xs items-center justify-center rounded-3xl bg-linear-to-b from-blue-50 to-white p-8">
            <Logo size="lg" className="animate-drift h-full w-full drop-shadow-[0_14px_18px_rgb(11_31_71/0.2)]" />
          </div>
        </Reveal>
        <div>
          <SectionHead eyebrow={u("ourStory", lang)} title={tr(site.tagline, lang)} />
          <div className="mt-6 space-y-4">
            {trl(about.history, lang).map((p, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)}><p className="text-base leading-relaxed text-muted sm:text-lg">{p}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 md:grid-cols-2">
        {vm.map((b, i) => (
          <Reveal key={b.k} delay={i * 0.1} className={`card border-t-4 p-8 ${b.top}`}>
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${b.tile}`}><b.icon className="h-6 w-6" aria-hidden /></span>
            <h2 className="mt-5 text-2xl text-blue-950">{b.k}</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted">{b.t}</p>
          </Reveal>
        ))}
      </section>

      <Pillars />

      <section id="message" className="scroll-mt-32 bg-blue-50">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:py-24">
          <SectionHead eyebrow={u("messageTitle", lang)} title={tr(m.greeting, lang)} />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
            {[m.intro, m.motto, m.trust, m.care, m.healing, m.closing].map((p, i) => (
              <Reveal key={i}><p>{tr(p, lang)}</p></Reveal>
            ))}
          </div>
          <Reveal className="mt-10 border-t border-blue-200 pt-6">
            <p className="text-muted">{tr(m.regards, lang)}</p>
            <p className="mt-1 text-2xl font-bold text-blue-950">{tr(m.name, lang)}</p>
            <p className="text-sm text-muted">{tr(m.role, lang)} · {tr(site.name, lang)}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <SectionHead center eyebrow={u("team", lang)} title={u("team", lang)} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {about.team.map((t, i) => (
            <Reveal as="li" key={t.name.en} delay={i * 0.07}>
              <div className="card card-hover h-full p-6 text-center">
                <span className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-extrabold ring-4 ring-white shadow-lg ${i % 2 ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                  {tr(t.name, lang).replace(/^(Dr\.|Mr\.|डॉ\.|श्री)\s*/, "").charAt(0)}
                </span>
                <p className="mt-4 text-lg font-bold text-blue-950">
                  {t.doctor ? <Link href={`/${lang}/doctors/${t.doctor}`} className="transition hover:text-blue-600">{tr(t.name, lang)}</Link> : tr(t.name, lang)}
                </p>
                <p className="mt-1 text-sm text-muted">{tr(t.role, lang)}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
