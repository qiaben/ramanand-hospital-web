"use client";

import Link from "next/link";
import { CalendarCheck, FlaskConical, MapPin, Phone, Stethoscope } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { useLang } from "@/lib/lang-context";
import Reveal from "./Reveal";

/** Four quick actions straight under the hero, like most hospital sites. */
export default function QuickActions() {
  const lang = useLang();
  const items = [
    { icon: CalendarCheck, title: u("requestAppt", lang), sub: u("qaApptSub", lang), href: `/${lang}/appointment`, tone: "green" },
    { icon: FlaskConical, title: u("bookLabTest", lang), sub: u("qaLabSub", lang), href: `/${lang}/lab-booking`, tone: "green" },
    { icon: Stethoscope, title: u("findDoctor", lang), sub: u("qaDoctorSub", lang), href: `/${lang}/doctors`, tone: "blue" },
    { icon: Phone, title: u("callUs", lang), sub: site.phoneDisplay, href: `tel:${site.tel}`, tone: "green" },
    { icon: MapPin, title: u("getDirections", lang), sub: u("qaMapSub", lang), href: site.mapUrl, tone: "blue", external: true },
  ];
  return (
    <section className="relative z-10 mx-auto -mt-14 max-w-7xl px-5">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 sm:max-lg:[&>li:last-child:nth-child(odd)]:col-span-2">
        {items.map((it, i) => {
          const Icon = it.icon;
          const inner = (
            <>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${it.tone === "green" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-600"}`}>
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-blue-950">{it.title}</span>
                <span className="mt-0.5 block text-sm leading-snug text-muted">{it.sub}</span>
              </span>
            </>
          );
          const cls = "card card-hover flex items-center gap-4 p-5";
          return (
            <Reveal as="li" key={it.title} delay={i * 0.06}>
              {it.external ? (
                <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              ) : it.href.startsWith("tel:") ? (
                <a href={it.href} className={cls}>{inner}</a>
              ) : (
                <Link href={it.href} className={cls}>{inner}</Link>
              )}
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
