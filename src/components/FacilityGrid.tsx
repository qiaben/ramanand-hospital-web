import Link from "next/link";
import { ArrowRight, BedDouble, Microscope, Pill } from "lucide-react";
import { facilities } from "@/data/content";
import { u } from "@/data/ui";
import { tr, type Lang } from "@/lib/i18n";
import Reveal from "./Reveal";
import Tilt from "./Tilt";

const style = {
  daycare: { icon: BedDouble, tile: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" },
  lab: { icon: Microscope, tile: "bg-green-50 text-green-700 group-hover:bg-green-600 group-hover:text-white" },
  pharmacy: { icon: Pill, tile: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" },
} as const;

export default function FacilityGrid({ lang }: { lang: Lang }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {facilities.map((f, i) => {
        const s = style[f.key as keyof typeof style];
        const Icon = s.icon;
        return (
          <Reveal key={f.key} delay={i * 0.08} className="h-full sm:max-lg:last:odd:col-span-2">
            <Tilt className="h-full">
              <Link href={`/${lang}/facilities/${f.key}`} className="card card-hover edge-glow group flex h-full flex-col p-7">
                <div className="flex items-start justify-between">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-500 ${s.tile}`}>
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  {/^\d+$/.test(f.stat) && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{f.stat} {lang === "en" ? "beds" : "बिस्तर"}</span>
                  )}
                </div>
                <h3 className="mt-5 text-xl text-blue-950">{tr(f.title, lang)}</h3>
                <p className="mt-2 leading-relaxed text-muted">{tr(f.text, lang)}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-blue-700">
                  {u("viewFacility", lang)}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Tilt>
          </Reveal>
        );
      })}
    </div>
  );
}
