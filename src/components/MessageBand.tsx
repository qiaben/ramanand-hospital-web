import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { about } from "@/data/content";
import { u } from "@/data/ui";
import { tr, type Lang } from "@/lib/i18n";
import Reveal from "./Reveal";
import { Eyebrow } from "./Section";

/** Short message from the owner, with a link to the full text. */
export default function MessageBand({ lang }: { lang: Lang }) {
  const m = about.message;
  return (
    <section className="bg-blue-50 py-20 sm:py-24">
      <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-10 px-5 lg:grid-cols-[auto_1fr] lg:gap-16">
        <Reveal className="mx-auto text-center">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-white text-5xl font-extrabold text-blue-700 shadow-lg ring-4 ring-white">
            {tr({ en: "AK", hi: "अ" }, lang)}
          </div>
          <p className="mt-4 text-xl font-bold text-blue-950">{tr(m.name, lang)}</p>
          <p className="text-sm text-muted">{tr(m.role, lang)}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Eyebrow>{u("messageEyebrow", lang)}</Eyebrow>
          <Quote className="mt-4 h-9 w-9 text-green-500/60" aria-hidden />
          <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.3rem)] text-blue-950">{tr(m.greeting, lang)}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{tr(m.motto, lang)}</p>
          <Link href={`/${lang}/about#message`} className="btn btn-blue group mt-7">
            {u("readMore", lang)}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
