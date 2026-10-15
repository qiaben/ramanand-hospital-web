"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { CalendarCheck, CircleCheck, ClipboardList, Hospital } from "lucide-react";
import { steps } from "@/data/content";
import { tr, type Lang } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";

const icons = [ClipboardList, CalendarCheck, CircleCheck, Hospital];

function Step({ i, p, lang }: { i: number; p: MotionValue<number>; lang: Lang }) {
  const Icon = icons[i];
  const s = steps[i];
  const at = i / (steps.length - 1);
  // each step lights up as the lifeline reaches it
  const lit = useTransform(p, [Math.max(0, at - 0.16), at], [0, 1]);
  const scale = useTransform(lit, [0, 1], [0.9, 1]);
  const bg = useTransform(lit, [0, 1], ["#dfeafd", "#1550c0"]);
  const fg = useTransform(lit, [0, 1], ["#1550c0", "#ffffff"]);
  return (
    <li className="relative flex items-start gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
      <motion.span style={{ backgroundColor: bg, color: fg, scale }} className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-8 ring-white">
        <Icon className="h-6 w-6" aria-hidden />
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white ring-2 ring-white">{i + 1}</span>
      </motion.span>
      <div className="md:mt-4">
        <h3 className="text-lg text-blue-950">{tr(s.t, lang)}</h3>
        <p className="mt-1 max-w-64 text-[15px] leading-relaxed text-muted md:mx-auto">{tr(s.d, lang)}</p>
      </div>
    </li>
  );
}

/** The patient journey: a lifeline that draws itself as you scroll, with a pulse riding its tip. */
export default function JourneyLine() {
  const lang = useLang();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const w = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <ol ref={ref} className="relative grid gap-10 md:grid-cols-4 md:gap-6">
      {/* horizontal line (desktop) */}
      <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 rounded-full bg-blue-100 md:block" />
      <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 md:block">
        <motion.span style={{ width: w }} className="block h-full rounded-full bg-linear-to-r from-blue-600 to-green-500" />
        <motion.span style={{ left: w }} className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500 shadow-[0_0_14px_5px_rgb(25_135_84/0.45)]" />
      </span>
      {/* vertical line (phones) */}
      <span aria-hidden className="absolute bottom-7 left-7 top-7 w-0.5 rounded-full bg-blue-100 md:hidden" />
      <span aria-hidden className="absolute bottom-7 left-7 top-7 w-0.5 md:hidden">
        <motion.span style={{ height: w }} className="block w-full rounded-full bg-linear-to-b from-blue-600 to-green-500" />
      </span>
      {steps.map((_, i) => (
        <Step key={i} i={i} p={p} lang={lang} />
      ))}
    </ol>
  );
}
