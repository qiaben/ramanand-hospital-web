"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Heart, Leaf, Pause, Play, ShieldCheck } from "lucide-react";
import { pillars } from "@/data/content";
import { u } from "@/data/ui";
import { tr } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";
import { Eyebrow } from "./Section";
import Logo from "./Logo";

const ease = [0.22, 1, 0.36, 1] as const;
const SLIDE_MS = 6500;
const icons = { trust: ShieldCheck, care: Heart, healing: Leaf } as const;
// every card gets its own tint so the three are told apart at a glance
const tints = [
  "from-blue-500/45 via-blue-700/30 to-blue-950/60",
  "from-green-500/40 via-blue-700/30 to-blue-950/60",
  "from-lime/30 via-green-700/30 to-blue-950/60",
];

/**
 * Trust, Care and Healing as a 3D cover-flow. The front card faces you, the other two tilt back on either
 * side, and every few seconds the ring turns so the next card glides to the front.
 * It pauses on hover, on focus, when off screen, or when paused with the button, and it can be driven
 * with the arrows, the keyboard, the progress bars, a click on a side card, or a swipe.
 * With reduced motion it never advances by itself.
 */
export default function PillarsCoverflow() {
  const lang = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const n = pillars.length;

  const [active, setActive] = useState(0);
  const [turns, setTurns] = useState(0); // restarts the progress bar even when the slide index repeats
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const paused = !!reduce || userPaused || hover || focus || !inView;

  const go = useCallback((to: number) => { setActive(((to % n) + n) % n); setTurns((t) => t + 1); }, [n]);
  const next = useCallback(() => { setActive((a) => (a + 1) % n); setTurns((t) => t + 1); }, [n]);
  const prev = useCallback(() => { setActive((a) => (a - 1 + n) % n); setTurns((t) => t + 1); }, [n]);

  const label = (i: number) => (u("slideOf", lang) as string).replace("{n}", String(i + 1)).replace("{total}", String(n));

  return (
    <section
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label={u("pillarsTitle", lang)}
      className="bg-feature relative overflow-hidden py-20 text-white sm:py-28"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      // only keyboard focus pauses autoplay; a mouse click on an arrow must not leave it paused for good
      onFocusCapture={(e) => setFocus((e.target as HTMLElement).matches(":focus-visible"))}
      onBlurCapture={() => setFocus(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.09)_1.2px,transparent_1.6px)] bg-size-[28px_28px] mask-[linear-gradient(180deg,#000,transparent_90%)]" />
      <Logo size="lg" className="pointer-events-none absolute -bottom-24 -right-16 h-136 w-136 opacity-[0.06]" />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow tone="dark">{u("pillarsEyebrow", lang)}</Eyebrow>
            <p className="mt-3 max-w-md text-2xl font-bold sm:text-3xl">{u("pillarsTitle", lang)}</p>
          </div>
          <div className="flex items-center gap-2" role="group" aria-label={u("pillarsTitle", lang)}>
            <button onClick={prev} aria-label={u("prevSlide", lang)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/8 transition hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              onClick={() => setUserPaused((v) => !v)}
              aria-label={userPaused || reduce ? u("playSlides", lang) : u("pauseSlides", lang)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/8 transition hover:bg-white/20"
            >
              {userPaused || reduce ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
            </button>
            <button onClick={next} aria-label={u("nextSlide", lang)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-950 transition hover:bg-lime">
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        {/* the turntable */}
        <div className="relative mt-10 h-[41rem] sm:mt-12 sm:h-[38rem]" style={{ perspective: 1600 }} aria-live={paused ? "polite" : "off"}>
          {/* a soft pool of light under the cards */}
          <div aria-hidden className="absolute inset-x-[8%] bottom-0 h-16 rounded-[100%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.45),transparent)]" />

          {pillars.map((p, i) => {
            const off = ((i - active + n + 1) % n) - 1; // -1, 0 or 1, wrapping around
            const front = off === 0;
            const Icon = icons[p.key as keyof typeof icons];
            return (
              <motion.div
                key={p.key}
                role="group"
                aria-roledescription="slide"
                aria-label={label(i)}
                inert={!front}
                initial={false}
                animate={{
                  x: `${off * 70}%`,
                  rotateY: off * -40,
                  scale: front ? 1 : 0.8,
                  opacity: front ? 1 : 0.5,
                }}
                transition={{ duration: 0.95, ease }}
                style={{ zIndex: front ? 30 : 10, transformPerspective: 1600 }}
                drag={front ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) next();
                  else if (info.offset.x > 70) prev();
                }}
                className={`absolute inset-y-0 left-0 right-0 mx-auto w-[86%] touch-pan-y sm:w-[62%] lg:w-[46rem] ${front ? "cursor-grab active:cursor-grabbing" : ""}`}
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-blue-950 p-6 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] sm:p-9">
                  <div aria-hidden className={`absolute inset-0 bg-linear-to-br ${tints[i % tints.length]}`} />
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.14),transparent_38%)]" />
                  <Icon aria-hidden strokeWidth={1} className="absolute -right-8 -top-8 h-56 w-56 text-white/10" />

                  <div className="relative flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/12 ring-1 ring-white/25">
                      <Icon className="h-6 w-6 text-lime" aria-hidden />
                    </span>
                    <span className="text-sm font-bold tracking-widest text-white/65">0{i + 1} / 0{n}</span>
                  </div>
                  <h3 className="text-grad-light relative mt-4 pb-[0.14em] text-[clamp(3rem,7vw,5.2rem)] font-extrabold leading-[1.05] tracking-tight">
                    {tr(p.title, lang)}
                  </h3>

                  <ul className="relative mt-2 space-y-2.5 sm:space-y-3">
                    {p.points.map((pt) => (
                      <li key={pt.h.en} className="flex gap-3 rounded-xl border border-white/15 bg-white/8 p-3 sm:p-3.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/90 text-blue-950">
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                        </span>
                        <span>
                          <span className="block text-[15px] font-bold">{tr(pt.h, lang)}</span>
                          <span className="mt-0.5 block text-[13px] leading-relaxed text-white/70 sm:text-sm">{tr(pt.t, lang)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* a side card is a big button: click it to bring it to the front */}
                {!front && (
                  <button onClick={() => go(i)} aria-label={`${tr(p.title, lang)}, ${label(i)}`} className="absolute inset-0 z-10 cursor-pointer rounded-[2rem]" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* story-style progress: the current bar fills, then the ring turns */}
        <ol className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          {pillars.map((x, i) => (
            <li key={x.key}>
              <button onClick={() => go(i)} aria-current={i === active} className="group block w-full text-left">
                <span className="relative block h-1.5 overflow-hidden rounded-full bg-white/20">
                  {i === active ? (
                    <span
                      key={`${active}-${turns}`}
                      className="slide-fill absolute inset-0 bg-lime"
                      style={{
                        ["--slide-ms" as string]: `${SLIDE_MS}ms`,
                        animationPlayState: paused ? "paused" : "running",
                        ...(reduce ? { animation: "none", transform: "scaleX(1)" } : null),
                      }}
                      onAnimationEnd={next}
                    />
                  ) : null}
                </span>
                <span className={`mt-2.5 flex items-baseline gap-2 text-sm font-semibold transition-colors ${i === active ? "text-white" : "text-white/55 group-hover:text-white/80"}`}>
                  <span className="text-xs tracking-widest">0{i + 1}</span>
                  {tr(x.title, lang)}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
