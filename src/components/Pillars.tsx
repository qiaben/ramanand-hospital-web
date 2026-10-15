"use client";

import { Check, Heart, Leaf, ShieldCheck } from "lucide-react";
import { pillars } from "@/data/content";
import { u } from "@/data/ui";
import { tr } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";
import { SectionHead } from "./Section";
import Reveal from "./Reveal";

const style = {
  trust: { icon: ShieldCheck, tile: "bg-blue-50 text-blue-600", top: "border-t-blue-600", tick: "bg-blue-50 text-blue-600" },
  care: { icon: Heart, tile: "bg-green-50 text-green-700", top: "border-t-green-500", tick: "bg-green-50 text-green-700" },
  healing: { icon: Leaf, tile: "bg-green-50 text-green-700", top: "border-t-blue-400", tick: "bg-blue-50 text-blue-600" },
} as const;

/** Trust, Care and Healing as three plain cards. */
export default function Pillars() {
  const lang = useLang();
  return (
    <section className="bg-mist py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHead center eyebrow={u("pillarsEyebrow", lang)} title={u("pillarsTitle", lang)} />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pillars.map((p, i) => {
            const s = style[p.key as keyof typeof style];
            const Icon = s.icon;
            return (
              <Reveal key={p.key} delay={i * 0.1} className={`card card-hover border-t-4 p-7 ${s.top}`}>
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.tile}`}>
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-2xl text-blue-950">{tr(p.title, lang)}</h3>
                <ul className="mt-5 space-y-4">
                  {p.points.map((pt) => (
                    <li key={pt.h.en} className="flex gap-3">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${s.tick}`}>
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                      <span>
                        <span className="block font-semibold text-blue-950">{tr(pt.h, lang)}</span>
                        <span className="mt-0.5 block text-[15px] leading-relaxed text-muted">{tr(pt.t, lang)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
