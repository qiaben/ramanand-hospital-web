import Link from "next/link";
import { ArrowRight, Baby, Check, Stethoscope } from "lucide-react";
import { departments, doctorBySlug } from "@/data/content";
import { u } from "@/data/ui";
import { tr, trl, type Lang } from "@/lib/i18n";
import Reveal from "./Reveal";
import Tilt from "./Tilt";

const icons = { Baby, Stethoscope };
const tones = [
  { top: "border-t-blue-600", tile: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white", tick: "text-blue-600", link: "text-blue-700" },
  { top: "border-t-green-500", tile: "bg-green-50 text-green-700 group-hover:bg-green-600 group-hover:text-white", tick: "text-green-700", link: "text-green-700" },
];

export default function DeptCards({ lang }: { lang: Lang }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {departments.map((d, i) => {
        const Icon = icons[d.icon];
        const head = doctorBySlug(d.head);
        const t = tones[i % 2];
        return (
          <Reveal key={d.slug} delay={i * 0.1} className="h-full">
            <Tilt className="h-full">
              <Link href={`/${lang}/departments/${d.slug}`} className={`card card-hover edge-glow group flex h-full flex-col border-t-4 p-7 ${t.top}`}>
                <span className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-500 ${t.tile}`}>
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="mt-5 text-2xl text-blue-950">{tr(d.name, lang)}</h3>
                <p className="mt-2 leading-relaxed text-muted">{tr(d.short, lang)}</p>

                <ul className="mt-5 space-y-2.5">
                  {trl(d.treatments, lang).slice(0, 3).map((x) => (
                    <li key={x} className="flex gap-2.5 text-[15px] text-blue-950/85">
                      <Check className={`mt-1 h-4 w-4 shrink-0 ${t.tick}`} strokeWidth={3} aria-hidden />
                      {x.split(" (")[0]}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-5">
                  <p className="text-sm text-muted">
                    {u("headOfDept", lang)}
                    <span className="block font-semibold text-blue-950">{head && tr(head.name, lang)}</span>
                  </p>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${t.link}`}>
                    {u("explore", lang)}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Tilt>
          </Reveal>
        );
      })}
    </div>
  );
}
