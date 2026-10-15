import Link from "next/link";
import { ArrowRight, CalendarCheck, Phone } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import type { Lang } from "@/lib/i18n";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import Lifeline from "./Lifeline";
import Logo from "./Logo";

/** Closing call to action: the deep blue of the feature scene, with the lifeline running along the bottom. */
export default function CtaBand({ lang }: { lang: Lang }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:pb-24">
      <Reveal>
        <div className="bg-feature relative overflow-hidden rounded-2xl px-7 pb-20 pt-10 text-white sm:px-12 sm:pb-24">
          <Logo size="md" className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 opacity-[0.1]" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] text-white">{u("apptTitle", lang)}</h2>
              <p className="mt-2 max-w-lg text-white/75">{u("apptSub", lang)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <Link href={`/${lang}/appointment`} className="btn btn-green group">
                  <CalendarCheck className="h-5 w-5" aria-hidden />
                  {u("requestAppt", lang)}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </Magnetic>
              <Magnetic strength={0.18}>
                <a href={`tel:${site.tel}`} className="btn btn-ghost">
                  <Phone className="h-4 w-4" aria-hidden />
                  {site.phoneDisplay}
                </a>
              </Magnetic>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-5 text-white">
            <Lifeline pulse="#7fdcae" className="h-12 w-full" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
