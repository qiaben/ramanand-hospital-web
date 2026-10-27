import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, LifeBuoy, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale, tr } from "@/lib/i18n";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import VisitBlock from "@/components/VisitBlock";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? u("contactTitle", lang) : "Contact" };
}

export default async function Page({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const rows = [
    { icon: Mail, k: u("email", lang), v: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, k: u("address", lang), v: tr(site.address, lang) },
    { icon: Clock, k: u("timings", lang), v: tr(site.opdText, lang) },
    { icon: Clock, k: u("labPharmacyHours", lang), v: tr(site.labPharmacyText, lang) },
  ];

  // The client gave one number for reception, appointments, emergency and ambulance.
  const numbers = [
    { k: u("lblReception", lang), v: site.phoneDisplay },
    { k: u("lblAppointments", lang), v: site.phoneDisplay },
    { k: u("lblEmergency", lang), v: site.phoneDisplay },
    { k: u("lblAmbulance", lang), v: site.phoneDisplay },
  ];

  return (
    <>
      <PageHeader eyebrow={u("contactTitle", lang)} title={u("contactTitle", lang)} sub={u("contactSub", lang)} />

      <section className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-5 pb-20 pt-16 sm:pb-28 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-4">
          <Reveal>
            <div className="card p-5 sm:p-6">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                <Phone className="h-4 w-4 text-green-700" aria-hidden /> {u("phoneNumbers", lang)}
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {numbers.map((n) => (
                  <li key={n.k}>
                    <a href={`tel:${site.tel}`} className="group flex items-center justify-between gap-3 rounded-xl bg-mist px-4 py-3.5 transition hover:bg-blue-100">
                      <span className="text-sm font-semibold text-muted">{n.k}</span>
                      <span className="font-bold text-blue-950 transition group-hover:text-blue-600">{n.v}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-muted">{u("numbersNote", lang)}</p>
            </div>
          </Reveal>

          {rows.map((r, i) => (
            <Reveal key={r.k} delay={i * 0.07}>
              <div className="card card-hover flex items-center gap-5 p-5">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-md ${i % 2 ? "from-green-400 to-green-700" : "from-blue-400 to-blue-700"}`}>
                  <r.icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{r.k}</p>
                  <p className="mt-0.5 text-lg font-semibold text-blue-950">
                    {r.href ? <a href={r.href} className="break-all hover:text-blue-600">{r.v}</a> : r.v}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal>
            <div className="rounded-2xl bg-mint p-7 ring-1 ring-green-200">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-green-700">
                <LifeBuoy className="h-4 w-4" aria-hidden /> {u("grievance", lang)}
              </p>
              <p className="mt-2 text-muted">{u("grievanceText", lang)}</p>
              <p className="font-display mt-1 text-2xl text-blue-950">{tr(site.grievance.name, lang)}</p>
              <p className="text-muted">{site.phoneDisplay} · {site.email}</p>
            </div>
          </Reveal>

          <Reveal>
            <p className="rounded-2xl bg-blue-50 px-6 py-4 text-sm font-medium text-blue-900 ring-1 ring-blue-200">{u("emergencyNote", lang)}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}><ContactForm /></Reveal>
      </section>

      <div className="border-t border-line bg-white"><VisitBlock lang={lang} /></div>
    </>
  );
}
