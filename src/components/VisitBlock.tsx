import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { tr, type Lang } from "@/lib/i18n";
import { SectionHead } from "./Section";
import Reveal from "./Reveal";
import OpenNow from "./OpenNow";
import MapEmbed from "./MapEmbed";

export default function VisitBlock({ lang }: { lang: Lang }) {
  const rows = [
    { icon: MapPin, label: u("address", lang), value: tr(site.address, lang), tone: "bg-blue-50 text-blue-600" },
    { icon: Phone, label: u("phone", lang), value: site.phoneDisplay, href: `tel:${site.tel}`, tone: "bg-green-50 text-green-700" },
    { icon: Mail, label: u("email", lang), value: site.email, href: `mailto:${site.email}`, tone: "bg-blue-50 text-blue-600" },
    { icon: Clock, label: u("timings", lang), value: tr(site.opdText, lang), tone: "bg-green-50 text-green-700" },
  ];
  return (
    <section className="mx-auto grid max-w-7xl items-stretch gap-10 px-5 py-20 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
      <div>
        <SectionHead eyebrow={u("visitEyebrow", lang)} title={u("visitTitle", lang)} />
        <ul className="mt-8 space-y-3">
          {rows.map((r, i) => (
            <Reveal as="li" key={r.label} delay={i * 0.06}>
              <div className="card flex items-center gap-4 p-4">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${r.tone}`}>
                  <r.icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{r.label}</p>
                  <p className="mt-0.5 font-semibold text-blue-950">
                    {r.href ? <a href={r.href} className="break-all transition hover:text-blue-600">{r.value}</a> : r.value}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
        <div className="mt-6"><OpenNow /></div>
      </div>

      <Reveal delay={0.1} className="min-h-96 lg:min-h-0">
        <MapEmbed />
      </Reveal>
    </section>
  );
}
