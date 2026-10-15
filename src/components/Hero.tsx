"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarCheck, CircleCheck, Phone } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { tr } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";
import { Eyebrow } from "./Section";
import { Words } from "./Reveal";
import PointerLight from "./PointerLight";
import Magnetic from "./Magnetic";
import CrestOrbit from "./CrestOrbit";
import Lifeline from "./Lifeline";

const ease = [0.22, 1, 0.36, 1] as const;
const up = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

export default function Hero() {
  const lang = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yCrest = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -24]);

  const [a, b] = lang === "en" ? ["Trust, Care, and", "Healing."] : ["विश्वास, देखभाल और", "उपचार।"];
  const points = lang === "en" ? ["Day Care", "Laboratory", "Pharmacy"] : ["डे केयर", "प्रयोगशाला", "फार्मेसी"];

  return (
    <PointerLight as="section" className="mesh relative overflow-hidden">
      {/* drifting colour, transform only */}
      <div aria-hidden className="animate-blob pointer-events-none absolute -right-40 -top-40 h-160 w-160 rounded-full bg-[radial-gradient(closest-side,rgb(36_104_212/0.16),transparent)]" />
      <div aria-hidden className="animate-blob pointer-events-none absolute -bottom-52 -left-40 h-136 w-136 rounded-full bg-[radial-gradient(closest-side,rgb(25_135_84/0.13),transparent)] [animation-delay:-11s]" />
      {/* dot grid that lights up around the pointer */}
      <div aria-hidden className="dot-faint pointer-events-none absolute inset-0 [mask-image:linear-gradient(180deg,#000,transparent_85%)]" />
      <div aria-hidden className="dot-lit pointer-events-none absolute inset-0" />

      <div ref={ref} className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-36 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-44 lg:pt-16">
        <motion.div style={{ y: yText }}>
          <motion.div {...up(0)}><Eyebrow>{u("heroEyebrow", lang)}</Eyebrow></motion.div>
          <h1 className="mt-4 text-[clamp(2.4rem,5.2vw,4.1rem)] leading-[1.1] text-blue-950" aria-label={tr(site.tagline, lang)}>
            <Words text={a} immediate delay={0.1} />{" "}
            <Words text={b} immediate delay={0.3} wordClass="text-grad" />
          </h1>
          <motion.p {...up(0.5)} className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{u("heroSub", lang)}</motion.p>

          <motion.div {...up(0.62)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href={`/${lang}/appointment`} className="btn btn-green group px-6! py-3.5!">
                <CalendarCheck className="h-5 w-5" aria-hidden />
                {u("requestAppt", lang)}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </Magnetic>
            <Magnetic strength={0.18}>
              <a href={`tel:${site.tel}`} className="btn btn-outline px-6! py-3.5!">
                <Phone className="h-4 w-4 text-green-700" aria-hidden />
                {site.phoneDisplay}
              </a>
            </Magnetic>
          </motion.div>

          <motion.ul {...up(0.74)} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-blue-900">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 text-green-700" aria-hidden />
                {p}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          style={{ y: yCrest }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease }}
        >
          <CrestOrbit />
        </motion.div>
      </div>

      {/* the lifeline: a pulse of light forever travelling along a heartbeat */}
      <div className="pointer-events-none absolute inset-x-0 bottom-14 text-blue-600">
        <Lifeline className="h-14 w-full" />
      </div>
    </PointerLight>
  );
}
