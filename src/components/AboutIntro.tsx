"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { animate, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { about, departments, doctors, facilities, site } from "@/data/content";
import { u } from "@/data/ui";
import { tr, trl } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";
import Reveal from "./Reveal";
import { SectionHead } from "./Section";

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(to);
      return;
    }
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => (el.textContent = String(Math.round(v))) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>0</span>;
}

/** Short "about" with four plain facts. Every number comes from the site's own data. */
export default function AboutIntro() {
  const lang = useLang();
  const beds = Number(facilities.find((f) => f.key === "daycare")?.stat ?? 0);
  const facts = [
    { n: departments.length, l: { en: "Departments", hi: "विभाग" } },
    { n: doctors.length, l: { en: "Registered doctors", hi: "पंजीकृत डॉक्टर" } },
    { n: beds, l: { en: "Day-care beds", hi: "डे-केयर बिस्तर" } },
    { n: 6, l: { en: "OPD days a week", hi: "सप्ताह में ओपीडी के दिन" } },
  ];
  return (
    <section className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-12 px-5 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionHead eyebrow={u("aboutEyebrow", lang)} title={`${u("aboutEyebrow", lang)}: ${tr(site.name, lang)}`} />
        <div className="mt-5 space-y-4">
          {trl(about.history, lang).map((p, i) => (
            <Reveal key={i} delay={0.08 * (i + 1)}><p className="text-base leading-relaxed text-muted sm:text-lg">{p}</p></Reveal>
          ))}
        </div>
        <Reveal delay={0.25} className="mt-7">
          <Link href={`/${lang}/about`} className="btn btn-outline group">
            {u("learnMore", lang)}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </Reveal>
      </div>

      <dl className="grid grid-cols-2 gap-4">
        {facts.map((f, i) => (
          <Reveal key={f.l.en} delay={i * 0.07} className="card px-6 py-8 text-center">
            <dd className="text-5xl font-extrabold text-blue-600"><Count to={f.n} /></dd>
            <dt className="mt-2 text-sm font-semibold text-muted">{f.l[lang]}</dt>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
