"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Check, Heart, Leaf, ShieldCheck } from "lucide-react";
import { pillars } from "@/data/content";
import { u } from "@/data/ui";
import { tr } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";
import { Eyebrow } from "./Section";
import Logo from "./Logo";
import Pillars from "./Pillars";

const ease = [0.22, 1, 0.36, 1] as const;
const icons = { trust: ShieldCheck, care: Heart, healing: Leaf } as const;

/**
 * Trust, Care and Healing as one pinned scene: the page holds still while you scroll through the three,
 * a pulse of light travelling along the progress line. With reduced motion it falls back to plain cards.
 */
export default function PillarsScene() {
  const lang = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const n = pillars.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n)))));
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (reduce) return <Pillars />;

  const p = pillars[active];
  const Icon = icons[p.key as keyof typeof icons];

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / n) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={ref} style={{ height: `${n * 85 + 15}svh` }} aria-label={u("pillarsTitle", lang)}>
      <div className="bg-feature sticky top-0 flex h-svh flex-col overflow-hidden pt-20 text-white sm:pt-40">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.09)_1.2px,transparent_1.6px)] bg-size-[28px_28px] mask-[linear-gradient(180deg,#000,transparent_90%)]" />
        <Logo size="lg" className="pointer-events-none absolute -bottom-24 -right-16 h-136 w-136 opacity-[0.07]" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pb-24 sm:pb-8">
          <div className="flex items-center justify-between">
            <Eyebrow tone="dark">{u("pillarsEyebrow", lang)}</Eyebrow>
            <p className="text-sm font-bold tracking-widest text-white/60">0{active + 1} / 0{n}</p>
          </div>

          <div className="grid flex-1 items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={p.key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.55, ease }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/12 ring-1 ring-white/25">
                    <Icon className="h-6 w-6 text-lime" aria-hidden />
                  </span>
                  <h2 className="text-grad-light mt-3 pb-[0.14em] text-[clamp(3.4rem,10vw,8.5rem)] font-extrabold leading-[1.05] tracking-tight">{tr(p.title, lang)}</h2>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.ul
                  key={p.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {p.points.map((pt, i) => (
                    <motion.li
                      key={pt.h.en}
                      initial={{ opacity: 0, x: 28 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.12 + i * 0.1, ease }}
                      className="flex gap-3.5 rounded-xl border border-white/15 bg-white/8 p-4 backdrop-blur-sm sm:p-5"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime/90 text-blue-950">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                      </span>
                      <span>
                        <span className="block font-bold">{tr(pt.h, lang)}</span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-white/70 sm:text-[15px]">{tr(pt.t, lang)}</span>
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>

          {/* progress rail with a travelling pulse */}
          <div className="relative mt-4">
            <div aria-hidden className="absolute left-5 right-5 top-5 h-px bg-white/25" />
            <div aria-hidden className="absolute left-5 right-5 top-5 h-px">
              <motion.div style={{ width: fill }} className="h-full bg-linear-to-r from-blue-300 to-lime" />
              <motion.span
                style={{ left: fill }}
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_14px_5px_rgb(127_220_174/0.65)]"
              />
            </div>
            <div className="relative flex justify-between">
              {pillars.map((x, i) => (
                <button
                  key={x.key}
                  onClick={() => jump(i)}
                  aria-current={i === active}
                  className="group flex flex-col items-center gap-2"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-colors duration-500 ${
                      i <= active ? "border-lime bg-lime text-blue-950" : "border-white/30 bg-blue-900 text-white/70 group-hover:border-white/60"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-xs font-semibold transition-colors ${i === active ? "text-white" : "text-white/55"}`}>{tr(x.title, lang)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
